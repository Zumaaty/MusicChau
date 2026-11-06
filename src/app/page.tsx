'use client';

import React from 'react';
import MoodSelector from '@/components/MoodSelector';
import Player from '@/components/Player';
import { SAMPLE_SONGS } from '@/lib/moodEngine';
import { useAudioStore } from '@/lib/audioEngine';
import { Play, User, Music } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { playSong, currentSong, isPlaying } = useAudioStore();

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 py-6">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-[#1DB954] rounded-full flex items-center justify-center shadow-lg">
            <Music className="text-black" size={24} />
          </div>
          <h1 className="text-2xl font-black tracking-tight">Moodify</h1>
        </div>

        <Link href="/login" className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full border border-white/10 text-sm font-semibold transition">
          <User size={16} />
          <span>Tài khoản</span>
        </Link>
      </header>

      <MoodSelector />

      <section className="mt-8">
        <h2 className="text-xl font-bold mb-4">Gợi Ý Cho Bạn</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {SAMPLE_SONGS.map((song) => {
            const isCurrent = currentSong?.id === song.id;
            return (
              <div 
                key={song.id}
                onClick={() => playSong(song, SAMPLE_SONGS)}
                className="bg-[#181818] p-4 rounded-xl hover:bg-[#282828] transition group cursor-pointer relative"
              >
                <div className="relative mb-3">
                  <img src={song.albumCover} alt={song.title} className="w-full aspect-square object-cover rounded-lg shadow-md" />
                  <button className={`absolute right-2 bottom-2 w-10 h-10 rounded-full bg-[#1DB954] text-black flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition ${
                    isCurrent && isPlaying ? 'opacity-100' : ''
                  }`}>
                    <Play size={20} fill="black" className="ml-0.5" />
                  </button>
                </div>
                <h3 className="font-semibold text-sm truncate text-white">{song.title}</h3>
                <p className="text-xs text-gray-400 mt-1 truncate">{song.artist}</p>
              </div>
            );
          })}
        </div>
      </section>

      <Player />
    </main>
  );
}