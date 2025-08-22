// /lib/fsHelpers.ts
export const AUDIO_EXT = ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac'];

export async function* iterateDirectoryFiles(dirHandle: FileSystemDirectoryHandle) {
  for await (const [name, handle] of dirHandle.entries()) {
    if (handle.kind === 'file') {
      const ext = name.split('.').pop()?.toLowerCase() || '';
      if (AUDIO_EXT.includes(ext)) {
        yield { name, handle };
      }
    } else if (handle.kind === 'directory') {
      // recursion
      for await (const file of iterateDirectoryFiles(handle)) {
        yield file;
      }
    }
  }
}
