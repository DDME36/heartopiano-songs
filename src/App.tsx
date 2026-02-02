import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Header } from './components/Header'
import { SongList } from './components/SongList'
import { Controls } from './components/Controls'
import { MiniMode } from './components/MiniMode'
import { Toast } from './components/Toast'
import { SearchBar } from './components/SearchBar'
import { usePianoPlayer } from './hooks/usePianoPlayer'
import { useToast } from './hooks/useToast'
import { fetchSongs } from './services/songService'
import { useI18n } from './hooks/useI18n'
import { Song } from './types'
import { Activity, CheckCircle2, Search, Zap } from 'lucide-react'

// Check if running in Electron
const isElectron = () => {
  return typeof window !== 'undefined' &&
    window.process &&
    window.process.type === 'renderer'
}

function App() {
  const [songs, setSongs] = useState<Song[]>([])
  const [selectedSong, setSelectedSong] = useState<Song | null>(null)
  const [isMiniMode, setIsMiniMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const { toasts, removeToast, info } = useToast()

  const {
    isPlaying,
    speed,
    setSpeed,
    play,
    refreshSong,
    stop,
    seekTo,
    togglePlay,
    currentNoteIndex,
    currentBeat,
    totalBeats,
    totalNotes,
    gameWindowFound,
    bpm
  } = usePianoPlayer()

  const { lang, toggleLang, t } = useI18n()

  // Handle mini mode toggle
  const toggleMiniMode = useCallback((mini: boolean) => {
    setIsMiniMode(mini)
    if (isElectron()) {
      try {
        const { ipcRenderer } = window.require('electron')
        ipcRenderer.send('set-mini-mode', mini)
      } catch (error) {
        console.error('Failed to set mini mode:', error)
      }
    }
  }, [])

  const handlePlayPause = useCallback(() => {
    if (!selectedSong) {
      info(lang === 'en' ? 'Please select a song first' : 'กรุณาเลือกเพลงก่อน')
      return
    }

    if (!gameWindowFound) {
      info(lang === 'en' ? 'Game window not found! Please open Heartopia first.' : 'ไม่พบหน้าต่างเกม! กรุณาเปิด Heartopia ก่อน')
      return
    }

    if (!isPlaying && currentNoteIndex === 0) {
      play(selectedSong)
    } else {
      togglePlay()
    }
  }, [selectedSong, isPlaying, currentNoteIndex, play, togglePlay, info, lang, gameWindowFound])

  useEffect(() => {
    const loadSongs = async () => {
      setIsLoading(true)
      
      // Check if first time user
      const isFirstTime = localStorage.getItem('heartopiano_first_visit') === null
      
      try {
        const loadedSongs = await fetchSongs()
        console.log('[App] Loaded songs:', loadedSongs.length)
        setSongs(loadedSongs)
        
        if (loadedSongs.length > 0) {
          console.log(`[App] Successfully loaded ${loadedSongs.length} songs from GitHub`)
          
          // Show first-time welcome message
          if (isFirstTime) {
            localStorage.setItem('heartopiano_first_visit', 'true')
            setTimeout(() => {
              info(lang === 'en' 
                ? '🎵 Welcome! Songs are automatically updated. Enjoy!' 
                : '🎵 ยินดีต้อนรับ! เพลงอัพเดทอัตโนมัติ ขอให้สนุก!')
            }, 1000)
          }
        } else {
          console.warn('[App] No songs loaded')
          info(lang === 'en' 
            ? 'No songs available. Please check your internet connection.' 
            : 'ไม่มีเพลง กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต')
        }
      } catch (err) {
        console.error('[App] Failed to load songs:', err)
        info(lang === 'en' 
          ? 'Failed to load songs. Please check your internet connection.' 
          : 'โหลดเพลงไม่สำเร็จ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต')
      } finally {
        setIsLoading(false)
      }
    }
    loadSongs()
  }, [info, lang])

  useEffect(() => {
    if (window.require) {
      try {
        const { ipcRenderer } = window.require('electron')

        const onToggle = () => handlePlayPause()
        const onStop = () => stop()

        ipcRenderer.on('toggle-play', onToggle)
        ipcRenderer.on('emergency-stop', onStop)

        return () => {
          ipcRenderer.removeListener('toggle-play', onToggle)
          ipcRenderer.removeListener('emergency-stop', onStop)
        }
      } catch (e) {
        console.error('IPC Setup failed:', e)
      }
    }
  }, [handlePlayPause, stop])

  useEffect(() => {
    if (isElectron()) {
      // In mini mode, always disable click-through to allow dragging
      if (isMiniMode) {
        try {
          const { ipcRenderer } = window.require('electron')
          ipcRenderer.send('set-click-through', false)
        } catch (error) { }
        return
      }

      // In full mode, use dynamic click-through based on mouse position
      const handleMouseMove = (e: MouseEvent) => {
        const el = document.elementFromPoint(e.clientX, e.clientY)
        const isInteractive = !!el?.closest('.glass, .glass-card, button, input, .draggable-region, .slider')

        try {
          const { ipcRenderer } = window.require('electron')
          ipcRenderer.send('set-click-through', !isInteractive)
        } catch (error) { }
      }

      window.addEventListener('mousemove', handleMouseMove)
      return () => window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isMiniMode])

  const handleClose = () => {
    if (isElectron()) {
      try {
        const { ipcRenderer } = window.require('electron')
        ipcRenderer.send('close-app')
      } catch (error) { window.close() }
    } else { window.close() }
  }

  const handleMinimize = () => {
    if (isElectron()) {
      try {
        const { ipcRenderer } = window.require('electron')
        ipcRenderer.send('minimize-app')
      } catch (error) { console.error('Failed to minimize:', error) }
    }
  }

  const progress = totalNotes > 0 ? (currentNoteIndex / totalNotes) * 100 : 0

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Space for play/pause (when not typing)
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault()
        handlePlayPause()
      }
      
      // Escape to stop
      if (e.key === 'Escape' && isPlaying) {
        e.preventDefault()
        stop()
      }
      
      // Arrow keys for speed control
      if (e.key === 'ArrowUp' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setSpeed(prev => Math.min(2.0, prev + 0.1))
      }
      if (e.key === 'ArrowDown' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setSpeed(prev => Math.max(0.5, prev - 0.1))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlePlayPause, isPlaying, stop, setSpeed])

  // Filter songs based on search
  const filteredSongs = songs.filter(song => {
    const query = searchQuery.toLowerCase()
    return (
      song.title.toLowerCase().includes(query) ||
      song.artist.toLowerCase().includes(query) ||
      song.difficulty.toLowerCase().includes(query)
    )
  })

  // Mini Mode View
  if (isMiniMode) {
    const handleNextSong = () => {
      if (!selectedSong || songs.length === 0) return
      const currentIndex = songs.findIndex(s => s.id === selectedSong.id)
      const nextIndex = (currentIndex + 1) % songs.length
      const nextSong = songs[nextIndex]
      setSelectedSong(nextSong)
      if (isPlaying) {
        stop()
      }
    }

    const handlePrevSong = () => {
      if (!selectedSong || songs.length === 0) return
      const currentIndex = songs.findIndex(s => s.id === selectedSong.id)
      const prevIndex = (currentIndex - 1 + songs.length) % songs.length
      const prevSong = songs[prevIndex]
      setSelectedSong(prevSong)
      if (isPlaying) {
        stop()
      }
    }

    return (
      <MiniMode
        isPlaying={isPlaying}
        selectedSong={selectedSong}
        progress={progress}
        currentBeat={currentBeat}
        totalBeats={totalBeats}
        bpm={bpm}
        speed={speed}
        onPlayPause={handlePlayPause}
        onStop={stop}
        onExpandMode={() => toggleMiniMode(false)}
        onClose={handleClose}
        onNextSong={handleNextSong}
        onPrevSong={handlePrevSong}
        onSeek={seekTo}
        currentNoteIndex={currentNoteIndex}
        totalNotes={totalNotes}
        t={t}
      />
    )
  }

  // Full Mode View
  return (
    <div className="w-screen h-screen vibrant-bg p-3 flex flex-col gap-3 rounded-[32px] overflow-hidden border border-white/40 shadow-2xl">
      <Header
        onClose={handleClose}
        onMinimize={handleMinimize}
        onMiniMode={() => toggleMiniMode(true)}
        lang={lang}
        onToggleLang={toggleLang}
        t={t}
      />

      <div className="flex-1 flex flex-col gap-3 overflow-hidden min-h-0">
        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={lang === 'en' ? 'Search songs...' : 'ค้นหาเพลง...'}
        />

        {/* Loading State */}
        {isLoading ? (
          <div className="glass-card flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-pink-400 border-t-transparent 
                            rounded-full animate-spin mx-auto mb-3" />
              <p className="text-slate-600 text-sm font-medium">
                {lang === 'en' ? 'Loading songs...' : 'กำลังโหลดเพลง...'}
              </p>
            </div>
          </div>
        ) : filteredSongs.length === 0 ? (
          <div className="glass-card flex-1 flex items-center justify-center">
            <div className="text-center px-4">
              <div className="text-4xl mb-3">🎵</div>
              <p className="text-slate-600 text-sm font-bold mb-1">
                {searchQuery 
                  ? (lang === 'en' ? 'No songs found' : 'ไม่พบเพลง')
                  : (lang === 'en' ? 'No songs available' : 'ไม่มีเพลง')
                }
              </p>
              {!searchQuery && (
                <p className="text-slate-400 text-xs">
                  {lang === 'en' 
                    ? 'Add .json files to the songs folder' 
                    : 'เพิ่มไฟล์ .json ในโฟลเดอร์ songs'}
                </p>
              )}
            </div>
          </div>
        ) : (
          <SongList
            songs={filteredSongs}
            selectedSong={selectedSong}
            onSelectSong={(song) => {
              setSelectedSong(song);
              refreshSong(song);
            }}
            t={t}
          />
        )}

        <Controls
          isPlaying={isPlaying}
          speed={speed}
          onPlayPause={handlePlayPause}
          onStop={stop}
          onSpeedChange={setSpeed}
          onSeek={seekTo}
          progress={progress}
          currentNoteIndex={currentNoteIndex}
          totalNotes={totalNotes}
          currentBeat={currentBeat}
          totalBeats={totalBeats}
          bpm={bpm}
          selectedSong={selectedSong}
          gameWindowFound={gameWindowFound}
          t={t}
        />
      </div>

      <div className="glass rounded-2xl p-2.5 text-center transition-all duration-500 ease-out shadow-sm overflow-hidden">
        <motion.div 
          key={gameWindowFound ? (isPlaying ? 'playing' : (selectedSong ? 'ready' : 'synced')) : 'finding'}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-center gap-2"
        >
          {gameWindowFound ? (
            isPlaying ? (
              <>
                <Activity className="w-3.5 h-3.5 text-green-500 animate-pulse" />
                <span className="text-slate-800 text-[10px] font-bold tracking-wider uppercase">
                  {t.performing}
                </span>
                <span className="text-pink-500 text-[10px] font-black ml-1">{Math.round(progress)}%</span>
              </>
            ) : selectedSong ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-slate-700 text-[10px] font-bold uppercase tracking-wider">
                  {t.ready}
                </span>
              </>
            ) : (
              <>
                <Zap className="w-3 h-3 text-indigo-500 fill-current" />
                <span className="text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                  {t.synced}
                </span>
              </>
            )
          ) : (
            <>
              <Search className="w-3.5 h-3.5 text-rose-500 animate-bounce" />
              <span className="text-rose-600 text-[10px] font-black uppercase tracking-widest">{t.findingGame}</span>
            </>
          )}
        </motion.div>
      </div>

      {/* Toast Notifications */}
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  )
}

export default App
