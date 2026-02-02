import sys
import json
import pydirectinput
import time
import threading

def log(msg):
    # Log to stderr to allow main process to capture debug info without messing up stdout protocol if we used it
    sys.stderr.write(f"[Sender] {msg}\n")
    sys.stderr.flush()

log("Started Python Input Sender")

# Disable fail-safe and remove internal pauses for instant chords
pydirectinput.FAILSAFE = False
pydirectinput.PAUSE = 0

import ctypes

# Global state for focus locking
focus_lock_enabled = False
target_hwnd = None
focus_thread = None

def find_window_hwnd(window_title):
    """Find window handle by title"""
    hwnd = ctypes.windll.user32.FindWindowW(None, window_title)
    if not hwnd:
        def foreach_window(h, windows):
            length = ctypes.windll.user32.GetWindowTextLengthW(h)
            if length > 0:
                buff = ctypes.create_unicode_buffer(length + 1)
                ctypes.windll.user32.GetWindowTextW(h, buff, length + 1)
                if window_title.lower() in buff.value.lower() or "heartopia" in buff.value.lower():
                    windows.append(h)
            return True
        windows = []
        WNDENUMPROC = ctypes.WINFUNCTYPE(ctypes.c_bool, ctypes.c_int, ctypes.c_void_p)
        ctypes.windll.user32.EnumWindows(WNDENUMPROC(foreach_window), ctypes.py_object(windows))
        if windows: 
            hwnd = windows[0]
    return hwnd

def force_focus_window(hwnd):
    """Force focus to a specific window handle"""
    try:
        fore_thread = ctypes.windll.user32.GetWindowThreadProcessId(ctypes.windll.user32.GetForegroundWindow(), None)
        app_thread = ctypes.windll.kernel32.GetCurrentThreadId()
        
        if fore_thread != app_thread:
            ctypes.windll.user32.AttachThreadInput(app_thread, fore_thread, True)
            
        ctypes.windll.user32.ShowWindow(hwnd, 9)
        ctypes.windll.user32.SetForegroundWindow(hwnd)
        ctypes.windll.user32.UpdateWindow(hwnd)
        
        if fore_thread != app_thread:
            ctypes.windll.user32.AttachThreadInput(app_thread, fore_thread, False)
        return True
    except:
        return False

def focus_lock_thread():
    """Background thread that continuously maintains focus"""
    global focus_lock_enabled, target_hwnd
    while True:
        if focus_lock_enabled and target_hwnd:
            current_fg = ctypes.windll.user32.GetForegroundWindow()
            if current_fg != target_hwnd:
                force_focus_window(target_hwnd)
            time.sleep(0.2)  # Check every 200ms - balanced performance
        else:
            time.sleep(0.5)

def focus_window(window_title):
    global target_hwnd
    try:
        log(f"Aggressive focus attempt: {window_title}")
        hwnd = find_window_hwnd(window_title)
        
        if hwnd:
            log(f"Force activating hwnd: {hwnd}")
            target_hwnd = hwnd
            force_focus_window(hwnd)
            log("Focus command executed.")
            return True
        else:
            log("No window found.")
            return False
    except Exception as e:
        log(f"Aggressive focus error: {e}")
        return False

# Start focus lock thread
focus_thread = threading.Thread(target=focus_lock_thread, daemon=True)
focus_thread.start()

while True:
    try:
        # Read line from stdin
        line = sys.stdin.readline()
        if not line:
            break
        
        line = line.strip()
        if not line:
            continue

        try:
            command = json.loads(line)
        except json.JSONDecodeError:
            log(f"Invalid JSON: {line}")
            continue

        cmd_type = command.get('type')
        if cmd_type == 'press':
            key = command.get('key', '').lower()
            log(f"Pressing: {key}")
            if key:
                pydirectinput.press(key)
        
        elif cmd_type == 'press-keys':
            keys = command.get('keys', [])
            log(f"Chord: {keys}")
            for k in keys:
                if k: pydirectinput.keyDown(k.lower())
            time.sleep(0.05) # Tiny hold time for game to register
            for k in reversed(keys):
                if k: pydirectinput.keyUp(k.lower())
        
        elif cmd_type == 'key-down':
            keys = command.get('keys', [])
            if keys:
                log(f"Down: {keys}")
                for k in keys:
                    if k and len(k) > 0:
                        try:
                            pydirectinput.keyDown(k.lower())
                        except Exception as e:
                            log(f"Failed to press key '{k}': {e}")
                
        elif cmd_type == 'key-up':
            keys = command.get('keys', [])
            if keys:
                log(f"Up: {keys}")
                for k in keys:
                    if k and len(k) > 0:
                        try:
                            pydirectinput.keyUp(k.lower())
                        except Exception as e:
                            log(f"Failed to release key '{k}': {e}")
        
        elif cmd_type == 'focus':
            title = command.get('title', 'Heartopia')
            focus_window(title)
        
        elif cmd_type == 'enable-focus-lock':
            focus_lock_enabled = True
            log("Focus lock ENABLED")
        
        elif cmd_type == 'disable-focus-lock':
            focus_lock_enabled = False
            log("Focus lock DISABLED")

        elif cmd_type == 'ping':
            log("Pong")

    except Exception as e:
        log(f"Error: {e}")
