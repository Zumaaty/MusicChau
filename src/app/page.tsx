'use client';

import React, { useState } from 'react';
import MoodSelector from '@/components/MoodSelector';
import Player from '@/components/Player';
import { VIETNAMESE_SONGS, Song } from '@/lib/musicData';
import { useAudioStore } from '@/lib/audioEngine';
import { Play, User, Music, Search, Heart, PlusCircle, Trash2, DownloadCloud } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { 
    playSong, currentSong, isPlaying, 
    searchQuery, setSearchQuery, mood, 
    favorites, playlists, createPlaylist, removePlaylist, addSongToPlaylist 
  } = useAudioStore();

  const [activeTab, setActiveTab] = useState<'home' | 'favorites' | 'playlists'>('home');
  const [newPlName, setNewPlName] = useState('');

  // Lọc danh sách bài hát theo Tìm kiếm + Mood
  const filteredSongs = VIETNAMESE_SONGS.filter(song => {
    const matchSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        song.genre.toLowerCase().includes(searchQuery.toLowerCase());
    const matchMood = mood === 'all' || song.mood === mood;
    return matchSearch && matchMood;
  });

  const handleCreatePL = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlName.trim()) return;
    createPlaylist(newPlName.trim());
    setNewPlName('');
  };

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 py-6 pb-36">
      {/* Header & Navigation */}
      <header className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-[#1DB954] rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
            <Music className="text-black" size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Moodify Việt Nam</h1>
            <p className="text-xs text-gray-400">Nghe nhạc Việt không quảng cáo • Tối ưu 5G</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-3 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Tìm bài hát, ca sĩ (Sơn Tùng, Đen Vâu, Vũ...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#242424] border border-white/10 rounded-full pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#1DB954] transition"
          />
        </div>

        <Link 
          href="/login"
          className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full border border-white/10 text-sm font-semibold transition"
        >
          <User size={16} />
          <span>Tài khoản</span>
        </Link>
      </header>

      {/* Tabs Menu */}
      <div className="flex space-x-3 mb-6 border-b border-white/10 pb-3">
        <button 
          onClick={() => setActiveTab('home')}
          className={`px-4 py-2 rounded-full text-sm font-bold transition ${activeTab === 'home' ? 'bg-[#1DB954] text-black' : 'text-gray-400 hover:text-white'}`}
        >
          Trang Chủ & Mood
        </button>
        <button 
          onClick={() => setActiveTab('favorites')}
          className={`px-4 py-2 rounded-full text-sm font-bold transition ${activeTab === 'favorites' ? 'bg-[#1DB954] text-black' : 'text-gray-400 hover:text-white'}`}
        >
          Nhạc Yêu Thích ({favorites.length})
        </button>
        <button 
          onClick={() => setActiveTab('playlists')}
          className={`px-4 py-2 rounded-full text-sm font-bold transition ${activeTab === 'playlists' ? 'bg-[#1DB954] text-black' : 'text-gray-400 hover:text-white'}`}
        >
          Playlist Của Tôi ({playlists.length})
        </button>
      </div>

      {/* Content based on Active Tab */}
      {activeTab === 'home' && (
        <>
          <MoodSelector />

          {/* Song Grid */}
          <section className="mt-8">
            <h2 className="text-xl font-bold mb-4 flex items-center justify-between">
              <span>Bảng Xếp Hạng Nhạc Việt HOT</span>
              <span className="text-xs text-gray-400 font-normal">{filteredSongs.length} bài hát</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredSongs.map((song) => {
                const isCurrent = currentSong?.id === song.id;
                return (
                  <div 
                    key={song.id}
                    onClick={() => playSong(song, filteredSongs)}
                    className="bg-[#181818] p-3 rounded-2xl hover:bg-[#282828] transition group cursor-pointer relative flex flex-col justify-between"
                  >
                    <div className="relative mb-3">
                      <img 
                        src={song.albumCover} 
                        alt={song.title} 
                        className="w-full aspect-square object-cover rounded-xl shadow-md"
                      />
                      <button className={`absolute right-2 bottom-2 w-10 h-10 rounded-full bg-[#1DB954] text-black flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition ${
                        isCurrent && isPlaying ? 'opacity-100' : ''
                      }`}>
                        <Play size={20} fill="black" className="ml-0.5" />
                      </button>
                    </div>
                    <div>
                      <h3 className="font-bold text-sm truncate text-white">{song.title}</h3>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">{song.artist}</p>
                      <span className="inline-block mt-2 text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-green-400">
                        {song.genre}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}

      {activeTab === 'favorites' && (
        <section className="mt-4">
          <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <Heart className="text-red-500 fill-red-500" size={22} />
            <span>Danh Sách Nhạc Việt Yêu Thích</span>
          </h2>

          {favorites.length === 0 ? (
            <p className="text-gray-400 text-sm">Chưa có bài hát nào được thả tim. Hãy bấm icon ❤️ trên trình phát để lưu bài nhé!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {favorites.map((song) => (
                <div key={song.id} onClick={() => playSong(song, favorites)} className="bg-[#181818] p-3 rounded-xl flex items-center space-x-3 cursor-pointer hover:bg-[#282828]">
                  <img src={song.albumCover} alt={song.title} className="w-14 h-14 rounded-lg object-cover" />
                  <div className="flex-1 truncate">
                    <h4 className="font-bold text-sm text-white truncate">{song.title}</h4>
                    <p className="text-xs text-gray-400 truncate">{song.artist}</p>
                  </div>
                  <Play size={20} className="text-[#1DB954]" />
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === 'playlists' && (
        <section className="mt-4">
          <form onSubmit={handleCreatePL} className="flex space-x-2 mb-6 max-w-md">
            <input 
              type="text" 
              placeholder="Tên Playlist mới..."
              value={newPlName}
              onChange={(e) => setNewPlName(e.target.value)}
              className="flex-1 bg-[#242424] border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1DB954]"
            />
            <button type="submit" className="bg-[#1DB954] text-black font-bold px-4 py-2 rounded-lg text-sm flex items-center space-x-1">
              <PlusCircle size={16} />
              <span>Tạo</span>
            </button>
          </form>

          <div className="space-y-4">
            {playlists.map((pl) => (
              <div key={pl.id} className="bg-[#181818] p-4 rounded-xl border border-white/5">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-lg text-white">{pl.name} ({pl.songs.length} bài)</h3>
                  <button onClick={() => removePlaylist(pl.id)} className="text-gray-400 hover:text-red-400">
                    <Trash2 size={18} />
                  </button>
                </div>
                {pl.songs.length === 0 ? (
                  <p className="text-xs text-gray-500">Playlist đang trống.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {pl.songs.map((song) => (
                      <div key={song.id} onClick={() => playSong(song, pl.songs)} className="p-2 bg-white/5 rounded-lg flex justify-between items-center cursor-pointer hover:bg-white/10">
                        <span className="text-xs font-semibold truncate">{song.title} - {song.artist}</span>
                        <Play size={14} className="text-[#1DB954]" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <Player />
    </main>
  );
}
