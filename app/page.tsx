"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { FileUploader } from "@/components/file-uploader"
import { ResultsDisplay } from "@/components/results-display"
import { AlertCircle, FileText, Upload } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<any | null>(null)
  const [inputText, setInputText] = useState("")

  const handleFileUpload = async (file: File) => {
    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/calculate", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to process file")
      }

      const data = await response.json()
      setResults(data)
    } catch (err: any) {
      setError(err.message || "An error occurred while processing your request")
    } finally {
      setIsLoading(false)
    }
  }

  const handleTextSubmit = async () => {
    if (!inputText.trim()) {
      setError("Please enter supplier data")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("data", inputText)

      const response = await fetch("/api/calculate", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to process data")
      }

      const data = await response.json()
      setResults(data)
    } catch (err: any) {
      setError(err.message || "An error occurred while processing your request")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setResults(null)
    setInputText("")
    setError(null)
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">MCP Risk Calculator</CardTitle>
          <CardDescription>Upload a CSV file or enter supplier data to calculate risk scores</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!results ? (
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload CSV
                </TabsTrigger>
                <TabsTrigger value="text">
                  <FileText className="mr-2 h-4 w-4" />
                  Enter Data
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="mt-6">
                <FileUploader onFileSelect={handleFileUpload} isLoading={isLoading} />
              </TabsContent>

              <TabsContent value="text" className="mt-6">
                <div className="space-y-4">
                  <Textarea
                    placeholder="Enter supplier data in format: Supplier Name, Country (one per line)"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="min-h-[200px]"
                  />
                  <Button onClick={handleTextSubmit} disabled={isLoading || !inputText.trim()} className="w-full">
                    {isLoading ? "Processing..." : "Calculate Risk"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <ResultsDisplay results={results} />
          )}
        </CardContent>
        {results && (
          <CardFooter>
            <Button onClick={handleReset} variant="outline" className="w-full">
              Calculate New Risk
            </Button>
          </CardFooter>
        )}
      </Card>
    </main>
  )
}

