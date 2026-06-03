import { create } from 'zustand';

import { appendScanRecord, loadScanHistory } from '@/core/storage/scanHistoryStorage';
import type { SkinAnalysisResult } from '@/types/skinAnalysis';
import type { StoredScanRecord } from '@/types/scanPipeline';

type SkinStore = {
  latestAnalysis: SkinAnalysisResult | null;
  analysisHistory: StoredScanRecord[];
  isAnalyzing: boolean;
  currentScanImageUri: string | null;
  hydrated: boolean;
  setScanImage: (uri: string) => void;
  setAnalyzing: (value: boolean) => void;
  setAnalysisResult: (result: SkinAnalysisResult) => void;
  addAnalysisResult: (record: StoredScanRecord) => Promise<void>;
  loadHistory: () => Promise<void>;
  getScanById: (id: string) => StoredScanRecord | undefined;
};

export const useSkinStore = create<SkinStore>((set, get) => ({
  latestAnalysis: null,
  analysisHistory: [],
  isAnalyzing: false,
  currentScanImageUri: null,
  hydrated: false,

  setScanImage: (uri) => set({ currentScanImageUri: uri }),

  setAnalyzing: (value) => set({ isAnalyzing: value }),

  setAnalysisResult: (result) =>
    set({
      latestAnalysis: result,
    }),

  addAnalysisResult: async (record) => {
    const history = await appendScanRecord(record);
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

  getScanById: (id) => get().analysisHistory.find((s) => s.id === id),
}));
