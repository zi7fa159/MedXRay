"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ZoomIn, ZoomOut, RotateCw, Maximize, Grid } from "lucide-react";

interface ImageControlsProps {
  onZoomChange: (zoom: number) => void;
  onRotateChange: (rotation: number) => void;
  onToggleFullscreen: () => void;
  onToggleGrid: () => void;
}

export default function ImageControls({
  onZoomChange,
  onRotateChange,
  onToggleFullscreen,
  onToggleGrid,
}: ImageControlsProps) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  const handleZoomChange = (value: number[]) => {
    const newZoom = value[0];
    setZoom(newZoom);
    onZoomChange(newZoom / 100);
  };

  const handleRotate = () => {
    const newRotation = (rotation + 90) % 360;
    setRotation(newRotation);
    onRotateChange(newRotation);
  };

  return (
    <div className="flex flex-col space-y-2" id="image-controls">
      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 p-2 rounded-md">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            if (zoom > 50) {
              const newZoom = zoom - 10;
              setZoom(newZoom);
              onZoomChange(newZoom / 100);
            }
          }}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>

        <Slider
          value={[zoom]}
          min={50}
          max={200}
          step={10}
          onValueChange={handleZoomChange}
          className="w-24 mx-2"
        />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            if (zoom < 200) {
              const newZoom = zoom + 10;
              setZoom(newZoom);
              onZoomChange(newZoom / 100);
            }
          }}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>

        <div className="text-xs text-gray-500 w-10 text-center">{zoom}%</div>

        <Button variant="ghost" size="icon" onClick={handleRotate}>
          <RotateCw className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="icon" onClick={onToggleGrid}>
          <Grid className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="icon" onClick={onToggleFullscreen}>
          <Maximize className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
