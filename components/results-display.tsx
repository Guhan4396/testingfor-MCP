"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileJson, FileSpreadsheet, TableIcon } from "lucide-react"

interface ResultsDisplayProps {
  results: {
    table: string
    csv: string
    data: any[]
  }
}

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  const [activeTab, setActiveTab] = useState("table")

  const downloadCSV = () => {
    const blob = new Blob([results.csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "risk_results.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(results.data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "risk_results.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Risk Calculation Results</h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={downloadCSV}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button variant="outline" size="sm" onClick={downloadJSON}>
            <FileJson className="h-4 w-4 mr-2" />
            JSON
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="table">
            <TableIcon className="mr-2 h-4 w-4" />
            Table View
          </TabsTrigger>
          <TabsTrigger value="json">
            <FileJson className="mr-2 h-4 w-4" />
            JSON View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="mt-4">
          <div className="border rounded-md overflow-auto max-h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  {results.data[0] &&
                    Object.keys(results.data[0]).map((header) => <TableHead key={header}>{header}</TableHead>)}
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.data.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {Object.values(row).map((cell: any, cellIndex) => (
                      <TableCell key={cellIndex}>{typeof cell === "number" ? cell.toFixed(2) : cell}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="json" className="mt-4">
          <div className="bg-muted p-4 rounded-md overflow-auto max-h-[500px]">
            <pre className="text-xs">{JSON.stringify(results.data, null, 2)}</pre>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

