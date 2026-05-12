"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import Editor, { useMonaco, loader } from "@monaco-editor/react"
import { useTheme } from "next-themes"
import {
  Sparkles,
  Trash2,
  Copy,
  CheckCircle2,
  FileJson,
  Minimize2,
  Loader2,
  Wand2,
  AlertTriangle,
} from "lucide-react"
import { toast } from "sonner"
import {
  useJsonFormatter,
  LARGE_FILE_THRESHOLD,
} from "@/hooks/useJsonFormatter"

export function JsonFormatter() {
  const { resolvedTheme } = useTheme()
  const [isCopied, setIsCopied] = useState(false)

  // Dynamically load the local monaco-editor engine ONLY in the browser
  // This bypasses the Next.js "window is not defined" SSR build error
  useEffect(() => {
    import("monaco-editor").then((monaco) => {
      loader.config({ monaco })
    })
  }, [])

  const {
    input,
    setInput,
    error,
    isProcessing,
    beautify,
    minify,
    attemptFix,
    clear,
  } = useJsonFormatter()

  const handleProcess = async (actionMode: "beautify" | "minify") => {
    if (!input.trim()) return

    const isSuccess =
      actionMode === "beautify" ? await beautify() : await minify()

    if (isSuccess) {
      const isLarge = new Blob([input]).size > LARGE_FILE_THRESHOLD
      toast.success(`پردازش موفق`, {
        icon: isLarge ? "☁️" : "✨",
        className:
          "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white",
      })
    }
  }

  const handleFix = async () => {
    const success = await attemptFix()
    if (success) {
      toast.success("خطاهای JSON برطرف شد!", {
        icon: "🪄",
        className:
          "bg-emerald-50 dark:bg-zinc-900 border-emerald-200 dark:border-zinc-800 text-emerald-700 dark:text-emerald-400",
      })
      await beautify()
    } else {
      toast.error("ساختار JSON بسیار آسیب‌دیده است. نیاز به اصلاح دستی دارد.", {
        className:
          "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-900 text-red-600 dark:text-red-200",
      })
    }
  }

  const copyToClipboard = async () => {
    if (!input) return
    await navigator.clipboard.writeText(input)
    setIsCopied(true)
    toast.success("کپی شد", {
      className:
        "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white",
    })
    setTimeout(() => setIsCopied(false), 2000)
  }

  const statsData = (() => {
    if (!input) return null
    const lines = input.split("\n").length
    const size = (new Blob([input]).size / 1024).toFixed(2)
    return { size, lines }
  })()

  return (
    <div
      className="min-h-[calc(100vh-4rem)] bg-slate-50 py-8 text-slate-900 transition-colors duration-300 selection:bg-blue-500/30 dark:bg-[#000000] dark:text-zinc-300"
      dir="rtl"
    >
      <div className="container mx-auto flex h-[calc(100vh-8rem)] max-w-[1200px] flex-col px-4">
        {/* Header & Main Controls */}
        <div className="mb-6 flex shrink-0 flex-col items-center justify-between gap-4 md:flex-row">
          <h1 className="flex items-center gap-2 text-2xl font-semibold text-slate-900 dark:text-white">
            <FileJson className="h-6 w-6 text-blue-500" />
            JSON Formatter
          </h1>

          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white/70 p-1.5 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-zinc-900/50">
            <button
              onClick={() => handleProcess("beautify")}
              disabled={isProcessing || !input}
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50 dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-white"
            >
              <Sparkles className="h-3.5 w-3.5" /> زیبا‌سازی
            </button>
            <button
              onClick={() => handleProcess("minify")}
              disabled={isProcessing || !input}
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50 dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-white"
            >
              <Minimize2 className="h-3.5 w-3.5" /> مینی‌فای
            </button>

            <div className="h-4 w-px bg-slate-200 dark:bg-white/10"></div>

            <button
              onClick={clear}
              className="rounded-lg px-2 py-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:text-zinc-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Unified Single Box */}
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-black/5 dark:border-white/10 dark:bg-[#0a0a0a] dark:ring-white/5">
          {/* Loading Overlay */}
          <AnimatePresence>
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm dark:bg-[#050505]/60"
              >
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Copy Button */}
          {input && (
            <div className="absolute top-4 right-6 z-10" dir="ltr">
              <button
                onClick={copyToClipboard}
                className="flex items-center justify-center rounded-md bg-white/80 p-2 text-slate-400 shadow-sm backdrop-blur-md transition-all hover:bg-white hover:text-slate-700 dark:bg-zinc-900/80 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                title="Copy to clipboard"
              >
                {isCopied ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          )}

          {/* Editor Area */}
          <div className="relative flex-1 overflow-hidden" dir="ltr">
            {input ? (
              <div className="h-full w-full pt-2">
                <Editor
                  height="100%"
                  language="json"
                  theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
                  value={input}
                  onChange={(val) => setInput(val || "")}
                  options={{
                    minimap: { enabled: false },
                    wordWrap: "on",
                    formatOnPaste: true,
                    folding: true,
                    lineNumbersMinChars: 3,
                    fontSize: 13,
                    fontFamily: "var(--font-mono)",
                    scrollBeyondLastLine: false,
                    padding: { top: 24, bottom: 24 }, // Extra top padding to clear the copy button
                  }}
                />
              </div>
            ) : (
              <div className="absolute inset-0 z-0">
                {/* Empty State Textarea to allow easy pasting */}
                <textarea
                  placeholder='{\n  "status": "ready",\n  "message": "paste your json here"\n}'
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="absolute inset-0 h-full w-full resize-none border-0 bg-transparent p-6 font-mono text-[13px] leading-relaxed text-slate-800 outline-none placeholder:text-slate-300 focus-visible:ring-0 dark:text-zinc-300 dark:placeholder:text-zinc-700"
                  spellCheck={false}
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <FileJson className="h-16 w-16 text-slate-200 dark:text-zinc-800" />
                </div>
              </div>
            )}
          </div>

          {/* Error Banner with Snippet Highlighting */}
          <AnimatePresence>
            {error && input && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-4 bottom-8 left-4 z-20 rounded-xl border border-amber-200 bg-amber-50/95 p-4 shadow-lg backdrop-blur-md dark:border-amber-500/20 dark:bg-amber-950/90"
                dir="ltr"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 overflow-hidden">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-amber-900 dark:text-amber-400">
                        Syntax Error Detected
                      </h4>

                      {error.snippet && (
                        <div className="mt-2 truncate rounded-md bg-white/50 px-3 py-2 font-mono text-[11px] text-amber-800 dark:bg-black/30 dark:text-amber-200">
                          <span className="mr-2 text-amber-500/50 select-none">
                            {error.line}:
                          </span>
                          <span className="relative">
                            {error.snippet}
                            <span className="absolute -bottom-1 left-0 h-px w-full bg-red-400/50 decoration-wavy"></span>
                          </span>
                        </div>
                      )}

                      <p className="mt-2 font-mono text-[10px] text-amber-700 dark:text-amber-500/70">
                        {error.message}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleFix}
                    className="group relative flex shrink-0 items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-amber-600 hover:shadow-md dark:bg-amber-500/20 dark:text-amber-300 dark:hover:bg-amber-500/30"
                  >
                    <Wand2 className="h-4 w-4" /> Auto-Fix
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500"></span>
                    </span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats Footer */}
          {statsData && !error && (
            <div
              className="flex h-8 shrink-0 items-center justify-between border-t border-slate-100 bg-white px-4 font-mono text-[10px] tracking-wider text-slate-400 uppercase dark:border-white/5 dark:bg-[#000000] dark:text-zinc-600"
              dir="ltr"
            >
              <div className="flex items-center gap-4">
                <span>{statsData.size} KB</span>
                <span>Ln {statsData.lines}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
