// hooks/useJsonFormatter.ts
import { useState, useCallback } from "react"

export const LARGE_FILE_THRESHOLD = 100 * 1024 // 100KB

export function useJsonFormatter() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isValid, setIsValid] = useState(false)
  const [mode, setMode] = useState<"beautify" | "minify" | null>(null)
  const [processingLocation, setProcessingLocation] = useState<
    "client" | "server" | null
  >(null)

  // NEW: Add a processing state
  const [isProcessing, setIsProcessing] = useState(false)

  const processJson = useCallback(
    async (action: "beautify" | "minify") => {
      if (!input.trim()) {
        clear()
        return false // Return false for failure
      }

      setIsProcessing(true) // Turn on the loading spinner
      setMode(action)
      setError(null)

      // CRITICAL FIX: Give the browser 10ms to paint the loading spinner to the screen
      // BEFORE we freeze the main thread with heavy parsing or regex.
      await new Promise((resolve) => setTimeout(resolve, 10))

      try {
        const size = new Blob([input]).size

        if (size > LARGE_FILE_THRESHOLD) {
          setProcessingLocation("server")

          const apiUrl =
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

          const response = await fetch(`${apiUrl}/api/format`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rawJson: input, action: action }),
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.error || "Server processing failed")
          }

          setOutput(data.result)
          setError(null)
          setIsValid(true)
          return true // Success
        } else {
          setProcessingLocation("client")
          const parsed = JSON.parse(input)
          const formatted =
            action === "beautify"
              ? JSON.stringify(parsed, null, 2)
              : JSON.stringify(parsed)

          setOutput(formatted)
          setError(null)
          setIsValid(true)
          return true // Success
        }
      } catch (err: any) {
        setOutput("")
        setError(err.message || "Invalid JSON structure")
        setIsValid(false)
        return false // Failure
      } finally {
        // ALWAYS turn off the loading spinner when done
        setIsProcessing(false)
      }
    },
    [input]
  )

  const beautify = useCallback(() => processJson("beautify"), [processJson])
  const minify = useCallback(() => processJson("minify"), [processJson])

  const clear = useCallback(() => {
    setInput("")
    setOutput("")
    setError(null)
    setIsValid(false)
    setMode(null)
    setProcessingLocation(null)
    setIsProcessing(false)
  }, [])

  return {
    input,
    setInput,
    output,
    error,
    isValid,
    mode,
    processingLocation,
    isProcessing,
    beautify,
    minify,
    clear,
  }
}
