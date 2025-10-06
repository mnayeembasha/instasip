import { useState, useRef } from 'react';

interface ImageZoomLensProps {
  src: string;
  alt: string;
  className?: string;
}

interface Position {
  x: number;
  y: number;
}

interface ImageDimensions {
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
}

const ImageZoomLens: React.FC<ImageZoomLensProps> = ({ src, alt, className = '' }) => {
  const [showLens, setShowLens] = useState<boolean>(false);
  const [lensPosition, setLensPosition] = useState<Position>({ x: 0, y: 0 });
  const [zoomPosition, setZoomPosition] = useState<Position>({ x: 0, y: 0 });
  const [imgDimensions, setImgDimensions] = useState<ImageDimensions>({ width: 0, height: 0, offsetX: 0, offsetY: 0 });
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const lensSize = 150; // Size of the magnifying lens
  const zoomLevel = 2.5; // Magnification level

  const calculateImageDimensions = () => {
    if (!imgRef.current || !containerRef.current) return;

    const img = imgRef.current;
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();

    const imgAspect = img.naturalWidth / img.naturalHeight;
    const containerAspect = containerRect.width / containerRect.height;

    let renderedWidth, renderedHeight, offsetX, offsetY;

    if (imgAspect > containerAspect) {
      // Image is wider - fit to width
      renderedWidth = containerRect.width;
      renderedHeight = containerRect.width / imgAspect;
      offsetX = 0;
      offsetY = (containerRect.height - renderedHeight) / 2;
    } else {
      // Image is taller - fit to height
      renderedHeight = containerRect.height;
      renderedWidth = containerRect.height * imgAspect;
      offsetX = (containerRect.width - renderedWidth) / 2;
      offsetY = 0;
    }

    setImgDimensions({ width: renderedWidth, height: renderedHeight, offsetX, offsetY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if cursor is over the actual image (not empty space)
    const { width, height, offsetX, offsetY } = imgDimensions;
    if (x < offsetX || x > offsetX + width || y < offsetY || y > offsetY + height) {
      setShowLens(false);
      return;
    }

    setShowLens(true);

    // Calculate lens position (centered on cursor)
    const lensX = Math.max(0, Math.min(x - lensSize / 2, rect.width - lensSize));
    const lensY = Math.max(0, Math.min(y - lensSize / 2, rect.height - lensSize));

    setLensPosition({ x: lensX, y: lensY });

    // Calculate zoom position relative to the actual image
    const relativeX = ((x - offsetX) / width) * 100;
    const relativeY = ((y - offsetY) / height) * 100;

    setZoomPosition({ x: relativeX, y: relativeY });
  };

  const handleMouseEnter = () => {
    if (imgRef.current && imgRef.current.complete) {
      calculateImageDimensions();
    }
  };

  const handleMouseLeave = () => {
    setShowLens(false);
  };

  const handleImageLoad = () => {
    calculateImageDimensions();
  };

  return (
    <div
      ref={containerRef}
      className={`relative cursor-crosshair ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="max-w-full max-h-full object-contain rounded-xl"
        onLoad={handleImageLoad}
      />

      {/* Magnifying Lens */}
      {showLens && (
        <div
          className="absolute border-4 border-gray-300 rounded-full pointer-events-none shadow-2xl bg-white"
          style={{
            width: `${lensSize}px`,
            height: `${lensSize}px`,
            left: `${lensPosition.x}px`,
            top: `${lensPosition.y}px`,
            backgroundImage: `url(${src})`,
            backgroundSize: `${(imgDimensions.width * zoomLevel)}px ${(imgDimensions.height * zoomLevel)}px`,
            // backgroundPosition: `${-(zoomPosition.x / 100 * imgDimensions.width * zoomLevel - lensSize / 2 + imgDimensions.offsetX * (zoomLevel - 1))}px ${-(zoomPosition.y / 100 * imgDimensions.height * zoomLevel - lensSize / 2 + imgDimensions.offsetY * (zoomLevel - 1))}px`,
                        backgroundPosition: `${-(zoomPosition.x / 100 * imgDimensions.width * zoomLevel - lensSize / 2)}px ${-(zoomPosition.y / 100 * imgDimensions.height * zoomLevel - lensSize / 2)}px`,
            backgroundRepeat: 'no-repeat',
            opacity: 0.98,
            transition: 'opacity 0.15s ease-out',
          }}
        />
      )}

      {/* Overlay hint */}
      {!showLens && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-gray-900 bg-opacity-75 px-4 py-2 rounded-full text-sm font-medium text-white backdrop-blur-sm">
            🔍 Hover to zoom
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageZoomLens;