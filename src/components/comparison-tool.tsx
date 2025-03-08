"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { ArrowLeft, ArrowRight, SplitSquareVertical } from "lucide-react";

interface ComparisonToolProps {
  originalImage: string;
  highlightedImage: string;
  referenceImages?: string[];
}

export default function ComparisonTool({
  originalImage,
  highlightedImage,
  referenceImages = [
    "https://images.unsplash.com/photo-1516069677018-378761110711?w=800&q=80",
    "https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?w=800&q=80",
  ],
}: ComparisonToolProps) {
  const [comparisonMode, setComparisonMode] = useState<
    "side-by-side" | "slider" | "reference"
  >("side-by-side");
  const [sliderPosition, setSliderPosition] = useState(50);
  const [currentReferenceIndex, setCurrentReferenceIndex] = useState(0);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  const nextReference = () => {
    setCurrentReferenceIndex((prev) =>
      prev === referenceImages.length - 1 ? 0 : prev + 1,
    );
  };

  const prevReference = () => {
    setCurrentReferenceIndex((prev) =>
      prev === 0 ? referenceImages.length - 1 : prev - 1,
    );
  };

  return (
    <div className="bg-white dark:bg-gray-950 p-6 rounded-xl shadow-sm border">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Image Comparison</h2>
        <Tabs
          value={comparisonMode}
          onValueChange={(v) => setComparisonMode(v as any)}
        >
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="side-by-side">Side by Side</TabsTrigger>
            <TabsTrigger value="slider">Slider</TabsTrigger>
            <TabsTrigger value="reference">Reference</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        {comparisonMode === "side-by-side" && (
          <div className="grid grid-cols-2 h-full">
            <div className="relative border-r border-white/20">
              <Image
                src={originalImage}
                alt="Original X-Ray"
                fill
                className="object-contain"
              />
            </div>
            <div className="relative">
              <Image
                src={highlightedImage}
                alt="Highlighted X-Ray"
                fill
                className="object-contain"
              />
            </div>
          </div>
        )}

        {comparisonMode === "slider" && (
          <div className="relative h-full">
            <div className="absolute inset-0">
              <Image
                src={originalImage}
                alt="Original X-Ray"
                fill
                className="object-contain"
              />
            </div>
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <Image
                src={highlightedImage}
                alt="Highlighted X-Ray"
                fill
                className="object-contain"
              />
            </div>
            <div
              className="absolute inset-y-0 w-1 bg-white cursor-ew-resize"
              style={{ left: `${sliderPosition}%` }}
            >
              <SplitSquareVertical className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 text-white bg-blue-600 rounded-full p-1" />
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={handleSliderChange}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/4 z-10"
            />
          </div>
        )}

        {comparisonMode === "reference" && (
          <div className="relative h-full">
            <div className="grid grid-cols-2 h-full">
              <div className="relative border-r border-white/20">
                <Image
                  src={originalImage}
                  alt="Original X-Ray"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="relative">
                <Image
                  src={referenceImages[currentReferenceIndex]}
                  alt="Reference X-Ray"
                  fill
                  className="object-contain"
                />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={prevReference}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-white text-sm bg-black/50 px-2 py-1 rounded">
                    Reference {currentReferenceIndex + 1} of{" "}
                    {referenceImages.length}
                  </span>
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={nextReference}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-500">
        {comparisonMode === "side-by-side" && (
          <p>
            Compare the original X-ray (left) with the AI-enhanced version
            (right).
          </p>
        )}
        {comparisonMode === "slider" && (
          <p>Drag the slider to reveal portions of the AI-enhanced image.</p>
        )}
        {comparisonMode === "reference" && (
          <p>Compare your X-ray with reference images of similar conditions.</p>
        )}
      </div>
    </div>
  );
}
