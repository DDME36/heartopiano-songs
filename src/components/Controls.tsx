import { motion } from 'framer-motion'
import { Play, Pause, Square, Zap, Music2 } from 'lucide-react'
import { Song } from '../types'

interface ControlsProps {
  isPlaying: boolean
  speed: number
  onPlayPause: () => void
  onStop: () => void
  onSpeedChange: (speed: number) => void
  onSeek: (index: number) => void
  progress: number
  currentNoteIndex: number
  totalNotes: number
  currentBeat: number
  totalBeats: number
  bpm: number
  selectedSong: Song | null
  gameWindowFound: boolean
  t: any
}

export const Controls = ({
  isPlaying,
  speed,
  onPlayPause,
  onStop,
  onSpeedChange,
  onSeek,
  progress,
  currentNoteIndex,
  totalNotes,
  currentBeat,
  totalBeats,
  bpm,
  selectedSong,
  gameWindowFound,
  t
}: ControlsProps) => {
  return (
    <div className="glass-card p-3 shadow-indigo-200/10 flex-shrink-0">
      {/* Selected Song Display - Compact - Fixed Height Container */}
      <div className="mb-2 text-center px-2 h-[28px] flex flex-col justify-center">
        {selectedSong ? (
          <motion.div
            key={selectedSong.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="text-slate-800 font-black text-xs tracking-tight leading-none mb-0.5 flex items-center justify-center gap-1">
              <Music2 className="w-3 h-3 text-pink-400" />
              {selectedSong.title}
            </div>
            <div className="text-slate-500 text-[10px] font-medium opacity-70 flex items-center justify-center gap-1.5">
              <span>{selectedSong.artist}</span>
              {bpm > 0 && (
                <>
                  <span>•</span>
                  <span className="bg-slate-200 px-1 py-0.5 rounded text-slate-600 font-bold text-[9px]">
                    {bpm} BPM
                  </span>
                </>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-slate-400 text-[10px] font-medium opacity-60 flex items-center justify-center gap-1"
          >
            <Music2 className="w-3 h-3" />
            <span>{t.selectSong}</span>
          </motion.div>
        )}
      </div>

      {/* Progress Section */}
      <div className="mb-2 px-1">
        <div className="flex justify-between items-center mb-1 px-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {t.beat} {currentBeat.toFixed(1)} / {totalBeats.toFixed(1)}
          </span>
          <span className="text-pink-500 text-[10px] font-black">{Math.round(progress)}%</span>
        </div>
        <div className="relative h-2 bg-white/20 rounded-full overflow-hidden p-[1px] border border-white/10 group/progress">
          <motion.div
            className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-pink-400 to-indigo-500 shadow-[0_0_8px_rgba(255,105,180,0.3)] z-0"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
          <input
            type="range"
            min="0"
            max={totalNotes > 0 ? totalNotes : 0}
            value={currentNoteIndex}
            onChange={(e) => onSeek(parseInt(e.target.value))}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
            disabled={!selectedSong}
          />
        </div>
      </div>

      {/* Control Buttons Cluster */}
      <div className="flex gap-2 mb-2">
        <motion.button
          className={`
            flex-[3] py-2 rounded-xl font-black text-white text-[10px] tracking-wider uppercase
            shadow-md transition-all flex items-center justify-center gap-1.5
            ${isPlaying
              ? 'bg-gradient-to-br from-amber-400 to-orange-500'
              : 'bg-gradient-to-br from-indigo-500 to-purple-600'
            }
            disabled:grayscale disabled:opacity-30 disabled:cursor-not-allowed
          `}
          whileHover={{ scale: (selectedSong && gameWindowFound) ? 1.02 : 1 }}
          whileTap={{ scale: 0.98 }}
          onClick={onPlayPause}
          disabled={!selectedSong || !gameWindowFound}
        >
          {isPlaying ? (
            <><Pause className="w-3.5 h-3.5 fill-current" /> {t.pause}</>
          ) : (
            <><Play className="w-3.5 h-3.5 fill-current" /> {t.begin}</>
          )}
        </motion.button>

        <motion.button
          className="flex-1 py-2 rounded-xl font-black text-white text-[10px] tracking-wider bg-gradient-to-br from-rose-500 to-pink-600 shadow-md flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStop}
        >
          <Square className="w-3.5 h-3.5 fill-current" />
        </motion.button>
      </div>

      {/* Compact Speed Control */}
      <div className="bg-white/10 p-1.5 rounded-xl border border-white/10 mb-2">
        <div className="flex justify-between items-center mb-1 px-1">
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-500 fill-current" />
            <span className="text-slate-700 text-[10px] font-black uppercase tracking-wider">{t.tempo}</span>
          </div>
          <span className="px-1.5 py-0.5 bg-white/40 rounded text-pink-600 font-bold text-[10px]">{speed.toFixed(1)}x</span>
        </div>
        <input
          type="range"
          min="0.5"
          max="2.0"
          step="0.1"
          value={speed}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
          className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer slider"
        />
      </div>

      {/* Helpful Hint */}
      <div className="text-center pt-1">
        <div className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.12em] opacity-70">
          {t.hint} / {t.hintStop}
        </div>
      </div>
    </div>
  )
}
