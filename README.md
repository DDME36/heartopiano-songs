# 🎹 HEARTOPIANO

Auto Piano Player for Heartopia Game

เครื่องเล่นเปียโนอัตโนมัติสำหรับเกม Heartopia

---

## ✨ Features

- 🎵 **Online Song Library** - เพลงอัพเดทอัตโนมัติ
- ⚡ **Speed Control** - ปรับความเร็ว 0.5x - 2.0x
- 🎨 **Beautiful UI** - ดีไซน์สวยงามแบบ glassmorphism
- 🎹 **Mini Mode** - โหมดขนาดเล็กสำหรับเล่นเพลง
- 🔍 **Search & Filter** - ค้นหาเพลงได้ง่าย
- 🌐 **Multi-language** - รองรับภาษาไทยและอังกฤษ
- ⌨️ **Keyboard Shortcuts** - ควบคุมด้วยคีย์ลัด
- 🎯 **Auto Focus** - ล็อคโฟกัสหน้าต่างเกมอัตโนมัติ

---

## 📋 Requirements

- Windows 10/11
- Python 3.x (สำหรับ key simulation)
- Internet connection (สำหรับโหลดเพลง)

---

## 🚀 Installation

### สำหรับผู้ใช้งาน

1. ดาวน์โหลดจาก [Releases](https://github.com/DDME36/heartopiano-songs/releases)
2. รันไฟล์ `Heartopiano-Setup-1.0.0.exe`
3. ติดตั้งตามขั้นตอน
4. เปิดเกม Heartopia ก่อนใช้งาน
5. เปิดแอพ Heartopiano

---

## 🎮 How to Use

1. **เปิดเกม Heartopia** - แอพจะตรวจจับหน้าต่างเกมอัตโนมัติ
2. **เลือกเพลง** - คลิกเพลงที่ต้องการจากรายการ
3. **ปรับความเร็ว** - ใช้ slider ปรับความเร็วตามต้องการ
4. **กด F5 หรือ Play** - เริ่มเล่นเพลง
5. **กด F8 หรือ Stop** - หยุดเล่น

### Keyboard Shortcuts

- `F5` - เริ่ม/หยุดชั่วคราว
- `F8` - หยุดเล่น
- `Space` - เริ่ม/หยุดชั่วคราว
- `Esc` - หยุดเล่น
- `Ctrl + ↑` - เพิ่มความเร็ว
- `Ctrl + ↓` - ลดความเร็ว

---

## 🎵 Song Library

เพลงทั้งหมดอยู่ในโฟลเดอร์ `songs/` และจะอัพเดทอัตโนมัติในแอพ

### Song Format

```json
{
  "id": "unique-id",
  "title": "ชื่อเพลง",
  "artist": "ศิลปิน",
  "difficulty": "Easy/Medium/Hard",
  "bpm": 120,
  "notes": [
    { "key": "C", "beat": 0, "duration": 0.5 },
    { "key": "D", "beat": 0.5, "duration": 0.5 }
  ]
}
```

---

## 🛠️ Development

### Setup

```bash
# Install dependencies
npm install

# Install Python dependencies
pip install pydirectinput pygetwindow

# Run development server
npm run dev
```

### Build

```bash
# Build for production
npm run electron:build
```

---

## 🔒 Security Features

- DevTools disabled in production (F12, Ctrl+Shift+I blocked)
- Source code minified and obfuscated
- Console logs removed in production
- No external dependencies in runtime

---

## 📝 License

Free to Use

---

## 👨‍💻 Author

Created by **PUNN** with ❤️

© 2026 PUNN

---

## 🐛 Troubleshooting

### แอพไม่พบหน้าต่างเกม
- ตรวจสอบว่าเกม Heartopia เปิดอยู่
- ชื่อ process ต้องเป็น `xdt.exe`

### เพลงไม่โหลด
- ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต
- ตรวจสอบว่า repository เป็น Public

### Python Error
- ติดตั้ง Python 3.x
- รัน: `pip install pydirectinput pygetwindow`
