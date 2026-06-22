import { useCallback, useEffect, useRef, useState } from 'react';

import { loadQuizAnswers } from '@/core/storage/quizStorage';
import {
  analyzeSkinWithGemini,
  isGeminiAnalyzeAvailable,
} from '@/services/api/geminiAnalyze';
import { submitScan } from '@/services/api/scans';
import { FaceScanError, analyzeFaceFromCameraPhoto } from '@/services/ai/faceScanAnalysis';
import { useI18n } from '@/i18n/I18nProvider';
import { persistScanImage } from '@/services/scan/scanImageStorage';
import {
  ensureProfileAvatarFromScan,
  syncProfileAvatarIfNeeded,
} from '@/services/profile/scanProfileAvatar';
import { useAuthStore } from '@/store/authStore';
import { useRoutineStore } from '@/store/routineStore';
import { useSkinStore } from '@/store/skinStore';
import type { SkinAnalysisResult } from '@/types/skinAnalysis';
import type { AnalysisPipelineMeta } from '@/types/scanPipeline';
import type { PersonalizedRoutine } from '@/types/routine';

import { MIN_ANALYZING_MS } from '@/screens/scan/analyzingContent';

const CLOUD_CONFIDENCE_THRESHOLD = 0.7;

export type PipelineStage = 'persist' | 'local' | 'cloud' | 'sync' | 'save';

const STAGE_PROGRESS: Record<PipelineStage, { start: number; end: number }> = {
  persist: { start: 0, end: 18 },
  local: { start: 18, end: 50 },
  cloud: { start: 50, end: 72 },
  sync: { start: 72, end: 88 },
  save: { start: 88, end: 100 },
};

function lerpProgress(stage: PipelineStage, fraction: number): number {
  const { start, end } = STAGE_PROGRESS[stage];
  return start + (end - start) * Math.min(1, Math.max(0, fraction));
}

export type UseSkinAnalysisState = {
  progress: number;
  stage: PipelineStage | null;
  error: string | null;
  result: SkinAnalysisResult | null;
  meta: AnalysisPipelineMeta | null;
  retry: () => void;
};

