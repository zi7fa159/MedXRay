"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, MicOff, Save, Copy, Trash } from "lucide-react";

interface VoiceDictationProps {
  onSave?: (text: string) => void;
  placeholder?: string;
  initialText?: string;
}

export default function VoiceDictation({
  onSave,
  placeholder = "Dictate your findings or notes here...",
  initialText = "",
}: VoiceDictationProps) {
  const [text, setText] = useState(initialText);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any | null>(null);
  const [supported, setSupported] = useState(true);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check if browser supports speech recognition
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = "en-US";

        recognitionInstance.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map((result) => result[0])
            .map((result) => result.transcript)
            .join("");

          setText((prev) => {
            // Only update if we have a new transcript
            if (transcript && transcript !== prev) {
              return prev + " " + transcript;
            }
            return prev;
          });
        };

        recognitionInstance.onerror = (event) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };

        setRecognition(recognitionInstance);
      } else {
        setSupported(false);
      }
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }

    setIsListening(!isListening);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(text);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  const handleClear = () => {
    setText("");
  };

  // Add medical terminology to text
  const addMedicalTerm = (term: string) => {
    setText((prev) => prev + " " + term);
  };

  // Common medical terms for quick insertion
  const commonTerms = [
    "pneumonia",
    "cardiomegaly",
    "pleural effusion",
    "atelectasis",
    "pneumothorax",
    "consolidation",
    "infiltrate",
    "nodule",
    "opacity",
    "edema",
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Voice Dictation</h3>
        <div className="flex items-center gap-2">
          {supported ? (
            <Button
              onClick={toggleListening}
              variant={isListening ? "destructive" : "default"}
              size="sm"
              className="flex items-center gap-1"
            >
              {isListening ? (
                <>
                  <MicOff className="h-4 w-4" /> Stop
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4" /> Start
                </>
              )}
            </Button>
          ) : (
            <div className="text-sm text-red-500">
              Speech recognition not supported in this browser
            </div>
          )}
        </div>
      </div>

      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        className="min-h-[200px]"
      />

      <div className="flex flex-wrap gap-2">
        {commonTerms.map((term) => (
          <Button
            key={term}
            variant="outline"
            size="sm"
            onClick={() => addMedicalTerm(term)}
          >
            {term}
          </Button>
        ))}
      </div>

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleClear}
          className="flex items-center gap-1"
        >
          <Trash className="h-4 w-4" /> Clear
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="flex items-center gap-1"
        >
          <Copy className="h-4 w-4" /> Copy
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={handleSave}
          className="flex items-center gap-1"
        >
          <Save className="h-4 w-4" /> Save
        </Button>
      </div>
    </div>
  );
}
