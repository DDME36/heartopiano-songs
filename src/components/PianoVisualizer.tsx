import { motion } from 'framer-motion'
import { keyMap } from '../config/keyMap'

interface PianoVisualizerProps {
  activeKeys: Set<string>
}

export const PianoVisualizer = ({ activeKeys }: PianoVisualizerProps) => {
  const lowOctave = keyMap.filter(k => k.octave === 'low')
  const highOctave = keyMap.filter(k => k.octave === 'high')

  const renderKey = (mapping: typeof keyMap[0]) => {
    const isActive = activeKeys.has(mapping.key)
    const isBlack = mapping.type === 'black'

    return (
      <motion.div
        key={mapping.key}
        className={`
          relative rounded-lg flex flex-col items-center justify-center
          ${isBlack ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}
          ${isActive ? 'ring-4 ring-yellow-400 shadow-lg shadow-yellow-400/50' : ''}
          transition-all duration-150
        `}
        style={{
          width: isBlack ? '40px' : '50px',
          height: isBlack ? '60px' : '80px',
        }}
        animate={{
          scale: isActive ? 0.95 : 1,
          y: isActive ? 2 : 0,
        }}
        transition={{ duration: 0.1 }}
      >
        <span className="text-xs font-bold">{mapping.note.replace(/[0-9]/g, '')}</span>
        <span className="text-[10px] opacity-60">{mapping.key}</span>
      </motion.div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* High Octave */}
      <div>
        <div className="text-xs text-white/70 mb-2 font-semibold">High Octave</div>
        <div className="flex gap-1 flex-wrap">
          {highOctave.map(renderKey)}
        </div>
      </div>

      {/* Low Octave */}
      <div>
        <div className="text-xs text-white/70 mb-2 font-semibold">Low Octave</div>
        <div className="flex gap-1 flex-wrap">
          {lowOctave.map(renderKey)}
        </div>
      </div>
    </div>
  )
}
