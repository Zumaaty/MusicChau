'use client';

import React, { useState, useEffect } from 'react';
import { useAudioStore } from '@/lib/audioEngine';
import { saveSongOffline, isSongDownloaded, removeSongOffline } from '@/lib/offlineManager';
import LyricsModal from './LyricsModal';
import EqualizerModal from './EqualizerModal';
import { 
  Play, Pause, SkipForward, SkipBack, Signal, Volume2, VolumeX, 
  Repeat, Shuffle, Heart, Mic2, Sliders, Download, CheckCircle, Maximize2, Minimize2 
} from 'lucide-react';

export default function Player() {
  const { 
    currentSong, isPlaying, togglePlay, nextSong, prevSong, 
    currentTime, duration, seek, quality, setQuality,
    volume, setVolume, isMuted, toggleMute, isLoop, toggleLoop, isShuffle, toggleShuffle,
    favorites, toggleFavorite
  } = useAudioStore();

  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showEQ, setShowEQ] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (currentSong) {
      isSongDownloaded(currentSong.streamUrl).then(setIsDownloaded);
    }
  }, [currentSong]);

  if (!currentSong) return null;

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;
  const isFav = favorites.some(s => s.id === currentSong.id);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleDownloadToggle = async () => {
    if (!currentSong) return;
    if (isDownloaded) {
      await removeSongOffline(currentSong.streamUrl);
      setIsDownloaded(false);
    } else {
      const ok = await saveSongOffline(currentSong.streamUrl);
      if (ok) setIsDownloaded(true);
    }
  };

  return (
    <>
      <LyricsModal isOpen={showLyrics} onClose={() => setShowLyrics(false)} />
      <EqualizerModal isOpen={showEQ} onClose={() => setShowEQ(false)} />

      <div className={`fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 px-4 py-3 z-50 transition-all ${
        isExpanded ? 'h-full flex flex-col justify-between py-8 px-6' : ''
      }`}>
        <div 
          className="w-full bg-white/20 h-1.5 rounded-full cursor-pointer mb-3 relative overflow-hidden"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            seek(((e.clientX - rect.left) / rect.width) * duration);
          }}
        >
          <div className="bg-[#1DB954] h-full rounded-full transition-all duration-100" style={{ width: `${progressPercent}%` }} />
        </div>

        <div className={`flex items-center justify-between max-w-7xl mx-auto w-full ${isExpanded ? 'flex-col justify-around flex-1' : ''}`}>
          
          <div className={`flex items-center space-x-4 ${isExpanded ? 'flex-col space-x-0 space-y-4 text-center' : 'w-1/3'}`}>
            <img 
              src={currentSong.albumCover} 
              alt={currentSong.title} 
              className={`rounded-xl object-cover shadow-2xl transition-all ${isExpanded ? 'w-64 h-64 shadow-[0_10px_30px_rgba(29,185,84,0.3)]' : 'w-12 h-12'}`} 
            />
            <div className="truncate">
              <h4 className={`font-bold text-white truncate ${isExpanded ? 'text-2xl' : 'text-sm'}`}>{currentSong.title}</h4>
              <p className={`text-gray-400 truncate ${isExpanded ? 'text-base mt-1' : 'text-xs'}`}>{currentSong.artist}</p>
            </div>
            
            <button onClick={() => toggleFavorite(currentSong)} className="text-gray-400 hover:text-red-500 transition">
              <Heart size={20} fill={isFav ? '#ef4444' : 'none'} className={isFav ? 'text-red-500' : ''} />
            </button>
          </div>

          <div className={`flex flex-col items-center justify-center space-y-2 ${isExpanded ? 'w-full my-6' : 'w-1/3'}`}>
            <div className="flex items-center space-x-6">
              <button onClick={toggleShuffle} className={`transition ${isShuffle ? 'text-[#1DB954]' : 'text-gray-400 hover:text-white'}`}>
                <Shuffle size={18} />
              </button>
              <button onClick={prevSong} className="text-gray-300 hover:text-white"><SkipBack size={22} /></button>
              <button onClick={togglePlay} className="w-12 h-12 rounded-full bg-[#1DB954] text-black flex items-center justify-center hover:scale-105 shadow-lg">
                {isPlaying ? <Pause size={24} fill="black" /> : <Play size={24} fill="black" className="ml-0.5" />}
              </button>
              <button onClick={nextSong} className="text-gray-300 hover:text-white"><SkipForward size={22} /></button>
              <button onClick={toggleLoop} className={`transition ${isLoop ? 'text-[#1DB954]' : 'text-gray-400 hover:text-white'}`}>
                <Repeat size={18} />
              </button>
            </div>

            {isExpanded && (
              <span className="text-xs text-gray-400 font-medium">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            )}
          </div>

          <div className={`flex items-center justify-end space-x-3 ${isExpanded ? 'w-full justify-center space-x-6' : 'w-1/3'}`}>
            <button onClick={() => setShowLyrics(true)} className="text-gray-400 hover:text-[#1DB954] p-1 transition" title="Xem Lời Bài Hát">
              <Mic2 size={18} />
            </button>

            <button onClick={() => setShowEQ(true)} className="text-gray-400 hover:text-[#1DB954] p-1 transition" title="Chỉnh âm Equalizer">
              <Sliders size={18} />
            </button>

            <button onClick={handleDownloadToggle} className={`p-1 transition ${isDownloaded ? 'text-[#1DB954]' : 'text-gray-400 hover:text-white'}`}>
              {isDownloaded ? <CheckCircle size={18} /> : <Download size={18} />}
            </button>

            <div className="hidden md:flex items-center space-x-2">
              <button onClick={toggleMute} className="text-gray-400 hover:text-white">
                {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <input 
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-16 accent-[#1DB954] h-1.5 bg-white/20 rounded-lg cursor-pointer"
              />
            </div>

            <div className="relative">
              <button 
                onClick={() => setShowQualityMenu(!showQualityMenu)} 
                className="flex items-center space-x-1 text-[10px] bg-white/10 px-2 py-1 rounded-full text-green-400 font-bold"
              >
                <Signal size={12} /><span className="uppercase">{quality}</span>
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

            <button onClick={() => setIsExpanded(!isExpanded)} className="text-gray-400 hover:text-white p-1">
              {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
