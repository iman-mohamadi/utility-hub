// hooks/useJsonFormatter.ts
import { useState, useCallback } from "react"

export const LARGE_FILE_THRESHOLD = 100 * 1024 // 100KB

export interface JsonError {
  message: string
  line?: number
  col?: number
  snippet?: string
}

export function useJsonFormatter() {
  const [input, setInput] = useState("")
  const [error, setError] = useState<JsonError | null>(null)
  const [isValid, setIsValid] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Smart error parser to extract the exact line of failure
  const parseErrorDetails = (
    errMessage: string,
    rawInput: string
  ): JsonError => {
    const match =
      errMessage.match(/position (\d+)/) || errMessage.match(/column (\d+)/)
    let pos = match ? parseInt(match[1], 10) : -1

    if (pos !== -1 && pos <= rawInput.length) {
      const upToError = rawInput.substring(0, pos)
      const lines = upToError.split("\n")
      const lineNum = lines.length
      const colNum = lines[lines.length - 1].length + 1

      const allLines = rawInput.split("\n")
      const snippet = allLines[lineNum - 1]?.trim() || ""

      return { message: errMessage, line: lineNum, col: colNum, snippet }
    }
    return { message: errMessage }
  }

  const processJson = useCallback(
    async (action: "beautify" | "minify") => {
      if (!input.trim()) {
        clear()
        return false
      }

      setIsProcessing(true)
      setError(null)

      // Allow UI to paint loading state
      await new Promise((resolve) => setTimeout(resolve, 10))

      try {
        const size = new Blob([input]).size

        if (size > LARGE_FILE_THRESHOLD) {
          const apiUrl =
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
          const response = await fetch(`${apiUrl}/api/format`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rawJson: input, action: action }),
          })

          const data = await response.json()
          if (!response.ok)
            throw new Error(data.error || "Server processing failed")

          setInput(data.result) // ONE BOX: Overwrite input with formatted result
          setError(null)
          setIsValid(true)
          return true
        } else {
          const parsed = JSON.parse(input)
          const formatted =
            action === "beautify"
              ? JSON.stringify(parsed, null, 2)
              : JSON.stringify(parsed)

          setInput(formatted) // ONE BOX: Overwrite input with formatted result
          setError(null)
          setIsValid(true)
          return true
        }
      } catch (err: any) {
        setError(
          parseErrorDetails(err.message || "Invalid JSON structure", input)
        )
        setIsValid(false)
        return false
      } finally {
        setIsProcessing(false)
      }
    },
    [input]
  )

  const beautify = useCallback(() => processJson("beautify"), [processJson])
  const minify = useCallback(() => processJson("minify"), [processJson])

  // Heuristic JSON Fixer (Handles trailing commas, missing quotes, single quotes)
  const attemptFix = useCallback(async () => {
    try {
      let fixed = input
      // 1. Remove trailing commas before closing braces/brackets
      fixed = fixed.replace(/,\s*([}\]])/g, "$1")
      // 2. Fix unquoted keys
      fixed = fixed.replace(
        /([{,]\s*)([a-zA-Z_$][0-9a-zA-Z_$]*)\s*:/g,
        '$1"$2":'
      )
      // 3. Fix single-quoted keys
      fixed = fixed.replace(/([{,]\s*)'([^']+)'\s*:/g, '$1"$2":')
      // 4. Fix single-quoted string values
      fixed = fixed.replace(/:\s*'([^']*)'/g, ': "$1"')

      // Validate the fix
      JSON.parse(fixed)
      setInput(fixed)
      setError(null)
      return true
    } catch (e) {
      return false // Fix failed, JSON is too broken
    }
  }, [input])

  const clear = useCallback(() => {
    setInput("")
    setError(null)
    setIsValid(false)
    setIsProcessing(false)
  }, [])

  return {
    input,
    setInput,
    error,
    isValid,
    isProcessing,
    beautify,
    minify,
    attemptFix,
    clear,
  }
}
