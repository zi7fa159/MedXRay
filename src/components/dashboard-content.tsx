"use client";

import { useState } from "react";
import UploadArea from "./upload-area";
import { Button } from "./ui/button";
import { FileText, Upload, History, BarChart } from "lucide-react";
import AnalysisResults from "./analysis-results";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Finding {
  condition: string;
  confidence: number;
  severity: string;
  location?: string;
  recommendation?: string;
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

export default function DashboardContent() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);

  const handleFileSelected = (selectedFile: File) => {
    setFile(selectedFile);
    setResults(null); // Clear previous results
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsAnalyzing(true);

    // Simulate API call with timeout
    setTimeout(() => {
      // Mock results
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
          },
          {
            condition: "Pleural Effusion",
            confidence: 0.78,
            severity: "Mild",
            location: "Right hemithorax",
            recommendation:
              "Monitor for progression. Consider thoracentesis if symptoms worsen.",
          },
          {
            condition: "Atelectasis",
            confidence: 0.65,
            severity: "Mild",
            location: "Left lower lobe",
            recommendation:
              "Breathing exercises and incentive spirometry advised.",
          },
          {
            condition: "Cardiomegaly",
            confidence: 0.45,
            severity: "Minimal",
            location: "Cardiac silhouette",
            recommendation: "Cardiology consultation may be warranted.",
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

  return (
    <div className="w-full max-w-6xl mx-auto">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
            </div>

            <div>
              {results ? (
                <div id="analysis-results">
                  <AnalysisResults
                    results={results}
                    onGenerateReport={generateReport}
                  />
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-950 p-6 rounded-xl shadow-sm border h-full flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium">No Analysis Results</h3>
                    <p className="mt-2">
                      Upload and analyze an X-ray to see results here
                    </p>
                  </div>
                </div>
              )}
            </div>
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
