import type { FaceScanErrorCode } from '@/services/ai/faceScanAnalysis';
import type { TranslationKey } from '@/i18n/useTranslation';

const ERROR_HINT_KEYS: Record<FaceScanErrorCode, TranslationKey> = {
  photo_too_dark: 'scan.photoTooDark',
  photo_too_bright: 'scan.photoTooBright',
  photo_low_quality: 'scan.photoLowQuality',
  analysis_failed: 'scan.analysisFailedHint',
};

export function scanErrorHintKey(code: string): TranslationKey {
  if (code in ERROR_HINT_KEYS) {
    return ERROR_HINT_KEYS[code as FaceScanErrorCode];
  }
  return 'scan.analysisFailedHint';
}

export function scanErrorTitleKey(code: string): TranslationKey {
  if (code === 'photo_too_dark') return 'scan.photoTooDarkTitle';
  if (code === 'photo_too_bright') return 'scan.photoTooBrightTitle';
  if (code === 'photo_low_quality') return 'scan.photoLowQualityTitle';
  return 'scan.analysisFailed';
}
