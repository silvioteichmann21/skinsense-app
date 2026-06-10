import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';

import { isSupabaseConfigured } from '@/config/env';
import { getActiveUserScope, storageKeyForUser } from '@/core/storage/userScope';
import { getSupabase, pingSupabase } from '@/lib/supabase';

const BUCKET = 'feedback-avatars';
const SYNC_URI_BASE = '@skinsense/avatar_sync_uri';

function guessMime(uri: string): string {
  const lower = uri.toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  return 'image/jpeg';
}

function guessExt(uri: string): string {
  const lower = uri.toLowerCase();
  if (lower.endsWith('.png')) return 'png';
  if (lower.endsWith('.webp')) return 'webp';
  return 'jpg';
}

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function syncUriKey(): Promise<string> {
  return storageKeyForUser(SYNC_URI_BASE, await getActiveUserScope());
}

async function readSyncedUri(): Promise<string | null> {
  return AsyncStorage.getItem(await syncUriKey());
}

async function writeSyncedUri(uri: string): Promise<void> {
  await AsyncStorage.setItem(await syncUriKey(), uri);
}

async function saveProfileAvatarUrl(userId: string, avatarUrl: string): Promise<void> {
  const { error } = await getSupabase()
    .from('profiles')
    .update({
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error?.code === '42703' || error?.message?.includes('avatar_url')) {
    return;
  }
}

/** Upload a local portrait and persist the public URL on the user's profile. */
export async function syncUserAvatarFromLocal(
  userId: string,
  localUri: string,
  options?: { force?: boolean },
): Promise<string | null> {
  if (!isSupabaseConfigured() || !userId || !localUri) return null;

  const reachable = await pingSupabase();
  if (!reachable) return null;

  try {
    const normalized = localUri.trim();
    if (!options?.force) {
      const synced = await readSyncedUri();
      if (synced === normalized) {
        const { data } = await getSupabase()
          .from('profiles')
          .select('avatar_url')
          .eq('id', userId)
          .maybeSingle();
        const existing = (data as { avatar_url?: string | null } | null)?.avatar_url?.trim();
        if (existing) return existing;
      }
    }

    const info = await FileSystem.getInfoAsync(normalized);
    if (!info.exists) return null;

    const base64 = await FileSystem.readAsStringAsync(normalized, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const bytes = base64ToBytes(base64);
    const ext = guessExt(normalized);
    const path = `${userId}/avatar.${ext}`;

    const { error: uploadError } = await getSupabase()
      .storage.from(BUCKET)
      .upload(path, bytes, {
        contentType: guessMime(normalized),
        upsert: true,
      });

    if (uploadError) return null;

    const { data: urlData } = getSupabase().storage.from(BUCKET).getPublicUrl(path);
    const publicUrl = urlData.publicUrl ?? null;
    if (!publicUrl) return null;

    await saveProfileAvatarUrl(userId, publicUrl);
    await writeSyncedUri(normalized);
    return publicUrl;
  } catch {
    return null;
  }
}
