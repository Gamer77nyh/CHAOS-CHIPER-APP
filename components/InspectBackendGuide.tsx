
import React from 'react';
import { ArrowLeft, Copy, Terminal, Monitor, Code, Globe } from 'lucide-react';

interface InspectBackendGuideProps {
  onBack: () => void;
}

const InspectBackendGuide: React.FC<InspectBackendGuideProps> = ({ onBack }) => {
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
    alert("Python Payload Copied!");
  };

  return (
    <div className="h-full overflow-y-auto p-6 space-y-8 terminal-scrollbar bg-black/40 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-orbitron text-[10px] font-black tracking-widest uppercase"
      >
        <ArrowLeft className="w-4 h-4" /> RETURN_TO_NEXUS
      </button>

      <div className="bg-slate-900/40 border border-blue-500/20 rounded-2xl p-8 space-y-6 shadow-[0_0_30px_rgba(37,99,235,0.05)]">
        <h2 className="text-3xl font-orbitron font-bold text-white flex items-center gap-4 tracking-tighter">
          <Terminal className="w-8 h-8 text-blue-400" /> SYSTEM_SETUP_PROTOCOL
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-[11px] font-orbitron font-black text-blue-400 flex items-center gap-2 tracking-[0.2em] uppercase">
              <Monitor className="w-5 h-5 opacity-50" /> 01_PREPARATION
            </h3>
            <ol className="list-decimal list-inside space-y-3 text-slate-400 text-[10px] font-bold tracking-wider uppercase leading-relaxed">
              <li>Deploy <span className="text-blue-400">Python 3.10+</span> on target environment.</li>
              <li>Initialize PowerShell with Elevated Privileges.</li>
              <li>Inject dependencies:
                <div className="mt-2 p-3 bg-black border border-blue-500/10 rounded font-mono text-[9px] text-green-500 shadow-inner">
                  pip install flask flask-httpauth psutil opencv-python pystray pillow requests
                </div>
              </li>
            </ol>
          </div>

          <div className="space-y-4">
            <h3 className="text-[11px] font-orbitron font-black text-blue-400 flex items-center gap-2 tracking-[0.2em] uppercase">
              <Globe className="w-5 h-5 opacity-50" /> 02_REMOTE_LINK
            </h3>
            <p className="text-[10px] text-slate-400 font-bold tracking-wider leading-relaxed uppercase">
              Establish a secure tunnel to bypass local firewalls using <span className="text-white">NGROK</span> or <span className="text-white">CLOUDFLARE</span> targeting port 5000.
            </p>
            <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg text-[9px] text-blue-300/60 italic font-mono uppercase">
              "Ngrok http 5000" generates a global endpoint for this command shell.
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-orbitron font-black text-blue-400 flex items-center gap-2 tracking-[0.2em] uppercase">
              <Code className="w-5 h-5 opacity-50" /> 03_BACKEND_PAYLOAD
            </h3>
            <button 
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-3 py-1 bg-blue-600/10 border border-blue-600/20 hover:bg-blue-600/30 rounded text-[9px] font-black text-blue-400 transition-all tracking-widest uppercase"
            >
              <Copy className="w-3 h-3" /> COPY_PAYLOAD
            </button>
          </div>
          <div className="p-4 bg-black border border-blue-500/10 rounded-xl font-mono text-[9px] text-blue-400/70 h-64 overflow-y-auto terminal-scrollbar shadow-inner">
            <pre className="whitespace-pre-wrap">{pythonCode}</pre>
          </div>
          <p className="text-[9px] text-slate-600 font-bold tracking-widest uppercase">
            Deploy as <code className="text-blue-500">elite_service.py</code> and execute via <code className="text-blue-500">python elite_service.py</code>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InspectBackendGuide;
