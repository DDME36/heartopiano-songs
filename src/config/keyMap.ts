import { KeyMapping } from '../types'

/**
 * HEARTORIA KEYBOARD MAPPING (Verified from Screenshot)
 * --------------------------------------------------
 * Top Row    (C4-C5) : Q W E R T Y U I
 * Middle Row (C3-B3) : Z X C V B N M
 * Bottom Row (C2-C3) : . / O P [ ] (Wait, verify from image)
 */
export const keyMap: KeyMapping[] = [
  // --- ROW 1: TOP (Octave 4) ---
  { note: 'C4', key: 'Q', type: 'white', octave: 'high' },
  { note: 'D4', key: 'W', type: 'white', octave: 'high' },
  { note: 'E4', key: 'E', type: 'white', octave: 'high' },
  { note: 'F4', key: 'R', type: 'white', octave: 'high' },
  { note: 'G4', key: 'T', type: 'white', octave: 'high' },
  { note: 'A4', key: 'Y', type: 'white', octave: 'high' },
  { note: 'B4', key: 'U', type: 'white', octave: 'high' },
  { note: 'C5', key: 'I', type: 'white', octave: 'high' },

  { note: 'C#4', key: '2', type: 'black', octave: 'high' },
  { note: 'D#4', key: '3', type: 'black', octave: 'high' },
  { note: 'F#4', key: '5', type: 'black', octave: 'high' },
  { note: 'G#4', key: '6', type: 'black', octave: 'high' },
  { note: 'A#4', key: '7', type: 'black', octave: 'high' },

  // --- ROW 2: MIDDLE (Octave 3) ---
  { note: 'C3', key: 'Z', type: 'white', octave: 'middle' },
  { note: 'D3', key: 'X', type: 'white', octave: 'middle' },
  { note: 'E3', key: 'C', type: 'white', octave: 'middle' },
  { note: 'F3', key: 'V', type: 'white', octave: 'middle' },
  { note: 'G3', key: 'B', type: 'white', octave: 'middle' },
  { note: 'A3', key: 'N', type: 'white', octave: 'middle' },
  { note: 'B3', key: 'M', type: 'white', octave: 'middle' },

  { note: 'C#3', key: 'S', type: 'black', octave: 'middle' },
  { note: 'D#3', key: 'D', type: 'black', octave: 'middle' },
  { note: 'F#3', key: 'G', type: 'black', octave: 'middle' },
  { note: 'G#3', key: 'H', type: 'black', octave: 'middle' },
  { note: 'A#3', key: 'J', type: 'black', octave: 'middle' },

  // --- ROW 3: BOTTOM (Octave 2) - CORRECTED FROM SCREENSHOT ---
  { note: 'C2', key: ',', type: 'white', octave: 'low' },     // Hidden, but left of .
  { note: 'D2', key: '.', type: 'white', octave: 'low' },
  { note: 'E2', key: '/', type: 'white', octave: 'low' },
  { note: 'F2', key: 'O', type: 'white', octave: 'low' },
  { note: 'G2', key: 'P', type: 'white', octave: 'low' },
  { note: 'A2', key: '[', type: 'white', octave: 'low' },
  { note: 'B2', key: ']', type: 'white', octave: 'low' },

  { note: 'C#2', key: 'L', type: 'black', octave: 'low' },
  { note: 'D#2', key: ';', type: 'black', octave: 'low' },
  { note: 'F#2', key: '0', type: 'black', octave: 'low' },
  { note: 'G#2', key: '-', type: 'black', octave: 'low' },
  { note: 'A#2', key: '=', type: 'black', octave: 'low' },
]

const normalizeNote = (note: string): string => {
  if (note.includes('b')) {
    const flatNote = note.substring(0, 2);
    const octave = note.substring(2);
    const flatMap: Record<string, string> = {
      'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#'
    };
    if (flatMap[flatNote]) return flatMap[flatNote] + octave;
  }
  return note;
}

export const getKeyForNote = (noteOrKey: string): string | undefined => {
  if (!noteOrKey) return undefined
  const target = normalizeNote(noteOrKey);
  const mappingByNote = keyMap.find(k => k.note === target);
  if (mappingByNote) return mappingByNote.key;

  const upperInput = noteOrKey.toUpperCase();
  const rawKeyMapping = keyMap.find(k => k.key.toUpperCase() === upperInput);
  if (rawKeyMapping && (noteOrKey.length === 1 || [';', '/', '.', '[', ']', ',', '-', '='].includes(noteOrKey))) {
    return rawKeyMapping.key;
  }
  return undefined;
}

export const getNoteForKey = (key: string): string | undefined => {
  const upperKey = key.toUpperCase();
  return keyMap.find(k => k.key.toUpperCase() === upperKey)?.note;
}