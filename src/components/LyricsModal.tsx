'use client';

import React from 'react';
import { useAudioStore } from '@/lib/audioEngine';
import { X, Mic2 } from 'lucide-react';

interface LyricsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LyricsModal({ isOpen, onClose }: LyricsModalProps) {
  const { currentSong, currentTime } = useAudioStore();

  if (!isOpen || !currentSong) return null;

  const lyrics = [
    { time: 0, text: `🎵 ${currentSong.title} - ${currentSong.artist}` },
    { time: 5, text: '🎵 Đang đồng bộ lời bài hát từ Spotify...' },
    { time: 12, text: 'Giai điệu vang lên trong không gian yên tĩnh...' },
    { time: 20, text: 'Hãy thả mình vào âm nhạc chất lượng cao...' }
  ];

  return (
    <div className="fixed inset-0 bg-[#121212]/95 backdrop-blur-2xl z-[100] flex flex-col p-6 text-white transition-all">
      <div className="flex justify-between items-center mb-6 max-w-4xl mx-auto w-full">
        <div className="flex items-center space-x-2">
          <Mic2 className="text-[#1DB954]" size={24} />
          <h3 className="text-lg font-bold">Lời Bài Hát (Spotify Synced)</h3>
        </div>
        <button onClick={onClose} className="p-2 rounded-full bg-white/10 hover:bg-white/20">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center space-y-6 text-center px-4 max-w-2xl mx-auto">
        <img src={currentSong.albumCover} alt={currentSong.title} className="w-48 h-48 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] mb-4 object-cover" />
        <h2 className="text-3xl font-black">{currentSong.title}</h2>
        <p className="text-gray-400 font-bold text-lg">{currentSong.artist}</p>

        <div className="space-y-6 mt-8">
          {lyrics.map((line, idx) => {
            const isCurrentLine = currentTime >= line.time && (idx === lyrics.length - 1 || currentTime < lyrics[idx + 1].time);
            return (
              <p 
                key={idx}
                className={`text-2xl font-black transition-all duration-300 ${
                  isCurrentLine ? 'text-[#1DB954] scale-105 drop-shadow-[0_0_15px_rgba(29,185,84,0.6)]' : 'text-gray-600 hover:text-gray-300'
                }`}
              >
                {line.text}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}
