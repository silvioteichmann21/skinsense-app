import { create } from 'zustand';

import { recordScanActivity } from '@/core/storage/activityStorage';
import { notifyScanResultReady } from '@/services/notifications/notificationService';
import { appendScanRecord, deleteScanRecord, loadScanHistory } from '@/core/storage/scanHistoryStorage';
import { deleteScanImageFiles } from '@/services/scan/scanImageStorage';
import type { SkinAnalysisResult } from '@/types/skinAnalysis';
import type { AngleImageUris, StoredScanRecord } from '@/types/scanPipeline';

type SkinStore = {
  latestAnalysis: SkinAnalysisResult | null;
  analysisHistory: StoredScanRecord[];
  isAnalyzing: boolean;
  currentScanImageUri: string | null;
  pendingAnglePhotos: AngleImageUris | null;
  hydrated: boolean;
  profilePhotoRevision: number;
  profileAvatarGenerating: boolean;
  setScanImage: (uri: string) => void;
  setPendingAnglePhotos: (uris: AngleImageUris | null) => void;
  setAnalyzing: (value: boolean) => void;
  setAnalysisResult: (result: SkinAnalysisResult) => void;
  addAnalysisResult: (record: StoredScanRecord) => Promise<void>;
  removeScanRecord: (id: string) => Promise<void>;
  loadHistory: () => Promise<void>;
  resetForUserSwitch: () => void;
  getScanById: (id: string) => StoredScanRecord | undefined;
  bumpProfilePhotoRevision: () => void;
  setProfileAvatarGenerating: (value: boolean) => void;
};

export const useSkinStore = create<SkinStore>((set, get) => ({
  latestAnalysis: null,
  analysisHistory: [],
  isAnalyzing: false,
  currentScanImageUri: null,
  pendingAnglePhotos: null,
  hydrated: false,
  profilePhotoRevision: 0,
  profileAvatarGenerating: false,

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

  removeScanRecord: async (id) => {
    const record = get().getScanById(id);
    if (!record) return;

    const history = await deleteScanRecord(id);
    await deleteScanImageFiles(record);
    set({
      analysisHistory: history,
      latestAnalysis: history[0] ?? null,
      currentScanImageUri:
        get().currentScanImageUri === record.imageUri ? history[0]?.imageUri ?? null : get().currentScanImageUri,
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
      profilePhotoRevision: 0,
      profileAvatarGenerating: false,
    });
  },

  getScanById: (id) => get().analysisHistory.find((s) => s.id === id),

  bumpProfilePhotoRevision: () =>
    set((state) => ({ profilePhotoRevision: state.profilePhotoRevision + 1 })),

  setProfileAvatarGenerating: (value) => set({ profileAvatarGenerating: value }),
}));
