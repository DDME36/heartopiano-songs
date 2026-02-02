# 🚀 คู่มือการ Deploy HEARTOPIANO

## ขั้นตอนที่ 1: สร้าง Repository สำหรับเพลง

1. ไปที่ GitHub.com
2. คลิก "New repository"
3. ตั้งชื่อ: `heartopiano-songs`
4. เลือก Public
5. คลิก "Create repository"

6. สร้างโครงสร้างโฟลเดอร์:
```
heartopiano-songs/
└── songs/
    ├── song1.json
    ├── song2.json
    └── song3.json
```

7. อัพโหลดไฟล์เพลง (ไฟล์ .json) ทั้งหมดไปในโฟลเดอร์ `songs/`

---

## ขั้นตอนที่ 2: แก้ไข Config ในโปรเจค

แก้ไขไฟล์ `src/services/onlineSongService.ts`:

```typescript
const GITHUB_USER = 'DDME36' // เปลี่ยนเป็น GitHub username ของคุณ
const GITHUB_REPO = 'heartopiano-songs'
const GITHUB_BRANCH = 'main'
```

---

## ขั้นตอนที่ 3: Build แอพ

```bash
npm run electron:build
```

หลัง build เสร็จ จะได้ไฟล์ใน `dist/`:
- `Heartopiano-Setup-1.0.0.exe` (ไฟล์ติดตั้งสำหรับ Windows)

---

## ขั้นตอนที่ 4: สร้าง Repository สำหรับแอพหลัก (heartopiano)

1. ไปที่ GitHub.com
2. คลิก "New repository"
3. ตั้งชื่อ: `heartopiano`
4. เลือก Public
5. คลิก "Create repository"

6. Push โค้ดทั้งหมด:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/DDME36/heartopiano.git
git push -u origin main
```

---

## ขั้นตอนที่ 5: สร้าง GitHub Release

1. ไปที่ repository `heartopiano` บน GitHub
2. คลิกแท็บ "Releases" (ด้านขวา)
3. คลิก "Create a new release"
4. กรอกข้อมูล:
   - **Tag version**: `v1.0.0`
   - **Release title**: `HEARTOPIANO v1.0.0`
   - **Description**: 
     ```
     🎹 HEARTOPIANO - Auto Piano Player for Heartopia Game
     
     ## ✨ Features
     - Online song library from GitHub
     - Speed control (0.5x - 2.0x)
     - Beautiful UI with mini mode
     - Multi-language support (TH/EN)
     
     ## 📋 Requirements
     - Windows 10/11
     - Python 3.x
     - Internet connection
     
     ## 🚀 Installation
     1. Download `Heartopiano-Setup-1.0.0.exe`
     2. Run the installer
     3. Open Heartopia game
     4. Launch Heartopiano
     
     ## 📝 Notes
     - Songs are loaded from GitHub automatically
     - Make sure you have internet connection
     ```

5. **อัพโหลดไฟล์**:
   - ลากไฟล์ `dist/Heartopiano-Setup-1.0.0.exe` มาวางในช่อง "Attach binaries"

6. คลิก "Publish release"

---

## ขั้นตอนที่ 6: อัพโหลด download.html

### วิธีที่ 1: ใช้ GitHub Pages (แนะนำ)

1. ไปที่ repository `heartopiano`
2. คลิก Settings → Pages
3. เลือก Source: "Deploy from a branch"
4. เลือก Branch: `main` และ folder: `/ (root)`
5. คลิก Save

6. สร้างไฟล์ `index.html` ในโฟลเดอร์หลัก (คัดลอกจาก download.html):
```bash
cp download.html index.html
```

7. แก้ไขลิงค์ใน `index.html`:
```html
<a href="https://github.com/DDME36/heartopiano/releases/latest/download/Heartopiano-Setup-1.0.0.exe" 
   class="download-btn">
```

8. Push ขึ้น GitHub:
```bash
git add index.html
git commit -m "Add download page"
git push
```

9. เว็บจะอยู่ที่: `https://DDME36.github.io/heartopiano/`

### วิธีที่ 2: ใช้ Netlify (ฟรี)

