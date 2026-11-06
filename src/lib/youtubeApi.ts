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

export async function searchYouTubeMusic(query: string): Promise<YTSong[]> {
  if (!query.trim()) return [];

  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&country=VN&limit=25`;
    const res = await fetch(url);
    if (!res.ok) return [];

    const data = await res.json();
    return data.results.map((item: any) => {
      // Đổi ảnh bìa thành kích thước HD 600x600
      const hdCover = item.artworkUrl100 ? item.artworkUrl100.replace('100x100bb', '600x600bb') : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80';
      
      return {
        id: item.trackId.toString(),
        title: item.trackName,
        artist: item.artistName,
        albumCover: hdCover,
        streamUrl: item.previewUrl, // Direct high-speed CDN audio stream
        duration: Math.floor((item.trackTimeMillis || 180000) / 1000),
        mood: 'all',
        genre: item.primaryGenreName || 'V-Pop'
      };
    });
  } catch (err) {
    console.error('iTunes Search API Error:', err);
    return [];
  }
}

export function getFallbackStreamUrl(videoId: string): string {
  return '';
}
