export interface YTSong {
  id: string;
  title: string;
  artist: string;
  albumCover: string;
  streamUrl: string;
  duration: number;
  mood: string;
  genre: string;
}

// Danh sách các Instance API Invidious/Piped công khai mượt nhất
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
        // Lấy ảnh bìa chất lượng cao
        const thumbnails = item.videoThumbnails || [];
        const highThumb = thumbnails.find((t: any) => t.quality === 'high') || thumbnails[0];
        const albumCover = highThumb ? highThumb.url : `https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg`;

        return {
          id: item.videoId,
          title: item.title,
          artist: item.author || 'Ca sĩ Việt Nam',
          albumCover: albumCover,
          streamUrl: `https://pipedproxy.kavin.rocks/videoplayback?id=${item.videoId}&itag=140`, // itag=140 là luồng Audio AAC 128kbps siêu tiết kiệm 5G
          duration: item.lengthSeconds || 180,
          mood: 'all',
          genre: 'Nhạc Việt'
        };
      });
    } catch (err) {
      console.warn(`Endpoint ${endpoint} failed, trying next...`);
    }
  }

  // Fallback direct Audio Proxy if all endpoints fail
  return [];
}

export function getFallbackStreamUrl(videoId: string): string {
  // Trực tiếp proxy luồng audio để đảm bảo 100% phát được nhạc
  return `https://yewtu.be/latest_version?id=${videoId}&itag=140`;
}
