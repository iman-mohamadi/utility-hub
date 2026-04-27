"use client"

import { useState, useCallback } from "react"

interface JsonStats {
  inputSize: number
  outputSize: number
  compression: number
  inputLines: number
  outputLines: number
}

export function useJsonFormatter() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [isValid, setIsValid] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState<"beautify" | "minify">("beautify")

  const calculateStats = useCallback(
    (text: string): { size: number; lines: number } => {
      const size = new Blob([text]).size
      const lines = text.split("\n").length
      return { size, lines }
    },
    []
  )

  const beautify = useCallback(() => {
    if (!input.trim()) {
      setError("لطفاً JSON را وارد کنید")
      return false
    }

    setIsLoading(true)
    setError("")

    try {
      const parsed = JSON.parse(input)
      const formatted = JSON.stringify(parsed, null, 2)
      setOutput(formatted)
      setIsValid(true)
      setMode("beautify")
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "JSON نامعتبر")
      setIsValid(false)
      setOutput("")
      return false
    } finally {
      setIsLoading(false)
    }
  }, [input])

  const minify = useCallback(() => {
    if (!input.trim()) {
      setError("لطفاً JSON را وارد کنید")
      return false
    }

    setIsLoading(true)
    setError("")

    try {
      const parsed = JSON.parse(input)
      const minified = JSON.stringify(parsed)
      setOutput(minified)
      setIsValid(true)
      setMode("minify")
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "JSON نامعتبر")
      setIsValid(false)
      setOutput("")
      return false
    } finally {
      setIsLoading(false)
    }
  }, [input])

  const clear = useCallback(() => {
    setInput("")
    setOutput("")
    setError("")
    setIsValid(false)
  }, [])

  const loadExample = useCallback(() => {
    const example = {
      name: "ابزارهای رایگان",
      version: "1.0.0",
      features: ["JSON Formatter", "Copy Paste", "URL Shortener"],
      author: {
        name: "Developer",
        skills: ["React", "Next.js", "Node.js"],
      },
      createdAt: new Date().toISOString(),
    }
    setInput(JSON.stringify(example, null, 2))
    setTimeout(() => beautify(), 100)
  }, [beautify])

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

  const stats = output
    ? {
        outputSize: calculateStats(output).size,
        outputLines: calculateStats(output).lines,
        compression: input
          ? Math.round(
              (1 - calculateStats(output).size / calculateStats(input).size) *
                100
            )
          : 0,
      }
    : null

  return {
    input,
    setInput,
    output,
    error,
    isValid,
    isLoading,
    mode,
    stats,
    beautify,
    minify,
    clear,
    loadExample,
    copyToClipboard,
    download,
  }
}
