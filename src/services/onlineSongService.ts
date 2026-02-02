import { Song } from '../types'

// GitHub repository configuration
const GITHUB_USER = 'DDME36'
const GITHUB_REPO = 'heartopiano-songs' // ใช้ repo เดียว
const GITHUB_BRANCH = 'main'
const SONGS_PATH = 'songs'

// Set to true to enable online songs from GitHub
export const ENABLE_ONLINE_SONGS = true

// GitHub API endpoint
const GITHUB_API = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${SONGS_PATH}?ref=${GITHUB_BRANCH}`
const GITHUB_RAW = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${SONGS_PATH}`

export interface OnlineSong {
  name: string
  url: string
  downloadUrl: string
  sha: string
}

/**
 * Fetch list of available songs from GitHub
 */
export const fetchOnlineSongList = async (): Promise<OnlineSong[]> => {
  if (!ENABLE_ONLINE_SONGS) {
    return []
  }

  try {
    const response = await fetch(GITHUB_API, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    })

    if (!response.ok) {
      console.warn(`GitHub API returned ${response.status}, online songs disabled`)
      return []
    }

    const files = await response.json()
    
    return files
      .filter((file: any) => file.name.endsWith('.json') && file.type === 'file')
      .map((file: any) => ({
        name: file.name,
        url: file.html_url,
        downloadUrl: file.download_url,
        sha: file.sha
      }))
  } catch (error) {
    console.warn('Online songs unavailable:', error)
    return []
  }
}

/**
 * Download and parse a song from GitHub
 */
export const downloadSong = async (downloadUrl: string): Promise<Song | null> => {
  try {
    const response = await fetch(downloadUrl)
    
    if (!response.ok) {
      throw new Error(`Failed to download song: ${response.status}`)
    }

    const text = await response.text()
    
    // Strip comments (same as electron main.ts)
    const cleanJson = text.split('\n')
      .map(line => {
        const trimmed = line.trim()
        return (trimmed.startsWith('#') || trimmed.startsWith('//')) ? '' : line
      })
      .join('\n')

    const song = JSON.parse(cleanJson)
    return song
  } catch (error) {
    console.error('Failed to download song:', error)
    return null
  }
}

/**
 * Get direct download URL for a song
 */
export const getSongDownloadUrl = (filename: string): string => {
  return `${GITHUB_RAW}/${filename}`
}

/**
 * Check if online songs are available
 */
export const checkOnlineAvailability = async (): Promise<boolean> => {
  try {
    const response = await fetch(GITHUB_API, { 
      method: 'HEAD',
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    })
    return response.ok
  } catch {
    return false
  }
}
