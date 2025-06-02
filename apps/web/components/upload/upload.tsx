"use client";
import React, { useState, useCallback, useRef } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";
import {
  Upload,
  X,
  FileImage,
  Loader2,
  AlertCircle,
  CheckCircle,
  Download,
} from "lucide-react";

interface FileUploadProps {
  uploadUrl: string;
  onUploadSuccess?: (res: any) => void;
  onUploadError?: (error: any) => void;
}

interface UploadFile {
  file: File;
  preview: string; // preview url
  id: string;
}

interface UploadResponse {
  savedFileInfo: {
    filename: string;
    originalname: string;
    path: string;
    size: number;
    uploadedAt: string;
  };
  convertedPngDownloadUrl: string;
}

export default function UploadArea({
  uploadUrl,
  onUploadSuccess,
  onUploadError,
}: FileUploadProps) {
  const [uploadFile, setUploadFile] = useState<UploadFile | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_FILE_SIZE: number = 5 * 1024 * 1024;

  const validateFile = (file: File): boolean => {
    if (file.type !== "image/svg+xml") {
      toast.error("Please upload only svg files", {
        description: "Only svg files are allowed",
        icon: <AlertCircle className="h-4 w-4" />,
      });
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File too large", {
        description: "Please upload files smaller than 5mb",
        icon: <AlertCircle className="h-4 w-4" />,
      });
      return false;
    }
    return true;
  };

  const createFilePreview = (file: File): string => {
    return URL.createObjectURL(file);
  };

  const removeFile = () => {
    if (uploadFile) {
      URL.revokeObjectURL(uploadFile.preview);
      setUploadFile(null);
      setUploadResult(null);
      toast.info("File Removed", {
        description: "Please select a file first",
        icon: <AlertCircle className="h-4 w-4" />,
      });
      return;
    }
  };

  const processFile = (file: File) => {
    if (!validateFile(file)) {
      return;
    }
    if (uploadFile) {
      URL.revokeObjectURL(uploadFile.preview);
    }
    setUploadResult(null); // Clear previous results
    const preview = createFilePreview(file);
    const newFile: UploadFile = {
      file,
      preview,
      id: Math.random().toString(36).substring(2, 9),
    };
    setUploadFile(newFile);
    toast.success("File added sucessfully", {
      description: `${file.name} is ready to upload`,
      icon: <CheckCircle className="h-4 w-4" />,
    });
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFile(files[0]!);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]!);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadFiles = async () => {
    if (!uploadFile) {
      toast.error("No file to upload", {
        description: "Please select a file first",
        icon: <AlertCircle className="h-4 w-4" />,
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", uploadFile.file);

      const response = await axios.post<UploadResponse>(uploadUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1),
          );
          console.log("Upload progress:", percentCompleted);
        },
      });

      toast.success("Upload successful!", {
        description: `${uploadFile.file.name} has been converted to PNG successfully`,
        icon: <CheckCircle className="h-4 w-4" />,
      });

      setUploadResult(response.data);
      URL.revokeObjectURL(uploadFile.preview);
      setUploadFile(null);
      onUploadSuccess?.(response.data);
    } catch (error: any) {
      console.error("Upload error:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Upload failed. Please try again.";

      console.log(errorMessage as string);

      toast.error("Upload failed", {
        description: errorMessage,
        icon: <AlertCircle className="h-4 w-4" />,
      });

      onUploadError?.(error);
    } finally {
      setIsUploading(false);
    }
  };

  const downloadPng = async () => {
    if (uploadResult?.convertedPngDownloadUrl) {
      try {
        // Fetch the PNG as a blob using axios
        const response = await axios.get(uploadResult.convertedPngDownloadUrl, {
          responseType: "blob",
        });

        // Use file-saver to trigger the download
        const filename = uploadResult.savedFileInfo.originalname.replace(
          ".svg",
          ".png",
        );
        saveAs(response.data, filename);

        toast.success("Download started!", {
          description: `${filename} is being downloaded`,
          icon: <CheckCircle className="h-4 w-4" />,
        });
      } catch (error: any) {
        toast.error("Download failed", {
          description: error?.message || "Unknown error",
          icon: <AlertCircle className="h-4 w-4" />,
        });
      }
    }
  };

  const startOver = () => {
    setUploadResult(null);
    setUploadFile(null);
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      {/* Success Result */}
      {uploadResult && (
        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">
                    Conversion Successful!
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Your SVG file has been converted to PNG format.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    onClick={downloadPng}
                    className="bg-green-600 text-white hover:bg-green-700"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download PNG
                  </Button>
                  <Button
                    variant="outline"
                    onClick={startOver}
                    className="border-green-300 text-green-700 hover:bg-green-100 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900"
                  >
                    Convert Another File
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Drop Zone - Hidden when upload is successful */}
      {!uploadResult && (
        <Card className="relative">
          <CardContent className="p-6">
            <div
              className={cn(
                "relative cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors duration-200",
                isDragOver
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
              )}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={openFileDialog}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".svg,image/svg+xml"
                onChange={handleFileSelect}
                className="hidden"
              />

              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="bg-muted rounded-full p-4">
                  <Upload className="text-muted-foreground h-8 w-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">
                    Drop your SVG file here
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    or click to browse files
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Only SVG files up to 5MB are supported
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* File Preview - Hidden when upload is successful */}
      {uploadFile && !uploadResult && (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center">
              {/* Thumbnail */}
              <div className="p-4">
                <div className="border-muted-foreground/20 bg-background relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border shadow-sm">
                  <img
                    src={uploadFile.preview}
                    alt={uploadFile.file.name}
                    className="h-12 w-12 object-contain"
                  />
                </div>
              </div>

              {/* File Info */}
              <div className="flex-1 py-4 pr-4">
                <div className="space-y-1">
                  <p className="text-foreground truncate text-sm font-semibold">
                    {uploadFile.file.name}
                  </p>
                  <div className="text-muted-foreground flex items-center space-x-2 text-xs">
                    <span className="flex items-center">
                      <FileImage className="mr-1 h-3 w-3" />
                      SVG
                    </span>
                    <span>•</span>
                    <span>{(uploadFile.file.size / 1024).toFixed(1)} KB</span>
                  </div>
                </div>
              </div>

              {/* Remove Button */}
              <div className="p-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-destructive/20 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  onClick={removeFile}
                >
                  <X className="mr-1 h-3 w-3" />
                  Remove
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Button - Hidden when upload is successful */}
      {!uploadResult && (
        <div className="flex justify-center">
          <Button
            onClick={uploadFiles}
            disabled={!uploadFile || isUploading}
            className="min-w-32"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Converting...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Convert to PNG
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
