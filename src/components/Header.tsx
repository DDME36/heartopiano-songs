import { motion } from 'framer-motion'
import { Languages, Minimize2 } from 'lucide-react'

interface HeaderProps {
  onClose: () => void
  onMinimize: () => void
  onMiniMode: () => void
  lang: string
  onToggleLang: () => void
  t: any
}

export const Header = ({ onClose, onMinimize, onMiniMode, lang, onToggleLang, t }: HeaderProps) => {
  return (
    <div
      className="glass rounded-2xl p-3 flex items-center justify-between"
    >
      <div className="flex items-center gap-2 flex-1 draggable-region select-none">
        <div className="text-2xl drop-shadow-md">🎹</div>
        <div className="flex-1 text-center">
          <h1 className="text-gray-800 font-extrabold text-xs tracking-tighter leading-none flex items-center justify-center gap-1">
            {t.appName}
            <span className="text-pink-500 font-black text-[9px] uppercase tracking-widest">{t.appSub}</span>
          </h1>
          <p className="text-gray-500 text-[9px] font-medium opacity-70 mt-0.5">
            {lang === 'th' ? '(ลากเพื่อเลื่อน)' : '(Drag here to move)'}
          </p>
        </div>
      </div>

      <div className="flex gap-2 no-drag items-center">
        <motion.button
          className="px-2 py-1.5 rounded-lg bg-white/40 hover:bg-white/60 flex items-center gap-1.5 transition-all shadow-sm border border-white/20"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleLang}
        >
          <Languages className="w-3 h-3 text-indigo-500" />
          <span className="text-[10px] font-black uppercase text-indigo-600">
            {lang === 'en' ? 'TH' : 'EN'}
          </span>
        </motion.button>

        <div className="w-[1px] h-4 bg-gray-300/30 mx-0.5" />

        <motion.button
          className="w-7 h-7 rounded-lg bg-indigo-400/80 hover:bg-indigo-500 flex items-center justify-center shadow-md"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onMiniMode}
          title="Mini Mode"
        >
          <Minimize2 className="w-3.5 h-3.5 text-white" />
        </motion.button>

        <motion.button
          className="w-7 h-7 rounded-lg bg-yellow-400/80 hover:bg-yellow-500 flex items-center justify-center text-white font-bold text-sm shadow-md"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onMinimize}
        >
          −
        </motion.button>

        <motion.button
          className="w-7 h-7 rounded-lg bg-rose-400/80 hover:bg-rose-500 flex items-center justify-center text-white font-bold text-sm shadow-md"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
        >
          ✕
        </motion.button>
      </div>
    </div>
  )
}
