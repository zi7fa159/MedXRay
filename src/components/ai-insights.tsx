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
import {
  AlertCircle,
  Brain,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  HelpCircle,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Finding {
  condition: string;
  confidence: number;
  severity: string;
  location?: string;
  explanation?: string;
  references?: {
    title: string;
    url: string;
  }[];
}

interface AIInsightsProps {
  findings: Finding[];
  summary: string;
}

export default function AIInsights({ findings, summary }: AIInsightsProps) {
  const [showExplanations, setShowExplanations] = useState(true);

  // Sort findings by confidence
  const sortedFindings = [...findings].sort(
    (a, b) => b.confidence - a.confidence,
  );

  // Generate differential diagnosis based on findings
  const generateDifferentialDiagnosis = () => {
    // This would be more sophisticated in a real app
    const conditions = sortedFindings.map((f) => f.condition);

    if (conditions.includes("Pneumonia")) {
      return [
        {
          condition: "Bacterial Pneumonia",
          probability: "High",
          reasoning:
            "Consistent with consolidation pattern and clinical presentation",
        },
        {
          condition: "Viral Pneumonia",
          probability: "Moderate",
          reasoning: "Less likely given the density of infiltrates",
        },
        {
          condition: "Pulmonary Edema",
          probability: "Low",
          reasoning:
            "Some radiographic overlap, but distribution pattern differs",
        },
      ];
    } else if (conditions.includes("Pleural Effusion")) {
      return [
        {
          condition: "Parapneumonic Effusion",
          probability: "High",
          reasoning: "Associated with pneumonic process",
        },
        {
          condition: "Malignant Effusion",
          probability: "Low",
          reasoning: "No evidence of masses or nodules",
        },
        {
          condition: "Heart Failure",
          probability: "Moderate",
          reasoning: "Consider given cardiomegaly",
        },
      ];
    } else {
      return [
        {
          condition: "Atypical Infection",
          probability: "Moderate",
          reasoning: "Subtle infiltrates may represent atypical infection",
        },
        {
          condition: "Early Pneumonia",
          probability: "Moderate",
          reasoning: "May be early manifestation of infectious process",
        },
        {
          condition: "Normal Variant",
          probability: "Low",
          reasoning: "Findings may represent normal anatomical variants",
        },
      ];
    }
  };

  const differentialDiagnosis = generateDifferentialDiagnosis();

  // Generate follow-up recommendations
  const generateRecommendations = () => {
    const highConfidenceFindings = findings.filter((f) => f.confidence > 0.7);
    const recommendations = [];

    if (highConfidenceFindings.some((f) => f.condition === "Pneumonia")) {
      recommendations.push({
        title: "Follow-up Imaging",
        description: "Repeat chest X-ray in 4-6 weeks to confirm resolution",
        urgency: "Standard",
      });
    }

    if (
      highConfidenceFindings.some((f) => f.condition === "Pleural Effusion")
    ) {
      recommendations.push({
        title: "Additional Imaging",
        description:
          "Consider chest ultrasound or CT to better characterize effusion",
        urgency: "Soon",
      });
    }

    if (highConfidenceFindings.some((f) => f.condition === "Cardiomegaly")) {
      recommendations.push({
        title: "Cardiac Evaluation",
        description: "Echocardiogram recommended to assess cardiac function",
        urgency: "Standard",
      });
    }

    // Default recommendation if none of the above apply
    if (recommendations.length === 0) {
      recommendations.push({
        title: "Clinical Correlation",
        description: "Correlate with clinical findings and patient history",
        urgency: "Standard",
      });
    }

    return recommendations;
  };

  const recommendations = generateRecommendations();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-600" />
          AI Insights
        </CardTitle>
        <CardDescription>
          Advanced analysis and clinical decision support
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="explanation">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="explanation">
              <Lightbulb className="h-4 w-4 mr-2" />
              Explanations
            </TabsTrigger>
            <TabsTrigger value="differential">
              <Sparkles className="h-4 w-4 mr-2" />
              Differential
            </TabsTrigger>
            <TabsTrigger value="recommendations">
              <AlertCircle className="h-4 w-4 mr-2" />
              Follow-up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="explanation" className="mt-4 space-y-4">
            <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-md text-sm">
              <div className="font-medium mb-1 flex items-center gap-1">
                <HelpCircle className="h-4 w-4" />
                How to interpret AI explanations
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                The AI provides explanations for its findings based on
                radiographic patterns and medical knowledge. Confidence scores
                indicate the AI's certainty in each finding.
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {sortedFindings.map((finding, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex justify-between items-center w-full pr-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${finding.confidence > 0.8 ? "bg-green-500" : finding.confidence > 0.6 ? "bg-blue-500" : "bg-yellow-500"}`}
                        ></div>
                        <span>{finding.condition}</span>
                        <span className="text-sm text-gray-500">
                          ({finding.severity})
                        </span>
                      </div>
                      <div className="text-sm font-normal text-gray-500">
                        {Math.round(finding.confidence * 100)}% confidence
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-4 border-l-2 border-gray-200 ml-1 space-y-3">
                      {finding.explanation && (
                        <div>
                          <div className="text-sm font-medium mb-1">
                            AI Explanation:
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {finding.explanation}
                          </p>
                        </div>
                      )}

                      {finding.location && (
                        <div>
                          <div className="text-sm font-medium mb-1">
                            Location:
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {finding.location}
                          </p>
                        </div>
                      )}

                      {finding.references && finding.references.length > 0 && (
                        <div>
                          <div className="text-sm font-medium mb-1">
                            References:
                          </div>
                          <ul className="text-sm space-y-1">
                            {finding.references.map((ref, i) => (
                              <li key={i} className="flex items-center gap-1">
                                <ExternalLink className="h-3 w-3 text-blue-500" />
                                <a
                                  href={ref.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:underline"
                                >
                                  {ref.title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>

          <TabsContent value="differential" className="mt-4">
            <div className="space-y-4">
              <div className="bg-purple-50 dark:bg-purple-950 p-3 rounded-md text-sm">
                <div className="font-medium mb-1">Differential Diagnosis</div>
                <p className="text-gray-600 dark:text-gray-300">
                  Based on the radiographic findings, the AI suggests the
                  following differential diagnoses for consideration.
                </p>
              </div>

              <div className="space-y-3">
                {differentialDiagnosis.map((diagnosis, index) => (
                  <div key={index} className="border rounded-md p-3">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">{diagnosis.condition}</div>
                      <div
                        className={`text-xs px-2 py-1 rounded-full ${diagnosis.probability === "High" ? "bg-green-100 text-green-800" : diagnosis.probability === "Moderate" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`}
                      >
                        {diagnosis.probability} probability
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                      {diagnosis.reasoning}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-xs text-gray-500 italic">
                Note: This differential diagnosis is generated by AI and should
                be used as a clinical decision support tool only. Clinical
                correlation is required.
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="mt-4">
            <div className="space-y-4">
              <div className="bg-orange-50 dark:bg-orange-950 p-3 rounded-md text-sm">
                <div className="font-medium mb-1">
                  Follow-up Recommendations
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Based on the findings, the AI suggests the following follow-up
                  actions. These should be evaluated in the context of the
                  patient's clinical presentation.
                </p>
              </div>

              <div className="space-y-3">
                {recommendations.map((rec, index) => (
                  <div key={index} className="border rounded-md p-3">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">{rec.title}</div>
                      <div
                        className={`text-xs px-2 py-1 rounded-full ${rec.urgency === "Urgent" ? "bg-red-100 text-red-800" : rec.urgency === "Soon" ? "bg-orange-100 text-orange-800" : "bg-blue-100 text-blue-800"}`}
                      >
                        {rec.urgency}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                      {rec.description}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-xs text-gray-500 italic">
                Note: These recommendations are generated by AI and should be
                evaluated by a healthcare professional before implementation.
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-xs text-gray-500">
          AI analysis based on current radiographic findings
        </div>
        <Button variant="outline" size="sm">
          Export Insights
        </Button>
      </CardFooter>
    </Card>
  );
}
