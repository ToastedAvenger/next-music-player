// /components/FileImporter.tsx
'use client';
import React from 'react';
import { iterateDirectoryFiles } from '../lib/fsHelpers';
import { extractMetadataFromFile } from '../utils/metadata';
import { usePlayer } from '../contexts/PlayerContext';
import '../styles/FileImporter.css';

function genId(folderName: string, fileName: string) {
  return `${folderName}::${fileName}::${Date.now()}::${Math.floor(Math.random() * 10000)}`;
}

export default function FileImporter() {
  const { addTracks } = usePlayer();

  const pickDirectory = async () => {
    if (!('showDirectoryPicker' in window)) {
      alert('Directory picker not supported in this browser. Use "Select files" instead.');
      return;
    }
    try {
      const dirHandle = await (window as any).showDirectoryPicker();
      const tracks = [];
      for await (const { name, handle } of iterateDirectoryFiles(dirHandle)) {
        const file = await handle.getFile();
        const meta = await extractMetadataFromFile(file);
        const id = genId(dirHandle.name || 'root', name);
        tracks.push({
          id,
          title: meta.title,
          artist: meta.artist,
          album: meta.album,
          duration: meta.duration,
          cover: meta.cover,
          fileHandle: handle,
          folderName: dirHandle.name,
          fileName: name,
        });
      }
      addTracks(tracks);
    } catch (err) {
      console.error(err);
      alert('Directory access cancelled or failed.');
    }
  };

  const onFilesSelected: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const files = Array.from(e.target.files || []);
    const tracks = [];
    for (const file of files) {
      const meta = await extractMetadataFromFile(file);
      const id = genId('files', file.name);

      const pseudoHandle = {
        kind: 'file',
        getFile: async () => file,
      } as unknown as FileSystemFileHandle;
      tracks.push({
        id,
        title: meta.title,
        artist: meta.artist,
        album: meta.album,
        duration: meta.duration,
        cover: meta.cover,
        fileHandle: pseudoHandle,
        folderName: 'files',
        fileName: file.name,
      });
    }
    addTracks(tracks);
    // reset input
    (e.target as HTMLInputElement).value = '';
  };

  return (
    <div className="file-importer">
      <button onClick={pickDirectory} className="btn">Select Folder (Windows/Chromium)</button>
      <div className="or">or</div>
      <label className="file-label">
        Select files
        <input type="file" accept="audio/*" multiple onChange={onFilesSelected} />
      </label>
    </div>
  );
}
