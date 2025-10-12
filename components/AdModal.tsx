import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface AdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdModal: React.FC<AdModalProps> = ({ isOpen, onClose }) => {
  const [canClose, setCanClose] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen) {
      setCanClose(false);
      setCountdown(5);
      
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanClose(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Start video playback
      videoRef.current?.play().catch(error => {
        console.log("Video autoplay was prevented:", error);
      });

      return () => clearInterval(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    videoRef.current?.pause();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog">
        <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-4xl transform transition-all relative aspect-video flex flex-col items-center justify-center">
            
            <div className="absolute top-2 right-2 z-20">
              {canClose ? (
                <button 
                    onClick={handleClose} 
                    className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    aria-label="Close ad"
                >
                    <X size={24} />
                </button>
              ) : (
                <span className="px-3 py-1 bg-black/50 text-white text-sm rounded-full">
                  You can skip in {countdown}...
                </span>
              )}
            </div>

            <video 
              ref={videoRef}
              src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" 
              className="w-full h-full object-contain rounded-lg"
              muted
              playsInline
              loop
            >
              Your browser does not support the video tag.
            </video>
            
            <div className="absolute bottom-4 left-4 text-white bg-black/50 px-2 py-1 rounded text-xs">
              Advertisement
            </div>
        </div>
    </div>
  );
};

export default AdModal;
