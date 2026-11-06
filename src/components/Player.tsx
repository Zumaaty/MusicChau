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

      {/* Spotify Bottom Bar */}
      <div className={`fixed bottom-0 left-0 right-0 bg-black border-t border-[#282828] px-4 py-3 z-50 transition-all ${
        isExpanded ? 'h-full flex flex-col justify-between py-12 px-8 bg-[#121212]' : ''
      }`}>
        <div className={`flex items-center justify-between max-w-[1800px] mx-auto w-full ${isExpanded ? 'flex-col justify-around flex-1' : ''}`}>
          
          {/* Left: Song Info */}
          <div className={`flex items-center space-x-3 ${isExpanded ? 'flex-col space-x-0 space-y-4 text-center' : 'w-1/4'}`}>
            <img 
              src={currentSong.albumCover} 
              alt={currentSong.title} 
              className={`rounded-md object-cover shadow-lg transition-all ${isExpanded ? 'w-72 h-72 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)]' : 'w-14 h-14'}`} 
            />
            <div className="truncate">
              <h4 className={`font-bold text-white hover:underline cursor-pointer truncate ${isExpanded ? 'text-3xl' : 'text-sm'}`}>{currentSong.title}</h4>
              <p className={`text-gray-400 hover:underline cursor-pointer truncate ${isExpanded ? 'text-lg mt-1' : 'text-xs'}`}>{currentSong.artist}</p>
            </div>
            
            <button onClick={() => toggleFavorite(currentSong)} className="text-gray-400 hover:text-white transition ml-2">
              <Heart size={18} fill={isFav ? '#1DB954' : 'none'} className={isFav ? 'text-[#1DB954]' : ''} />
            </button>
          </div>

          {/* Center: Playback & Seekbar */}
          <div className={`flex flex-col items-center justify-center ${isExpanded ? 'w-full max-w-xl my-6' : 'w-2/4 max-w-2xl'}`}>
            <div className="flex items-center space-x-6 mb-2">
              <button onClick={toggleShuffle} className={`transition ${isShuffle ? 'text-[#1DB954]' : 'text-gray-400 hover:text-white'}`}>
                <Shuffle size={16} />
              </button>
              <button onClick={prevSong} className="text-gray-300 hover:text-white transition"><SkipBack size={20} /></button>
              <button onClick={togglePlay} className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition shadow-md">
                {isPlaying ? <Pause size={18} fill="black" /> : <Play size={18} fill="black" className="ml-0.5" />}
              </button>
              <button onClick={nextSong} className="text-gray-300 hover:text-white transition"><SkipForward size={20} /></button>
              <button onClick={toggleLoop} className={`transition ${isLoop ? 'text-[#1DB954]' : 'text-gray-400 hover:text-white'}`}>
                <Repeat size={16} />
              </button>
            </div>

            {/* Seek progress bar */}
            <div className="flex items-center space-x-2 w-full text-[11px] text-gray-400 font-medium">
              <span>{formatTime(currentTime)}</span>
              <div 
                className="flex-1 bg-[#4d4d4d] hover:bg-[#1DB954] h-1 rounded-full cursor-pointer group relative overflow-hidden transition"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  seek(((e.clientX - rect.left) / rect.width) * duration);
                }}
              >
                <div className="bg-white group-hover:bg-[#1DB954] h-full rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
              </div>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right: Tools & Volume */}
          <div className={`flex items-center justify-end space-x-3 ${isExpanded ? 'w-full justify-center space-x-6' : 'w-1/4'}`}>
            <button onClick={() => setShowLyrics(true)} className="text-gray-400 hover:text-white p-1 transition" title="Lyrics">
              <Mic2 size={16} />
            </button>

            <button onClick={() => setShowEQ(true)} className="text-gray-400 hover:text-white p-1 transition" title="Equalizer">
              <Sliders size={16} />
            </button>

            <button onClick={handleDownloadToggle} className={`p-1 transition ${isDownloaded ? 'text-[#1DB954]' : 'text-gray-400 hover:text-white'}`}>
              {isDownloaded ? <CheckCircle size={16} /> : <Download size={16} />}
            </button>

            <div className="hidden lg:flex items-center space-x-2">
              <button onClick={toggleMute} className="text-gray-400 hover:text-white">
                {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <input 
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-20 accent-[#1DB954] h-1 bg-[#4d4d4d] rounded-lg cursor-pointer"
              />
            </div>

            <div className="relative">
              <button 
                onClick={() => setShowQualityMenu(!showQualityMenu)} 
                className="flex items-center space-x-1 text-[10px] bg-white/10 px-2 py-0.5 rounded text-green-400 font-bold"
              >
                <Signal size={10} /><span className="uppercase">{quality}</span>
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
              {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
