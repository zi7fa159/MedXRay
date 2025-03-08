"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Ruler, Circle, Triangle, X, Move } from "lucide-react";

interface Point {
  x: number;
  y: number;
}

interface Measurement {
  type: "distance" | "angle" | "area";
  points: Point[];
  value: number;
  unit: string;
}

interface MeasurementToolsProps {
  containerRef: React.RefObject<HTMLDivElement>;
  imageWidth: number;
  imageHeight: number;
  pixelRatio?: number; // mm per pixel
}

export default function MeasurementTools({
  containerRef,
  imageWidth,
  imageHeight,
  pixelRatio = 0.2, // default 0.2mm per pixel (approximate for chest X-rays)
}: MeasurementToolsProps) {
  const [activeTool, setActiveTool] = useState<
    "distance" | "angle" | "area" | null
  >(null);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = imageWidth;
    canvas.height = imageHeight;
    drawMeasurements();
  }, [imageWidth, imageHeight]);

  // Redraw when measurements change
  useEffect(() => {
    drawMeasurements();
  }, [measurements, currentPoints]);

  const drawMeasurements = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw existing measurements
    measurements.forEach((measurement) => {
      ctx.strokeStyle = "#3b82f6"; // blue-500
      ctx.lineWidth = 2;
      ctx.fillStyle = "rgba(59, 130, 246, 0.5)"; // blue-500 with opacity

      if (measurement.type === "distance") {
        // Draw line
        ctx.beginPath();
        ctx.moveTo(measurement.points[0].x, measurement.points[0].y);
        ctx.lineTo(measurement.points[1].x, measurement.points[1].y);
        ctx.stroke();

        // Draw points
        measurement.points.forEach((point) => {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
          ctx.fill();
        });

        // Draw measurement text
        const midX = (measurement.points[0].x + measurement.points[1].x) / 2;
        const midY = (measurement.points[0].y + measurement.points[1].y) / 2;
        ctx.fillStyle = "white";
        ctx.strokeStyle = "#1e40af"; // blue-800
        ctx.lineWidth = 3;
        ctx.font = "12px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const text = `${measurement.value.toFixed(1)} ${measurement.unit}`;
        ctx.strokeText(text, midX, midY - 10);
        ctx.fillText(text, midX, midY - 10);
      } else if (measurement.type === "angle") {
        // Draw lines
        ctx.beginPath();
        ctx.moveTo(measurement.points[1].x, measurement.points[1].y);
        ctx.lineTo(measurement.points[0].x, measurement.points[0].y);
        ctx.lineTo(measurement.points[2].x, measurement.points[2].y);
        ctx.stroke();

        // Draw points
        measurement.points.forEach((point) => {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
          ctx.fill();
        });

        // Draw angle arc
        const angle = measurement.value;
        const radius = 20;
        const startAngle = Math.atan2(
          measurement.points[0].y - measurement.points[1].y,
          measurement.points[0].x - measurement.points[1].x,
        );
        const endAngle = Math.atan2(
          measurement.points[2].y - measurement.points[1].y,
          measurement.points[2].x - measurement.points[1].x,
        );

        ctx.beginPath();
        ctx.arc(
          measurement.points[1].x,
          measurement.points[1].y,
          radius,
          startAngle,
          endAngle,
        );
        ctx.stroke();

        // Draw measurement text
        ctx.fillStyle = "white";
        ctx.strokeStyle = "#1e40af"; // blue-800
        ctx.lineWidth = 3;
        ctx.font = "12px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const text = `${angle.toFixed(1)}°`;
        ctx.strokeText(
          text,
          measurement.points[1].x +
            radius * Math.cos((startAngle + endAngle) / 2),
          measurement.points[1].y +
            radius * Math.sin((startAngle + endAngle) / 2),
        );
        ctx.fillText(
          text,
          measurement.points[1].x +
            radius * Math.cos((startAngle + endAngle) / 2),
          measurement.points[1].y +
            radius * Math.sin((startAngle + endAngle) / 2),
        );
      } else if (measurement.type === "area") {
        // Draw polygon
        ctx.beginPath();
        ctx.moveTo(measurement.points[0].x, measurement.points[0].y);
        for (let i = 1; i < measurement.points.length; i++) {
          ctx.lineTo(measurement.points[i].x, measurement.points[i].y);
        }
        ctx.closePath();
        ctx.fillStyle = "rgba(59, 130, 246, 0.2)"; // blue-500 with opacity
        ctx.fill();
        ctx.stroke();

        // Draw points
        measurement.points.forEach((point) => {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(59, 130, 246, 0.5)";
          ctx.fill();
        });

        // Calculate centroid
        let centroidX = 0;
        let centroidY = 0;
        measurement.points.forEach((point) => {
          centroidX += point.x;
          centroidY += point.y;
        });
        centroidX /= measurement.points.length;
        centroidY /= measurement.points.length;

        // Draw measurement text
        ctx.fillStyle = "white";
        ctx.strokeStyle = "#1e40af"; // blue-800
        ctx.lineWidth = 3;
        ctx.font = "12px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const text = `${measurement.value.toFixed(1)} ${measurement.unit}`;
        ctx.strokeText(text, centroidX, centroidY);
        ctx.fillText(text, centroidX, centroidY);
      }
    });

    // Draw current measurement in progress
    if (currentPoints.length > 0 && activeTool) {
      ctx.strokeStyle = "#ef4444"; // red-500
      ctx.lineWidth = 2;
      ctx.fillStyle = "rgba(239, 68, 68, 0.5)"; // red-500 with opacity

      // Draw points
      currentPoints.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      if (activeTool === "distance" && currentPoints.length === 1) {
        // Draw line from first point to mouse position
        const container = containerRef.current;
        if (container) {
          const rect = container.getBoundingClientRect();
          const mouseX = container.offsetWidth / 2;
          const mouseY = container.offsetHeight / 2;

          ctx.beginPath();
          ctx.moveTo(currentPoints[0].x, currentPoints[0].y);
          ctx.lineTo(mouseX, mouseY);
          ctx.stroke();
        }
      } else if (activeTool === "distance" && currentPoints.length === 2) {
        // Draw completed line
        ctx.beginPath();
        ctx.moveTo(currentPoints[0].x, currentPoints[0].y);
        ctx.lineTo(currentPoints[1].x, currentPoints[1].y);
        ctx.stroke();
      } else if (activeTool === "angle") {
        if (currentPoints.length === 2) {
          // Draw first line
          ctx.beginPath();
          ctx.moveTo(currentPoints[1].x, currentPoints[1].y);
          ctx.lineTo(currentPoints[0].x, currentPoints[0].y);
          ctx.stroke();

          // Draw line from vertex to mouse position
          const container = containerRef.current;
          if (container) {
            const rect = container.getBoundingClientRect();
            const mouseX = container.offsetWidth / 2;
            const mouseY = container.offsetHeight / 2;

            ctx.beginPath();
            ctx.moveTo(currentPoints[1].x, currentPoints[1].y);
            ctx.lineTo(mouseX, mouseY);
            ctx.stroke();
          }
        } else if (currentPoints.length === 3) {
          // Draw completed angle
          ctx.beginPath();
          ctx.moveTo(currentPoints[1].x, currentPoints[1].y);
          ctx.lineTo(currentPoints[0].x, currentPoints[0].y);
          ctx.moveTo(currentPoints[1].x, currentPoints[1].y);
          ctx.lineTo(currentPoints[2].x, currentPoints[2].y);
          ctx.stroke();
        }
      } else if (activeTool === "area") {
        // Draw polygon
        ctx.beginPath();
        ctx.moveTo(currentPoints[0].x, currentPoints[0].y);
        for (let i = 1; i < currentPoints.length; i++) {
          ctx.lineTo(currentPoints[i].x, currentPoints[i].y);
        }

        // Draw line from last point to first point if more than 2 points
        if (currentPoints.length > 2) {
          ctx.lineTo(currentPoints[0].x, currentPoints[0].y);
        }

        // Draw line from last point to mouse position
        const container = containerRef.current;
        if (container && currentPoints.length > 0) {
          const rect = container.getBoundingClientRect();
          const mouseX = container.offsetWidth / 2;
          const mouseY = container.offsetHeight / 2;

          ctx.lineTo(mouseX, mouseY);
          ctx.lineTo(currentPoints[0].x, currentPoints[0].y);
        }

        ctx.fillStyle = "rgba(239, 68, 68, 0.2)"; // red-500 with opacity
        ctx.fill();
        ctx.stroke();
      }
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!activeTool) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking near an existing point for dragging
    for (let i = 0; i < measurements.length; i++) {
      const measurement = measurements[i];
      for (let j = 0; j < measurement.points.length; j++) {
        const point = measurement.points[j];
        const distance = Math.sqrt(
          Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2),
        );
        if (distance < 10) {
          // 10px threshold for clicking on a point
          setIsDragging(true);
          setDragIndex(i);
          return;
        }
      }
    }

    // Add point to current measurement
    const newPoint = { x, y };
    const newPoints = [...currentPoints, newPoint];
    setCurrentPoints(newPoints);

    // Complete measurement based on tool type
    if (activeTool === "distance" && newPoints.length === 2) {
      const distance = calculateDistance(newPoints[0], newPoints[1]);
      const realDistance = distance * pixelRatio; // Convert to mm
      const newMeasurement: Measurement = {
        type: "distance",
        points: newPoints,
        value: realDistance,
        unit: "mm",
      };
      setMeasurements([...measurements, newMeasurement]);
      setCurrentPoints([]);
    } else if (activeTool === "angle" && newPoints.length === 3) {
      const angle = calculateAngle(newPoints[0], newPoints[1], newPoints[2]);
      const newMeasurement: Measurement = {
        type: "angle",
        points: newPoints,
        value: angle,
        unit: "°",
      };
      setMeasurements([...measurements, newMeasurement]);
      setCurrentPoints([]);
    } else if (activeTool === "area" && newPoints.length >= 3) {
      // Check if clicking near the first point to close the polygon
      const firstPoint = newPoints[0];
      const lastPoint = newPoints[newPoints.length - 1];
      const distance = Math.sqrt(
        Math.pow(firstPoint.x - lastPoint.x, 2) +
          Math.pow(firstPoint.y - lastPoint.y, 2),
      );

      if (distance < 20 || newPoints.length >= 10) {
        // Close if near first point or max points reached
        // Replace last point with first point to close perfectly
        newPoints.pop();
        const area = calculateArea(newPoints);
        const realArea = area * pixelRatio * pixelRatio; // Convert to mm²
        const newMeasurement: Measurement = {
          type: "area",
          points: newPoints,
          value: realArea,
          unit: "mm²",
        };
        setMeasurements([...measurements, newMeasurement]);
        setCurrentPoints([]);
      }
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging && dragIndex !== null) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update the dragged point
      const updatedMeasurements = [...measurements];
      const measurement = updatedMeasurements[dragIndex];

      // Find the closest point to drag
      let closestPointIndex = 0;
      let minDistance = Infinity;

      for (let i = 0; i < measurement.points.length; i++) {
        const point = measurement.points[i];
        const distance = Math.sqrt(
          Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2),
        );
        if (distance < minDistance) {
          minDistance = distance;
          closestPointIndex = i;
        }
      }

      // Update the point
      measurement.points[closestPointIndex] = { x, y };

      // Recalculate measurement value
      if (measurement.type === "distance") {
        const distance = calculateDistance(
          measurement.points[0],
          measurement.points[1],
        );
        measurement.value = distance * pixelRatio;
      } else if (measurement.type === "angle") {
        const angle = calculateAngle(
          measurement.points[0],
          measurement.points[1],
          measurement.points[2],
        );
        measurement.value = angle;
      } else if (measurement.type === "area") {
        const area = calculateArea(measurement.points);
        measurement.value = area * pixelRatio * pixelRatio;
      }

      setMeasurements(updatedMeasurements);
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
    setDragIndex(null);
  };

  const calculateDistance = (p1: Point, p2: Point) => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  };

  const calculateAngle = (p1: Point, vertex: Point, p2: Point) => {
    const angle1 = Math.atan2(p1.y - vertex.y, p1.x - vertex.x);
    const angle2 = Math.atan2(p2.y - vertex.y, p2.x - vertex.x);
    let angle = Math.abs((angle1 - angle2) * (180 / Math.PI));
    if (angle > 180) angle = 360 - angle;
    return angle;
  };

  const calculateArea = (points: Point[]) => {
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += points[i].x * points[j].y;
      area -= points[j].x * points[i].y;
    }
    return Math.abs(area / 2);
  };

  const clearMeasurements = () => {
    setMeasurements([]);
    setCurrentPoints([]);
    setActiveTool(null);
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 p-2 rounded-md">
        <Button
          variant={activeTool === "distance" ? "default" : "ghost"}
          size="icon"
          onClick={() => {
            setActiveTool(activeTool === "distance" ? null : "distance");
            setCurrentPoints([]);
          }}
          title="Measure Distance"
        >
          <Ruler className="h-4 w-4" />
        </Button>

        <Button
          variant={activeTool === "angle" ? "default" : "ghost"}
          size="icon"
          onClick={() => {
            setActiveTool(activeTool === "angle" ? null : "angle");
            setCurrentPoints([]);
          }}
          title="Measure Angle"
        >
          <Triangle className="h-4 w-4" />
        </Button>

        <Button
          variant={activeTool === "area" ? "default" : "ghost"}
          size="icon"
          onClick={() => {
            setActiveTool(activeTool === "area" ? null : "area");
            setCurrentPoints([]);
          }}
          title="Measure Area"
        >
          <Circle className="h-4 w-4" />
        </Button>

        <Button
          variant={isDragging ? "default" : "ghost"}
          size="icon"
          onClick={() => {
            setIsDragging(!isDragging);
            setActiveTool(null);
            setCurrentPoints([]);
          }}
          title="Move Points"
        >
          <Move className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={clearMeasurements}
          title="Clear All Measurements"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 pointer-events-auto"
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseUp}
        style={{ width: "100%", height: "100%" }}
      />

      {activeTool && (
        <div className="absolute bottom-2 left-2 bg-white dark:bg-gray-800 text-xs p-2 rounded shadow z-20">
          {activeTool === "distance" && (
            <p>Click to set start and end points of the measurement</p>
          )}
          {activeTool === "angle" && (
            <p>Click to set first point, then vertex, then second point</p>
          )}
          {activeTool === "area" && (
            <p>
              Click to add points, click near first point to close the shape
            </p>
          )}
        </div>
      )}
    </div>
  );
}
