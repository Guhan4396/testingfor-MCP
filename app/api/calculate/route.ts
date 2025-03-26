import { type NextRequest, NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import fs from "fs"
import path from "path"
import os from "os"

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Create a temporary directory for processing
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "mcp-risk-"))
    const inputFilePath = path.join(tempDir, "input.csv")

    let inputData = ""

    // Handle file upload or direct text input
    if (formData.has("file")) {
      const file = formData.get("file") as File
      const buffer = Buffer.from(await file.arrayBuffer())
      fs.writeFileSync(inputFilePath, buffer)
    } else if (formData.has("data")) {
      inputData = formData.get("data") as string
      fs.writeFileSync(inputFilePath, inputData)
    } else {
      return NextResponse.json({ error: "No data provided" }, { status: 400 })
    }

    // Execute the Python script
    const scriptPath = path.join(process.cwd(), "python", "process.py")
    const { stdout, stderr } = await execAsync(`python ${scriptPath} ${inputFilePath}`)

    if (stderr) {
      console.error("Python script error:", stderr)
      return NextResponse.json({ error: "Error processing data" }, { status: 500 })
    }

    // Parse the JSON output from the Python script
    const results = JSON.parse(stdout)

    // Clean up temporary files
    fs.rmSync(tempDir, { recursive: true, force: true })

    return NextResponse.json(results)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "An error occurred while processing your request" }, { status: 500 })
  }
}

