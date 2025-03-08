"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Type, StickyNote, Eraser, Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Annotation {
  id: string;
  type: "drawing" | "text" | "note";
  content: any;
  position?: { x: number; y: number };
  color: string;
}

interface AnnotationToolsProps {
  containerRef: React.RefObject<HTMLDivElement>;
  imageWidth: number;
  imageHeight: number;
  onSave?: (annotations: Annotation[]) => void;
}

export default function AnnotationTools({
  containerRef,
  imageWidth,
  imageHeight,
  onSave,
}: AnnotationToolsProps) {
  const [activeTool, setActiveTool] = useState<
    "drawing" | "text" | "note" | "eraser" | null
  >(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>(
    [],
  );
  const [color, setColor] = useState<string>("#ef4444"); // red-500
  const [isDrawing, setIsDrawing] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [textPosition, setTextPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [noteInput, setNoteInput] = useState("");
  const [notePosition, setNotePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = imageWidth;
    canvas.height = imageHeight;
    drawAnnotations();
  }, [imageWidth, imageHeight]);

  // Redraw when annotations change
  useEffect(() => {
    drawAnnotations();
  }, [annotations, currentPath]);

  // Focus text input when it appears
  useEffect(() => {
    if (textPosition && textInputRef.current) {
      textInputRef.current.focus();
    }
  }, [textPosition]);

  const drawAnnotations = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw existing annotations
    annotations.forEach((annotation) => {
      if (annotation.type === "drawing") {
        const path = annotation.content;
        if (path.length < 2) return;

        ctx.strokeStyle = annotation.color;
        ctx.lineWidth = 2;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);

        for (let i = 1; i < path.length; i++) {
          ctx.lineTo(path[i].x, path[i].y);
        }

        ctx.stroke();
      } else if (annotation.type === "text") {
        const { text, position } = annotation.content;

        ctx.font = "14px sans-serif";
        ctx.fillStyle = annotation.color;
        ctx.fillText(text, position.x, position.y);
      } else if (annotation.type === "note") {
        const { text, position } = annotation.content;

        // Draw note background
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.strokeStyle = annotation.color;
        ctx.lineWidth = 1;

        const noteWidth = Math.min(text.length * 7 + 20, 200);
        const noteHeight = 40;

        ctx.beginPath();
        ctx.roundRect(position.x, position.y, noteWidth, noteHeight, 5);
        ctx.fill();
        ctx.stroke();

        // Draw note text
        ctx.font = "12px sans-serif";
        ctx.fillStyle = "#000000";

        // Truncate text if too long
        let displayText = text;
        if (text.length > 25) {
          displayText = text.substring(0, 22) + "...";
        }

        ctx.fillText(displayText, position.x + 10, position.y + 25);
      }
    });

    // Draw current path
    if (currentPath.length > 1 && activeTool === "drawing") {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      ctx.beginPath();
      ctx.moveTo(currentPath[0].x, currentPath[0].y);

      for (let i = 1; i < currentPath.length; i++) {
        ctx.lineTo(currentPath[i].x, currentPath[i].y);
      }

      ctx.stroke();
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!activeTool) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeTool === "drawing") {
      setIsDrawing(true);
      setCurrentPath([{ x, y }]);
    } else if (activeTool === "text") {
      setTextPosition({ x, y });
    } else if (activeTool === "note") {
      setNotePosition({ x, y });
    } else if (activeTool === "eraser") {
      eraseAnnotationAt(x, y);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || activeTool !== "drawing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCurrentPath([...currentPath, { x, y }]);
  };

  const handleCanvasMouseUp = () => {
    if (activeTool === "drawing" && isDrawing && currentPath.length > 1) {
      const newAnnotation: Annotation = {
        id: Date.now().toString(),
        type: "drawing",
        content: currentPath,
        color,
      };

      setAnnotations([...annotations, newAnnotation]);
      setCurrentPath([]);
    }

    setIsDrawing(false);
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim() && textPosition) {
      const newAnnotation: Annotation = {
        id: Date.now().toString(),
        type: "text",
        content: {
          text: textInput,
          position: textPosition,
        },
        color,
      };

      setAnnotations([...annotations, newAnnotation]);
      setTextInput("");
      setTextPosition(null);
    }
  };

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (noteInput.trim() && notePosition) {
      const newAnnotation: Annotation = {
        id: Date.now().toString(),
        type: "note",
        content: {
          text: noteInput,
          position: notePosition,
        },
        color,
      };

      setAnnotations([...annotations, newAnnotation]);
      setNoteInput("");
      setNotePosition(null);
    }
  };

  const eraseAnnotationAt = (x: number, y: number) => {
    // Find and remove annotations near the click point
    const updatedAnnotations = annotations.filter((annotation) => {
      if (annotation.type === "drawing") {
        // For drawings, check if any point in the path is close to the click
        const path = annotation.content;
        for (let i = 0; i < path.length; i++) {
          const distance = Math.sqrt(
            Math.pow(path[i].x - x, 2) + Math.pow(path[i].y - y, 2),
          );
          if (distance < 10) return false; // Remove if within 10px
        }
      } else if (annotation.type === "text" || annotation.type === "note") {
        // For text and notes, check if the click is near the position
        const position = annotation.content.position;
        const distance = Math.sqrt(
          Math.pow(position.x - x, 2) + Math.pow(position.y - y, 2),
        );
        if (distance < 20) return false; // Remove if within 20px
      }
      return true;
    });

    setAnnotations(updatedAnnotations);
  };

  const clearAnnotations = () => {
    setAnnotations([]);
    setCurrentPath([]);
    setTextInput("");
    setTextPosition(null);
    setNoteInput("");
    setNotePosition(null);
    setActiveTool(null);
  };

  const saveAnnotations = () => {
    if (onSave) {
      onSave(annotations);
    }

    // Create a temporary canvas to combine the image and annotations
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = imageWidth;
    tempCanvas.height = imageHeight;
    const tempCtx = tempCanvas.getContext("2d");

    if (tempCtx && containerRef.current) {
      // Draw the image
      const image = containerRef.current.querySelector("img");
      if (image) {
        tempCtx.drawImage(image, 0, 0, imageWidth, imageHeight);
      }

      // Draw the annotations
      const canvas = canvasRef.current;
      if (canvas) {
        tempCtx.drawImage(canvas, 0, 0);
      }

      // Convert to data URL and trigger download
      const dataUrl = tempCanvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `annotated_xray_${new Date().toISOString().slice(0, 10)}.png`;
      link.click();
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 p-2 rounded-md">
        <Button
          variant={activeTool === "drawing" ? "default" : "ghost"}
          size="icon"
          onClick={() =>
            setActiveTool(activeTool === "drawing" ? null : "drawing")
          }
          title="Draw"
        >
          <Pencil className="h-4 w-4" />
        </Button>

        <Button
          variant={activeTool === "text" ? "default" : "ghost"}
          size="icon"
          onClick={() => setActiveTool(activeTool === "text" ? null : "text")}
          title="Add Text"
        >
          <Type className="h-4 w-4" />
        </Button>

        <Button
          variant={activeTool === "note" ? "default" : "ghost"}
          size="icon"
          onClick={() => setActiveTool(activeTool === "note" ? null : "note")}
          title="Add Note"
        >
          <StickyNote className="h-4 w-4" />
        </Button>

        <Button
          variant={activeTool === "eraser" ? "default" : "ghost"}
          size="icon"
          onClick={() =>
            setActiveTool(activeTool === "eraser" ? null : "eraser")
          }
          title="Erase"
        >
          <Eraser className="h-4 w-4" />
        </Button>

        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-6 h-6 p-0 border-0 rounded cursor-pointer"
          title="Select Color"
        />

        <Button
          variant="ghost"
          size="icon"
          onClick={clearAnnotations}
          title="Clear All Annotations"
        >
          <X className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={saveAnnotations}
          title="Save Annotated Image"
        >
          <Save className="h-4 w-4" />
        </Button>
      </div>

      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 pointer-events-auto"
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseUp}
        style={{ width: "100%", height: "100%" }}
      />

      {textPosition && (
        <div
          className="absolute z-20 bg-white dark:bg-gray-800 p-2 rounded shadow-md"
          style={{ left: textPosition.x, top: textPosition.y + 20 }}
        >
          <form onSubmit={handleTextSubmit} className="flex">
            <Input
              ref={textInputRef}
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Enter text"
              className="w-40 h-8 text-sm"
            />
            <Button type="submit" size="sm" className="ml-2 h-8">
              Add
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="ml-1 h-8"
              onClick={() => setTextPosition(null)}
            >
              <X className="h-3 w-3" />
            </Button>
          </form>
        </div>
      )}

      {notePosition && (
        <div
          className="absolute z-20 bg-white dark:bg-gray-800 p-2 rounded shadow-md"
          style={{ left: notePosition.x, top: notePosition.y + 20 }}
        >
          <form onSubmit={handleNoteSubmit} className="flex flex-col">
            <textarea
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="Enter note"
              className="w-48 h-20 text-sm p-2 border rounded"
            />
            <div className="flex justify-end mt-2">
              <Button type="submit" size="sm">
                Add
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="ml-1"
                onClick={() => setNotePosition(null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </form>
        </div>
      )}

      {activeTool && (
        <div className="absolute bottom-2 left-2 bg-white dark:bg-gray-800 text-xs p-2 rounded shadow z-20">
          {activeTool === "drawing" && <p>Click and drag to draw</p>}
          {activeTool === "text" && <p>Click where you want to add text</p>}
          {activeTool === "note" && <p>Click where you want to add a note</p>}
          {activeTool === "eraser" && <p>Click on annotations to erase them</p>}
        </div>
      )}
    </div>
  );
}
