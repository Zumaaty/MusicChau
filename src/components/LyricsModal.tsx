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

  const lyrics = currentSong.lyrics || [
    { time: 0, text: '🎵 Đang đồng bộ lời bài hát tiếng Việt...' },
    { time: 10, text: 'Giai điệu dịu êm vỗ về giấc mơ...' }
  ];

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex flex-col p-6 text-white transition-all">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Mic2 className="text-[#1DB954]" size={24} />
          <h3 className="text-lg font-bold">Lời Bài Hát</h3>
        </div>
        <button onClick={onClose} className="p-2 rounded-full bg-white/10 hover:bg-white/20">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center space-y-6 text-center px-4">
        <img src={currentSong.albumCover} alt={currentSong.title} className="w-32 h-32 rounded-2xl shadow-2xl mb-4 object-cover" />
        <h2 className="text-2xl font-black">{currentSong.title}</h2>
        <p className="text-gray-400 font-medium">{currentSong.artist}</p>

        <div className="space-y-4 max-w-lg mt-6">
          {lyrics.map((line, idx) => {
            const isCurrentLine = currentTime >= line.time && (idx === lyrics.length - 1 || currentTime < lyrics[idx + 1].time);
            return (
              <p 
                key={idx}
                className={`text-xl font-bold transition-all duration-300 ${
                  isCurrentLine ? 'text-[#1DB954] scale-110 drop-shadow-[0_0_12px_rgba(29,185,84,0.6)]' : 'text-gray-500 hover:text-gray-300'
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
