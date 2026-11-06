'use client';

import React from 'react';
import { useAudioStore } from '@/lib/audioEngine';
import { searchYouTubeMusic } from '@/lib/youtubeApi';

export const SPOTIFY_MOODS = [
  { id: 'all', label: 'Tất cả', query: 'nhac viet nam hot' },
  { id: 'tuanhung', label: 'Tuấn Hưng Hits', query: 'tuan hung' },
  { id: 'sontung', label: 'Sơn Tùng M-TP', query: 'son tung mtp' },
  { id: 'denvau', label: 'Đen Vâu Rap', query: 'den vau' },
  { id: 'chillies', label: 'Chillies Indie', query: 'chillies' },
  { id: 'lofi', label: 'Lofi Chill', query: 'nhac lofi chill viet nam' },
  { id: 'coffee', label: 'Cà phê sáng', query: 'nhac vu indie viet nam' },
  { id: 'energy', label: 'Remix 88', query: 'nhac remix viet nam' },
];

export default function MoodSelector() {
  const { mood, setMood, playSong, setSearchResults, setIsSearching } = useAudioStore();

  const handleMoodSelect = async (selectedMood: typeof SPOTIFY_MOODS[0]) => {
    setMood(selectedMood.id);
    setIsSearching(true);
    try {
      const results = await searchYouTubeMusic(selectedMood.query);
      setSearchResults(results);
      if (results.length > 0) playSong(results[0], results);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex space-x-2 overflow-x-auto py-2 no-scrollbar">
      {SPOTIFY_MOODS.map((m) => (
        <button
          key={m.id}
          onClick={() => handleMoodSelect(m)}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
            mood === m.id ? 'bg-white text-black' : 'bg-[#2a2a2a] text-white hover:bg-[#3e3e3e]'
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
