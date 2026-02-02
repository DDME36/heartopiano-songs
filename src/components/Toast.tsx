import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { useEffect } from 'react'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastMessage {
  id: string
  type: ToastType
  message: string
  duration?: number
}

interface ToastProps {
  toasts: ToastMessage[]
  onRemove: (id: string) => void
}

export const Toast = ({ toasts, onRemove }: ToastProps) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  )
}

const ToastItem = ({ toast, onRemove }: { toast: ToastMessage; onRemove: (id: string) => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id)
    }, toast.duration || 3000)

    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onRemove])

  const icons = {
    success: <CheckCircle2 className="w-4 h-4" />,
    error: <AlertCircle className="w-4 h-4" />,
    info: <Info className="w-4 h-4" />
  }

  const colors = {
    success: 'from-green-400 to-emerald-500',
    error: 'from-rose-400 to-pink-500',
    info: 'from-blue-400 to-indigo-500'
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      className="pointer-events-auto"
    >
      <div className={`
        mini-glass rounded-2xl p-3 pr-10 min-w-[250px] max-w-[350px]
        flex items-center gap-3 shadow-xl relative
      `}>
        <div className={`
          w-8 h-8 rounded-xl bg-gradient-to-br ${colors[toast.type]}
          flex items-center justify-center text-white flex-shrink-0
        `}>
          {icons[toast.type]}
        </div>
        
        <p className="text-slate-800 text-sm font-medium flex-1">
          {toast.message}
        </p>

        <button
          onClick={() => onRemove(toast.id)}
          className="absolute top-2 right-2 w-6 h-6 rounded-lg hover:bg-white/40 
                     flex items-center justify-center transition-all"
        >
          <X className="w-3 h-3 text-slate-600" />
        </button>
      </div>
    </motion.div>
  )
}
