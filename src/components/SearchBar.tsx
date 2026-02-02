import { motion } from 'framer-motion'
import { Search, X } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export const SearchBar = ({ value, onChange, placeholder = 'Search songs...' }: SearchBarProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none z-10" 
              style={{ top: '50%', transform: 'translateY(-50%)' }} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full pl-10 pr-10 py-2.5 rounded-xl
          bg-white/40 border border-white/50
          text-slate-800 text-sm font-medium
          placeholder:text-slate-400
          outline-none focus:outline-none focus:ring-0
          focus:bg-white/50 focus:border-white/60
          transition-all
        "
        style={{ lineHeight: '1.5' }}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 z-10
                     w-5 h-5 rounded-full bg-slate-300/50 hover:bg-slate-400/50
                     transition-all flex items-center justify-center"
          style={{ top: '50%', marginTop: '-10px' }}
        >
          <X className="w-3 h-3 text-slate-600" />
        </button>
      )}
    </div>
  )
}
