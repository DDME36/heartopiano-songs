import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 to-pink-100">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 max-w-md shadow-2xl border border-white/50">
            <div className="text-center">
              <div className="text-6xl mb-4">😢</div>
              <h1 className="text-2xl font-black text-slate-800 mb-2">
                เกิดข้อผิดพลาด
              </h1>
              <p className="text-slate-600 mb-4 text-sm">
                แอพพลิเคชันเกิดข้อผิดพลาดที่ไม่คาดคิด
              </p>
              <div className="bg-slate-100 rounded-xl p-3 mb-4 text-left">
                <p className="text-xs text-slate-500 font-mono break-all">
                  {this.state.error?.message}
                </p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 
                         text-white font-bold rounded-xl hover:shadow-lg 
                         transition-all duration-300 hover:scale-105"
              >
                รีโหลดแอพ
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
