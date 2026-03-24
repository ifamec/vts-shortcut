# VTubeStudio Shortcut

A comprehensive application bundle for triggering VTubeStudio hotkeys remotely or locally, providing both a beautiful **Desktop Executable** and a **Local Network Web App**.

## Features
- **Standalone Desktop App**: Launch the `.exe` directly. It runs natively on Windows using Wails.
- **Local Network Remote**: While the desktop app is running, it simultaneously hosts a web server on port `10086`. You can visit your PC's local IP address (`http://192.168.x.x:10086`) from your phone or tablet to control VTubeStudio wirelessly! The desktop app interface will display precisely which exact links you can type into your mobile browser.
- **Premium Interface**: A modern dark-mode glassmorphism design with responsive grids.
- **Auto-Sync**: Automatically detects your current active VTubeStudio model and lists its configured hotkeys in categorized tabs.

## 🚀 How to Run

### Option 1: Desktop Application (Recommended)
1. Ensure VTubeStudio is running on your PC with "API" connections allowed on port `8001`. (Also check "Allow external IP" if you want mobile devices to connect).
2. Simply double-click the compiled `vts-shortcut.exe` located in the `build/bin/` folder.
3. The app will start natively. You will see "Network Access" URLs directly in the app that you can type into your mobile device.

### Option 2: Web Development Server
If you're making modifications to the React code, you can use the development server:
```bash
cd webapp
npm install
npm run dev
```

## Compilation
This project uses **Wails** (v2) and **Vite** (React/TypeScript).
To re-compile the Windows `.exe` application after making code changes:
```bash
wails build
```
