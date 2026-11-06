'use client';

import React, { useState, useEffect } from 'react';
import MoodSelector from '@/components/MoodSelector';
import Player from '@/components/Player';
import { useAudioStore } from '@/lib/audioEngine';
import { searchYouTubeMusic, YTSong } from '@/lib/youtubeApi';
import { Play, User, Music, Search, Heart, PlusCircle, Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';

const INITIAL_VIETNAMESE_SONGS: YTSong[] = [
  {
    id: 'TuAnHung-Phale',
    title: 'Phá Lệ (Lofi Chill)',
    artist: 'Tuấn Hưng',
    albumCover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
    streamUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    duration: 210,
    mood: 'chill',
    genre: 'V-Pop'
  },
  {
    id: 'SonTung-ChayNgayDi',
    title: 'Chạy Ngay Đi',
    artist: 'Sơn Tùng M-TP',
    albumCover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80',
    streamUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792ce.mp3',
    duration: 185,
    mood: 'energy',
    genre: 'Rap Việt'
  },
  {
    id: 'Vu-CaPhe',
    title: 'Bước Qua Mùa Cô Đơn',
    artist: 'Vũ.',
    albumCover: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&q=80',
    streamUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3',
    duration: 215,
    mood: 'coffee',
    genre: 'Indie Việt'
  }
];

export default function HomePage() {
  const { 
    playSong, currentSong, isPlaying, 
    searchQuery, setSearchQuery, 
    searchResults, setSearchResults, isSearching, setIsSearching,
    favorites, playlists, createPlaylist, removePlaylist
  } = useAudioStore();

  const [activeTab, setActiveTab] = useState<'home' | 'favorites' | 'playlists'>('home');
  const [newPlName, setNewPlName] = useState('');

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(INITIAL_VIETNAMESE_SONGS);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchYouTubeMusic(searchQuery);
      setSearchResults(results.length > 0 ? results : INITIAL_VIETNAMESE_SONGS);
      setIsSearching(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, setSearchResults, setIsSearching]);

  const handleCreatePL = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlName.trim()) return;
    createPlaylist(newPlName.trim());
    setNewPlName('');
  };

  const displaySongs = searchResults.length > 0 ? searchResults : INITIAL_VIETNAMESE_SONGS;

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 py-6 pb-36">
      <header className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-[#1DB954] rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
            <Music className="text-black" size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Moodify Việt Nam</h1>
            <p className="text-xs text-gray-400">Nghe nhạc YouTube Music không quảng cáo • Tối ưu 5G</p>
          </div>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-3 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Gõ bài hát, ca sĩ (Tuấn Hưng, Sơn Tùng, Đen...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#242424] border border-white/10 rounded-full pl-10 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-[#1DB954] transition"
          />
          {isSearching && (
            <Loader2 className="absolute right-3.5 top-3 text-[#1DB954] animate-spin" size={18} />
          )}
        </div>

        <Link 
          href="/login"
          className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full border border-white/10 text-sm font-semibold transition"
        >
          <User size={16} />
          <span>Tài khoản</span>
        </Link>
      </header>

      <div className="flex space-x-3 mb-6 border-b border-white/10 pb-3">
        <button 
          onClick={() => setActiveTab('home')}
          className={`px-4 py-2 rounded-full text-sm font-bold transition ${activeTab === 'home' ? 'bg-[#1DB954] text-black' : 'text-gray-400 hover:text-white'}`}
        >
          Trang Chủ & Tìm Kiếm
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
          Playlist ({playlists.length})
        </button>
      </div>

      {activeTab === 'home' && (
        <>
          <MoodSelector />

          <section className="mt-8">
            <h2 className="text-xl font-bold mb-4 flex items-center justify-between">
              <span>{searchQuery ? `Kết quả tìm kiếm cho "${searchQuery}"` : 'Bài Hát Gợi Ý Hàng Đầu'}</span>
              <span className="text-xs text-gray-400 font-normal">{displaySongs.length} bài hát</span>
            </h2>

            {isSearching ? (
              <div className="flex items-center justify-center py-20 text-gray-400 space-x-2">
                <Loader2 className="animate-spin text-[#1DB954]" size={24} />
                <span>Đang tìm kiếm nhạc YouTube...</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {displaySongs.map((song) => {
                  const isCurrent = currentSong?.id === song.id;
                  return (
                    <div 
                      key={song.id}
                      onClick={() => playSong(song, displaySongs)}
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
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}

      {activeTab === 'favorites' && (
        <section className="mt-4">
          <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <Heart className="text-red-500 fill-red-500" size={22} />
            <span>Nhạc Yêu Thích</span>
          </h2>
          {favorites.length === 0 ? (
            <p className="text-gray-400 text-sm">Chưa có bài hát nào được thả tim.</p>
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
