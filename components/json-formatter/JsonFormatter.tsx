"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Textarea } from "@/components/ui/textarea"
import {
  Sparkles,
  Trash2,
  Copy,
  Download,
  CheckCircle2,
  XCircle,
  FileJson,
  Minimize2,
} from "lucide-react"
import { toast } from "sonner"

const LARGE_FILE_THRESHOLD = 100 * 1024

// Syntax Highlighting adaptive for Light and Dark modes
const syntaxHighlight = (json: string) => {
  if (!json) return ""
  let formatted = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
  return formatted.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function (match) {
      let cls = "text-[#098658] dark:text-[#b5cea8]" // Numbers (Light: Dark Green, Dark: Light Green)
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "text-[#0451a5] dark:text-[#9cdcfe]" // Keys (Light: Blue, Dark: Light Blue)
        } else {
          cls = "text-[#a31515] dark:text-[#ce9178]" // Strings (Light: Dark Red, Dark: Orange)
        }
      } else if (/true|false/.test(match)) {
        cls = "text-[#0000ff] dark:text-[#569cd6]" // Booleans
      } else if (/null/.test(match)) {
        cls = "text-[#0000ff] dark:text-[#569cd6]" // Null
      }
      return `<span class="${cls}">${match}</span>`
    }
  )
}

const escapeHtml = (unsafe: string) =>
  unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

