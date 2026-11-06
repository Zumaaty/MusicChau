import { Song } from './supabase';

export const MOODS = [
  { id: 'chill', label: '☕ Thư giãn', color: 'from-blue-600 to-indigo-900' },
  { id: 'energy', label: '⚡ Năng lượng', color: 'from-yellow-500 to-orange-700' },
  { id: 'focus', label: '🧠 Tập trung', color: 'from-emerald-600 to-teal-900' },
  { id: 'sad', label: '🌧️ Tâm trạng', color: 'from-gray-600 to-slate-900' },
  { id: 'workout', label: '🔥 Tập luyện', color: 'from-red-600 to-rose-900' },
  { id: 'romance', label: '💖 Lãng mạn', color: 'from-pink-500 to-purple-800' },
];

export const SAMPLE_SONGS: Song[] = [
  {
    id: '1',
    title: 'Lofi Chill Study Beats',
    artist: 'ChillHop Collection',
    albumCover: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&q=80',
    streamUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    duration: 160,
    mood: 'chill',
    genre: 'Lo-Fi'
  },
  {
    id: '2',
    title: 'Midnight Focus Piano',
    artist: 'Acoustic Dreams',
    albumCover: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=500&q=80',
    streamUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3',
    duration: 210,
    mood: 'focus',
    genre: 'Piano'
  },
  {
    id: '3',
    title: 'Synthwave Workout Drive',
    artist: 'Cyber Beats',
    albumCover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&q=80',
    streamUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792ce.mp3',
    duration: 185,
    mood: 'workout',
    genre: 'Synthwave'
  },
  {
    id: '4',
    title: 'Deep Sad Memories',
    artist: 'Acoustic Rain',
    albumCover: 'https://images.unsplash.com/photo-1499209974431-9dac3ea0027f?w=500&q=80',
    streamUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3',
    duration: 195,
    mood: 'sad',
    genre: 'Acoustic'
  }
];

export function getSongsByMood(moodId: string): Song[] {
  return SAMPLE_SONGS.filter(s => s.mood === moodId);
}