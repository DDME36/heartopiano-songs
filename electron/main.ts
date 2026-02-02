import { app, BrowserWindow, ipcMain, globalShortcut, screen } from 'electron'
import { spawn, ChildProcess } from 'child_process'
import path from 'path'
import fs from 'fs'
import { exec } from 'child_process'

let mainWindow: BrowserWindow | null = null
let pythonProcess: ChildProcess | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 650,
    x: 100,
    y: 100,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    skipTaskbar: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  // Start by ignoring mouse events
  mainWindow.setIgnoreMouseEvents(true, { forward: true })

  setInterval(() => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.setAlwaysOnTop(true, 'screen-saver', 1)
    }
  }, 1000)

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL + '/app.html')
    // Only open DevTools in development
    if (process.env.NODE_ENV === 'development') {
      mainWindow.webContents.openDevTools({ mode: 'detach' })
    }
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/app.html'))
    // Disable DevTools in production
    mainWindow.webContents.on('before-input-event', (event, input) => {
      // Block F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
      if (
        input.key === 'F12' ||
        (input.control && input.shift && input.key === 'I') ||
        (input.control && input.shift && input.key === 'J') ||
        (input.control && input.shift && input.key === 'C')
      ) {
        event.preventDefault()
      }
    })
  }

  try {
    globalShortcut.register('F5', () => {
      mainWindow?.webContents.send('toggle-play')
    })

    globalShortcut.register('F8', () => {
      mainWindow?.webContents.send('emergency-stop')
    })
  } catch (error) {
    console.error('Failed to register shortcuts:', error)
  }
}

ipcMain.on('set-click-through', (_: any, ignore: boolean) => {
  if (mainWindow) {
    if (ignore) {
      mainWindow.setIgnoreMouseEvents(true, { forward: true })
    } else {
      mainWindow.setIgnoreMouseEvents(false)
    }
  }
})

ipcMain.on('set-mini-mode', (_: any, isMini: boolean) => {
  if (mainWindow) {
    const display = screen.getPrimaryDisplay()
    const { width: screenWidth, height: screenHeight } = display.workAreaSize
    
    if (isMini) {
      // Mini mode: smaller window, centered
      const windowWidth = 320
      const windowHeight = 240
      const x = Math.floor((screenWidth - windowWidth) / 2)
      const y = Math.floor((screenHeight - windowHeight) / 2)
      
      mainWindow.setBounds({ x, y, width: windowWidth, height: windowHeight }, true)
    } else {
      // Full mode: restore original size, centered
      const windowWidth = 400
      const windowHeight = 650
      const x = Math.floor((screenWidth - windowWidth) / 2)
      const y = Math.floor((screenHeight - windowHeight) / 2)
      
      mainWindow.setBounds({ x, y, width: windowWidth, height: windowHeight }, true)
    }
  }
})

ipcMain.on('set-window-opacity', (_: any, opacity: number) => {
  if (mainWindow) {
    mainWindow.setOpacity(opacity)
  }
})

function cleanExit() {
  if (pythonProcess) {
    try {
      pythonProcess.kill()
    } catch (e) { }
    pythonProcess = null
  }
  app.quit()
}

function startPythonParams() {
  // Use embedded Python if available, otherwise use system Python
  const embeddedPythonPath = path.join(process.resourcesPath, 'python-embed', 'python.exe')
  const pythonCommand = fs.existsSync(embeddedPythonPath) ? embeddedPythonPath : 'python'
  
  let scriptPath = path.join(process.resourcesPath, 'electron', 'sender.py')
  if (!fs.existsSync(scriptPath)) {
    scriptPath = path.join(__dirname, 'sender.py')
  }
  if (!fs.existsSync(scriptPath)) {
    scriptPath = path.join(__dirname, '../electron/sender.py')
  }

  console.log(`Starting Python: ${pythonCommand}`)
  console.log(`Script path: ${scriptPath}`)
  
  pythonProcess = spawn(pythonCommand, ['-u', scriptPath])

  pythonProcess.stderr?.on('data', (data: Buffer) => {
    console.log(`[Python Error]: ${data.toString()}`)
  })

  pythonProcess.on('close', (code: number) => {
    console.log(`Python process exited with code ${code}`)
    pythonProcess = null
  })

  pythonProcess.on('error', (err: any) => {
    console.error('Failed to start python process:', err)
  })
}

