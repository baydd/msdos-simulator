import React, { useState, useEffect, useRef } from 'react';
import { dosSoundManager } from '../utils/dosSounds';

interface DOSMusicProps {
  onExit: () => void;
}

interface Track {
  title: string;
  artist: string;
  duration: string;
  notes: Array<{ freq: number; duration: number }>;
}

export const DOSMusic: React.FC<DOSMusicProps> = ({ onExit }) => {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(50);
  const [visualizer, setVisualizer] = useState<number[]>(Array(20).fill(0));
  const intervalRef = useRef<NodeJS.Timeout>();

  const tracks: Track[] = [
    {
      title: "Für Elise",
      artist: "Ludwig van Beethoven",
      duration: "3:25",
      notes: [
        { freq: 659, duration: 400 }, { freq: 622, duration: 400 }, { freq: 659, duration: 400 },
        { freq: 622, duration: 400 }, { freq: 659, duration: 400 }, { freq: 494, duration: 400 },
        { freq: 587, duration: 400 }, { freq: 523, duration: 400 }, { freq: 440, duration: 800 }
      ]
    },
    {
      title: "Ode to Joy",
      artist: "Ludwig van Beethoven",
      duration: "4:12",
      notes: [
        { freq: 330, duration: 400 }, { freq: 330, duration: 400 }, { freq: 349, duration: 400 },
        { freq: 392, duration: 400 }, { freq: 392, duration: 400 }, { freq: 349, duration: 400 },
        { freq: 330, duration: 400 }, { freq: 294, duration: 400 }, { freq: 262, duration: 800 }
      ]
    },
    {
      title: "Twinkle Twinkle",
      artist: "Traditional",
      duration: "2:30",
      notes: [
        { freq: 523, duration: 400 }, { freq: 523, duration: 400 }, { freq: 784, duration: 400 },
        { freq: 784, duration: 400 }, { freq: 880, duration: 400 }, { freq: 880, duration: 400 },
        { freq: 784, duration: 800 }
      ]
    },
    {
      title: "Happy Birthday",
      artist: "Traditional",
      duration: "1:45",
      notes: [
        { freq: 523, duration: 300 }, { freq: 523, duration: 300 }, { freq: 587, duration: 600 },
        { freq: 523, duration: 600 }, { freq: 698, duration: 600 }, { freq: 659, duration: 1200 }
      ]
    },
    {
      title: "Mary Had a Little Lamb",
      artist: "Traditional",
      duration: "1:20",
      notes: [
        { freq: 659, duration: 400 }, { freq: 587, duration: 400 }, { freq: 523, duration: 400 },
        { freq: 587, duration: 400 }, { freq: 659, duration: 400 }, { freq: 659, duration: 400 },
        { freq: 659, duration: 800 }
      ]
    }
  ];

  const playTrack = async (trackIndex: number) => {
    if (isPlaying) {
      stopTrack();
      return;
    }

    setIsPlaying(true);
    setCurrentTrack(trackIndex);
    setCurrentTime(0);

    const track = tracks[trackIndex];
    let noteIndex = 0;

    const playNextNote = () => {
      if (noteIndex >= track.notes.length) {
        setIsPlaying(false);
        setCurrentTime(0);
        return;
      }

      const note = track.notes[noteIndex];
      dosSoundManager.playBeep(note.freq, note.duration);
      
      // Update visualizer
      const newVisualizer = Array(20).fill(0).map(() => Math.random() * (note.freq / 1000) * (volume / 100));
      setVisualizer(newVisualizer);

      noteIndex++;
      setCurrentTime(prev => prev + note.duration / 1000);

      intervalRef.current = setTimeout(playNextNote, note.duration);
    };

    playNextNote();
  };

  const stopTrack = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    setVisualizer(Array(20).fill(0));
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
    }
  };

  const nextTrack = () => {
    const next = (currentTrack + 1) % tracks.length;
    setCurrentTrack(next);
    if (isPlaying) {
      stopTrack();
      setTimeout(() => playTrack(next), 100);
    }
  };

  const prevTrack = () => {
    const prev = currentTrack === 0 ? tracks.length - 1 : currentTrack - 1;
    setCurrentTrack(prev);
    if (isPlaying) {
      stopTrack();
      setTimeout(() => playTrack(prev), 100);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case ' ':
        e.preventDefault();
        playTrack(currentTrack);
        break;
      case 'ArrowRight':
        nextTrack();
        break;
      case 'ArrowLeft':
        prevTrack();
        break;
      case 'Escape':
        onExit();
        break;
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="h-full bg-black text-green-400 dos-font p-4 overflow-hidden" onKeyDown={handleKeyPress} tabIndex={0}>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-yellow-400 text-xl">
          ♪♫♪ DOS MUSIC PLAYER v2.0 ♪♫♪
        </div>
        <div className="text-cyan-400 text-sm mt-2">
          PC Speaker Edition - High Quality 8-bit Audio!
        </div>
      </div>

      {/* Now Playing */}
      <div className="border border-green-400 p-4 mb-4">
        <div className="text-center">
          <div className="text-yellow-400 text-lg mb-2">Now Playing:</div>
          <div className="text-white text-xl">{tracks[currentTrack].title}</div>
          <div className="text-cyan-400">{tracks[currentTrack].artist}</div>
          <div className="text-gray-400 text-sm mt-2">
            {Math.floor(currentTime / 60)}:{(currentTime % 60).toFixed(0).padStart(2, '0')} / {tracks[currentTrack].duration}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="bg-gray-700 h-2 rounded">
            <div 
              className="bg-green-400 h-2 rounded transition-all duration-300"
              style={{ width: `${(currentTime / 180) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Visualizer */}
      <div className="border border-green-400 p-4 mb-4">
        <div className="text-center text-yellow-400 mb-2">Audio Visualizer</div>
        <div className="flex items-end justify-center space-x-1 h-20">
          {visualizer.map((height, index) => (
            <div
              key={index}
              className="bg-green-400 w-4 transition-all duration-100"
              style={{ height: `${Math.max(2, height * 60)}px` }}
            />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="border border-green-400 p-4 mb-4">
        <div className="flex justify-center items-center space-x-4">
          <button
            onClick={prevTrack}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 border border-blue-400"
          >
            ⏮ Prev
          </button>
          <button
            onClick={() => playTrack(currentTrack)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 border border-green-400"
          >
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>
          <button
            onClick={stopTrack}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 border border-red-400"
          >
            ⏹ Stop
          </button>
          <button
            onClick={nextTrack}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 border border-blue-400"
          >
            Next ⏭
          </button>
        </div>

        {/* Volume */}
        <div className="mt-4 flex items-center justify-center space-x-2">
          <span className="text-sm">🔊 Volume:</span>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-32"
          />
          <span className="text-sm w-8">{volume}%</span>
        </div>
      </div>

      {/* Playlist */}
      <div className="border border-green-400 p-4">
        <div className="text-yellow-400 mb-2">Playlist:</div>
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {tracks.map((track, index) => (
            <div
              key={index}
              onClick={() => playTrack(index)}
              className={`cursor-pointer p-2 rounded ${
                index === currentTrack 
                  ? 'bg-green-800 text-white' 
                  : 'hover:bg-gray-800'
              }`}
            >
              <div className="flex justify-between">
                <span>{index + 1}. {track.title}</span>
                <span className="text-gray-400">{track.duration}</span>
              </div>
              <div className="text-sm text-gray-400">{track.artist}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Help */}
      <div className="text-center text-xs text-gray-400 mt-4">
        SPACE: Play/Pause | ← → : Change Track | ESC: Exit
      </div>
    </div>
  );
};