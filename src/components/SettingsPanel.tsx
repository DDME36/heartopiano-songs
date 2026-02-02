import { motion } from 'framer-motion'
import { X, Settings as SettingsIcon } from 'lucide-react'

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
  opacity: number
  onOpacityChange: (value: number) => void
  defaultSpeed: number
  onDefaultSpeedChange: (value: number) => void
  t: any
}

export const SettingsPanel = ({
  isOpen,
  onClose,
  opacity,
  onOpacityChange,
  defaultSpeed,
  onDefaultSpeedChange,
  t
}: SettingsPanelProps) => {
  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="mini-glass rounded-3xl p-6 w-[350px] shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 
                          flex items-center justify-center">
              <SettingsIcon className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-slate-800 font-bold text-lg">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-white/40 flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        {/* Settings */}
        <div className="space-y-6">
          {/* Window Opacity */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-slate-700 text-sm font-bold">Window Opacity</label>
              <span className="text-pink-500 text-sm font-bold">{Math.round(opacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1"
              step="0.05"
              value={opacity}
              onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-white/30 rounded-full appearance-none cursor-pointer slider"
            />
          </div>

          {/* Default Speed */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-slate-700 text-sm font-bold">Default Speed</label>
              <span className="text-pink-500 text-sm font-bold">{defaultSpeed.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={defaultSpeed}
              onChange={(e) => onDefaultSpeedChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-white/30 rounded-full appearance-none cursor-pointer slider"
            />
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 pt-4 border-t border-white/30">
          <p className="text-slate-500 text-xs text-center">
            Press <kbd className="px-1.5 py-0.5 bg-white/40 rounded text-[10px] font-bold">Ctrl+,</kbd> to open settings
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}
