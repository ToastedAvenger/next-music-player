'use client';
import React, { useState } from 'react';
import FileImporter from '../components/FileImporter';
import SongList from '../components/SongList';
import PlaylistView from '../components/PlaylistView';
import Sidebar from '../components/Sidebar';
import Queue from '../components/Queue';
import '../styles/page.css';
import '../styles/globals.css';

export default function HomePage() {
  const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);

  return (
    <div className="app-grid">
      <Sidebar
        onShowHome={() => setActivePlaylistId(null)}
        onSelectPlaylist={(id) => setActivePlaylistId(id)}
      />

      <main className="home-wrap">
        <div className="import-row">
          <FileImporter />
          {activePlaylistId
            ? <PlaylistView playlistId={activePlaylistId} />
            : <SongList />
          }
        </div>
      </main>

      <aside className="right-area">
        <div className="queue-column">
          <Queue />
        </div>
      </aside>
    </div>
  );
}
