// /components/TrackCard.tsx
'use client';
import React from 'react';
import type { Track } from '../types/track';
import '../styles/TrackCard.css';
import { usePlayer } from '../contexts/PlayerContext';


export default function TrackCard({ track }: { track: Track }) {
  const { playTrack, addToQueue, playlists, addToPlaylist, createPlaylist } = usePlayer();

  const onPlay = async () => {
    await playTrack(track);
  };

  const onAddToQueue = () => addToQueue(track);
  const onAddToPlaylist = () => {
    const names = playlists.map((p, i) => `${i+1}. ${p.name}`).join("\n");
    const choice = prompt(`Select playlist:\n${names}\nOr type a new name:`);

    if (!choice) return;
    const existing = playlists.find(p => p.name === choice);
    if (existing) {
      addToPlaylist(existing.id, track);
    } else {
      // new playlist
      const newName = choice;
      const id = crypto.randomUUID();
      createPlaylist(newName);
      const created = playlists.find(p => p.name === newName);
      if (created) addToPlaylist(created.id, track);
    }
  };

  return (
    <div className="track-card">
      <img className="cover" src={track.cover || '/placeholder.png'} alt={track.title} />
      <div className="meta">
        <div className="title">{track.title}</div>
        <div className="sub">{track.artist || track.album || track.fileName}</div>
      </div>
      <div className="actions">
        <button onClick={onPlay}>Play</button>
        <button onClick={onAddToQueue}>+Queue</button>
        <button onClick={onAddToPlaylist}>+Playlist</button>
      </div>
    </div>
  );
}
