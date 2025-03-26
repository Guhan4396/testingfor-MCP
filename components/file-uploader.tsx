"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { FileType, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface FileUploaderProps {
  onFileSelect: (file: File) => void
  isLoading: boolean
}

export function FileUploader({ onFileSelect, isLoading }: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File) => {
    if (!file.name.endsWith(".csv")) {
      setFileError("Please upload a CSV file")
      return false
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      setFileError("File size exceeds 5MB limit")
      return false
    }

    setFileError(null)
    return true
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (validateFile(file)) {
        setSelectedFile(file)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (validateFile(file)) {
        setSelectedFile(file)
      }
    }
  }

  const handleUploadClick = () => {
    if (selectedFile) {
      onFileSelect(selectedFile)
    }
  }

  const openFileSelector = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  return (
    <div className="space-y-4">
      {fileError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{fileError}</AlertDescription>
        </Alert>
      )}

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          dragActive ? "border-primary bg-primary/10" : "border-gray-300"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-3 rounded-full bg-primary/10">
            <FileType className="h-8 w-8 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">
              {selectedFile ? selectedFile.name : "Drag and drop your CSV file here"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {selectedFile ? `${(selectedFile.size / 1024).toFixed(2)} KB` : "CSV files only, up to 5MB"}
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={openFileSelector} disabled={isLoading}>
            Select File
          </Button>
          <input ref={inputRef} type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
        </div>
      </div>

      {selectedFile && (
        <Button onClick={handleUploadClick} disabled={isLoading} className="w-full">
          {isLoading ? "Processing..." : "Calculate Risk"}
        </Button>
      )}
    </div>
  )
}

