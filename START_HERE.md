# 🚀 เริ่มต้นใช้งาน - อ่านไฟล์นี้ก่อน!

## ⚠️ สิ่งที่ต้องทำก่อน (สำคัญมาก!)

### 1. สร้าง GitHub Repositories (2 อัน)

ไปที่ https://github.com/new และสร้าง:

1. **Repository แรก**: `heartopiano` (Public)
2. **Repository ที่สอง**: `heartopiano-songs` (Public)

---

## 📦 ขั้นตอนการ Deploy

### Step 1: Deploy เพลง

```bash
deploy-songs.bat
```

สคริปต์นี้จะ:
- สร้าง repo ชั่วคราว
- คัดลอกเพลงจากโฟลเดอร์ `songs/`
- Push ขึ้น GitHub ที่ `heartopiano-songs`

### Step 2: Build แอพ

```bash
npm run electron:build
```

รอจนเสร็จ จะได้ไฟล์:
- `dist/Heartopiano-Setup-1.0.0.exe`

### Step 3: Deploy แอพ

```bash
deploy.bat
```

สคริปต์นี้จะ:
- Push โค้ดทั้งหมดขึ้น GitHub
- ไม่รวมโฟลเดอร์ `songs/` (ใช้ online แทน)

### Step 4: สร้าง Release

1. ไปที่: https://github.com/DDME36/heartopiano/releases/new
2. กรอก:
   - Tag: `v1.0.0`
   - Title: `HEARTOPIANO v1.0.0`
   - Description: (คัดลอกด้านล่าง)

```
🎹 HEARTOPIANO - Auto Piano Player for Heartopia Game

✨ Features:
- Online song library (auto-update)
- Speed control (0.5x - 2.0x)
- Beautiful UI with mini mode
- Multi-language (TH/EN)

📋 Requirements:
- Windows 10/11
- Python 3.x
- Internet connection

🚀 Installation:
1. Download Heartopiano-Setup-1.0.0.exe
2. Run installer
3. Open Heartopia game
4. Launch Heartopiano

Created by PUNN with ❤️
```

3. **อัพโหลดไฟล์**: ลาก `dist/Heartopiano-Setup-1.0.0.exe` มาวาง
4. คลิก **"Publish release"**

### Step 5: เปิด GitHub Pages

1. ไปที่: https://github.com/DDME36/heartopiano/settings/pages
2. Source: เลือก `main` branch, `/ (root)` folder
3. คลิก **Save**
4. รอ 2-3 นาที

---

## 🎉 เสร็จแล้ว!

เว็บดาวน์โหลดจะอยู่ที่:
```
https://ddme36.github.io/heartopiano/
```

ลิงค์โหลดตรง:
```
https://github.com/DDME36/heartopiano/releases/latest/download/Heartopiano-Setup-1.0.0.exe
```

---

## 🎵 เพิ่มเพลงใหม่ (ภายหลัง)

1. ไปที่: https://github.com/DDME36/heartopiano-songs
2. เข้าโฟลเดอร์ `songs/`
3. คลิก "Add file" → "Upload files"
4. อัพโหลดไฟล์ `.json` ใหม่
5. Commit

เพลงจะอัพเดทในแอพอัตโนมัติ!

---

## 🔄 อัพเดทแอพเวอร์ชันใหม่

1. แก้ไข `package.json`: เปลี่ยน version เป็น `1.0.1`
2. Build: `npm run electron:build`
3. สร้าง Release ใหม่ (tag: `v1.0.1`)
4. อัพโหลดไฟล์ `.exe` ใหม่

---

## ⚠️ หมายเหตุ

- ไฟล์ในโฟลเดอร์ `songs/` จะ**ไม่ถูก push** ขึ้น GitHub (ถูก ignore)
- แอพจะโหลดเพลงจาก `heartopiano-songs` repository แทน
- ไม่มีลิงค์ source code ในหน้า download (ป้องกันการคัดลอก)
- DevTools ถูกปิดใน production build

---

## 📞 ติดปัญหา?

ตรวจสอบ:
1. Repository ทั้ง 2 อันเป็น **Public** หรือยัง
2. เพลงอยู่ในโฟลเดอร์ `songs/` ของ `heartopiano-songs` หรือยัง
3. Release ถูก **Publish** แล้วหรือยัง (ไม่ใช่ Draft)
4. GitHub Pages **Enable** แล้วหรือยัง

---

**Created by PUNN with ❤️**
