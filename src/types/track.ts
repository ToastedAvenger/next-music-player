// /types/track.ts
export type TrackID = string;

export interface Track {
  id: TrackID;
  title: string;
  artist?: string;
  album?: string;
  duration?: number; // seconds
  cover?: string | null; // object URL or data URL, or null
  fileHandle: FileSystemFileHandle; // browser handle, client-only
  folderName?: string;
  fileName: string;
}
