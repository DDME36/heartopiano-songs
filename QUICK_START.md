# 🚀 Quick Start Guide - สำหรับคุณ PUNN

## ✅ สิ่งที่ต้องทำก่อน Deploy (เรียงตามลำดับ)

### 1️⃣ สร้าง Repository สำหรับเพลง

1. ไปที่ https://github.com/new
2. Repository name: `heartopiano-songs`
3. เลือก **Public**
4. คลิก "Create repository"
5. คลิก "creating a new file"
6. พิมพ์: `songs/song1.json` (จะสร้างโฟลเดอร์ songs อัตโนมัติ)
7. วางเนื้อหาเพลง (JSON) ลงไป
8. คลิก "Commit new file"
9. ทำซ้ำสำหรับเพลงอื่นๆ

**หรือ** อัพโหลดทีเดียว:
- คลิก "Add file" → "Upload files"
- ลากไฟล์ .json ทั้งหมดจากโฟลเดอร์ `songs/` ในเครื่องคุณ
- คลิก "Commit changes"

---

### 2️⃣ Build แอพ

```bash
npm run electron:build
```

รอจนเสร็จ จะได้ไฟล์:
- `dist/Heartopiano-Setup-1.0.0.exe` ← **ไฟล์นี้แหละที่จะให้คนโหลด**

---

### 3️⃣ สร้าง Repository สำหรับแอพหลัก

1. ไปที่ https://github.com/new
2. Repository name: `heartopiano`
3. เลือก **Public**
4. คลิก "Create repository"

5. เปิด Terminal/CMD ในโฟลเดอร์โปรเจค แล้วรัน:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/DDME36/heartopiano.git
git push -u origin main
```

---

### 4️⃣ สร้าง Release (สำคัญมาก!)

1. ไปที่ https://github.com/DDME36/heartopiano
2. คลิกแท็บ **"Releases"** (ด้านขวามือ)
3. คลิก **"Create a new release"**
4. กรอก:
   - **Tag**: `v1.0.0`
   - **Title**: `HEARTOPIANO v1.0.0`
   - **Description**: คัดลอกจากด้านล่าง

```markdown
🎹 HEARTOPIANO - Auto Piano Player for Heartopia Game

## ✨ Features
- 🎵 Online song library from GitHub
- ⚡ Speed control (0.5x - 2.0x)
- 🎨 Beautiful glassmorphism UI
- 🎹 Mini mode for compact playing
- 🌐 Multi-language (TH/EN)

## 📋 Requirements
- Windows 10/11
- Python 3.x
- Internet connection

## 🚀 How to Install
1. Download `Heartopiano-Setup-1.0.0.exe` below
2. Run the installer
3. Open Heartopia game first
4. Launch Heartopiano app

## 📝 Notes
- Songs are loaded from GitHub automatically
- Make sure you have internet connection
- DevTools are disabled for security
```

5. **อัพโหลดไฟล์**:
   - ลากไฟล์ `dist/Heartopiano-Setup-1.0.0.exe` มาวางในช่อง **"Attach binaries by dropping them here or selecting them."**
   - รอจนอัพโหลดเสร็จ (จะเห็นชื่อไฟล์)

6. คลิก **"Publish release"**

---

### 5️⃣ เปิด GitHub Pages (สำหรับหน้าดาวน์โหลด)

1. ไปที่ https://github.com/DDME36/heartopiano/settings/pages
2. ใน **"Source"** เลือก:
   - Branch: `main`
   - Folder: `/ (root)`
3. คลิก **"Save"**
4. รอ 2-3 นาที

5. เว็บจะพร้อมใช้งานที่: **https://ddme36.github.io/heartopiano/**

---

## 🎉 เสร็จแล้ว! ตอนนี้คุณมี:

1. ✅ **เว็บดาวน์โหลด**: https://ddme36.github.io/heartopiano/
2. ✅ **ลิงค์โหลดตรง**: https://github.com/DDME36/heartopiano/releases/latest/download/Heartopiano-Setup-1.0.0.exe
3. ✅ **Repository เพลง**: https://github.com/DDME36/heartopiano-songs
4. ✅ **Repository แอพ**: https://github.com/DDME36/heartopiano

---

## 📤 แชร์ให้คนอื่นโหลด

ส่งลิงค์นี้ให้เพื่อน:
```
https://ddme36.github.io/heartopiano/
```

หรือลิงค์โหลดตรง:
```
https://github.com/DDME36/heartopiano/releases/latest/download/Heartopiano-Setup-1.0.0.exe
```

---

## 🎵 เพิ่มเพลงใหม่ (ไม่ต้อง build ใหม่!)

1. ไปที่ https://github.com/DDME36/heartopiano-songs
2. เข้าโฟลเดอร์ `songs/`
3. คลิก "Add file" → "Upload files"
4. อัพโหลดไฟล์ `.json` ใหม่
5. คลิก "Commit changes"
6. **เสร็จ!** แอพจะโหลดเพลงใหม่อัตโนมัติ

---

## 🔄 อัพเดทแอพเวอร์ชันใหม่

เมื่อแก้ไขโค้ดและต้องการปล่อยเวอร์ชันใหม่:

1. แก้ไข `package.json`:
```json
"version": "1.0.1"
```

2. Build ใหม่:
```bash
npm run electron:build
```

3. สร้าง Release ใหม่:
   - ไปที่ https://github.com/DDME36/heartopiano/releases/new
   - Tag: `v1.0.1`
   - Title: `HEARTOPIANO v1.0.1`
   - อัพโหลดไฟล์ `.exe` ใหม่
   - Publish

4. **ไม่ต้องแก้ไข download.html** ถ้าใช้ลิงค์ `/latest/download/`

---

## ⚠️ Troubleshooting

### ปัญหา: โหลดไฟล์ไม่ได้ (404)
✅ ตรวจสอบว่า Release ถูก **Publish** แล้ว (ไม่ใช่ Draft)
✅ ตรวจสอบว่า repository เป็น **Public**
✅ ตรวจสอบชื่อไฟล์ว่าตรงกับที่ build

### ปัญหา: แอพโหลดเพลงไม่ได้
✅ ตรวจสอบว่า `heartopiano-songs` เป็น **Public**
✅ ตรวจสอบว่าเพลงอยู่ในโฟลเดอร์ `songs/`
✅ ตรวจสอบว่ามีอินเทอร์เน็ต

### ปัญหา: GitHub Pages ไม่ทำงาน
✅ รอ 5-10 นาที หลัง enable Pages
✅ ตรวจสอบว่าไฟล์ `index.html` อยู่ใน root
✅ ลอง force refresh: Ctrl+Shift+R

---

## 📞 ติดต่อ

ถ้ามีปัญหาหรือคำถาม:
- เปิด Issue: https://github.com/DDME36/heartopiano/issues
- หรือถามผมได้เลย!

---

**สร้างโดย PUNN with ❤️**
