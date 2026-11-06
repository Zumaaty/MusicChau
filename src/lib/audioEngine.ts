import { create } from 'zustand';
import { YTSong, getFallbackStreamUrl } from './youtubeApi';
import { eqEngine } from './equalizerEngine';

interface Playlist {
  id: string;
  name: string;
  songs: YTSong[];
}

interface AudioState {
  currentSong: YTSong | null;
  isPlaying: boolean;
  quality: 'low' | 'standard' | 'high';
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isLoop: boolean;
  isShuffle: boolean;
  queue: YTSong[];
  favorites: YTSong[];
  playlists: Playlist[];
  searchQuery: string;
  mood: string;
  searchResults: YTSong[];
  isSearching: boolean;

  // Actions
  setQuality: (quality: 'low' | 'standard' | 'high') => void;
  playSong: (song: YTSong, newQueue?: YTSong[]) => void;
  togglePlay: () => void;
  nextSong: () => void;
  prevSong: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  toggleFavorite: (song: YTSong) => void;
  createPlaylist: (name: string) => void;
  addSongToPlaylist: (playlistId: string, song: YTSong) => void;
  removePlaylist: (playlistId: string) => void;
  setSearchQuery: (query: string) => void;
  setMood: (mood: string) => void;
  setSearchResults: (results: YTSong[]) => void;
  setIsSearching: (val: boolean) => void;
}

export const useAudioStore = create<AudioState>((set, get) => {
  let audio: HTMLAudioElement | null = null;

  if (typeof window !== 'undefined') {
    audio = new Audio();
    audio.preload = 'metadata';
    audio.ontimeupdate = () => set({ currentTime: audio?.currentTime || 0 });
    audio.onloadedmetadata = () => set({ duration: audio?.duration || 0 });
    audio.onended = () => {
      if (get().isLoop && get().currentSong) {
        get().playSong(get().currentSong!);
      } else {
        get().nextSong();
      }
    };

    audio.onerror = () => {
      const current = get().currentSong;
      if (current && audio) {
        // Thử lại bằng luồng Backup stream nếu luồng chính bị chặn
        audio.src = getFallbackStreamUrl(current.id);
        audio.play().catch(e => console.error("Playback fallback failed:", e));
      }
    };
  }

  const updateMediaSession = (song: YTSong) => {
    if ('mediaSession' in navigator && song) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: song.title,
        artist: song.artist,
        album: 'Moodify Music',
        artwork: [{ src: song.albumCover, sizes: '512x512', type: 'image/jpeg' }],
      });
      navigator.mediaSession.setActionHandler('play', () => get().togglePlay());
      navigator.mediaSession.setActionHandler('pause', () => get().togglePlay());
      navigator.mediaSession.setActionHandler('nexttrack', () => get().nextSong());
      navigator.mediaSession.setActionHandler('previoustrack', () => get().prevSong());
    }
  };

  return {
    currentSong: null,
    isPlaying: false,
    quality: 'standard',
    currentTime: 0,
    duration: 0,
    volume: 1,
    isMuted: false,
    isLoop: false,
    isShuffle: false,
    queue: [],
    favorites: [],
    playlists: [{ id: 'fav-pl', name: 'Nhạc Yêu Thích 💖', songs: [] }],
    searchQuery: '',
    mood: 'all',
    searchResults: [],
    isSearching: false,

    setQuality: (quality) => set({ quality }),

    playSong: (song, newQueue) => {
      if (!audio) return;
      try {
        eqEngine.init(audio);
      } catch {}

      audio.src = song.streamUrl;
      audio.play().then(() => {
        set({ currentSong: song, isPlaying: true });
        if (newQueue) set({ queue: newQueue });
        updateMediaSession(song);
      }).catch(err => {
        console.warn("Thử luồng âm thanh dự phòng...");
        if (audio) {
          audio.src = getFallbackStreamUrl(song.id);
          audio.play().then(() => {
            set({ currentSong: song, isPlaying: true });
            if (newQueue) set({ queue: newQueue });
            updateMediaSession(song);
          });
        }
      });
    },

    togglePlay: () => {
      if (!audio) return;
      if (get().isPlaying) {
        audio.pause();
        set({ isPlaying: false });
      } else {
        audio.play();
        set({ isPlaying: true });
      }
    },

    nextSong: () => {
      const { queue, currentSong, isShuffle } = get();
      if (queue.length === 0) return;
      
      if (isShuffle) {
        const randomIndex = Math.floor(Math.random() * queue.length);
        get().playSong(queue[randomIndex]);
        return;
      }

      const currentIndex = queue.findIndex(s => s.id === currentSong?.id);
      const nextIndex = (currentIndex + 1) % queue.length;
      get().playSong(queue[nextIndex]);
    },

    prevSong: () => {
      const { queue, currentSong } = get();
      if (queue.length === 0) return;
      const currentIndex = queue.findIndex(s => s.id === currentSong?.id);
      const prevIndex = currentIndex - 1 < 0 ? queue.length - 1 : currentIndex - 1;
      get().playSong(queue[prevIndex]);
    },

    seek: (time) => {
      if (audio) {
        audio.currentTime = time;
        set({ currentTime: time });
      }
    },

    setVolume: (vol) => {
      if (audio) {
        audio.volume = vol;
        set({ volume: vol, isMuted: vol === 0 });
      }
    },

    toggleMute: () => {
      if (!audio) return;
      const muted = !get().isMuted;
      audio.muted = muted;
      set({ isMuted: muted });
    },

    toggleLoop: () => set((state) => ({ isLoop: !state.isLoop })),
    toggleShuffle: () => set((state) => ({ isShuffle: !state.isShuffle })),

    toggleFavorite: (song) => set((state) => {
      const exists = state.favorites.some(s => s.id === song.id);
      const newFavs = exists 
        ? state.favorites.filter(s => s.id !== song.id)
        : [...state.favorites, song];
      return { favorites: newFavs };
    }),

    createPlaylist: (name) => set((state) => ({
      playlists: [...state.playlists, { id: Date.now().toString(), name, songs: [] }]
    })),

    addSongToPlaylist: (playlistId, song) => set((state) => ({
      playlists: state.playlists.map(pl => {
        if (pl.id === playlistId && !pl.songs.some(s => s.id === song.id)) {
          return { ...pl, songs: [...pl.songs, song] };
        }
        return pl;
      })
    })),

    removePlaylist: (playlistId) => set((state) => ({
      playlists: state.playlists.filter(pl => pl.id !== playlistId)
    })),

    setSearchQuery: (searchQuery) => set({ searchQuery }),
    setMood: (mood) => set({ mood }),
    setSearchResults: (searchResults) => set({ searchResults }),
    setIsSearching: (isSearching) => set({ isSearching }),
  };
});
