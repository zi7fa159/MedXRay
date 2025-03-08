"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FileText, Download, Printer, Settings } from "lucide-react";

interface Finding {
  condition: string;
  confidence: number;
  severity: string;
  location?: string;
  recommendation?: string;
}

interface ReportGeneratorProps {
  patientInfo?: {
    id?: string;
    name?: string;
    age?: number;
    gender?: string;
  };
  scanInfo?: {
    date?: string;
    type?: string;
    technician?: string;
  };
  findings: Finding[];
  summary: string;
  originalImage: string;
  highlightedImage: string;
}

export default function ReportGenerator({
  patientInfo,
  scanInfo,
  findings,
  summary,
  originalImage,
  highlightedImage,
}: ReportGeneratorProps) {
  const [reportSections, setReportSections] = useState({
    patientInfo: true,
    scanInfo: true,
    findings: true,
    images: true,
    summary: true,
    recommendations: true,
  });

  const [reportFormat, setReportFormat] = useState<"detailed" | "summary">(
    "detailed",
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = () => {
    setIsGenerating(true);

    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      alert(
        "Report generated successfully! In a real implementation, this would create a PDF.",
      );
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Report Generator
        </CardTitle>
        <CardDescription>
          Customize and generate a detailed report based on the analysis results
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="content">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="content">Report Content</TabsTrigger>
            <TabsTrigger value="format">Format Options</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="patient-info"
                    checked={reportSections.patientInfo}
                    onCheckedChange={(checked) =>
                      setReportSections({
                        ...reportSections,
                        patientInfo: !!checked,
                      })
                    }
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="patient-info"
                      className="text-sm font-medium"
                    >
                      Patient Information
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Include patient demographics and ID
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="scan-info"
                    checked={reportSections.scanInfo}
                    onCheckedChange={(checked) =>
                      setReportSections({
                        ...reportSections,
                        scanInfo: !!checked,
                      })
                    }
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="scan-info" className="text-sm font-medium">
                      Scan Information
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Include scan date, type, and technician
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="findings"
                    checked={reportSections.findings}
                    onCheckedChange={(checked) =>
                      setReportSections({
                        ...reportSections,
                        findings: !!checked,
                      })
                    }
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="findings" className="text-sm font-medium">
                      Detailed Findings
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Include all detected conditions with confidence scores
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="images"
                    checked={reportSections.images}
                    onCheckedChange={(checked) =>
                      setReportSections({
                        ...reportSections,
                        images: !!checked,
                      })
                    }
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="images" className="text-sm font-medium">
                      X-Ray Images
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Include original and highlighted X-ray images
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="summary"
                    checked={reportSections.summary}
                    onCheckedChange={(checked) =>
                      setReportSections({
                        ...reportSections,
                        summary: !!checked,
                      })
                    }
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="summary" className="text-sm font-medium">
                      Summary
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Include overall analysis summary
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="recommendations"
                    checked={reportSections.recommendations}
                    onCheckedChange={(checked) =>
                      setReportSections({
                        ...reportSections,
                        recommendations: !!checked,
                      })
                    }
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="recommendations"
                      className="text-sm font-medium"
                    >
                      Recommendations
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Include follow-up and treatment recommendations
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="format" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Report Format</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={`border rounded-lg p-4 cursor-pointer ${reportFormat === "detailed" ? "border-blue-500 bg-blue-50" : ""}`}
                    onClick={() => setReportFormat("detailed")}
                  >
                    <div className="font-medium mb-1">Detailed Report</div>
                    <p className="text-sm text-gray-500">
                      Comprehensive report with all selected sections and
                      detailed findings
                    </p>
                  </div>

                  <div
                    className={`border rounded-lg p-4 cursor-pointer ${reportFormat === "summary" ? "border-blue-500 bg-blue-50" : ""}`}
                    onClick={() => setReportFormat("summary")}
                  >
                    <div className="font-medium mb-1">Summary Report</div>
                    <p className="text-sm text-gray-500">
                      Condensed one-page report with key findings and summary
                      only
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Additional Options
                </Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="letterhead" />
                    <Label htmlFor="letterhead" className="text-sm">
                      Include hospital letterhead
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="signature" />
                    <Label htmlFor="signature" className="text-sm">
                      Include digital signature line
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="watermark" />
                    <Label htmlFor="watermark" className="text-sm">
                      Add "AI-Assisted" watermark
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Settings className="h-4 w-4" />
            Save Template
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            disabled={isGenerating}
          >
            <Printer className="h-4 w-4" />
            Print
          </Button>

          <Button
            variant="default"
            size="sm"
            className="flex items-center gap-1"
            onClick={handleGenerateReport}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Generate PDF
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
