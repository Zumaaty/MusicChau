import { create } from 'zustand';
import { Song } from './supabase';

interface AudioState {
  currentSong: Song | null;
  isPlaying: boolean;
  quality: 'low' | 'standard' | 'high';
  currentTime: number;
  duration: number;
  queue: Song[];
  mood: string;
  setQuality: (quality: 'low' | 'standard' | 'high') => void;
  playSong: (song: Song, newQueue?: Song[]) => void;
  togglePlay: () => void;
  nextSong: () => void;
  prevSong: () => void;
  seek: (time: number) => void;
  setMood: (mood: string) => void;
}

export const useAudioStore = create<AudioState>((set, get) => {
  let audio: HTMLAudioElement | null = null;

  if (typeof window !== 'undefined') {
    audio = new Audio();
    audio.preload = 'metadata';
    audio.ontimeupdate = () => set({ currentTime: audio?.currentTime || 0 });
    audio.onloadedmetadata = () => set({ duration: audio?.duration || 0 });
    audio.onended = () => get().nextSong();
  }

  const updateMediaSession = (song: Song) => {
    if ('mediaSession' in navigator && song) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: song.title,
        artist: song.artist,
        album: 'Moodify',
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
    queue: [],
    mood: 'chill',

    setQuality: (quality) => set({ quality }),

    playSong: (song, newQueue) => {
      if (!audio) return;
      audio.src = song.streamUrl;
      audio.play().then(() => {
        set({ currentSong: song, isPlaying: true });
        if (newQueue) set({ queue: newQueue });
        updateMediaSession(song);
      }).catch(err => console.error("Playback error:", err));
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
      const { queue, currentSong } = get();
      if (queue.length === 0) return;
      const currentIndex = queue.findIndex(s => s.id === currentSong?.id);
      let nextIndex = (currentIndex + 1) % queue.length;
      const next = queue[nextIndex];
      if (next) get().playSong(next);
    },

    prevSong: () => {
      const { queue, currentSong } = get();
      if (queue.length === 0) return;
      const currentIndex = queue.findIndex(s => s.id === currentSong?.id);
      const prevIndex = currentIndex - 1 < 0 ? queue.length - 1 : currentIndex - 1;
      const prev = queue[prevIndex];
      if (prev) get().playSong(prev);
    },

    seek: (time) => {
      if (audio) {
        audio.currentTime = time;
        set({ currentTime: time });
      }
    },

    setMood: (mood) => set({ mood }),
  };
});