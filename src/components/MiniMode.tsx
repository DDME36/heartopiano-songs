import { motion } from 'framer-motion'
import { Play, Pause, Square, Maximize2, Music2, ChevronLeft, ChevronRight } from 'lucide-react'
import { Song } from '../types'

interface MiniModeProps {
  isPlaying: boolean
  selectedSong: Song | null
  progress: number
  currentBeat: number
  totalBeats: number
  bpm: number
  speed: number
  onPlayPause: () => void
  onStop: () => void
  onExpandMode: () => void
  onClose: () => void
  onNextSong: () => void
  onPrevSong: () => void
  onSeek?: (noteIndex: number) => void
  currentNoteIndex?: number
  totalNotes?: number
  t: any
}

export const MiniMode = ({
  isPlaying,
  selectedSong,
  progress,
  currentBeat,
  totalBeats,
  bpm,
  speed,
  onPlayPause,
  onStop,
  onExpandMode,
  onClose,
  onNextSong,
  onPrevSong,
  onSeek,
  currentNoteIndex = 0,
  totalNotes = 0,
  t
}: MiniModeProps) => {
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    if (!selectedSong || !onSeek || totalNotes === 0) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    const targetNoteIndex = Math.floor((percentage / 100) * totalNotes)
    
    console.log(`[MiniMode] Click at ${x.toFixed(0)}px / ${rect.width.toFixed(0)}px = ${percentage.toFixed(1)}% -> note ${targetNoteIndex}/${totalNotes}`)
    onSeek(targetNoteIndex)
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mini-glass rounded-2xl p-4 w-[280px] shadow-2xl draggable-region"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
              <Music2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold text-xs">HEARTOPIANO</span>
          </div>
          
          <div className="flex gap-1 no-drag">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onExpandMode}
              className="w-6 h-6 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
            >
              <Maximize2 className="w-3 h-3 text-white" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-6 h-6 rounded-lg bg-rose-400/80 hover:bg-rose-500 flex items-center justify-center transition-all"
            >
              <span className="text-white text-xs font-bold">✕</span>
            </motion.button>
          </div>
        </div>

        {/* Song Info */}
        {selectedSong ? (
          <div className="mb-3 no-drag">
            <div className="flex items-center justify-between gap-2 mb-1">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onPrevSong}
                className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all flex-shrink-0"
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </motion.button>
              
              <div className="flex-1 text-center min-w-0">
                <div className="text-white font-bold text-sm truncate mb-1">
                  {selectedSong.title}
                </div>
                <div className="flex items-center justify-center gap-2 text-[10px] text-white/80">
                  <span className="truncate">{selectedSong.artist}</span>
                  {bpm > 0 && (
                    <>
                      <span>•</span>
                      <span className="font-bold">{bpm} BPM</span>
                    </>
                  )}
                  <span>•</span>
                  <span className="text-pink-300 font-bold">{speed.toFixed(1)}x</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onNextSong}
                className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all flex-shrink-0"
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </motion.button>
            </div>
          </div>
        ) : (
          <div className="mb-3 text-center text-white/60 text-xs">
            {t.noSongSelected || 'No song selected'}
          </div>
        )}

        {/* Progress */}
        <div className="mb-3 no-drag">
          <div className="flex justify-between text-[9px] text-white/70 mb-1 font-mono">
            <span>{currentBeat.toFixed(1)}</span>
            <span className="text-pink-300 font-bold">{Math.round(progress)}%</span>
            <span>{totalBeats.toFixed(1)}</span>
          </div>
          <div 
            className="h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer hover:h-2 transition-all"
            onClick={handleProgressClick}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-pink-400 to-purple-500 rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2 no-drag">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPlayPause}
            disabled={!selectedSong}
            className={`
              flex-1 h-10 rounded-xl font-bold text-white text-xs
              flex items-center justify-center gap-1.5 transition-all
              ${isPlaying
                ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                : 'bg-gradient-to-r from-indigo-500 to-purple-600'
              }
              disabled:opacity-30 disabled:cursor-not-allowed
            `}
          >
            {isPlaying ? (
              <><Pause className="w-3.5 h-3.5 fill-current" /> PAUSE</>
            ) : (
              <><Play className="w-3.5 h-3.5 fill-current" /> PLAY</>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStop}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center"
          >
            <Square className="w-3.5 h-3.5 text-white fill-current" />
          </motion.button>
        </div>

        {/* Status Indicator */}
        <div className="mt-3 flex items-center justify-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-white/40'}`} />
          <span className="text-[9px] text-white/70 font-medium uppercase tracking-wider">
            {isPlaying ? t.performing.toUpperCase() : t.standby.toUpperCase()}
          </span>
        </div>
      </motion.div>
    </div>
  )
}
