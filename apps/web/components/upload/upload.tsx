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
  FileCheck2,
  Trash2,
  ArrowLeft,
} from "lucide-react";

interface FileUploadProps {
  uploadUrl: string;
  onUploadSuccess?: (res: UploadResponse) => void;
  onUploadError?: (error: any) => void;
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
  uploadUrl = "/api/upload", // Default URL for demonstration
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
        icon: <AlertCircle className="h-4 w-4 text-red-500" />,
      });
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File Too Large", {
        description: `Please upload files smaller than ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
        icon: <AlertCircle className="h-4 w-4 text-red-500" />,
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
    // No toast needed here, user initiated action
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
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
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
        icon: <AlertCircle className="h-4 w-4 text-red-500" />,
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
        icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      });

      setUploadResult(response.data);
      onUploadSuccess?.(response.data);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Upload failed. Please try again.";
      toast.error("Conversion Failed", {
        description: errorMessage,
        icon: <AlertCircle className="h-4 w-4 text-red-500" />,
      });
      onUploadError?.(error);
    } finally {
      setIsUploading(false);
      // Keep progress at 100 if successful, or reset if error?
      // For now, let's reset. If successful, the success UI shows.
      if (!uploadResult) {
        // only reset progress if it wasn't a success
        setUploadProgress(0);
      }
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
          icon: <Download className="h-4 w-4 text-blue-500" />,
        });
      } catch (error: any) {
        toast.error("Download Failed", {
          description: error?.message || "Could not download the file.",
          icon: <AlertCircle className="h-4 w-4 text-red-500" />,
        });
      }
    }
  };

  const startOver = () => {
    removeFile(); // This already resets uploadFile, uploadResult, and uploadProgress
    toast.info("Ready for a new file", {
      description: "The previous file has been cleared.",
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

  // Main content rendering logic
  if (uploadResult) {
    // Download Ready UI
    return (
      <Card className="mx-auto w-full max-w-lg shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <FileCheck2 className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl">Conversion Successful!</CardTitle>
          <CardDescription>
            Your SVG{" "}
            <span className="font-semibold">
              {uploadResult.savedFileInfo.originalname}
            </span>{" "}
            has been converted to PNG.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {uploadFile && (
            <div className="bg-card rounded-lg border p-4 shadow-sm">
              <p className="text-muted-foreground mb-2 text-xs">
                Original SVG Preview:
              </p>
              <div className="flex items-center space-x-4">
                <div className="border-muted-foreground/30 bg-muted/20 dark:bg-muted/30 flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-md border border-dashed p-1">
                  <img
                    src={
                      uploadFile.preview ||
                      "/placeholder.svg?width=80&height=80&text=SVG"
                    }
                    alt={`Preview of ${uploadFile.file.name}`}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="min-w-0 flex-grow">
                  <p className="text-card-foreground truncate text-base font-semibold">
                    {uploadResult.savedFileInfo.originalname.replace(
                      /\.svg$/,
                      ".png",
                    )}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Original SVG size: {formatBytes(uploadFile.file.size)}
                  </p>
                  {/* You could add PNG file size here if available from backend */}
                  {/* <p className="text-sm text-muted-foreground">Converted PNG size: {formatBytes(uploadResult.savedFileInfo.size)}</p> */}
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={downloadPng}
              className="w-full flex-grow bg-green-600 text-white hover:bg-green-700 sm:w-auto dark:bg-green-500 dark:hover:bg-green-600"
              size="lg"
            >
              <Download className="mr-2 h-5 w-5" />
              Download PNG
            </Button>
            <Button
              variant="outline"
              onClick={startOver}
              className="w-full flex-grow sm:w-auto"
              size="lg"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Convert Another
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isUploading || uploadFile) {
    // Uploading or File Selected UI
    return (
      <Card className="mx-auto w-full max-w-lg shadow-lg">
        <CardHeader>
          <CardTitle>
            {isUploading ? "Converting File" : "Selected File"}
          </CardTitle>
          <CardDescription>
            {isUploading
              ? "Please wait while your SVG is being converted to PNG."
              : "Review your file and start the conversion."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {uploadFile && (
            <div className="bg-card rounded-lg border p-4 shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="border-muted-foreground/30 bg-muted/20 dark:bg-muted/30 flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-md border border-dashed p-1">
                  <img
                    src={
                      uploadFile.preview ||
                      "/placeholder.svg?width=80&height=80&text=SVG"
                    }
                    alt={uploadFile.file.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="min-w-0 flex-grow">
                  <p className="text-card-foreground truncate text-base font-semibold">
                    {uploadFile.file.name}
                  </p>
                  <p className="text-muted-foreground text-sm">
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
            </div>
          )}

          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <p className="text-primary text-sm font-medium">
                  Processing...
                </p>
                <p className="text-primary text-sm font-semibold">
                  {uploadProgress}%
                </p>
              </div>
              <Progress value={uploadProgress} className="h-2.5 w-full" />
              {uploadProgress === 100 && !uploadResult && (
                <p className="text-muted-foreground pt-1 text-center text-xs">
                  Finalizing conversion, please wait...
                </p>
              )}
            </div>
          )}

          {!isUploading && uploadFile && (
            <Button onClick={uploadFiles} className="w-full" size="lg">
              <UploadCloud className="mr-2 h-5 w-5" />
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
    <Card
      className={cn(
        "mx-auto w-full max-w-lg shadow-lg transition-all duration-200 ease-in-out",
        isDragOver && "border-primary ring-primary/50 ring-2",
      )}
    >
      <CardContent
        className={cn(
          "p-0 transition-all duration-200 ease-in-out",
          isDragOver && "bg-primary/5 dark:bg-primary/10",
        )}
      >
        <div
          className={cn(
            "relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 sm:p-12",
            "border-muted-foreground/30 hover:border-primary/70 dark:border-muted-foreground/50 dark:hover:border-primary/70",
            isDragOver ? "border-primary" : "",
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={openFileDialog}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && openFileDialog()}
          aria-label="File upload area"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/svg+xml,.svg"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload-input"
          />
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div
              className={cn(
                "bg-muted dark:bg-muted/50 mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-colors",
                isDragOver && "bg-primary/20 dark:bg-primary/30",
              )}
            >
              <UploadCloud
                className={cn(
                  "text-muted-foreground h-8 w-8 transition-colors",
                  isDragOver && "text-primary dark:text-primary-foreground",
                )}
              />
            </div>
            <h3 className="text-xl font-semibold">Drop your SVG file here</h3>
            <p className="text-muted-foreground">
              or{" "}
              <span className="text-primary font-medium">click to browse</span>
            </p>
            <p className="text-muted-foreground pt-2 text-xs">
              Max file size: {MAX_FILE_SIZE / (1024 * 1024)}MB. Only SVG files
              supported.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