// Press key - USE PYTHON SENDER
ipcMain.handle('press-key', async (_: any, key: string) => {
  if (!pythonProcess) {
    startPythonParams()
  }

  if (pythonProcess && pythonProcess.stdin) {
    const command = JSON.stringify({ type: 'press', key: key })
    try {
      pythonProcess.stdin.write(command + '\n')
      return { success: true }
    } catch (e) {
      console.error('Write error:', e)
      return { success: false, error: 'Write failed' }
    }
  } else {
    return { success: false, error: 'Python process link failed' }
  }
})

ipcMain.handle('press-keys', async (_: any, keys: string[]) => {
  if (!pythonProcess) {
    startPythonParams()
  }

  if (pythonProcess && pythonProcess.stdin) {
    const command = JSON.stringify({ type: 'press-keys', keys: keys })
    try {
      pythonProcess.stdin.write(command + '\n')
      return { success: true }
    } catch (e) {
      console.error('Write error:', e)
      return { success: false, error: 'Write failed' }
    }
  } else {
    return { success: false, error: 'Python process link failed' }
  }
})

ipcMain.handle('key-down', async (_: any, keys: string[]) => {
  if (!pythonProcess) startPythonParams()
  if (pythonProcess && pythonProcess.stdin) {
    pythonProcess.stdin.write(JSON.stringify({ type: 'key-down', keys }) + '\n')
    return { success: true }
  }
  return { success: false }
})

ipcMain.handle('key-up', async (_: any, keys: string[]) => {
  if (!pythonProcess) startPythonParams()
  if (pythonProcess && pythonProcess.stdin) {
    pythonProcess.stdin.write(JSON.stringify({ type: 'key-up', keys }) + '\n')
    return { success: true }
  }
  return { success: false }
})

ipcMain.handle('focus-game', async (_: any, title: string) => {
  const targetTitle = title || 'Heartopia'
  if (!pythonProcess) {
    startPythonParams()
  }

  if (pythonProcess && pythonProcess.stdin) {
    const command = JSON.stringify({ type: 'focus', title: targetTitle })
    try {
      pythonProcess.stdin.write(command + '\n')
      return { success: true }
    } catch (e) {
      console.error('[IPC] Failed to write focus command:', e)
      return { success: false, error: 'Write failed' }
    }
  }
  return { success: false, error: 'Python link failed' }
})

ipcMain.handle('enable-focus-lock', async () => {
  if (!pythonProcess) startPythonParams()
  if (pythonProcess && pythonProcess.stdin) {
    pythonProcess.stdin.write(JSON.stringify({ type: 'enable-focus-lock' }) + '\n')
    return { success: true }
  }
  return { success: false }
})

ipcMain.handle('disable-focus-lock', async () => {
  if (!pythonProcess) startPythonParams()
  if (pythonProcess && pythonProcess.stdin) {
    pythonProcess.stdin.write(JSON.stringify({ type: 'disable-focus-lock' }) + '\n')
    return { success: true }
  }
  return { success: false }
})

ipcMain.handle('check-game-window', async () => {
  return new Promise((resolve) => {
    exec('powershell -Command "Get-Process -Name xdt -ErrorAction SilentlyContinue | Select-Object -ExpandProperty MainWindowTitle"',
      { timeout: 2000 },
      (_error: any, stdout: string) => {
        const title = stdout.trim()
        resolve({ found: title.length > 0, windowTitle: title })
      }
    )
  })
})

ipcMain.on('close-app', () => {
  cleanExit()
})

ipcMain.on('minimize-app', () => {
  if (mainWindow) {
    mainWindow.minimize()
  }
})

app.whenReady().then(() => {
  createWindow()
  startPythonParams()
})

app.on('window-all-closed', () => {
  globalShortcut.unregisterAll()
  if (process.platform !== 'darwin') {
    cleanExit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

