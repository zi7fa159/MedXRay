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
import { Calendar, Clock, FileText, TrendingUp, User } from "lucide-react";
import Image from "next/image";

interface ScanRecord {
  id: string;
  date: string;
  type: string;
  findings: string;
  imageUrl: string;
  severity: "normal" | "mild" | "moderate" | "severe";
}

interface PatientInfo {
  id: string;
  name: string;
  age: number;
  gender: string;
  medicalHistory?: string[];
  allergies?: string[];
}

interface PatientHistoryProps {
  patientId: string;
  currentScanId?: string;
  onSelectScan?: (scanId: string) => void;
}

export default function PatientHistory({
  patientId,
  currentScanId,
  onSelectScan,
}: PatientHistoryProps) {
  // Mock data - in a real app, this would come from an API
  const [patient] = useState<PatientInfo>({
    id: patientId,
    name: "John Doe",
    age: 58,
    gender: "Male",
    medicalHistory: [
      "Hypertension (diagnosed 2015)",
      "Type 2 Diabetes (diagnosed 2018)",
      "Pneumonia (2022)",
    ],
    allergies: ["Penicillin", "Sulfa drugs"],
  });

  const [scans] = useState<ScanRecord[]>([
    {
      id: "scan-001",
      date: "2024-05-23",
      type: "Chest X-Ray (PA and Lateral)",
      findings:
        "Moderate pneumonia in right lower lobe with mild pleural effusion",
      imageUrl:
        "https://images.unsplash.com/photo-1516069677018-378761110711?w=800&q=80",
      severity: "moderate",
    },
    {
      id: "scan-002",
      date: "2024-02-15",
      type: "Chest X-Ray (PA)",
      findings: "Mild cardiomegaly, no active pulmonary disease",
      imageUrl:
        "https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?w=800&q=80",
      severity: "mild",
    },
    {
      id: "scan-003",
      date: "2023-11-10",
      type: "Chest X-Ray (PA and Lateral)",
      findings: "Normal study, no significant findings",
      imageUrl:
        "https://images.unsplash.com/photo-1583911860205-72f8ac8ddcbe?w=800&q=80",
      severity: "normal",
    },
  ]);

  const handleSelectScan = (scanId: string) => {
    if (onSelectScan) {
      onSelectScan(scanId);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "normal":
        return "bg-green-100 text-green-800";
      case "mild":
        return "bg-yellow-100 text-yellow-800";
      case "moderate":
        return "bg-orange-100 text-orange-800";
      case "severe":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Patient History
        </CardTitle>
        <CardDescription>
          View previous scans and medical history for {patient.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="scans">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scans">Previous Scans</TabsTrigger>
            <TabsTrigger value="info">Patient Info</TabsTrigger>
          </TabsList>

          <TabsContent value="scans" className="space-y-4 mt-4">
            {scans.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No previous scans available
              </div>
            ) : (
              scans.map((scan) => (
                <div
                  key={scan.id}
                  className={`border rounded-lg overflow-hidden ${scan.id === currentScanId ? "ring-2 ring-blue-500" : ""}`}
                >
                  <div className="grid grid-cols-3 gap-4">
                    <div className="relative h-24">
                      <Image
                        src={scan.imageUrl}
                        alt={`Scan from ${scan.date}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="col-span-2 p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                            <Calendar className="h-3 w-3" />
                            <span>{scan.date}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <FileText className="h-3 w-3" />
                            <span>{scan.type}</span>
                          </div>
                        </div>
                        <div
                          className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(scan.severity)}`}
                        >
                          {scan.severity.charAt(0).toUpperCase() +
                            scan.severity.slice(1)}
                        </div>
                      </div>
                      <p className="text-sm mt-2 line-clamp-2">
                        {scan.findings}
                      </p>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-3 py-2 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSelectScan(scan.id)}
                    >
                      Compare
                    </Button>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="info" className="mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-500">
                    Patient ID
                  </div>
                  <div>{patient.id}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-500">Name</div>
                  <div>{patient.name}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-500">Age</div>
                  <div>{patient.age}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-500">
                    Gender
                  </div>
                  <div>{patient.gender}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-500">
                  Medical History
                </div>
                {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {patient.medicalHistory.map((item, index) => (
                      <li key={index} className="text-sm">
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-gray-500">
                    No medical history recorded
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-500">
                  Allergies
                </div>
                {patient.allergies && patient.allergies.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {patient.allergies.map((item, index) => (
                      <li key={index} className="text-sm">
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-gray-500">
                    No allergies recorded
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="flex items-center text-xs text-gray-500">
          <Clock className="h-3 w-3 mr-1" />
          Last updated: Today
        </div>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <TrendingUp className="h-3 w-3" />
          View Trends
        </Button>
      </CardFooter>
    </Card>
  );
}
