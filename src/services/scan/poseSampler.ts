import {
  analyzeFacePoseSampleBase64,
  type FacePoseSample,
} from '@/services/scan/facePoseDetection';

/** Capture frame N+1 while analyzing frame N for faster live pose polling. */
export function createPipelinedPoseSampler(
  takeSampleBase64: () => Promise<string | null>,
): () => Promise<FacePoseSample | null> {
  let pending = startSample(takeSampleBase64);

  function startSample(take: () => Promise<string | null>): Promise<FacePoseSample | null> {
    return (async () => {
      const base64 = await take();
      if (!base64) return null;
      return analyzeFacePoseSampleBase64(base64);
    })();
  }

  return async () => {
    const current = await pending;
    pending = startSample(takeSampleBase64);
    return current;
  };
}
