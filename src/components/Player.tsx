// /components/Player.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { usePlayer } from '../contexts/PlayerContext';
import '../styles/Player.css';

export default function Player() {
  const { currentTrack, isPlaying, togglePlay, next, prev, position, duration, seek, volume, setVolume } = usePlayer();
  const [localPos, setLocalPos] = useState(0);

  useEffect(()=> setLocalPos(position), [position]);

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setLocalPos(v);
    seek(v);
  };

  const onVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
  };

  return (
    <footer className="player">
      <div className="left">
        <img src={currentTrack?.cover || '/placeholder.png'} className="p-cover" />
        <div className="p-meta">
          <div className="p-title">{currentTrack?.title || 'No track'}</div>
          <div className="p-sub">{currentTrack?.artist}</div>
        </div>
      </div>

      <div className="center">
        <div className="controls">
          <button onClick={prev}>⏮</button>
          <button onClick={togglePlay}>{isPlaying ? '⏸' : '▶'}</button>
          <button onClick={next}>⏭</button>
        </div>
        <div className="progress">
          <input type="range" min={0} max={duration || 0} value={localPos} onChange={onSeek} step={0.1} />
          <div className="time">
            <span>{formatTime(localPos)}</span>
            <span>{formatTime(duration ?? 0)}</span>
          </div>
        </div>
      </div>

      <div className="right">
        <input type="range" min={0} max={1} step={0.01} value={volume} onChange={onVolume} />
      </div>
    </footer>
  );
}

function formatTime(s: number) {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}
