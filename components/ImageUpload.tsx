import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Camera, Image as ImageIcon, X, Loader } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

const MOCK_GALLERY_IMAGES = Array.from({ length: 9 }, (_, i) => `https://picsum.photos/seed/gallery${i + 1}/400/300`);

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const CameraView: React.FC<{ onCapture: (base64: string) => void, onCancel: () => void }> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activeStream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        activeStream = mediaStream;
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Could not access the camera. Please check permissions.");
      }
    };
    startCamera();
    return () => {
      activeStream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
        const base64 = canvasRef.current.toDataURL('image/jpeg');
        onCapture(base64);
        stream?.getTracks().forEach(track => track.stop());
      }
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden">
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-contain" />
        <canvas ref={canvasRef} className="hidden" />
      </div>
      <div className="flex space-x-2">
        <Button onClick={onCancel} variant="secondary">Cancel</Button>
        <Button onClick={handleCapture} disabled={!stream || !!error} icon={<Camera size={18} />}>Take Picture</Button>
      </div>
    </div>
  );
};

const GalleryView: React.FC<{ onSelect: (base64: string) => void }> = ({ onSelect }) => {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSelect = async (url: string) => {
    setIsLoading(url);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const base64 = await blobToBase64(blob);
      onSelect(base64);
    } catch (error) {
      console.error("Error fetching gallery image:", error);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {MOCK_GALLERY_IMAGES.map(url => (
        <div key={url} className="relative aspect-square cursor-pointer group" onClick={() => handleSelect(url)}>
          <img src={url} alt="Gallery item" className="w-full h-full object-cover rounded-md" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            {isLoading === url ? (
              <Loader className="animate-spin text-white" />
            ) : (
              <ImageIcon size={32} className="text-white" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const FileUploadView: React.FC<{ onUpload: (base64: string) => void }> = ({ onUpload }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const base64 = await blobToBase64(file);
      onUpload(base64);
    }
  };
  
  return (
    <div
      className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
      onClick={() => inputRef.current?.click()}
    >
      <input type="file" ref={inputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      <Upload size={48} className="text-gray-400 mb-2" />
      <p className="font-semibold">Click to upload a file</p>
      <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
    </div>
  );
};

const ImageUploadModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onImageSelected: (base64: string) => void;
}> = ({ isOpen, onClose, onImageSelected }) => {
  type View = 'options' | 'file' | 'gallery' | 'camera';
  const [view, setView] = useState<View>('options');

  useEffect(() => {
      if(isOpen) {
          setView('options');
      }
  }, [isOpen]);

  const renderContent = () => {
    switch (view) {
      case 'file': return <FileUploadView onUpload={onImageSelected} />;
      case 'gallery': return <GalleryView onSelect={onImageSelected} />;
      case 'camera': return <CameraView onCapture={onImageSelected} onCancel={() => setView('options')}/>;
      case 'options':
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <button onClick={() => setView('file')} className="p-6 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <Upload size={32} className="mx-auto mb-2" /> Upload File
            </button>
            <button onClick={() => setView('gallery')} className="p-6 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <ImageIcon size={32} className="mx-auto mb-2" /> From Gallery
            </button>
            <button onClick={() => setView('camera')} className="p-6 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <Camera size={32} className="mx-auto mb-2" /> Use Camera
            </button>
          </div>
        );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Choose an Image">
      {renderContent()}
    </Modal>
  );
};


interface ImageUploadProps {
  onImageSelect: (base64: string) => void;
  initialImageUrl?: string;
  label: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, initialImageUrl, label }) => {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(initialImageUrl);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setSelectedImage(initialImageUrl);
  }, [initialImageUrl]);

  const handleImageSelected = useCallback((base64: string) => {
    setSelectedImage(base64);
    onImageSelect(base64);
    setIsModalOpen(false);
  }, [onImageSelect]);
  
  const handleRemoveImage = () => {
      setSelectedImage(undefined);
      onImageSelect('');
  }

  return (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <div className="mt-1 flex items-center space-x-4 p-2 border-2 border-dashed rounded-lg">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center overflow-hidden">
                {selectedImage ? (
                    <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                    <ImageIcon size={32} className="text-gray-400" />
                )}
            </div>
            <div className="flex flex-col space-y-2 items-start">
                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(true)}>
                    {selectedImage ? 'Change Image' : 'Select Image'}
                </Button>
                {selectedImage && (
                    <Button 
                        type="button" 
                        onClick={handleRemoveImage}
                        className="!bg-transparent !text-red-500 !shadow-none hover:!bg-red-50 dark:hover:!bg-red-900/50 !p-1 !text-xs"
                    >
                        <X size={14} className="mr-1" /> Remove
                    </Button>
                )}
            </div>
        </div>
        <ImageUploadModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onImageSelected={handleImageSelected}
        />
    </div>
  );
};

export default ImageUpload;