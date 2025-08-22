import '../styles/globals.css';
import { PlayerProvider } from '../contexts/PlayerContext';
import Player from '../components/Player';

export const metadata = {
  title: 'Next Music Player',
  description: 'Browser-based music player',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PlayerProvider>
          {/* Sidebar will be rendered inside children page */}
          {children}
          <Player />
        </PlayerProvider>
      </body>
    </html>
  );
}
