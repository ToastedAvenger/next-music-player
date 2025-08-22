// /components/Sidebar.tsx
'use client';
import React from 'react';
import { useState } from 'react';
import '../styles/Sidebar.css';
import { usePlayer } from '../contexts/PlayerContext';

export default function Sidebar({ onShowHome, onSelectPlaylist }: { onShowHome?: () => void; onSelectPlaylist?: (id: string) => void }) {
  const { playlists, createPlaylist, deletePlaylist, renamePlaylist, playPlaylist, currentTrack } = usePlayer();
  const [playingPlaylistId, setPlayingPlaylistId] = useState<string | null>(null);

  const handleCreate = () => {
    const name = prompt("New playlist name?");
    if (name) createPlaylist(name);
  };

  const handlePlayPause = (id: string) => {
    if (playingPlaylistId === id) {
      // pause
      setPlayingPlaylistId(null);
    } else {
      playPlaylist(id);
      setPlayingPlaylistId(id);
    }
  };

  return (
    <aside className="sidebar">
      <div className="brand">MyMusic</div>
      <nav>
        <button className="nav-btn" onClick={onShowHome}>Home</button>
        <button className="nav-btn" onClick={handleCreate}>+ Create Playlist</button>
      </nav>
      <div className="playlists">
        {playlists.map(pl => (
          <div key={pl.id} className="playlist-item">
            <span onClick={() => onSelectPlaylist?.(pl.id)}>{pl.name}</span>
            <button onClick={() => handlePlayPause(pl.id)}>
              {playingPlaylistId === pl.id ? "⏸" : "▶"}
            </button>
            <button onClick={() => {
              const newName = prompt("Rename playlist:", pl.name);
              if (newName) renamePlaylist(pl.id, newName);
            }}>✎</button>
            <button onClick={() => deletePlaylist(pl.id)}>🗑</button>
          </div>
        ))}
      </div>
    </aside>
  );
}