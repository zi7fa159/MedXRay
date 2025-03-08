"use client";

import { Button } from "@/components/ui/button";
import { Download, FileText, Info, Printer, Share2 } from "lucide-react";
import Image from "next/image";
import { useState, useRef } from "react";
import ImageControls from "./image-controls";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface Finding {
  condition: string;
  confidence: number;
  severity: string;
  location?: string;
  recommendation?: string;
}

interface AnalysisResultsProps {
  results: {
    original_image: string;
    highlighted_image: string;
    findings: Finding[];
    summary: string;
    patient_info?: {
      id?: string;
      age?: number;
      gender?: string;
    };
    scan_info?: {
      date?: string;
      type?: string;
      technician?: string;
    };
  };
  onGenerateReport: () => void;
}

export default function AnalysisResults({
  results,
  onGenerateReport,
}: AnalysisResultsProps) {
  const [originalZoom, setOriginalZoom] = useState(1);
  const [highlightedZoom, setHighlightedZoom] = useState(1);
  const [originalRotation, setOriginalRotation] = useState(0);
  const [highlightedRotation, setHighlightedRotation] = useState(0);
  const [showOriginalGrid, setShowOriginalGrid] = useState(false);
  const [showHighlightedGrid, setShowHighlightedGrid] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  return (
    <div className="bg-white dark:bg-gray-950 p-6 rounded-xl shadow-sm border">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold">Analysis Results</h2>
        {results.patient_info && (
          <div className="bg-blue-50 px-3 py-2 rounded text-sm">
            <div>
              <strong>Patient ID:</strong> {results.patient_info.id}
            </div>
            <div>
              <strong>Age:</strong> {results.patient_info.age} |{" "}
              <strong>Gender:</strong> {results.patient_info.gender}
            </div>
            {results.scan_info?.date && (
              <div>
                <strong>Scan Date:</strong> {results.scan_info.date}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Original X-Ray
          </h3>
          <div className="relative aspect-square border rounded-lg overflow-hidden bg-black">
            <div
              className="w-full h-full relative"
              style={{
                transform: `scale(${originalZoom}) rotate(${originalRotation}deg)`,
                transition: "transform 0.2s ease",
              }}
            >
              <Image
                src={results.original_image}
                alt="Original X-Ray"
                fill
                className="object-contain"
                onClick={() => setFullscreenImage(results.original_image)}
              />
              {showOriginalGrid && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                    {[...Array(9)].map((_, i) => (
                      <div
                        key={i}
                        className="border border-blue-400 border-opacity-30"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <ImageControls
              onZoomChange={setOriginalZoom}
              onRotateChange={setOriginalRotation}
              onToggleFullscreen={() =>
                setFullscreenImage(results.original_image)
              }
              onToggleGrid={() => setShowOriginalGrid(!showOriginalGrid)}
            />
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Highlighted Areas
          </h3>
          <div className="relative aspect-square border rounded-lg overflow-hidden bg-black">
            <div
              className="w-full h-full relative"
              style={{
                transform: `scale(${highlightedZoom}) rotate(${highlightedRotation}deg)`,
                transition: "transform 0.2s ease",
              }}
            >
              <Image
                src={results.highlighted_image}
                alt="Highlighted X-Ray"
                fill
                className="object-contain"
                onClick={() => setFullscreenImage(results.highlighted_image)}
              />
              {showHighlightedGrid && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                    {[...Array(9)].map((_, i) => (
                      <div
                        key={i}
                        className="border border-blue-400 border-opacity-30"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <ImageControls
              onZoomChange={setHighlightedZoom}
              onRotateChange={setHighlightedRotation}
              onToggleFullscreen={() =>
                setFullscreenImage(results.highlighted_image)
              }
              onToggleGrid={() => setShowHighlightedGrid(!showHighlightedGrid)}
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Findings</h3>
        <div className="space-y-3">
          {results.findings.map((finding, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <span className="font-medium">{finding.condition}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({finding.severity})
                  </span>
                </div>
                <div className="w-24">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center">
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden flex-grow mr-1">
                            <div
                              className={`h-full ${finding.confidence > 0.8 ? "bg-green-600" : finding.confidence > 0.6 ? "bg-blue-600" : "bg-yellow-500"}`}
                              style={{ width: `${finding.confidence * 100}%` }}
                            ></div>
                          </div>
                          <Info className="h-3 w-3 text-gray-400" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-xs">
                          Confidence score of{" "}
                          {Math.round(finding.confidence * 100)}% indicates the
                          AI's certainty in this finding. Scores above 80% are
                          highly reliable, while scores below 60% may require
                          additional verification.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <div className="text-xs text-right mt-1">
                    {Math.round(finding.confidence * 100)}%
                  </div>
                </div>
              </div>
              {finding.location && (
                <div className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Location:</span>{" "}
                  {finding.location}
                </div>
              )}
              {finding.recommendation && (
                <div className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Recommendation:</span>{" "}
                  {finding.recommendation}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Summary</h3>
        <p className="text-gray-700 bg-blue-50 p-4 rounded-lg border border-blue-100">
          {results.summary}
        </p>
      </div>

      <div>
        {results.scan_info && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Scan Information</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Type:</span>{" "}
                {results.scan_info.type}
              </div>
              <div>
                <span className="text-gray-500">Date:</span>{" "}
                {results.scan_info.date}
              </div>
              <div>
                <span className="text-gray-500">Technician:</span>{" "}
                {results.scan_info.technician}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={onGenerateReport}
            className="flex-1"
            variant="outline"
          >
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
          <Button className="flex-1" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Save Results
          </Button>
          <Button className="flex-1" variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button className="flex-1" variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>

        {/* Fullscreen Image Dialog */}
        <Dialog
          open={!!fullscreenImage}
          onOpenChange={(open) => !open && setFullscreenImage(null)}
        >
          <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh] p-0 overflow-hidden bg-black">
            <div className="relative w-full h-[80vh]">
              {fullscreenImage && (
                <Image
                  src={fullscreenImage}
                  alt="X-Ray Fullscreen"
                  fill
                  className="object-contain"
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
