export interface YTSong {
  id: string;
  title: string;
  artist: string;
  albumCover: string;
  streamUrl: string;
  duration: number;
  mood: string;
  genre: string;
  lyrics?: { time: number; text: string }[];
}

const API_ENDPOINTS = [
  'https://inv.tux.rainside.sk/api/v1',
  'https://invidious.nerdvpn.de/api/v1',
  'https://vid.puffyan.us/api/v1',
];

export async function searchYouTubeMusic(query: string): Promise<YTSong[]> {
  if (!query.trim()) return [];

  for (const endpoint of API_ENDPOINTS) {
    try {
      const res = await fetch(`${endpoint}/search?q=${encodeURIComponent(query)}&type=video`, {
        headers: { 'Accept': 'application/json' }
      });
      
      if (!res.ok) continue;

      const data = await res.json();
      
      return data.slice(0, 15).map((item: any) => {
        const thumbnails = item.videoThumbnails || [];
        const highThumb = thumbnails.find((t: any) => t.quality === 'high') || thumbnails[0];
        const albumCover = highThumb ? highThumb.url : `https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg`;

        return {
          id: item.videoId,
          title: item.title || 'Bài hát Việt Nam',
          artist: item.author || 'Nhiều ca sĩ',
          albumCover: albumCover,
          streamUrl: `https://pipedproxy.kavin.rocks/videoplayback?id=${item.videoId}&itag=140`,
          duration: item.lengthSeconds || 180,
          mood: 'all',
          genre: 'V-Pop'
        };
      });
    } catch (err) {
      console.warn(`Endpoint ${endpoint} failed, trying next...`);
    }
  }

  return [];
}

export function getFallbackStreamUrl(videoId: string): string {
  return `https://yewtu.be/latest_version?id=${videoId}&itag=140`;
}