export function useSkinAnalysis(imageUri: string): UseSkinAnalysisState {
  const { locale } = useI18n();
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<PipelineStage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SkinAnalysisResult | null>(null);
  const [meta, setMeta] = useState<AnalysisPipelineMeta | null>(null);
  const progressRef = useRef(0);
  const runIdRef = useRef(0);

  const setProgressMonotonic = useCallback((value: number) => {
    const next = Math.max(progressRef.current, Math.min(100, value));
    progressRef.current = next;
    setProgress(next);
  }, []);

  const runPipeline = useCallback(async () => {
    const runId = ++runIdRef.current;
    const startedAt = Date.now();
    setError(null);
    setResult(null);
    setMeta(null);
    progressRef.current = 0;
    setProgress(0);
    useSkinStore.getState().setAnalyzing(true);

    const useGemini = isGeminiAnalyzeAvailable();
    let routineFromGemini: PersonalizedRoutine | undefined;

    try {
      setStage('persist');
      setProgressMonotonic(lerpProgress('persist', 0.2));
      const storedUri = imageUri.startsWith('file://') || imageUri.includes('/scans/')
        ? imageUri
        : await persistScanImage(imageUri);
      useSkinStore.getState().setScanImage(storedUri);
      setProgressMonotonic(lerpProgress('persist', 1));

      if (runId !== runIdRef.current) return;

      const quiz = await loadQuizAnswers();
      const angleImageUris = useSkinStore.getState().pendingAnglePhotos ?? undefined;

      let vector;
      let analysis;
      let confidence: number;
      let modelVersion: string;
      let usedCloudRefine = false;

      if (useGemini) {
        setStage('cloud');
        setProgressMonotonic(lerpProgress('cloud', 0.15));

        try {
          const gemini = await analyzeSkinWithGemini({
            frontImageUri: storedUri,
            angleImageUris,
            quiz,
            locale,
          });

          if (runId !== runIdRef.current) return;

          vector = gemini.scoreVector;
          analysis = gemini.result;
          confidence = gemini.confidence;
          modelVersion = gemini.modelVersion;
          usedCloudRefine = true;
          routineFromGemini = gemini.routine;
          setProgressMonotonic(lerpProgress('cloud', 1));
        } catch (geminiError) {
          if (__DEV__) {
            console.warn(
              '[useSkinAnalysis] Gemini unavailable, using on-device analysis:',
              geminiError instanceof Error ? geminiError.message : geminiError,
            );
          }
          setStage('local');
          setProgressMonotonic(lerpProgress('local', 0.3));
          const local = await analyzeFaceFromCameraPhoto({
            displayImageUri: storedUri,
            quiz,
          });
          vector = local.scoreVector;
          analysis = local.result;
          confidence = local.confidence;
          modelVersion = local.modelVersion;
          setProgressMonotonic(lerpProgress('local', 1));
        }
      } else {
        setStage('local');
        setProgressMonotonic(lerpProgress('local', 0.3));
        const local = await analyzeFaceFromCameraPhoto({
          displayImageUri: storedUri,
          quiz,
        });
        setProgressMonotonic(lerpProgress('local', 1));

        if (runId !== runIdRef.current) return;

        vector = local.scoreVector;
        analysis = local.result;
        confidence = local.confidence;
        modelVersion = local.modelVersion;

        if (local.confidence < CLOUD_CONFIDENCE_THRESHOLD) {
          setStage('cloud');
          setProgressMonotonic(lerpProgress('cloud', 0.5));
          const { refineAnalysisWithCloud } = await import('@/services/api/aiAnalyze');
          const refined = await refineAnalysisWithCloud({
            scoreVector: vector,
            quizContext: quiz,
            imageUri: storedUri,
          });
          vector = refined.vector;
          analysis = refined.result;
          usedCloudRefine = true;
          setProgressMonotonic(lerpProgress('cloud', 1));
        }
      }

      if (runId !== runIdRef.current) return;

      setStage('sync');
      setProgressMonotonic(lerpProgress('sync', 0.3));
      const stored = await submitScan({
        payload: { scoreVector: vector, quizContext: quiz },
        imageUri: storedUri,
        confidence,
        modelVersion,
        usedCloudRefine,
        localResult: { ...analysis, imageUri: storedUri },
        angleImageUris,
      });
      setProgressMonotonic(lerpProgress('sync', 1));

      if (runId !== runIdRef.current) return;

      setStage('save');
      setProgressMonotonic(lerpProgress('save', 0.5));
      await useSkinStore.getState().addAnalysisResult(stored);
      useSkinStore.getState().setPendingAnglePhotos(null);
      await useRoutineStore.getState().setFromScan(stored, quiz, routineFromGemini);

      if (useSkinStore.getState().analysisHistory.length === 1) {
        void ensureProfileAvatarFromScan(stored, locale).then((portrait) => {
          if (!portrait) return;
          const userId = useAuthStore.getState().user?.id ?? null;
          void syncProfileAvatarIfNeeded(userId, portrait.idealUri);
        });
      }

      setProgressMonotonic(lerpProgress('save', 1));

      const elapsed = Date.now() - startedAt;
      const waitMs = Math.max(0, MIN_ANALYZING_MS - elapsed);
      if (waitMs > 0) {
        await new Promise((r) => setTimeout(r, waitMs));
      }

      if (runId !== runIdRef.current) return;

      setProgressMonotonic(100);
      setResult(stored);
      setMeta({
        scoreVector: vector,
        confidence,
        modelVersion,
        usedCloudRefine,
        durationMs: Date.now() - startedAt,
      });
    } catch (e) {
      const code: FaceScanError['code'] | 'analysis_failed' =
        e instanceof FaceScanError ? e.code : 'analysis_failed';
      if (__DEV__) {
        console.warn('[useSkinAnalysis] Pipeline failed:', e);
      }
      setError(code);
    } finally {
      useSkinStore.getState().setAnalyzing(false);
    }
  }, [imageUri, locale, setProgressMonotonic]);

  const retry = useCallback(() => {
    void runPipeline();
  }, [runPipeline]);

  useEffect(() => {
    void runPipeline();
    return () => {
      runIdRef.current += 1;
    };
  }, [runPipeline]);

  return { progress, stage, error, result, meta, retry };
}
