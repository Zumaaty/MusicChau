'use client';

import React from 'react';
import { MOODS, getSongsByMood } from '@/lib/moodEngine';
import { useAudioStore } from '@/lib/audioEngine';
import { Sparkles } from 'lucide-react';

export default function MoodSelector() {
  const { mood, setMood, playSong } = useAudioStore();

  const handleMoodSelect = (selectedMood: string) => {
    setMood(selectedMood);
    const songs = getSongsByMood(selectedMood);
    if (songs.length > 0) playSong(songs[0], songs);
  };

  return (
    <div className="my-6">
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className="text-[#1DB954]" size={22} />
        <h2 className="text-xl font-bold text-white">Chuyển Nhạc Theo Mood</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {MOODS.map((m) => (
          <button
            key={m.id}
            onClick={() => handleMoodSelect(m.id)}
            className={`h-20 rounded-xl p-3 bg-gradient-to-br ${m.color} flex flex-col justify-end text-left shadow-lg hover:scale-105 transition ${
              mood === m.id ? 'ring-2 ring-white scale-105' : 'opacity-80'
            }`}
          >
            <span className="font-bold text-sm text-white drop-shadow-md">{m.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}