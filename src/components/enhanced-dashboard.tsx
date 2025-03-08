"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FileText,
  Upload,
  History,
  BarChart,
  Layers,
  PanelLeft,
  PanelRight,
  Maximize2,
  Minimize2,
  SplitSquareVertical,
} from "lucide-react";
import UploadArea from "./upload-area";
import AnalysisResults from "./analysis-results";
import ComparisonTool from "./comparison-tool";
import PatientHistory from "./patient-history";
import VoiceDictation from "./voice-dictation";
import AIInsights from "./ai-insights";
import MeasurementTools from "./measurement-tools";
import AnnotationTools from "./annotation-tools";

interface Finding {
  condition: string;
  confidence: number;
  severity: string;
  location?: string;
  recommendation?: string;
  explanation?: string;
  references?: {
    title: string;
    url: string;
  }[];
}

interface AnalysisResult {
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
}

export default function EnhancedDashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [sidebarContent, setSidebarContent] = useState<
    "history" | "dictation" | "insights"
  >("history");
  const [activeImageTool, setActiveImageTool] = useState<
    "none" | "measure" | "annotate"
  >("none");
  const [fullscreen, setFullscreen] = useState(false);

  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handleFileSelected = (selectedFile: File) => {
    setFile(selectedFile);
    setResults(null); // Clear previous results
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsAnalyzing(true);

    // Simulate API call with timeout
    setTimeout(() => {
      // Mock results with enhanced data
      setResults({
        original_image: URL.createObjectURL(file),
        highlighted_image: URL.createObjectURL(file), // In a real app, this would be a processed image
        findings: [
          {
            condition: "Pneumonia",
            confidence: 0.92,
            severity: "Moderate",
            location: "Right lower lobe",
            recommendation:
              "Antibiotic therapy recommended. Follow-up scan in 2 weeks.",
            explanation:
              "The AI detected increased opacity in the right lower lobe with air bronchograms, which is highly suggestive of pneumonia. The pattern is consistent with bacterial pneumonia rather than viral, given the density and distribution.",
            references: [
              {
                title: "Radiographic patterns of pneumonia",
                url: "https://radiopaedia.org/articles/pneumonia",
              },
              {
                title: "Bacterial vs Viral Pneumonia",
                url: "https://www.ncbi.nlm.nih.gov/books/NBK513321/",
              },
            ],
          },
          {
            condition: "Pleural Effusion",
            confidence: 0.78,
            severity: "Mild",
            location: "Right hemithorax",
            recommendation:
              "Monitor for progression. Consider thoracentesis if symptoms worsen.",
            explanation:
              "A small amount of fluid is visible in the right costophrenic angle, consistent with a small pleural effusion. This is likely parapneumonic, associated with the pneumonic process in the right lower lobe.",
            references: [
              {
                title: "Pleural Effusion Imaging",
                url: "https://emedicine.medscape.com/article/355524-overview",
              },
            ],
          },
          {
            condition: "Atelectasis",
            confidence: 0.65,
            severity: "Mild",
            location: "Left lower lobe",
            recommendation:
              "Breathing exercises and incentive spirometry advised.",
            explanation:
              "There is subtle linear opacity at the left lung base with mild volume loss, suggesting subsegmental atelectasis. This is a common finding and may be positional or due to hypoventilation.",
          },
          {
            condition: "Cardiomegaly",
            confidence: 0.45,
            severity: "Minimal",
            location: "Cardiac silhouette",
            recommendation: "Cardiology consultation may be warranted.",
            explanation:
              "The cardiothoracic ratio is borderline enlarged at approximately 0.52 (normal <0.5). This may represent true cardiomegaly or could be due to technical factors such as AP projection or poor inspiration.",
          },
        ],
        summary:
          "The analysis indicates signs of moderate pneumonia in the right lower lobe with mild pleural effusion. There is also evidence of mild atelectasis in the left lower lobe. Minimal cardiomegaly is noted but requires clinical correlation.",
        patient_info: {
          id: "DEMO-12345",
          age: 58,
          gender: "Male",
        },
        scan_info: {
          date: new Date().toISOString().split("T")[0],
          type: "Chest X-Ray (PA and Lateral)",
          technician: "Demo System",
        },
      });

      setIsAnalyzing(false);
    }, 3000);
  };

  const generateReport = () => {
    // In a real app, this would generate a PDF report
    alert("PDF report generation would be implemented here");
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <Tabs defaultValue="single" className="mb-8">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="single" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Single Scan
          </TabsTrigger>
          <TabsTrigger
            value="batch"
            className="flex items-center gap-2"
            id="batch-tab"
          >
            <History className="h-4 w-4" />
            Batch Analysis
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="flex items-center gap-2"
            id="analytics-tab"
          >
            <BarChart className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="single" className="mt-6">
          <div className="flex gap-4">
            {/* Main Content */}
            <div
              className={`${showSidebar ? "w-3/4" : "w-full"} transition-all duration-300`}
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                  <Button
                    variant={
                      activeImageTool === "measure" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      setActiveImageTool(
                        activeImageTool === "measure" ? "none" : "measure",
                      )
                    }
                    className="flex items-center gap-1"
                  >
                    <Layers className="h-4 w-4" />
                    Measure
                  </Button>
                  <Button
                    variant={
                      activeImageTool === "annotate" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      setActiveImageTool(
                        activeImageTool === "annotate" ? "none" : "annotate",
                      )
                    }
                    className="flex items-center gap-1"
                  >
                    <SplitSquareVertical className="h-4 w-4" />
                    Annotate
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleSidebar}
                    className="flex items-center gap-1"
                  >
                    {showSidebar ? (
                      <PanelRight className="h-4 w-4" />
                    ) : (
                      <PanelLeft className="h-4 w-4" />
                    )}
                    {showSidebar ? "Hide" : "Show"} Sidebar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleFullscreen}
                    className="flex items-center gap-1"
                  >
                    {fullscreen ? (
                      <Minimize2 className="h-4 w-4" />
                    ) : (
                      <Maximize2 className="h-4 w-4" />
                    )}
                    {fullscreen ? "Exit Fullscreen" : "Fullscreen"}
                  </Button>
                </div>
              </div>

              <div
                className={`grid ${results ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"} gap-8`}
              >
                <div>
                  <div
                    className="bg-white dark:bg-gray-950 p-6 rounded-xl shadow-sm border mb-6"
                    id="upload-area"
                  >
                    <h2 className="text-xl font-semibold mb-4">
                      Upload X-Ray Image
                    </h2>
                    <UploadArea
                      onFileSelected={handleFileSelected}
                      isLoading={isAnalyzing}
                    />

                    {file && !isAnalyzing && !results && (
                      <Button onClick={handleAnalyze} className="w-full mt-4">
                        Analyze X-Ray
                      </Button>
                    )}
                  </div>

                  {results && (
                    <div className="mb-6">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full">
                            <SplitSquareVertical className="mr-2 h-4 w-4" />
                            Open Comparison Tool
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl w-[90vw]">
                          <DialogHeader>
                            <DialogTitle>Image Comparison</DialogTitle>
                          </DialogHeader>
                          <ComparisonTool
                            originalImage={results.original_image}
                            highlightedImage={results.highlighted_image}
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </div>

                {results ? (
                  <div
                    id="analysis-results"
                    className="relative"
                    ref={imageContainerRef}
                  >
                    <AnalysisResults
                      results={results}
                      onGenerateReport={generateReport}
                    />

                    {activeImageTool === "measure" &&
                      imageContainerRef.current && (
                        <MeasurementTools
                          containerRef={imageContainerRef}
                          imageWidth={500}
                          imageHeight={500}
                        />
                      )}

                    {activeImageTool === "annotate" &&
                      imageContainerRef.current && (
                        <AnnotationTools
                          containerRef={imageContainerRef}
                          imageWidth={500}
                          imageHeight={500}
                        />
                      )}
                  </div>
                ) : (
                  <div className="bg-white dark:bg-gray-950 p-6 rounded-xl shadow-sm border h-full flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-medium">
                        No Analysis Results
                      </h3>
                      <p className="mt-2">
                        Upload and analyze an X-ray to see results here
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            {showSidebar && (
              <div className="w-1/4 space-y-4">
                <div className="bg-white dark:bg-gray-950 p-4 rounded-xl shadow-sm border">
                  <Tabs defaultValue={sidebarContent}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger
                        value="history"
                        onClick={() => setSidebarContent("history")}
                      >
                        History
                      </TabsTrigger>
                      <TabsTrigger
                        value="dictation"
                        onClick={() => setSidebarContent("dictation")}
                      >
                        Dictation
                      </TabsTrigger>
                      <TabsTrigger
                        value="insights"
                        onClick={() => setSidebarContent("insights")}
                      >
                        Insights
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="history" className="mt-4">
                      <PatientHistory patientId="DEMO-12345" />
                    </TabsContent>

                    <TabsContent value="dictation" className="mt-4">
                      <VoiceDictation />
                    </TabsContent>

                    <TabsContent value="insights" className="mt-4">
                      {results ? (
                        <AIInsights
                          findings={results.findings}
                          summary={results.summary}
                        />
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <p>Analyze an X-ray to see AI insights</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="batch" className="mt-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Batch Analysis</h2>
            <p className="text-gray-500 mb-6">
              Upload multiple X-ray images for batch processing.
            </p>

            <div className="border-2 border-dashed rounded-lg p-8 text-center border-gray-300">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="p-4 bg-blue-100 rounded-full">
                  <Upload className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium">
                  Drag & drop multiple X-ray images
                </h3>
                <p className="text-sm text-gray-500 max-w-md">
                  Upload up to 50 images at once for batch processing. Results
                  will be available in the history tab.
                </p>
                <Button className="mt-4" variant="outline">
                  Select Files
                </Button>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Recent Batches</h3>
              <div className="rounded-md border">
                <div className="p-4 bg-gray-50 border-b">
                  <div className="grid grid-cols-4 gap-4 font-medium text-sm">
                    <div>Batch Name</div>
                    <div>Date</div>
                    <div>Status</div>
                    <div>Actions</div>
                  </div>
                </div>
                <div className="p-4 text-sm text-gray-500 text-center py-8">
                  No batch analysis history available
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Analytics Dashboard</h2>
            <p className="text-gray-500 mb-6">
              View statistics and trends from your analysis history.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="text-sm text-blue-600 mb-1">Total Scans</div>
                <div className="text-2xl font-bold">0</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <div className="text-sm text-green-600 mb-1">Completed</div>
                <div className="text-2xl font-bold">0</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <div className="text-sm text-purple-600 mb-1">
                  Avg. Processing Time
                </div>
                <div className="text-2xl font-bold">0s</div>
              </div>
            </div>

            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium">No Analytics Data</h3>
                <p className="mt-2">
                  Complete some analyses to see statistics and trends
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
