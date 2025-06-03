"use client";
import type React from "react";
import { useState, useCallback, useRef } from "react";
import axios, { type AxiosProgressEvent } from "axios";
import { saveAs } from "file-saver";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@workspace/ui/components/card";
import { Progress } from "@workspace/ui/components/progress";
import { cn } from "@workspace/ui/lib/utils";
import {
  UploadCloud,
  Loader2,
  AlertCircle,
  CheckCircle,
  Download,
  Trash2,
  ArrowLeft,
  Sparkles,
  RefreshCcw,
} from "lucide-react";

interface FileUploadProps {
  uploadUrl: string;
  onUploadSuccess?: (res: UploadResponse) => void;
  onUploadError?: (error: unknown) => void;
}

interface UploadFile {
  file: File;
  preview: string;
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
  uploadUrl = "/api/placeholder-upload", // Default URL for demonstration
  onUploadSuccess,
  onUploadError,
}: FileUploadProps) {
  const [uploadFile, setUploadFile] = useState<UploadFile | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_FILE_SIZE: number = 5 * 1024 * 1024; // 5MB

  const validateFile = (file: File): boolean => {
    if (file.type !== "image/svg+xml") {
      toast.error("Invalid File Type", {
        description: "Please upload only SVG files.",
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      });
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File Too Large", {
        description: `Please upload files smaller than ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      });
      return false;
    }
    return true;
  };

  const createFilePreview = (file: File): string => {
    return URL.createObjectURL(file);
  };

  const removeFile = useCallback(() => {
    if (uploadFile) {
      URL.revokeObjectURL(uploadFile.preview);
    }
    setUploadFile(null);
    setUploadResult(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [uploadFile]);

  const processFile = (file: File) => {
    if (!validateFile(file)) {
      return;
    }
    if (uploadFile) {
      URL.revokeObjectURL(uploadFile.preview);
    }
    setUploadResult(null);
    setUploadProgress(0);
    const preview = createFilePreview(file);
    const newFile: UploadFile = {
      file,
      preview,
      id: Math.random().toString(36).substring(2, 9),
    };
    setUploadFile(newFile);
    toast.success("File Ready", {
      description: `${file.name} is selected and ready to convert.`,
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    });
  };

  const openFileDialog = () => {
    if (!isUploading && !uploadResult) {
      fileInputRef.current?.click();
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isUploading && !uploadResult) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isUploading && !uploadResult) {
      e.dataTransfer.dropEffect = "copy";
    } else {
      e.dataTransfer.dropEffect = "none";
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (isUploading || uploadResult) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && files[0]) {
      processFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && files[0]) {
      processFile(files[0]);
    }
  };

  const uploadFiles = async () => {
    if (!uploadFile) {
      toast.error("No File Selected", {
        description: "Please select an SVG file first.",
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", uploadFile.file);

      const response = await axios.post<UploadResponse>(uploadUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          const total = progressEvent.total ?? uploadFile.file.size;
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / total,
          );
          setUploadProgress(percentCompleted);
        },
      });

      toast.success("Conversion Successful!", {
        description: `${uploadFile.file.name} converted to PNG.`,
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      });

      setUploadResult(response.data);
      onUploadSuccess?.(response.data);
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Upload failed. Please try again.";
      toast.error("Conversion Failed", {
        description: errorMessage,
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      });
      onUploadError?.(error);
      // Reset progress on error to allow re-try or new file
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
      // If successful, progress remains 100 until new file or start over
      // If error, it's reset above.
    }
  };

  const downloadPng = async () => {
    if (uploadResult?.convertedPngDownloadUrl) {
      try {
        const response = await axios.get(uploadResult.convertedPngDownloadUrl, {
          responseType: "blob",
        });
        const originalName = uploadResult.savedFileInfo.originalname;
        const filename =
          originalName.substring(0, originalName.lastIndexOf(".")) + ".png";
        saveAs(response.data, filename);
        toast.success("Download Started", {
          description: `${filename} is being downloaded.`,
          icon: <Download className="h-5 w-5 text-blue-500" />,
        });
      } catch (error: unknown) {
        const axiosError = error as { message?: string };
        toast.error("Download Failed", {
          description: axiosError?.message || "Could not download the file.",
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
        });
      }
    }
  };

  const startOver = () => {
    removeFile();
    toast.info("Ready for a new file", {
      description: "The previous file has been cleared.",
      icon: <Sparkles className="h-5 w-5 text-blue-500" />,
    });
  };

  const formatBytes = (bytes: number, decimals = 2): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
    );
  };

  // Download Ready UI
  if (uploadResult) {
    return (
      <Card className="mx-auto w-full max-w-2xl rounded-xl shadow-xl">
        <CardHeader className="pt-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Conversion Successful!
          </CardTitle>
          <CardDescription className="text-base">
            Your SVG{" "}
            <span className="text-foreground font-semibold">
              {uploadResult.savedFileInfo.originalname}
            </span>{" "}
            is now a PNG.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6 sm:p-8">
          {uploadFile && (
            <div className="bg-muted/40 dark:bg-muted/60 flex items-center space-x-4 rounded-lg border p-4">
              <img
                src={
                  uploadFile.preview ||
                  "/placeholder.svg?width=64&height=64&query=SVG+file+icon"
                }
                alt={uploadResult.savedFileInfo.originalname}
                className="bg-background h-16 w-16 rounded-md border object-contain p-1"
              />
              <div className="min-w-0 flex-grow">
                <p className="text-foreground truncate text-sm font-medium">
                  {uploadResult.savedFileInfo.originalname.replace(
                    /\.svg$/,
                    ".png",
                  )}
                </p>
                <p className="text-muted-foreground text-xs">
                  Original: {formatBytes(uploadFile.file.size)}
                </p>
              </div>
            </div>
          )}
          <div className="space-y-4">
            <Button
              onClick={downloadPng}
              className="w-full bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
              size="lg"
            >
              <Download className="mr-2 h-5 w-5" />
              Download PNG
            </Button>
            <Button
              variant="outline"
              onClick={startOver}
              className="w-full"
              size="lg"
            >
              Convert Another
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Uploading or File Selected UI
  if (isUploading || uploadFile) {
    return (
      <Card className="mx-auto w-full max-w-2xl rounded-xl shadow-xl">
        <CardHeader className="pt-8">
          <CardTitle className="text-2xl font-bold">
            {isUploading ? "Converting your SVG" : "File Selected"}
          </CardTitle>
          <CardDescription className="text-base">
            {isUploading
              ? "Hold tight! We're turning your SVG into a shiny PNG."
              : "Your SVG is ready. Let's convert it!"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6 sm:p-8">
          {uploadFile && (
            <div className="bg-muted/40 dark:bg-muted/60 flex items-center space-x-4 rounded-lg border p-4">
              <div className="flex-shrink-0">
                <img
                  src={
                    uploadFile.preview ||
                    "/placeholder.svg?width=64&height=64&query=SVG+file+icon"
                  }
                  alt={uploadFile.file.name}
                  className="bg-background h-16 w-16 rounded-md border object-contain p-1"
                />
              </div>
              <div className="min-w-0 flex-grow">
                <p className="text-foreground truncate text-sm font-semibold">
                  {uploadFile.file.name}
                </p>
                <p className="text-muted-foreground text-xs">
                  {formatBytes(uploadFile.file.size)} • SVG Image
                </p>
              </div>
              {!isUploading && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={removeFile}
                  className="text-muted-foreground hover:text-destructive flex-shrink-0"
                  aria-label="Remove file"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              )}
            </div>
          )}

          {isUploading && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-primary text-sm font-medium">
                  Processing...
                </p>
                <p className="text-primary text-sm font-semibold">
                  {uploadProgress}%
                </p>
              </div>
              <Progress
                value={uploadProgress}
                className="h-2.5 w-full rounded-full"
              />
              {uploadProgress === 100 && !uploadResult && (
                <p className="text-muted-foreground pt-1 text-center text-xs">
                  Finalizing conversion, almost there...
                </p>
              )}
            </div>
          )}

          {!isUploading && uploadFile && (
            <Button onClick={uploadFiles} className="w-full" size="lg">
              <RefreshCcw className="mr-2 h-5 w-5" />
              Convert to PNG
            </Button>
          )}

          {isUploading && (
            <Button disabled className="w-full" size="lg">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Converting...
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  // Default Drag and Drop Zone UI
  return (
    <Card className="mx-auto w-full max-w-2xl rounded-xl shadow-xl">
      <CardContent className="p-6">
        <div
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-12 py-16 transition-all duration-300 ease-in-out",
            isDragOver
              ? "border-primary bg-primary/5 dark:bg-primary/10"
              : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/20",
            "min-h-[240px]",
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={openFileDialog}
          role="button"
          tabIndex={0}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && openFileDialog()
          }
          aria-label="File upload area, drag and drop SVG or click to browse"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/svg+xml,.svg"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload-input"
            aria-labelledby="file-upload-heading"
          />
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div
              className={cn(
                "bg-muted flex h-16 w-16 items-center justify-center rounded-full transition-all duration-300 ease-in-out",
                isDragOver && "bg-primary/20 scale-110",
              )}
            >
              <UploadCloud
                className={cn(
                  "text-muted-foreground h-8 w-8 transition-colors duration-300 ease-in-out",
                  isDragOver && "text-primary",
                )}
              />
            </div>
            <div className="space-y-2">
              <h3
                id="file-upload-heading"
                className="text-foreground text-xl font-semibold"
              >
                Drop your SVG here
              </h3>
              <p className="text-muted-foreground">
                or{" "}
                <span className="text-primary font-medium hover:underline">
                  click to browse files
                </span>
              </p>
            </div>
            <p className="text-muted-foreground text-sm">
              Max file size: {MAX_FILE_SIZE / (1024 * 1024)}MB. Only SVG files.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
