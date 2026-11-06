'use client';

import React from 'react';
import { useAudioStore } from '@/lib/audioEngine';
import { VIETNAMESE_SONGS } from '@/lib/musicData';
import { Sparkles } from 'lucide-react';

export const VN_MOODS = [
  { id: 'all', label: '🔥 Tất cả Nhạc Việt', color: 'from-green-600 to-emerald-900' },
  { id: 'chill', label: '☕ Thư giãn / Lofi', color: 'from-blue-600 to-indigo-900' },
  { id: 'coffee', label: '🍂 Cà phê sáng', color: 'from-amber-600 to-orange-900' },
  { id: 'energy', label: '⚡ Năng lượng / EDM', color: 'from-yellow-500 to-red-700' },
  { id: 'sad', label: '🌧️ Tâm trạng / Mưa', color: 'from-gray-600 to-slate-900' },
  { id: 'night', label: '🌙 Đêm đô thị R&B', color: 'from-purple-600 to-pink-900' },
];

export default function MoodSelector() {
  const { mood, setMood, playSong } = useAudioStore();

  const handleMoodSelect = (selectedMood: string) => {
    setMood(selectedMood);
    const filtered = selectedMood === 'all' 
      ? VIETNAMESE_SONGS 
      : VIETNAMESE_SONGS.filter(s => s.mood === selectedMood);
    if (filtered.length > 0) playSong(filtered[0], filtered);
  };

  return (
    <div className="my-6">
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className="text-[#1DB954]" size={22} />
        <h2 className="text-xl font-black text-white">Chuyển Nhạc Theo Mood Việt Nam</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {VN_MOODS.map((m) => (
          <button
            key={m.id}
            onClick={() => handleMoodSelect(m.id)}
            className={`h-20 rounded-2xl p-3 bg-gradient-to-br ${m.color} flex flex-col justify-end text-left shadow-lg hover:scale-105 transition-all ${
              mood === m.id ? 'ring-2 ring-white scale-105 shadow-green-500/20' : 'opacity-85 hover:opacity-100'
            }`}
          >
            <span className="font-extrabold text-sm text-white drop-shadow-md">{m.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
