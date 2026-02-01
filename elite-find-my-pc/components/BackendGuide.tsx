
import React from 'react';
import { ArrowLeft, Copy, Terminal, Monitor, Code, Globe } from 'lucide-react';

interface BackendGuideProps {
  onBack: () => void;
}

const BackendGuide: React.FC<BackendGuideProps> = ({ onBack }) => {
  const pythonCode = `import os
import cv2
import psutil
import threading
import winsound
import requests
from flask import Flask, jsonify, send_file
from flask_httpauth import HTTPBasicAuth
from pystray import Icon, Menu, MenuItem
from PIL import Image

# Configuration
USER = "admin"
PASS = "admin123"
PORT = 5000

app = Flask(__name__)
auth = HTTPBasicAuth()

@auth.verify_password
def verify(username, password):
    return username == USER and password == PASS

@app.route('/stats')
@auth.login_required
def get_stats():
    return jsonify({
        "cpu": psutil.cpu_percent(),
        "ram": psutil.virtual_memory().percent,
        "ip": requests.get('https://api.ipify.org').text,
        "uptime": "Calculating..."
    })

@app.route('/lock')
@auth.login_required
def lock_pc():
    os.system("rundll32.exe user32.dll,LockWorkStation")
    return "Locked"

@app.route('/alarm')
@auth.login_required
def alarm():
    winsound.Beep(2500, 2000)
    return "Alarm Played"

@app.route('/snapshot')
@auth.login_required
def snapshot():
    cam = cv2.VideoCapture(0)
    ret, frame = cam.read()
    if ret:
        cv2.imwrite("snap.jpg", frame)
        cam.release()
        return send_file("snap.jpg", mimetype='image/jpeg')
    return "Camera Error", 500

def run_flask():
    app.run(host='0.0.0.0', port=PORT, threaded=True)

def setup_tray():
    image = Image.new('RGB', (64, 64), (0, 100, 255))
    menu = Menu(
        MenuItem('Lock PC', lambda: os.system("rundll32.exe user32.dll,LockWorkStation")),
        MenuItem('Exit', lambda icon: icon.stop())
    )
    icon = Icon("EliteTracker", image, "Elite Find My PC", menu)
    icon.run()

if __name__ == "__main__":
    threading.Thread(target=run_flask, daemon=True).start()
    setup_tray()`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pythonCode);
    alert("Python Code Copied!");
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-orbitron"
      >
        <ArrowLeft className="w-4 h-4" /> BACK TO DASHBOARD
      </button>

      <div className="glass rounded-2xl p-8 space-y-6">
        <h2 className="text-3xl font-orbitron font-bold text-white flex items-center gap-4">
          <Terminal className="w-8 h-8 text-blue-400" /> SYSTEM SETUP
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-orbitron text-blue-300 flex items-center gap-2">
              <Monitor className="w-5 h-5" /> 1. Preparation
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-slate-300 text-sm leading-relaxed">
              <li>Install <span className="text-white font-bold">Python 3.10+</span> from python.org.</li>
              <li>Open PowerShell as Administrator.</li>
              <li>Install dependencies:
                <div className="mt-2 p-3 bg-black rounded font-mono text-xs text-green-400 border border-slate-800">
                  pip install flask flask-httpauth psutil opencv-python pystray pillow requests
                </div>
              </li>
            </ol>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-orbitron text-blue-300 flex items-center gap-2">
              {/* Fix: Globe is now imported from lucide-react */}
              <Globe className="w-5 h-5" /> 2. Remote Access
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              To access your PC from anywhere (mobile data), use a tunnel like <span className="text-white">ngrok</span> or <span className="text-white">Cloudflare Tunnel</span> to point to port 5000.
            </p>
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-300 italic">
              "Ngrok http 5000" will give you a public URL to use in this dashboard.
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-orbitron text-blue-300 flex items-center gap-2">
              <Code className="w-5 h-5" /> 3. Backend Script (PC Side)
            </h3>
            <button 
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs font-bold transition-all"
            >
              <Copy className="w-3 h-3" /> COPY CODE
            </button>
          </div>
          <div className="p-4 bg-slate-950 rounded-xl font-mono text-xs text-slate-400 border border-slate-800 h-64 overflow-y-auto custom-scrollbar">
            <pre className="whitespace-pre-wrap">{pythonCode}</pre>
          </div>
          <p className="text-xs text-slate-500">
            Save this file as <code className="text-slate-300">elite_service.py</code> and run it with <code className="text-slate-300">python elite_service.py</code>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BackendGuide;
