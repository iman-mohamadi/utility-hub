"use client"

import { useState, useCallback } from "react"

const LARGE_FILE_THRESHOLD = 100 * 1024 // 100KB - use backend for larger files

export function useJsonFormatter() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [isValid, setIsValid] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState<"beautify" | "minify">("beautify")
  const [processingLocation, setProcessingLocation] = useState<"client" | "server">("client")

  // Process on frontend (fast, private)
  const processOnClient = useCallback((jsonString: string, formatMode: "beautify" | "minify") => {
    try {
      const parsed = JSON.parse(jsonString)
      const result = formatMode === "beautify" 
        ? JSON.stringify(parsed, null, 2)
        : JSON.stringify(parsed)
      
      setOutput(result)
      setIsValid(true)
      setProcessingLocation("client")
      return { success: true, data: result }
    } catch (err) {
      throw err
    }
  }, [])

  // Process on backend (for large files)
  const processOnServer = useCallback(async (jsonString: string, formatMode: "beautify" | "minify") => {
    try {
      const response = await fetch("/api/format", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          json: jsonString,
          mode: formatMode,
          indent: 2
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Server processing failed")
      }

      setOutput(result.data)
      setProcessingLocation("server")
      return { success: true, data: result.data, metadata: result.metadata }
    } catch (err) {
      throw err
    }
  }, [])

  // Smart processing: choose client or server based on size
  const beautify = useCallback(async () => {
    if (!input.trim()) {
      setError("لطفاً JSON را وارد کنید")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const size = new Blob([input]).size
      const useServer = size > LARGE_FILE_THRESHOLD

      if (useServer) {
        await processOnServer(input, "beautify")
      } else {
        processOnClient(input, "beautify")
      }
      
      setMode("beautify")
    } catch (err) {
      setError(err instanceof Error ? err.message : "JSON نامعتبر")
      setIsValid(false)
      setOutput("")
    } finally {
      setIsLoading(false)
    }
  }, [input, processOnClient, processOnServer])

  const minify = useCallback(async () => {
    if (!input.trim()) {
      setError("لطفاً JSON را وارد کنید")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const size = new Blob([input]).size
      const useServer = size > LARGE_FILE_THRESHOLD

      if (useServer) {
        await processOnServer(input, "minify")
      } else {
        processOnClient(input, "minify")
      }
      
      setMode("minify")
    } catch (err) {
      setError(err instanceof Error ? err.message : "JSON نامعتبر")
      setIsValid(false)
      setOutput("")
    } finally {
      setIsLoading(false)
    }
  }, [input, processOnClient, processOnServer])

  const clear = useCallback(() => {
    setInput("")
    setOutput("")
    setError("")
    setIsValid(false)
  }, [])

  const copyToClipboard = useCallback(async () => {
    if (!output) return false
    try {
      await navigator.clipboard.writeText(output)
      return true
    } catch (err) {
      return false
    }
  }, [output])

  const download = useCallback(() => {
    if (!output) return
    const blob = new Blob([output], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = mode === "beautify" ? "formatted.json" : "minified.json"
    a.click()
    URL.revokeObjectURL(url)
  }, [output, mode])

  return {
    input,
    setInput,
    output,
    error,
    isValid,
    isLoading,
    mode,
    processingLocation,
    beautify,
    minify,
    clear,
    copyToClipboard,
    download
  }
}