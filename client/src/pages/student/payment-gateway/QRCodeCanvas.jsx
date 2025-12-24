import { useEffect, useRef } from "react";

export default function QRCodeCanvas({ value, size = 200 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    // Simple QR code-like pattern generator
    const generateQRPattern = () => {
      const moduleCount = 25; // Grid size
      const moduleSize = size / moduleCount;
      
      // Clear canvas
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);
      
      // Generate pattern based on value
      const hash = value.split("").reduce((acc, char) => {
        return acc + char.charCodeAt(0);
      }, 0);
      
      // Set black for modules
      ctx.fillStyle = "#000000";
      
      // Position markers (corners)
      const drawPositionMarker = (x, y) => {
        // Outer square
        ctx.fillRect(x * moduleSize, y * moduleSize, 7 * moduleSize, 7 * moduleSize);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect((x + 1) * moduleSize, (y + 1) * moduleSize, 5 * moduleSize, 5 * moduleSize);
        ctx.fillStyle = "#000000";
        ctx.fillRect((x + 2) * moduleSize, (y + 2) * moduleSize, 3 * moduleSize, 3 * moduleSize);
      };
      
      // Draw position markers
      drawPositionMarker(0, 0); // Top-left
      drawPositionMarker(moduleCount - 7, 0); // Top-right
      drawPositionMarker(0, moduleCount - 7); // Bottom-left
      
      // Generate data pattern
      let seed = hash;
      const random = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
      };
      
      // Fill in data modules
      for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
          // Skip position markers
          if (
            (row < 8 && col < 8) ||
            (row < 8 && col >= moduleCount - 8) ||
            (row >= moduleCount - 8 && col < 8)
          ) {
            continue;
          }
          
          // Randomly fill based on hash
          if (random() > 0.5) {
            ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize);
          }
        }
      }
    };
    
    generateQRPattern();
  }, [value, size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="border-4 border-gray-200 dark:border-gray-700 rounded-lg"
    />
  );
}
