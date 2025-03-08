"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface TourStep {
  target: string;
  title: string;
  content: string;
  position: "top" | "right" | "bottom" | "left";
}

const tourSteps: TourStep[] = [
  {
    target: "#upload-area",
    title: "Upload X-Ray Images",
    content: "Drag and drop or select X-ray images to upload for AI analysis.",
    position: "right",
  },
  {
    target: "#analysis-results",
    title: "View Analysis Results",
    content:
      "After processing, view detailed findings and AI-detected abnormalities here.",
    position: "left",
  },
  {
    target: "#image-controls",
    title: "Image Controls",
    content:
      "Use these controls to zoom, rotate, and enhance your view of the X-ray images.",
    position: "top",
  },
  {
    target: "#batch-tab",
    title: "Batch Processing",
    content:
      "Process multiple X-rays at once for efficient workflow management.",
    position: "bottom",
  },
  {
    target: "#analytics-tab",
    title: "Analytics Dashboard",
    content:
      "Track usage statistics and view trends from your analysis history.",
    position: "bottom",
  },
];

export default function GuidedTour() {
  const [showTour, setShowTour] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [tooltipStyle, setTooltipStyle] = useState({});

  useEffect(() => {
    // Check if this is the user's first visit
    const hasSeenTour = localStorage.getItem("hasSeenTour");
    if (!hasSeenTour) {
      setShowTour(true);
    }
  }, []);

  useEffect(() => {
    if (showTour && currentStep < tourSteps.length) {
      positionTooltip();
    }
  }, [showTour, currentStep]);

  const positionTooltip = () => {
    const step = tourSteps[currentStep];
    const targetElement = document.querySelector(step.target);

    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      const tooltipWidth = 300;
      const tooltipHeight = 150;
      const margin = 10;

      let top, left;

      switch (step.position) {
        case "top":
          top = rect.top - tooltipHeight - margin;
          left = rect.left + rect.width / 2 - tooltipWidth / 2;
          break;
        case "right":
          top = rect.top + rect.height / 2 - tooltipHeight / 2;
          left = rect.right + margin;
          break;
        case "bottom":
          top = rect.bottom + margin;
          left = rect.left + rect.width / 2 - tooltipWidth / 2;
          break;
        case "left":
          top = rect.top + rect.height / 2 - tooltipHeight / 2;
          left = rect.left - tooltipWidth - margin;
          break;
      }

      // Ensure tooltip stays within viewport
      if (left < 0) left = margin;
      if (left + tooltipWidth > window.innerWidth)
        left = window.innerWidth - tooltipWidth - margin;
      if (top < 0) top = margin;
      if (top + tooltipHeight > window.innerHeight)
        top = window.innerHeight - tooltipHeight - margin;

      setTooltipStyle({
        top: `${top}px`,
        left: `${left}px`,
        width: `${tooltipWidth}px`,
      });

      // Highlight the target element
      targetElement.classList.add("ring-2", "ring-blue-500", "ring-offset-2");

      return () => {
        targetElement.classList.remove(
          "ring-2",
          "ring-blue-500",
          "ring-offset-2",
        );
      };
    }
  };

  const nextStep = () => {
    const step = tourSteps[currentStep];
    const targetElement = document.querySelector(step.target);
    if (targetElement) {
      targetElement.classList.remove(
        "ring-2",
        "ring-blue-500",
        "ring-offset-2",
      );
    }

    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      endTour();
    }
  };

  const prevStep = () => {
    const step = tourSteps[currentStep];
    const targetElement = document.querySelector(step.target);
    if (targetElement) {
      targetElement.classList.remove(
        "ring-2",
        "ring-blue-500",
        "ring-offset-2",
      );
    }

    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const endTour = () => {
    const step = tourSteps[currentStep];
    const targetElement = document.querySelector(step.target);
    if (targetElement) {
      targetElement.classList.remove(
        "ring-2",
        "ring-blue-500",
        "ring-offset-2",
      );
    }

    setShowTour(false);
    localStorage.setItem("hasSeenTour", "true");
  };

  if (!showTour) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50"
        onClick={() => {
          setCurrentStep(0);
          setShowTour(true);
        }}
      >
        Start Tour
      </Button>
    );
  }

  const currentTourStep = tourSteps[currentStep];

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={endTour}
      />
      <div
        className="fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 animate-in fade-in slide-in-from-bottom-4"
        style={tooltipStyle}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2"
          onClick={endTour}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="mb-4">
          <h3 className="font-bold text-lg">{currentTourStep.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {currentTourStep.content}
          </p>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Step {currentStep + 1} of {tourSteps.length}
          </div>
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button variant="outline" size="sm" onClick={prevStep}>
                Previous
              </Button>
            )}
            {currentStep < tourSteps.length - 1 ? (
              <Button size="sm" onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button size="sm" onClick={endTour}>
                Finish
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
