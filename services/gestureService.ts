
export type Results = any;

export class GestureService {
  private hands: any;
  private camera: any;
  private videoElement: HTMLVideoElement;
  private lastCenterX: number | null = null;
  private swipeThreshold = 0.15;
  private lastSwipeTime = 0;
  private isProcessing = false;
  private isStopped = true;
  private isFatal = false;
  private lastFrameTimestamp = 0;
  private minFrameInterval = 100;

  constructor(videoElement: HTMLVideoElement, onResults: (results: Results) => void) {
    this.videoElement = videoElement;
    
    const HandsClass = (window as any).Hands;
    if (!HandsClass) {
      console.warn("MediaPipe Hands class not found on window.");
      this.isFatal = true;
      return;
    }

    try {
      this.hands = new HandsClass({
        locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });

      this.hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      this.hands.onResults((results: any) => {
        if (!this.isStopped && !this.isFatal) {
          onResults(results);
        }
      });
    } catch (e) {
      console.error("Failed to initialize Hands engine:", e);
      this.isFatal = true;
    }
  }

  public async start() {
    if (this.isFatal) {
      throw new Error("GESTURE_ENGINE_FATAL: WASM aborted.");
    }

    const CameraClass = (window as any).Camera;
    if (!CameraClass) throw new Error("CAMERA_CLASS_MISSING");

    this.isStopped = false;

    if (this.camera) {
      await this.camera.start();
      return;
    }

    this.camera = new CameraClass(this.videoElement, {
      onFrame: async () => {
        const now = performance.now();
        if (this.isStopped || this.isFatal || !this.hands || this.isProcessing || (now - this.lastFrameTimestamp < this.minFrameInterval)) {
          return;
        }
        
        if (this.videoElement.readyState < 2 || this.videoElement.videoWidth <= 0 || this.videoElement.paused) {
          return;
        }

        try {
          this.isProcessing = true;
          this.lastFrameTimestamp = now;
          await this.hands.send({ image: this.videoElement });
        } catch (error: any) {
          const msg = error?.toString() || "";
          if (msg.includes('abort') || msg.includes('Aborted')) {
            this.isFatal = true;
            this.stop();
          }
          console.error("Gesture engine error:", msg);
        } finally {
          this.isProcessing = false;
        }
      },
      width: 640,
      height: 480,
    });
    
    return this.camera.start();
  }

  public stop() {
    this.isStopped = true;
    this.isProcessing = false;
    if (this.camera) {
      try { this.camera.stop(); } catch (e) {}
    }
    const stream = this.videoElement.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      this.videoElement.srcObject = null;
    }
  }

  public analyzeGesture(results: any) {
    if (this.isFatal || !results || !results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      this.lastCenterX = null;
      return { gesture: 'None' as const, pinchDistance: 0, center: { x: 0.5, y: 0.5 } };
    }

    const landmarks = results.multiHandLandmarks[0];
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const wrist = landmarks[0];

    const dist = (p1: any, p2: any) => Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
    const pinchDist = dist(thumbTip, indexTip);
    
    const fingers = [landmarks[8], landmarks[12], landmarks[16], landmarks[20]];
    const avgFingerDist = fingers.reduce((sum, f) => sum + dist(f, wrist), 0) / 4;
    
    const isFist = avgFingerDist < 0.22;
    const isOpen = avgFingerDist > 0.45;
    const isTwoFingers = dist(indexTip, wrist) > 0.35 && dist(landmarks[12], wrist) > 0.35 && dist(landmarks[16], wrist) < 0.25;

    const center = {
      x: landmarks.reduce((sum: number, l: any) => sum + l.x, 0) / landmarks.length,
      y: landmarks.reduce((sum: number, l: any) => sum + l.y, 0) / landmarks.length,
    };

    let detectedGesture: 'OpenPalm' | 'Fist' | 'Pinch' | 'TwoFingers' | 'None' | 'SwipeLeft' | 'SwipeRight' = 'None';
    const now = Date.now();
    
    if (this.lastCenterX !== null && now - this.lastSwipeTime > 1200) {
      const dx = center.x - this.lastCenterX;
      if (Math.abs(dx) > this.swipeThreshold) {
        detectedGesture = dx > 0 ? 'SwipeRight' : 'SwipeLeft';
        this.lastSwipeTime = now;
      }
    }
    this.lastCenterX = center.x;

    if (detectedGesture === 'None') {
      if (isFist) detectedGesture = 'Fist';
      else if (isTwoFingers) detectedGesture = 'TwoFingers';
      else if (isOpen) detectedGesture = 'OpenPalm';
      else if (pinchDist < 0.06) detectedGesture = 'Pinch';
    }

    return { gesture: detectedGesture, pinchDistance: pinchDist, center };
  }
}
