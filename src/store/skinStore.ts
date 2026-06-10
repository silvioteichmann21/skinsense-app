import { create } from 'zustand';

import { recordScanActivity } from '@/core/storage/activityStorage';
import { notifyScanResultReady } from '@/services/notifications/notificationService';
import { appendScanRecord, loadScanHistory } from '@/core/storage/scanHistoryStorage';
import type { SkinAnalysisResult } from '@/types/skinAnalysis';
import type { AngleImageUris, StoredScanRecord } from '@/types/scanPipeline';

type SkinStore = {
  latestAnalysis: SkinAnalysisResult | null;
  analysisHistory: StoredScanRecord[];
  isAnalyzing: boolean;
  currentScanImageUri: string | null;
  pendingAnglePhotos: AngleImageUris | null;
  hydrated: boolean;
  setScanImage: (uri: string) => void;
  setPendingAnglePhotos: (uris: AngleImageUris | null) => void;
  setAnalyzing: (value: boolean) => void;
  setAnalysisResult: (result: SkinAnalysisResult) => void;
  addAnalysisResult: (record: StoredScanRecord) => Promise<void>;
  loadHistory: () => Promise<void>;
  resetForUserSwitch: () => void;
  getScanById: (id: string) => StoredScanRecord | undefined;
};

export const useSkinStore = create<SkinStore>((set, get) => ({
  latestAnalysis: null,
  analysisHistory: [],
  isAnalyzing: false,
  currentScanImageUri: null,
  pendingAnglePhotos: null,
  hydrated: false,

  setScanImage: (uri) => set({ currentScanImageUri: uri }),

  setPendingAnglePhotos: (uris) => set({ pendingAnglePhotos: uris }),

  setAnalyzing: (value) => set({ isAnalyzing: value }),

  setAnalysisResult: (result) =>
    set({
      latestAnalysis: result,
    }),

  addAnalysisResult: async (record) => {
    const history = await appendScanRecord(record);
    await recordScanActivity();
    await notifyScanResultReady(record.skinScore);
    set({
      latestAnalysis: record,
      analysisHistory: history,
    });
  },

  loadHistory: async () => {
    const history = await loadScanHistory();
    set({
      analysisHistory: history,
      latestAnalysis: history[0] ?? null,
      hydrated: true,
    });
  },

  resetForUserSwitch: () => {
    set({
      latestAnalysis: null,
      analysisHistory: [],
      isAnalyzing: false,
      currentScanImageUri: null,
      pendingAnglePhotos: null,
      hydrated: false,
    });
  },

  getScanById: (id) => get().analysisHistory.find((s) => s.id === id),
}));
