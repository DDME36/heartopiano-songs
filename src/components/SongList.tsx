import { motion } from 'framer-motion'
import { Music } from 'lucide-react'
import { Song } from '../types'

interface SongListProps {
  songs: Song[]
  selectedSong: Song | null
  onSelectSong: (song: Song) => void
  t: any
}

export const SongList = ({
  songs,
  selectedSong,
  onSelectSong,
  t
}: SongListProps) => {
  const getDifficultyColor = (difficulty: Song['difficulty']) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-500'
      case 'Medium': return 'text-amber-500'
      case 'Hard': return 'text-rose-500'
    }
  }

  return (
    <div
      className="glass-card flex-[1.5] flex flex-col p-2.5 shadow-pink-200/10 min-h-[180px] overflow-hidden"
    >
      <div className="flex items-center gap-2 mb-2.5 px-1">
        <Music className="text-pink-500 w-3.5 h-3.5" />
        <h3 className="text-slate-800 font-black text-xs tracking-widest uppercase">
          {t.collection}
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-2.5 px-1 py-2">
        {songs.map((song) => (
          <motion.div
            key={song.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`
              p-2.5 rounded-2xl cursor-pointer transition-all duration-300 relative group overflow-hidden
              ${selectedSong?.id === song.id
                ? 'bg-gradient-to-r from-pink-400 to-indigo-400 text-white shadow-lg shadow-indigo-200/50 scale-[1.02]'
                : 'bg-white/40 hover:bg-white/60 text-slate-700 hover:scale-[1.01] hover:shadow-md'
              }
            `}
            whileHover={{ scale: selectedSong?.id === song.id ? 1.02 : 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectSong(song)}
          >
            {selectedSong?.id === song.id && (
              <motion.div
                layoutId="active-glow"
                className="absolute inset-0 rounded-2xl ring-2 ring-white/50 animate-pulse"
              />
            )}

            <div className="relative z-10 flex items-center justify-between">
              <div className={`font-bold text-sm ${selectedSong?.id === song.id ? 'text-white' : 'text-slate-800'} flex items-center gap-2`}>
                <span>{song.title}</span>
                <span className={`font-medium text-xs ${selectedSong?.id === song.id ? 'text-white/70' : 'text-slate-500'}`}>
                  - {song.artist}
                </span>
              </div>
              <span className={`
                text-[10px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-tighter flex-shrink-0
                ${selectedSong?.id === song.id
                  ? 'bg-white/20 text-white'
                  : getDifficultyColor(song.difficulty) + ' bg-white/50 shadow-sm'
                }
              `}>
                {t.difficulty[song.difficulty]}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
