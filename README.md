# Chaos Cipher - Elite Hacking Mastery

Chaos Cipher is a high-performance terminal interface and hacking simulation environment powered by Gemini AI. This repository contains the source code for both the web application and the standalone Windows desktop application.

## 🚀 Features

- **Autonomous Terminal**: AI-powered command shell using Gemini Pro.
- **System Recon**: Real-time device telemetry and node analysis simulation.
- **Ghost Forge**: Advanced payload mutation and signature generation interface.
- **Desktop Ready**: Fully converted into a Windows executable (.exe).

## 💻 Running Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (LTS recommended)

### Setup
1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure API Key**:
   Create a `.env.local` file in the root directory and add your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_actual_key_here
   ```

3. **Development Mode**:
   - Run in Browser: `npm run dev`
   - Run in Desktop (Electron): `npm run app:dev`

## 🌐 Deployment (Web)

Chaos Cipher can be deployed as a high-performance web application on **Vercel**:

1. **Push to GitHub**: (Already completed).
2. **Connect to Vercel**:
   - Go to [Vercel.com](https://vercel.com).
   - Click **"New Project"**.
   - Import this GitHub repository.
3. **Configure Environment Variables**:
   - During the import, add a **New Environment Variable**:
     - **Key**: `GEMINI_API_KEY`
     - **Value**: `your_actual_key_here`
4. **Deploy**: Vercel will automatically detect the Vite configuration and deploy your terminal to the web.

## 📦 Building for Windows

To package the application into a standalone `.exe`:

1. Run the build command:
   ```bash
   npm run electron:package
   ```
2. The output will be located in `dist_electron/ChaosCipher-win32-x64/`.

## 🛠️ Maintenance & Repair

If you encounter build errors or dependency issues, use the provided repair tool:
- Double-click `repair_and_build.bat` in the root folder.

## 📜 License

This project is for educational and simulation purposes only.
