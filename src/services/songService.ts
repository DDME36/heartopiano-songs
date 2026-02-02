import { Song } from '../types'
import { fetchOnlineSongList, downloadSong, ENABLE_ONLINE_SONGS } from './onlineSongService'

/**
 * Fetch songs from local files (via Electron IPC) - DISABLED in production
 */
export const fetchLocalSongs = async (): Promise<Song[]> => {
  // Disabled - use online songs only
  return [];
}

/**
 * Fetch songs from GitHub repository
 */
export const fetchOnlineSongs = async (): Promise<Song[]> => {
  if (!ENABLE_ONLINE_SONGS) {
    console.warn('[Songs] Online songs disabled')
    return []
  }

  try {
    console.log('[Songs] Fetching from GitHub...')
    const songList = await fetchOnlineSongList()
    
    if (songList.length === 0) {
      console.warn('[Songs] No songs found on GitHub')
      return []
    }
    
    console.log(`[Songs] Found ${songList.length} songs, downloading...`)
    
    // Download all songs in parallel
    const downloadPromises = songList.map(song => downloadSong(song.downloadUrl))
    const songs = await Promise.all(downloadPromises)
    
    // Filter out failed downloads
    const validSongs = songs.filter((song): song is Song => song !== null)
    console.log(`[Songs] Successfully loaded ${validSongs.length} songs`)
    
    return validSongs
  } catch (error) {
    console.error('[Songs] Failed to fetch online songs:', error)
    return []
  }
}

/**
 * Fetch songs from online source only
 */
export const fetchSongs = async (): Promise<Song[]> => {
  try {
    const songs = await fetchOnlineSongs()
    
    if (songs.length === 0) {
      throw new Error('No songs available. Please check your internet connection.')
    }
    
    return songs
  } catch (error) {
    console.error('[Songs] Error fetching songs:', error)
    throw error
  }
}
