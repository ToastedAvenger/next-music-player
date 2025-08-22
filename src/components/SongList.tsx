// /components/SongList.tsx
'use client';
import React, { useMemo, useState } from 'react';
import TrackCard from './TrackCard';
import '../styles/SongList.css';
import { usePlayer } from '../contexts/PlayerContext';

export default function SongList() {
  const { allTracks } = usePlayer();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allTracks;
    return allTracks.filter(t => (
      t.title.toLowerCase().includes(q) ||
      (t.artist || '').toLowerCase().includes(q) ||
      (t.album || '').toLowerCase().includes(q) ||
      (t.fileName || '').toLowerCase().includes(q)
    ));
  }, [allTracks, query]);

  return (
    <section className="songlist">
      <div className="topbar">
        <input placeholder="Search songs..." value={query} onChange={(e)=>setQuery(e.target.value)} />
        <div className="counts">{filtered.length} songs</div>
      </div>

      <div className="list">
        {filtered.map(track => <TrackCard key={track.id} track={track} />)}
      </div>
    </section>
  );
}
