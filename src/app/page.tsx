'use client';

import React, { useState, useEffect } from 'react';
import MoodSelector from '@/components/MoodSelector';
import Player from '@/components/Player';
import { useAudioStore } from '@/lib/audioEngine';
import { searchYouTubeMusic, YTSong } from '@/lib/youtubeApi';
import { 
  Home, Search, Library, Heart, Plus, Play, User, Music, 
  Loader2, ChevronLeft, ChevronRight, Compass, Sparkles, Disc 
} from 'lucide-react';
import Link from 'next/link';

export default function SpotifyApp() {
  const { 
    playSong, currentSong, isPlaying, 
    searchQuery, setSearchQuery, 
    searchResults, setSearchResults, isSearching, setIsSearching,
    favorites, playlists, createPlaylist
  } = useAudioStore();

  const [activeNav, setActiveNav] = useState<'home' | 'search' | 'library' | 'favorites'>('home');
  const [topHits, setTopHits] = useState<YTSong[]>([]);

  // Tải Nhạc Việt HOT mặc định ngay khi vào ứng dụng (<100ms)
  useEffect(() => {
    async function loadDefaultMusic() {
      const results = await searchYouTubeMusic('nhac viet nam hot bang xep hang');
      setTopHits(results);
      setSearchResults(results);
    }
    loadDefaultMusic();
  }, [setSearchResults]);

  // Tìm kiếm tức thì theo thời gian thực (Zero latency)
  useEffect(() => {
    if (!searchQuery.trim()) {
      if (topHits.length > 0) setSearchResults(topHits);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchYouTubeMusic(searchQuery);
      setSearchResults(results);
      setIsSearching(false);
    }, 250); // Phản hồi cực nhạy 250ms

    return () => clearTimeout(timer);
  }, [searchQuery, topHits, setSearchResults, setIsSearching]);

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden select-none">
      
      {/* 🟢 SIDEBAR BÊN TRÁI CHUẨN SPOTIFY */}
      <aside className="w-64 bg-black p-4 flex flex-col space-y-6 hidden md:flex border-r border-[#181818]">
        {/* Logo Spotify */}
        <div className="flex items-center space-x-2 px-2">
          <div className="w-8 h-8 bg-[#1DB954] rounded-full flex items-center justify-center">
            <Music size={20} className="text-black" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">Spotify</span>
        </div>

        {/* Main Nav */}
        <nav className="space-y-3 font-bold text-sm text-gray-400">
          <button 
            onClick={() => { setActiveNav('home'); setSearchQuery(''); }}
            className={`flex items-center space-x-4 w-full px-2 py-1.5 rounded-lg transition ${activeNav === 'home' ? 'text-white' : 'hover:text-white'}`}
          >
            <Home size={22} />
            <span>Trang chủ</span>
          </button>

          <button 
            onClick={() => setActiveNav('search')}
            className={`flex items-center space-x-4 w-full px-2 py-1.5 rounded-lg transition ${activeNav === 'search' ? 'text-white' : 'hover:text-white'}`}
          >
            <Search size={22} />
            <span>Tìm kiếm</span>
          </button>

          <button 
            onClick={() => setActiveNav('library')}
            className={`flex items-center space-x-4 w-full px-2 py-1.5 rounded-lg transition ${activeNav === 'library' ? 'text-white' : 'hover:text-white'}`}
          >
            <Library size={22} />
            <span>Thư viện</span>
          </button>
        </nav>

        {/* Playlists & Liked Section */}
        <div className="pt-4 border-t border-[#282828] flex-1 overflow-y-auto space-y-3">
          <button 
            onClick={() => setActiveNav('favorites')}
            className="flex items-center space-x-3 text-sm font-bold text-gray-400 hover:text-white w-full px-2"
          >
            <div className="w-6 h-6 bg-gradient-to-br from-indigo-600 to-purple-800 rounded flex items-center justify-center">
              <Heart size={14} className="text-white fill-white" />
            </div>
            <span className="truncate">Bài hát đã thích</span>
          </button>

          <div className="px-2 pt-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
            PLAYLIST CỦA BẠN
          </div>
          {playlists.map((pl) => (
            <div key={pl.id} className="px-2 text-sm text-gray-400 hover:text-white cursor-pointer truncate">
              {pl.name}
            </div>
          ))}
        </div>
      </aside>

      {/* 🔴 NỘI DUNG CHÍNH (MAIN VIEW SPOTIFY) */}
      <main className="flex-1 bg-gradient-to-b from-[#1e1e1e] to-[#121212] overflow-y-auto pb-32 relative">
        
        {/* Sticky Header */}
        <header className="sticky top-0 bg-[#121212]/80 backdrop-blur-md px-6 py-4 flex justify-between items-center z-40">
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <button className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-gray-400 hover:text-white">
                <ChevronLeft size={20} />
              </button>
              <button className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-gray-400 hover:text-white">
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Ô Tìm Kiếm Siêu Tốc */}
            <div className="relative w-64 sm:w-96">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input 
                type="text"
                placeholder="Bạn muốn nghe gì? (Tuấn Hưng, Sơn Tùng, Đen...)"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setActiveNav('search'); }}
                className="w-full bg-[#242424] border-0 rounded-full pl-10 pr-8 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white transition"
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-2.5 text-[#1DB954] animate-spin" size={16} />
              )}
            </div>
          </div>

          <Link 
            href="/login"
            className="flex items-center space-x-2 bg-black hover:scale-105 transition px-3 py-1.5 rounded-full border border-white/10 text-xs font-bold"
          >
            <User size={14} />
            <span>Tài khoản</span>
          </Link>
        </header>

        <div className="px-6 py-4">
          <MoodSelector />

          {/* Quick Access Greeting Section */}
          {!searchQuery && activeNav === 'home' && (
            <section className="my-6">
              <h2 className="text-2xl font-black mb-4">Chào buổi tối</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {topHits.slice(0, 6).map((song) => (
                  <div 
                    key={song.id} 
                    onClick={() => playSong(song, topHits)}
                    className="bg-white/5 hover:bg-white/20 transition rounded-md flex items-center overflow-hidden cursor-pointer group"
                  >
                    <img src={song.albumCover} alt={song.title} className="w-16 h-16 object-cover shadow-md" />
                    <span className="font-bold text-sm px-4 truncate flex-1">{song.title}</span>
                    <button className="w-10 h-10 rounded-full bg-[#1DB954] text-black flex items-center justify-center mr-3 opacity-0 group-hover:opacity-100 transition shadow-xl">
                      <Play size={18} fill="black" className="ml-0.5" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Song Grid (Bảng Xếp Hạng & Kết Quả Tìm Kiếm) */}
          <section className="my-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold tracking-tight">
                {searchQuery ? `Kết quả tìm kiếm cho "${searchQuery}"` : 'Top Nhạc Việt Nổi Bật'}
              </h2>
              <span className="text-xs text-gray-400 font-bold">{searchResults.length} bài hát</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {searchResults.map((song) => {
                const isCurrent = currentSong?.id === song.id;
                return (
                  <div 
                    key={song.id}
                    onClick={() => playSong(song, searchResults)}
                    className="bg-[#181818] hover:bg-[#282828] p-4 rounded-lg transition duration-200 group cursor-pointer relative"
                  >
                    <div className="relative mb-4">
                      <img 
                        src={song.albumCover} 
                        alt={song.title} 
                        className="w-full aspect-square object-cover rounded-md shadow-lg"
                      />
                      <button className={`absolute right-2 bottom-2 w-12 h-12 rounded-full bg-[#1DB954] text-black flex items-center justify-center shadow-2xl opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all ${
                        isCurrent && isPlaying ? 'opacity-100 translate-y-0' : ''
                      }`}>
                        <Play size={22} fill="black" className="ml-0.5" />
                      </button>
                    </div>
                    <h3 className="font-bold text-sm truncate text-white mb-1">{song.title}</h3>
                    <p className="text-xs text-gray-400 truncate">{song.artist}</p>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <Player />
      </main>
    </div>
  );
}
