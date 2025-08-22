// /contexts/PlayerContext.tsx
'use client';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { Track } from '../types/track';

type Playlist = {
  id: string;
  name: string;
  tracks: Track[];
};

type PlayerContextType = {
  allTracks: Track[];
  setAllTracks: (t: Track[]) => void;
  addTracks: (t: Track[]) => void;
  playTrack: (t: Track) => Promise<void>;
  playIndexFromQueue: (index: number) => Promise<void>;
  togglePlay: () => void;
  isPlaying: boolean;
  currentTrack: Track | null;
  queue: Track[];
  addToQueue: (t: Track | Track[]) => void;
  reorderQueue: (newQueue: Track[]) => void;
  next: () => void;
  prev: () => void;
  volume: number;
  setVolume: (v: number) => void;
  seek: (s: number) => void;
  position: number;
  duration: number | undefined;
  removeFromQueue: (id: string) => void;
  playlists: Playlist[];
  createPlaylist: (name: string) => void;
  renamePlaylist: (id: string, newName: string) => void;
  deletePlaylist: (id: string) => void;
  addToPlaylist: (id: string, track: Track) => void;
  playPlaylist: (id: string) => void;
  removeFromPlaylist: (playlistId: string, trackId: string) => void;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used inside PlayerProvider');
  return ctx;
};

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [allTracks, setAllTracks] = useState<Track[]>([]);
  const [queue, setQueue] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(1);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState<number | undefined>(undefined);

  const removeFromQueue = (id: string) => {
  setQueue((prev) => prev.filter((track) => track.id !== id));
  };

  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  const createPlaylist = (name: string) => {
    setPlaylists(prev => [...prev, { id: crypto.randomUUID(), name, tracks: [] }]);
  };

  const renamePlaylist = (id: string, newName: string) => {
    setPlaylists(prev => prev.map(pl => pl.id === id ? { ...pl, name: newName } : pl));
  };

  const deletePlaylist = (id: string) => {
    setPlaylists(prev => prev.filter(pl => pl.id !== id));
  };

  const addToPlaylist = (id: string, track: Track) => {
    setPlaylists(prev =>
      prev.map(pl =>
        pl.id === id && !pl.tracks.find(t => t.id === track.id)
          ? { ...pl, tracks: [...pl.tracks, track] }
          : pl
      )
    );
  };

  const playPlaylist = (id: string) => {
    const pl = playlists.find(p => p.id === id);
    if (!pl) return;
    setQueue(pl.tracks);
    if (pl.tracks.length > 0) playTrack(pl.tracks[0]);
  };

  const removeFromPlaylist = (playlistId: string, trackId: string) => {
    setPlaylists(prev =>
      prev.map(pl =>
        pl.id === playlistId
          ? { ...pl, tracks: pl.tracks.filter(t => t.id !== trackId) }
          : pl
      )
    );
  };


  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentObjectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    audio.preload = 'metadata';

    const onTimeUpdate = () => {
      setPosition(audio.currentTime);
    };
    const onLoadedMeta = () => {
      setDuration(audio.duration || undefined);
    };
    const onEnded = () => {
      setIsPlaying(false);
      next();
    };
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMeta);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMeta);
      audio.removeEventListener('ended', onEnded);
      audio.pause();
      audioRef.current = null;
      if (currentObjectUrlRef.current) {
        URL.revokeObjectURL(currentObjectUrlRef.current);
        currentObjectUrlRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const setVolume = (v: number) => {
    setVolumeState(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  const addTracks = (tracks: Track[]) => {
    // avoid duplicates by id
    setAllTracks((prev) => {
      const map = new Map(prev.map((t) => [t.id, t]));
      tracks.forEach((t) => map.set(t.id, t));
      return Array.from(map.values());
    });
  };

  const addToQueue = (t: Track | Track[]) => {
    const items = Array.isArray(t) ? t : [t];
    setQueue((prev) => [...prev, ...items]);
  };

  const playTrack = async (t: Track) => {
    if (!audioRef.current) return;
    const file = await t.fileHandle.getFile();
    if (currentObjectUrlRef.current) {
      URL.revokeObjectURL(currentObjectUrlRef.current);
    }
    const url = URL.createObjectURL(file);
    currentObjectUrlRef.current = url;
    audioRef.current.src = url;
    try {
      await audioRef.current.play();
      setIsPlaying(true);
      setCurrentTrack(t);
    } catch (err) {
      console.error('play failed', err);
    }
  };

  const playIndexFromQueue = async (index: number) => {
    const t = queue[index];
    if (!t) return;
    await playTrack(t);
    // set queue so that that index becomes first (optional)
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const seek = (s: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = s;
    setPosition(s);
  };

  const next = async () => {
    // if queue has next item and current is in queue, play next.
    if (queue.length === 0) return;
    if (!currentTrack) {
      // play first
      await playTrack(queue[0]);
      return;
    }
    const idx = queue.findIndex((t) => t.id === currentTrack.id);
    const nextIdx = idx === -1 ? 0 : idx + 1;
    if (nextIdx < queue.length) {
      await playTrack(queue[nextIdx]);
    } else {
      // end of queue
      setIsPlaying(false);
      setCurrentTrack(null);
    }
  };

  const prev = async () => {
    if (!currentTrack || queue.length === 0) return;
    const idx = queue.findIndex((t) => t.id === currentTrack.id);
    const prevIdx = idx > 0 ? idx - 1 : 0;
    await playTrack(queue[prevIdx]);
  };

  const reorderQueue = (newQueue: Track[]) => {
    setQueue(newQueue);
  };

  const value: PlayerContextType = {
    allTracks,
    setAllTracks,
    addTracks,
    playTrack,
    playIndexFromQueue,
    togglePlay,
    isPlaying,
    currentTrack,
    queue,
    addToQueue,
    reorderQueue,
    next,
    prev,
    volume,
    setVolume,
    seek,
    position,
    duration,
    removeFromQueue,
    playlists,
    createPlaylist,
    renamePlaylist,
    deletePlaylist,
    addToPlaylist,
    playPlaylist,
    removeFromPlaylist,
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
};
