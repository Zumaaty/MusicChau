const CACHE_NAME = 'moodify-offline-songs-v1';

export async function saveSongOffline(songUrl: string): Promise<boolean> {
  if (!('caches' in window)) return false;
  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.add(songUrl);
    return true;
  } catch (err) {
    console.error('Lỗi khi tải nhạc offline:', err);
    return false;
  }
}

export async function isSongDownloaded(songUrl: string): Promise<boolean> {
  if (!('caches' in window)) return false;
  try {
    const cache = await caches.open(CACHE_NAME);
    const match = await cache.match(songUrl);
    return !!match;
  } catch {
    return false;
  }
}

export async function removeSongOffline(songUrl: string): Promise<boolean> {
  if (!('caches' in window)) return false;
  try {
    const cache = await caches.open(CACHE_NAME);
    return await cache.delete(songUrl);
  } catch {
    return false;
  }
}
