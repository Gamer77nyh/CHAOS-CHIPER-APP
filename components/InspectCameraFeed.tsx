
import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCcw } from 'lucide-react';

const InspectCameraFeed: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);

  const startCamera = async () => {
    setLoading(true);
    try {
      // First, try to stop any existing tracks to prevent conflicts
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user"
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setHasPermission(true);
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        alert("CRITICAL: Camera is already in use by another module (e.g. Particle Collider). Close other sensors to engage Shadow Link.");
      }
      setHasPermission(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="relative rounded-xl overflow-hidden bg-black aspect-video border border-slate-800 group shadow-[0_0_20px_rgba(0,0,0,0.5)]">
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <RefreshCcw className="w-8 h-8 text-blue-400 animate-spin" />
        </div>
      ) : hasPermission ? (
        <>
          <video 
            ref={videoRef} 
            autoPlay 
            muted 
            playsInline 
            className="w-full h-full object-cover grayscale opacity-60 contrast-125"
          />
          <div className="absolute inset-0 pointer-events-none border-[1px] border-blue-500/20">
            <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-red-500" />
            <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-red-500" />
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-red-500" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-red-500" />
            
            {/* Scanline overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-30"></div>
          </div>
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 bg-black/50 text-[10px] rounded backdrop-blur border border-red-500/30 font-bold text-red-500">
             <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" /> LIVE_FEED
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          <Camera className="w-10 h-10 text-slate-700 mb-2" />
          <p className="text-[10px] text-slate-500 mb-4 font-bold tracking-widest">REMOTE LINK SEVERED. SENSOR PERMISSION REQUIRED.</p>
          <button 
            onClick={startCamera}
            className="px-4 py-2 bg-blue-600/20 border border-blue-600 hover:bg-blue-600/40 text-blue-400 rounded-lg text-[10px] font-black transition-all tracking-widest uppercase"
          >
            RESTORE SENSOR LINK
          </button>
        </div>
      )}
      
      <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform">
        <button className="w-full py-1 text-[9px] font-black text-white bg-blue-600/50 rounded uppercase tracking-[0.2em]">CAPTURE_SNAPSHOT</button>
      </div>
    </div>
  );
};

export default InspectCameraFeed;
