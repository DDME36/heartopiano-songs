export interface Note {
  key: string
  time: number
  recordTime: number
  duration?: number
  lyric?: string
  comment?: string
}

export interface Song {
  id: string
  title: string
  artist: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  bpm?: number
  notes: Note[]
}

export interface KeyMapping {
  note: string
  key: string
  type: 'white' | 'black'
  octave: 'low' | 'middle' | 'high'
}
