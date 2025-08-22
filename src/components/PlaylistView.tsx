'use client';
import React from 'react';
import { usePlayer } from '../contexts/PlayerContext';
import TrackCard from './TrackCard';
import '../styles/SongList.css'; // reuse styling

export default function PlaylistView({ playlistId }: { playlistId: string }) {
  const { playlists, removeFromPlaylist } = usePlayer();
  const playlist = playlists.find(p => p.id === playlistId);

  if (!playlist) {
    return <div className="songlist"><p>Playlist not found.</p></div>;
  }

  return (
    <section className="songlist">
      <div className="topbar">
        <h2>{playlist.name}</h2>
        <div className="counts">{playlist.tracks.length} songs</div>
      </div>

      <div className="list">
        {playlist.tracks.length === 0 && (
          <p className="empty">No songs in this playlist yet.</p>
        )}
        {playlist.tracks.map(track => (
          <div key={track.id} className="playlist-track-row">
            <TrackCard track={track} />
            <button
              className="remove-btn"
              onClick={() => removeFromPlaylist(playlist.id, track.id)}
            >
              ❌
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