export function JsonFormatter() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [isValid, setIsValid] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [processingLocation, setProcessingLocation] = useState<
    "client" | "server" | null
  >(null)

  const processOnClient = useCallback(
    (jsonString: string, formatMode: "beautify" | "minify") => {
      const parsed = JSON.parse(jsonString)
      const result =
        formatMode === "beautify"
          ? JSON.stringify(parsed, null, 2)
          : JSON.stringify(parsed)
      setOutput(result)
      setIsValid(true)
      setError("")
      setProcessingLocation("client")
      return result
    },
    []
  )

  const handleProcess = useCallback(
    async (actionMode: "beautify" | "minify", silent = false) => {
      if (!input.trim()) {
        if (!silent)
          toast.error("کد JSON را وارد کنید", {
            className:
              "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white",
          })
        return
      }

      try {
        if (new Blob([input]).size > LARGE_FILE_THRESHOLD) {
          // Mock Server Processing
          const parsed = JSON.parse(input)
          const result =
            actionMode === "beautify"
              ? JSON.stringify(parsed, null, 2)
              : JSON.stringify(parsed)
          setOutput(result)
          setIsValid(true)
          setError("")
          setProcessingLocation("server")
          if (!silent)
            toast.success(`پردازش سرور انجام شد`, {
              icon: "☁️",
              className:
                "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800",
            })
        } else {
          processOnClient(input, actionMode)
          if (!silent)
            toast.success(`پردازش موفق`, {
              icon: "✨",
              className:
                "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800",
            })
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "فرمت نامعتبر"
        setError(errorMsg)
        setIsValid(false)
        setOutput("")
        if (!silent)
          toast.error("خطا در ساختار JSON", {
            className:
              "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-900 text-red-600 dark:text-red-200",
          })
      }
    },
    [input, processOnClient]
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      if (input.trim()) {
        try {
          JSON.parse(input)
          handleProcess("beautify", true)
        } catch (e) {
          setIsValid(false)
          setError(e instanceof Error ? e.message : "نامعتبر")
        }
      } else {
        setOutput("")
        setError("")
        setIsValid(false)
        setProcessingLocation(null)
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [input, handleProcess])

  const copyToClipboard = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setIsCopied(true)
    toast.success("کپی شد", {
      className:
        "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white",
    })
    setTimeout(() => setIsCopied(false), 2000)
  }

  const clear = () => {
    setInput("")
    setOutput("")
    setError("")
    setIsValid(false)
    setProcessingLocation(null)
  }

  const statsData = (() => {
    if (!output) return null
    const inSize = new Blob([input]).size,
      outSize = new Blob([output]).size
    return {
      size: (outSize / 1024).toFixed(2),
      lines: output.split("\n").length,
      comp: inSize ? Math.round((1 - outSize / inSize) * 100) : 0,
    }
  })()

  return (
    <div
      className="min-h-[calc(100vh-4rem)] bg-slate-50 py-8 text-slate-900 transition-colors duration-300 selection:bg-blue-500/30 dark:bg-[#000000] dark:text-zinc-300"
      dir="rtl"
    >
      <div className="container mx-auto flex h-[calc(100vh-8rem)] max-w-[1400px] flex-col px-4">
        {/* Minimal Header */}
        <div className="mb-6 flex shrink-0 flex-col items-end justify-between gap-4 md:flex-row">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-semibold text-slate-900 dark:text-white">
              <FileJson className="h-5 w-5 text-blue-500" />
              JSON Formatter
            </h1>
          </div>

          {/* Aceternity Style Toolbar */}
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-zinc-900/50 dark:shadow-none">
            <button
              onClick={() => handleProcess("beautify")}
              className="flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-white"
            >
              <Sparkles className="h-3.5 w-3.5" /> زیبا‌سازی
            </button>
            <button
              onClick={() => handleProcess("minify")}
              className="flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-white"
            >
              <Minimize2 className="h-3.5 w-3.5" /> مینی‌فای
            </button>
            <div className="mx-1 h-4 w-px bg-slate-200 dark:bg-white/10"></div>
            <button
              onClick={clear}
              className="rounded-md px-2 py-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:text-zinc-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Min-h-0 is crucial here to enable scrolling inside flex children */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#0a0a0a] dark:shadow-none">
          {/* Min-h-0 crucial for grid too */}
          <div className="grid min-h-0 flex-1 divide-y divide-slate-200 lg:grid-cols-2 lg:divide-x lg:divide-y-0 lg:divide-x-reverse dark:divide-white/10">
            {/* Input Pane */}
            <div className="group relative flex min-h-0 flex-col">
              <div
                className="absolute top-3 right-4 z-10 flex items-center gap-2"
                dir="ltr"
              >
                <span className="text-[10px] tracking-widest text-slate-400 uppercase dark:text-zinc-600">
                  Input
                </span>
                {input && (
                  <div
                    className={`h-1.5 w-1.5 rounded-full ${isValid ? "bg-green-500" : "bg-red-500"}`}
                  />
                )}
              </div>
              <Textarea
                placeholder='{\n  "status": "ready",\n  "message": "paste your json here"\n}'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="h-full w-full flex-1 resize-none overflow-y-auto border-0 bg-transparent p-6 pt-10 text-left font-mono text-[13px] leading-relaxed text-slate-800 outline-none placeholder:text-slate-400 focus-visible:ring-0 dark:text-zinc-300 dark:placeholder:text-zinc-800"
                dir="ltr"
                spellCheck={false}
              />
            </div>

            {/* Output Pane */}
            <div className="relative flex min-h-0 flex-col bg-slate-50 dark:bg-[#050505]">
              <div
                className="absolute top-3 right-4 z-10 flex w-[calc(100%-2rem)] items-center justify-between"
                dir="ltr"
              >
                <span className="text-[10px] tracking-widest text-slate-400 uppercase dark:text-zinc-600">
                  Output
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={copyToClipboard}
                    className="rounded bg-white p-1 text-slate-400 shadow-sm transition-colors hover:text-slate-700 dark:bg-transparent dark:text-zinc-600 dark:shadow-none dark:hover:text-zinc-300"
                    title="Copy"
                  >
                    {isCopied ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div
                className="relative flex-1 overflow-x-auto overflow-y-auto p-6 pt-10"
                dir="ltr"
              >
                <AnimatePresence mode="wait">
                  {error ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 font-mono text-xs text-red-600 dark:border-red-500/10 dark:bg-red-500/5 dark:text-red-400"
                    >
                      <XCircle className="h-4 w-4 shrink-0" />
                      <span className="whitespace-pre-wrap">{error}</span>
                    </motion.div>
                  ) : output ? (
                    <pre className="min-w-full text-left font-mono text-[13px] leading-relaxed break-words whitespace-pre-wrap">
                      <code
                        dangerouslySetInnerHTML={{
                          __html:
                            output.length > 50000
                              ? escapeHtml(output)
                              : syntaxHighlight(output),
                        }}
                      />
                    </pre>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-200 dark:text-zinc-800">
                      <FileJson className="h-12 w-12 stroke-[1]" />
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Minimal Status Bar */}
              {statsData && output && !error && (
                <div
                  className="flex h-7 shrink-0 items-center justify-between border-t border-slate-200 bg-white px-4 font-mono text-[10px] tracking-wider text-slate-500 uppercase dark:border-white/5 dark:bg-[#000000] dark:text-zinc-600"
                  dir="ltr"
                >
                  <div className="flex items-center gap-4">
                    <span>{statsData.size} KB</span>
                    <span>Ln {statsData.lines}</span>
                    {statsData.comp !== 0 && (
                      <span
                        className={
                          statsData.comp > 0
                            ? "text-green-600 dark:text-green-500/70"
                            : "text-yellow-600 dark:text-yellow-500/70"
                        }
                      >
                        {statsData.comp > 0 ? "-" : "+"}
                        {Math.abs(statsData.comp)}%
                      </span>
                    )}
                  </div>
                  <div>
                    {processingLocation === "server" ? "Server" : "Client"}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