1. ไปที่ [netlify.com](https://www.netlify.com/)
2. Sign up ด้วย GitHub
3. คลิก "Add new site" → "Import an existing project"
4. เลือก repository `heartopiano`
5. Build settings:
   - Build command: (ว่างไว้)
   - Publish directory: `/`
6. คลิก "Deploy site"

7. แก้ไขลิงค์ใน `download.html` แล้ว push:
```html
<a href="https://github.com/DDME36/heartopiano/releases/latest/download/Heartopiano-Setup-1.0.0.exe" 
   class="download-btn">
```

8. เว็บจะอยู่ที่: `https://your-site-name.netlify.app/download.html`

---

## ขั้นตอนที่ 7: แก้ไขลิงค์ใน download.html

แก้ไขไฟล์ `download.html` หรือ `index.html`:

```html
<!-- ปุ่ม Download Windows -->
<a href="https://github.com/DDME36/heartopiano/releases/latest/download/Heartopiano-Setup-1.0.0.exe" 
   class="download-btn">
    <span class="platform-icon">🪟</span>
    <span>ดาวน์โหลดสำหรับ Windows</span>
</a>

<!-- ลิงค์ Footer -->
<a href="https://github.com/DDME36/heartopiano" class="footer-link">📖 GitHub</a>
<a href="https://github.com/DDME36/heartopiano/issues" class="footer-link">🐛 รายงานปัญหา</a>
<a href="https://github.com/DDME36/heartopiano-songs" class="footer-link">🎼 เพิ่มเพลง</a>
<a href="https://github.com/DDME36/heartopiano/blob/main/README.md" class="footer-link">📚 คู่มือ</a>
```

---

## 📝 สรุป URL ทั้งหมด

1. **Repository แอพหลัก**: `https://github.com/DDME36/heartopiano`
2. **Repository เพลง**: `https://github.com/DDME36/heartopiano-songs`
3. **Download Page**: `https://DDME36.github.io/heartopiano/` (GitHub Pages)
4. **Release/Download**: `https://github.com/DDME36/heartopiano/releases`
5. **Direct Download Link**: `https://github.com/DDME36/heartopiano/releases/latest/download/Heartopiano-Setup-1.0.0.exe`

---

## 🔄 การอัพเดทเวอร์ชันใหม่

เมื่อต้องการอัพเดทแอพ:

1. แก้ไขโค้ด
2. เปลี่ยนเวอร์ชันใน `package.json`:
   ```json
   "version": "1.0.1"
   ```
3. Build ใหม่: `npm run electron:build`
4. สร้าง Release ใหม่บน GitHub ด้วย tag `v1.0.1`
5. อัพโหลดไฟล์ `.exe` ใหม่
6. แก้ไขลิงค์ใน `download.html` (ถ้าใช้ชื่อไฟล์เฉพาะเวอร์ชัน)

---

## 🎵 การเพิ่มเพลงใหม่

1. ไปที่ repository `heartopiano-songs`
2. เข้าโฟลเดอร์ `songs/`
3. คลิก "Add file" → "Upload files"
4. อัพโหลดไฟล์ `.json` ใหม่
5. Commit changes
6. เพลงจะอัพเดทอัตโนมัติในแอพ (ไม่ต้อง build ใหม่!)

---

## ⚠️ สิ่งที่ต้องระวัง

1. **ชื่อไฟล์ต้องตรงกัน**: ถ้า build ได้ `Heartopiano-Setup-1.0.0.exe` ลิงค์ก็ต้องใช้ชื่อนี้
2. **Repository ต้อง Public**: ไม่งั้นโหลดไฟล์ไม่ได้
3. **เพลงต้องอยู่ใน `songs/` folder**: ไม่งั้นแอพหาไม่เจอ
4. **Internet connection**: แอพต้องมีเน็ตถึงจะโหลดเพลงได้

---

## 🆘 Troubleshooting

### ปัญหา: โหลดไฟล์ไม่ได้ (404)
- ตรวจสอบว่า Release ถูก Publish แล้ว
- ตรวจสอบชื่อไฟล์ว่าตรงกับลิงค์
- ตรวจสอบว่า repository เป็น Public

### ปัญหา: แอพโหลดเพลงไม่ได้
- ตรวจสอบว่า repository `heartopiano-songs` เป็น Public
- ตรวจสอบว่าเพลงอยู่ในโฟลเดอร์ `songs/`
- ตรวจสอบ username และ repo name ใน `onlineSongService.ts`

### ปัญหา: GitHub Pages ไม่ทำงาน
- รอ 5-10 นาทีหลัง enable Pages
- ตรวจสอบว่าไฟล์ชื่อ `index.html` อยู่ใน root folder
- ตรวจสอบ Settings → Pages ว่า enable แล้ว
