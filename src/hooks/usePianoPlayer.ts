import { useState, useRef, useCallback, useEffect } from 'react'
import { Song, Note } from '../types'
import { getKeyForNote } from '../config/keyMap'

// Check if running in Electron
const isElectron = () => {
  return typeof window !== 'undefined' &&
    window.process &&
    window.process.type === 'renderer'
}

export const usePianoPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0)
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set())
  const [speed, setSpeed] = useState(1.0)
  const [gameWindowFound, setGameWindowFound] = useState(false)
  const [gameWindowTitle, setGameWindowTitle] = useState('')
  const [currentBpm, setCurrentBpm] = useState(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const currentSongRef = useRef<Song | null>(null)

  // Check for game window on mount
  useEffect(() => {
    const checkGameWindow = async () => {
      if (!isElectron()) return

      try {
        const { ipcRenderer } = window.require('electron')
        const result = await ipcRenderer.invoke('check-game-window')
        setGameWindowFound(result.found)
        setGameWindowTitle(result.windowTitle)
      } catch (error) {
        console.error('Failed to check game window:', error)
      }
    }

    checkGameWindow()
    const interval = setInterval(checkGameWindow, 5000)
    return () => clearInterval(interval)
  }, [])

  const keyDown = async (keys: string[]) => {
    if (keys.length === 0) return
    keys.forEach(key => setActiveKeys(prev => new Set(prev).add(key)))
    if (isElectron()) {
      try {
        const { ipcRenderer } = window.require('electron')
        await ipcRenderer.invoke('key-down', keys)
      } catch (e) {
        console.error('[Piano] Key down failed:', e)
      }
    }
  }

  const keyUp = async (keys: string[]) => {
    if (keys.length === 0) return
    keys.forEach(key => setActiveKeys(prev => {
      const newSet = new Set(prev)
      newSet.delete(key)
      return newSet
    }))
    if (isElectron()) {
      try {
        const { ipcRenderer } = window.require('electron')
        await ipcRenderer.invoke('key-up', keys)
      } catch (e) {
        console.error('[Piano] Key up failed:', e)
      }
    }
  }

  const stop = useCallback(() => {
    setIsPlaying(false)
    setCurrentNoteIndex(0)
    setActiveKeys(new Set())
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    
    if (isElectron()) {
      try {
        const { ipcRenderer } = window.require('electron')
        ipcRenderer.invoke('disable-focus-lock')
      } catch (e) {
        console.error('Failed to disable focus lock:', e)
      }
    }
  }, [])


  const playChordInternal = useCallback((index: number) => {
    if (!currentSongRef.current || !startTimeRef.current) return

    const notes = currentSongRef.current.notes
    if (index >= notes.length) {
      stop()
      return
    }

    // Find all notes with the SAME time (chord)
    const currentTimeMs = notes[index].time
    const chordNotes: Note[] = []
    let nextIndex = index

    while (nextIndex < notes.length && notes[nextIndex].time === currentTimeMs) {
      chordNotes.push(notes[nextIndex])
      nextIndex++
    }

    // Process keys for current chord with validation
    const keysToPress = chordNotes
      .flatMap(n => {
        const parts = n.key.split(',').map(p => p.trim());
        return parts.map(p => {
          const key = getKeyForNote(p);
          if (!key) {
            console.warn(`[Piano] Invalid note: ${p} in chord at time ${currentTimeMs}ms`);
          }
          return key;
        }).filter((k): k is string => !!k);
      });

    // Press keys only if valid
    if (keysToPress.length > 0) {
      keyDown(keysToPress);
    }

    // Schedule releases (Sustain)
    chordNotes.forEach(note => {
      const noteKeys = note.key.split(',').map(p => p.trim())
        .map(p => getKeyForNote(p)).filter((k): k is string => !!k);

      const beatDur = 60000 / (currentSongRef.current?.bpm || 120);
      
      // Improved duration calculation with speed applied upfront
      let durationMs: number;
      if (note.duration !== undefined) {
        // Use explicit duration from note
        durationMs = (note.duration * beatDur) / speed;
      } else {
        // Calculate gap to next note for auto-legato
        const nextNoteIndex = notes.findIndex((n, i) => i > index && n.time > currentTimeMs);
        if (nextNoteIndex !== -1) {
          const gap = (notes[nextNoteIndex].time - currentTimeMs) / speed;
          durationMs = Math.min(gap * 0.9, (beatDur * 0.85) / speed); // 90% of gap or 85% of beat
        } else {
          durationMs = (beatDur * 0.5) / speed; // Default half beat for last notes
        }
      }

      if (noteKeys.length > 0) {
        setTimeout(() => keyUp(noteKeys), durationMs);
      }
    });

    setCurrentNoteIndex(nextIndex)

    if (nextIndex < notes.length) {
      const nextNote = notes[nextIndex]
      const actualElapsed = performance.now() - startTimeRef.current
      const targetTimeMs = nextNote.time / speed

      // Absolute timing: delay is targeting the exact absolute time from start
      const delay = Math.max(0, targetTimeMs - actualElapsed)

      timeoutRef.current = setTimeout(() => playChordInternal(nextIndex), delay)
    } else {
      stop()
    }
  }, [speed, stop])

  const seekTo = useCallback((index: number) => {
    if (!currentSongRef.current) return

    // Clamp index between 0 and total notes
    const targetIndex = Math.max(0, Math.min(index, currentSongRef.current.notes.length))

    // Stop any current playback
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    setCurrentNoteIndex(targetIndex)
    setActiveKeys(new Set())

    // If we were playing, continue from the new position
    if (isPlaying && targetIndex < currentSongRef.current.notes.length) {
      // Reset start time for accurate timing from new position
      const targetTimeMs = currentSongRef.current.notes[targetIndex].time
      startTimeRef.current = performance.now() - (targetTimeMs / speed)
      playChordInternal(targetIndex)
    }
  }, [isPlaying, playChordInternal, speed])

  const refreshSong = useCallback((song: Song) => {
    if (!song) return;
    
    // Validate and clamp BPM
    let bpm = song.bpm || 120;
    if (bpm <= 0 || bpm > 300) {
      console.warn(`[Piano] Invalid BPM: ${bpm}, using default 120`);
      bpm = 120;
    }
    
    const beatDuration = 60000 / bpm;

    const processedNotes = song.notes
      .filter(n => {
        if (n.key === undefined || n.time === undefined) {
          console.warn('[Piano] Skipping invalid note:', n);
          return false;
        }
        return true;
      })
      .map(note => {
        // Simplified: 1.0 in JSON = 1 beat in song
        const timeMs = Math.round(note.time * beatDuration);
        return { ...note, recordTime: note.time, time: timeMs };
      });

    const sortedNotes = [...processedNotes].sort((a, b) => a.time - b.time);
    currentSongRef.current = { ...song, notes: sortedNotes, bpm };
    setCurrentBpm(bpm);
    
    console.log(`[Piano] Loaded: ${song.title} | ${sortedNotes.length} notes | ${bpm} BPM`);
  }, []);

  const play = useCallback(async (song: Song) => {
    refreshSong(song);

    setCurrentNoteIndex(0)
    setIsPlaying(true)
    startTimeRef.current = performance.now()

    if (isElectron()) {
      try {
        const { ipcRenderer } = window.require('electron')
        await ipcRenderer.invoke('focus-game', gameWindowTitle || 'Heartopia')
        await ipcRenderer.invoke('enable-focus-lock')
      } catch (e) {
        console.error('Focus failed:', e)
      }
    }

    // Quick delay to allow focus
    setTimeout(() => {
      if (currentSongRef.current && currentSongRef.current.notes.length > 0) {
        // Reset start time again right before first note to be more accurate
        startTimeRef.current = performance.now();
        playChordInternal(0)
      }
    }, 300)
  }, [playChordInternal, gameWindowTitle])

  const pause = useCallback(() => {
    setIsPlaying(false)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    
    if (isElectron()) {
      try {
        const { ipcRenderer } = window.require('electron')
        ipcRenderer.invoke('disable-focus-lock')
      } catch (e) {
        console.error('Failed to disable focus lock:', e)
      }
    }
  }, [])

  const resume = useCallback(async () => {
    if (currentSongRef.current) {
      setIsPlaying(true)

      if (isElectron()) {
        try {
          const { ipcRenderer } = window.require('electron')
          await ipcRenderer.invoke('focus-game', gameWindowTitle || 'Heartopia')
          await ipcRenderer.invoke('enable-focus-lock')
        } catch (e) {
          console.error('Focus failed on resume:', e)
        }
      }

      // Anchoring start time for resume
      const currentNoteTimeMs = currentSongRef.current.notes[currentNoteIndex].time
      startTimeRef.current = performance.now() - (currentNoteTimeMs / speed)

      playChordInternal(currentNoteIndex)
    }
  }, [currentNoteIndex, playChordInternal, gameWindowTitle, speed])

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause()
    } else if (currentSongRef.current) {
      if (currentNoteIndex > 0) resume()
      else play(currentSongRef.current)
    }
  }, [isPlaying, currentNoteIndex, pause, resume, play])

  const currentBeat = currentSongRef.current?.notes[currentNoteIndex]?.recordTime || 0;
  const totalBeats = currentSongRef.current?.notes[currentSongRef.current.notes.length - 1]?.recordTime || 0;

  return {
    isPlaying,
    activeKeys,
    speed,
    setSpeed,
    play,
    refreshSong,
    pause,
    resume,
    stop,
    seekTo,
    togglePlay,
    currentNoteIndex,
    currentBeat,
    totalBeats,
    totalNotes: currentSongRef.current?.notes.length || 0,
    gameWindowFound,
    gameWindowTitle,
    bpm: currentBpm
  }
}
