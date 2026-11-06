'use client';

import React, { useState } from 'react';
import { useAudioStore } from '@/lib/audioEngine';
import { Play, Pause, SkipForward, SkipBack, Signal } from 'lucide-react';

export default function Player() {
  const { currentSong, isPlaying, togglePlay, nextSong, prevSong, currentTime, duration, seek, quality, setQuality } = useAudioStore();
  const [showQualityMenu, setShowQualityMenu] = useState(false);

  if (!currentSong) return null;

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-white/10 px-4 py-3 z-50">
      <div 
        className="w-full bg-white/20 h-1.5 rounded-full cursor-pointer mb-3 relative overflow-hidden"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          seek(((e.clientX - rect.left) / rect.width) * duration);
        }}
      >
        <div className="bg-[#1DB954] h-full rounded-full transition-all duration-100" style={{ width: `${progressPercent}%` }} />
      </div>

      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-3 w-1/3">
          <img src={currentSong.albumCover} alt={currentSong.title} className="w-12 h-12 rounded-md object-cover" />
          <div className="truncate">
            <h4 className="text-sm font-semibold text-white truncate">{currentSong.title}</h4>
            <p className="text-xs text-gray-400 truncate">{currentSong.artist}</p>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-6 w-1/3">
          <button onClick={prevSong} className="text-gray-300 hover:text-white"><SkipBack size={20} /></button>
          <button onClick={togglePlay} className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105">
            {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" className="ml-0.5" />}
          </button>
          <button onClick={nextSong} className="text-gray-300 hover:text-white"><SkipForward size={20} /></button>
        </div>

        <div className="flex items-center justify-end space-x-4 w-1/3 relative">
          <span className="text-xs text-gray-400 hidden sm:inline">{formatTime(currentTime)} / {formatTime(duration)}</span>
          <div className="relative">
            <button onClick={() => setShowQualityMenu(!showQualityMenu)} className="flex items-center space-x-1 text-xs bg-white/10 px-2 py-1 rounded-full text-green-400">
              <Signal size={14} /><span className="uppercase">{quality}</span>
            </button>
            {showQualityMenu && (
              <div className="absolute right-0 bottom-10 bg-[#282828] border border-white/10 rounded-lg p-2 shadow-2xl space-y-1 w-36 text-xs z-50">
                <p className="text-gray-400 px-2 py-1 text-[10px] font-bold">TIẾT KIỆM 5G</p>
                <button onClick={() => { setQuality('low'); setShowQualityMenu(false); }} className={`w-full text-left px-2 py-1 rounded ${quality === 'low' ? 'bg-[#1DB954] text-black font-bold' : 'text-white'}`}>Low (64kbps)</button>
                <button onClick={() => { setQuality('standard'); setShowQualityMenu(false); }} className={`w-full text-left px-2 py-1 rounded ${quality === 'standard' ? 'bg-[#1DB954] text-black font-bold' : 'text-white'}`}>Standard (128kbps)</button>
                <button onClick={() => { setQuality('high'); setShowQualityMenu(false); }} className={`w-full text-left px-2 py-1 rounded ${quality === 'high' ? 'bg-[#1DB954] text-black font-bold' : 'text-white'}`}>High (320kbps)</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}