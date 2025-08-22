// /utils/metadata.ts
import { parseBlob } from 'music-metadata-browser';

export async function extractMetadataFromFile(file: File) {
  try {
    const meta = await parseBlob(file);
    const common = meta.common || {};
    const picture = common.picture && common.picture.length ? common.picture[0] : null;

    let cover: string | null = null;
    if (picture && picture.data) {
      // convert Uint8Array to base64 data URL
      const bytes = picture.data;
      let binary = '';
      const len = bytes.length;
      for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
      const base64 = btoa(binary);
      // picture.format like 'image/jpeg'
      cover = `data:${picture.format};base64,${base64}`;
    }

    return {
      title: common.title || file.name.replace(/\.[^/.]+$/, ''),
      artist: common.artist || '',
      album: common.album || '',
      duration: meta.format?.duration || undefined,
      cover,
    };
  } catch (err) {
    console.warn('metadata parse failed for', file.name, err);
    return {
      title: file.name.replace(/\.[^/.]+$/, ''),
      artist: '',
      album: '',
      duration: undefined,
      cover: null,
    };
  }
}
