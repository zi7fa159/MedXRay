"use client";

import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { useState, useRef } from "react";

interface UploadAreaProps {
  onFileSelected: (file: File) => void;
  isLoading?: boolean;
}

export default function UploadArea({
  onFileSelected,
  isLoading = false,
}: UploadAreaProps) {
  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Check if file is an image
    if (!file.type.match("image.*")) {
      alert("Please upload an image file");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreviewImage(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);

    // Pass file to parent component
    onFileSelected(file);
  };

  const clearImage = () => {
    setPreviewImage(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      {!previewImage ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={handleChange}
            accept="image/*"
          />
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-4 bg-blue-100 rounded-full">
              <Upload className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium">
              Drag & drop your X-ray image here
            </h3>
            <p className="text-sm text-gray-500 max-w-md">
              Supported formats: JPEG, PNG, DICOM. For best results, use
              high-resolution images.
            </p>
            <Button
              onClick={() => inputRef.current?.click()}
              className="mt-4"
              variant="outline"
            >
              Select File
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative border rounded-lg overflow-hidden">
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 z-10 rounded-full"
            onClick={clearImage}
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="aspect-video relative">
            <Image
              src={previewImage}
              alt="X-ray preview"
              fill
              className="object-contain"
            />
          </div>
          {isLoading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
                <p>Analyzing image...</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
