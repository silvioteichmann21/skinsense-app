import { useCallback, useEffect, useRef, useState } from 'react';

import { loadQuizAnswers } from '@/core/storage/quizStorage';
import { refineAnalysisWithCloud } from '@/services/api/aiAnalyze';
import { submitScan } from '@/services/api/scans';
import {
  FaceScanError,
  analyzeFaceFromCameraPhoto,
} from '@/services/ai/faceScanAnalysis';
import { ON_DEVICE_MODEL_VERSION } from '@/services/ai/skinAnalyzer';
import { persistScanImage } from '@/services/scan/scanImageStorage';
import { useRoutineStore } from '@/store/routineStore';
import { useSkinStore } from '@/store/skinStore';
import type { SkinAnalysisResult } from '@/types/skinAnalysis';
import type { AnalysisPipelineMeta } from '@/types/scanPipeline';

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

      setStage('local');
      setProgressMonotonic(lerpProgress('local', 0.3));
      const local = await analyzeFaceFromCameraPhoto({
        displayImageUri: storedUri,
        quiz,
      });
      setProgressMonotonic(lerpProgress('local', 1));

      if (runId !== runIdRef.current) return;

      let vector = local.scoreVector;
      let analysis = local.result;
      let usedCloudRefine = false;

      if (local.confidence < CLOUD_CONFIDENCE_THRESHOLD) {
        setStage('cloud');
        setProgressMonotonic(lerpProgress('cloud', 0.2));
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

      if (runId !== runIdRef.current) return;

      setStage('sync');
      setProgressMonotonic(lerpProgress('sync', 0.3));
      const angleImageUris = useSkinStore.getState().pendingAnglePhotos ?? undefined;
      const stored = await submitScan({
        payload: { scoreVector: vector, quizContext: quiz },
        imageUri: storedUri,
        confidence: local.confidence,
        modelVersion: ON_DEVICE_MODEL_VERSION,
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
      await useRoutineStore.getState().setFromScan(stored, quiz);
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
        confidence: local.confidence,
        modelVersion: ON_DEVICE_MODEL_VERSION,
        usedCloudRefine,
        durationMs: Date.now() - startedAt,
      });
    } catch (e) {
      const code =
        e instanceof FaceScanError ? e.code : e instanceof Error ? e.message : 'analysis_failed';
      setError(code);
    } finally {
      useSkinStore.getState().setAnalyzing(false);
    }
  }, [imageUri, setProgressMonotonic]);

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
