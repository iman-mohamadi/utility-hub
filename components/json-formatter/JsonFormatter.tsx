"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Sparkles, 
  Zap, 
  Trash2, 
  Copy, 
  Download, 
  CheckCircle2,
  XCircle,
  ArrowRightLeft,
  FileJson,
  Braces,
  Cloud,
  Cpu
} from "lucide-react"
import { toast } from "sonner"

const LARGE_FILE_THRESHOLD = 100 * 1024 // 100KB

export function JsonFormatter() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [isValid, setIsValid] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState<"beautify" | "minify">("beautify")
  const [isCopied, setIsCopied] = useState(false)
  const [processingLocation, setProcessingLocation] = useState<"client" | "server" | null>(null)

  // Process on frontend (fast, private)
  const processOnClient = useCallback((jsonString: string, formatMode: "beautify" | "minify") => {
    const parsed = JSON.parse(jsonString)
    const result = formatMode === "beautify" 
      ? JSON.stringify(parsed, null, 2)
      : JSON.stringify(parsed)
    
    setOutput(result)
    setIsValid(true)
    setProcessingLocation("client")
    return result
  }, [])

  // Process on backend (for large files)
  const processOnServer = useCallback(async (jsonString: string, formatMode: "beautify" | "minify") => {
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
    return result.data
  }, [])

  // Smart processing: choose client or server based on size
  const beautify = useCallback(async () => {
    if (!input.trim()) {
      setError("لطفاً JSON را وارد کنید")
      toast.error("لطفاً JSON را وارد کنید")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const size = new Blob([input]).size
      const useServer = size > LARGE_FILE_THRESHOLD

      if (useServer) {
        await processOnServer(input, "beautify")
        toast.success("JSON با موفقیت در سرور زیبا‌سازی شد", { icon: "☁️" })
      } else {
        processOnClient(input, "beautify")
        toast.success("JSON با موفقیت زیبا‌سازی شد", { icon: "✨" })
      }
      
      setMode("beautify")
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "JSON نامعتبر"
      setError(errorMsg)
      setIsValid(false)
      setOutput("")
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }, [input, processOnClient, processOnServer])

  const minify = useCallback(async () => {
    if (!input.trim()) {
      setError("لطفاً JSON را وارد کنید")
      toast.error("لطفاً JSON را وارد کنید")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const size = new Blob([input]).size
      const useServer = size > LARGE_FILE_THRESHOLD

      if (useServer) {
        await processOnServer(input, "minify")
        toast.success("JSON با موفقیت در سرور مینی‌فای شد", { icon: "☁️" })
      } else {
        processOnClient(input, "minify")
        toast.success("JSON با موفقیت مینی‌فای شد", { icon: "⚡" })
      }
      
      setMode("minify")
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "JSON نامعتبر"
      setError(errorMsg)
      setIsValid(false)
      setOutput("")
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }, [input, processOnClient, processOnServer])

  const clear = () => {
    setInput("")
    setOutput("")
    setError("")
    setIsValid(false)
    setProcessingLocation(null)
    toast.info("همه چیز پاک شد", { icon: "🗑️" })
  }

  const copyToClipboard = async () => {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
      setIsCopied(true)
      toast.success("در کلیپ‌بورد کپی شد!", { icon: "📋" })
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      toast.error("خطا در کپی کردن")
    }
  }

  const download = () => {
    if (!output) return
    const blob = new Blob([output], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = mode === "beautify" ? "formatted.json" : "minified.json"
    a.click()
    URL.revokeObjectURL(url)
    toast.success("فایل با موفقیت دانلود شد")
  }

  // Calculate stats
  const stats = useCallback(() => {
    if (!output) return null
    const inputSize = new Blob([input]).size
    const outputSize = new Blob([output]).size
    return {
      inputSize,
      outputSize,
      compression: inputSize ? Math.round((1 - outputSize / inputSize) * 100) : 0,
      inputLines: input.split("\n").length,
      outputLines: output.split("\n").length,
    }
  }, [input, output])

  const statsData = stats()

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault()
        beautify()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "m") {
        e.preventDefault()
        minify()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [beautify, minify])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header - Persian RTL */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
          dir="rtl"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <motion.div 
              className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg"
              whileHover={{ rotate: [0, -10, 10, -5, 5, 0], transition: { duration: 0.5 } }}
            >
              <Braces className="w-6 h-6 text-white" />
            </motion.div>
            <Badge variant="outline" className="text-sm px-4 py-1 rounded-full">
              ابزار حرفه‌ای
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 dark:from-white dark:via-blue-400 dark:to-white bg-clip-text text-transparent">
            فرمت‌کننده JSON
          </h1>
          <p className="text-muted-foreground text-lg">
            زیبا‌سازی، مینی‌فای و اعتبارسنجی JSON در لحظه
          </p>
        </motion.div>

        {/* Action Buttons - Persian RTL */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-3 justify-center mb-8"
          dir="rtl"
        >
          <Button
            onClick={beautify}
            disabled={isLoading}
            variant={mode === "beautify" ? "default" : "outline"}
            className="gap-2"
          >
            <Sparkles className="w-4 h-4" />
            زیبا‌سازی
            <kbd className="hidden md:inline-block px-1.5 py-0.5 text-xs bg-white/20 rounded mr-1">⌘↵</kbd>
          </Button>
          
          <Button
            onClick={minify}
            disabled={isLoading}
            variant={mode === "minify" ? "default" : "outline"}
            className="gap-2"
          >
            <Zap className="w-4 h-4" />
            مینی‌فای
            <kbd className="hidden md:inline-block px-1.5 py-0.5 text-xs bg-white/20 rounded mr-1">⌘M</kbd>
          </Button>
          
          <Button onClick={clear} variant="outline" className="gap-2">
            <Trash2 className="w-4 h-4" />
            پاک کردن
          </Button>
        </motion.div>

        {/* Main Editor Grid - JSON content LTR */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="relative overflow-hidden border-0 shadow-xl">
              <motion.div 
                className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.3 }}
              />
              <div className="p-4 border-b bg-muted/30">
                <div className="flex justify-between items-center" dir="rtl">
                  <div className="flex items-center gap-2">
                    <FileJson className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">ورودی JSON</span>
                  </div>
                  {input && (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={isValid ? "valid" : "invalid"}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <Badge variant={isValid ? "default" : "destructive"} className="gap-1">
                          {isValid ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              معتبر
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" />
                              نامعتبر
                            </>
                          )}
                        </Badge>
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
              </div>
              <div className="p-4">
                <Textarea
                  placeholder={`{
  "name": "example",
  "value": 123
}`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="font-mono text-sm min-h-[500px] resize-none border-0 shadow-none focus-visible:ring-0 p-0"
                  dir="ltr"
                  style={{ textAlign: "left" }}
                />
              </div>
              {input && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="p-4 border-t bg-muted/30 text-xs text-muted-foreground"
                  dir="rtl"
                >
                  {input.length.toLocaleString("fa-IR")} کاراکتر • {statsData?.inputLines} خط
                </motion.div>
              )}
            </Card>
          </motion.div>

          {/* Output Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="relative overflow-hidden border-0 shadow-xl h-full">
              <motion.div 
                className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4 }}
              />
              <div className="p-4 border-b bg-muted/30">
                <div className="flex justify-between items-center" dir="rtl">
                  <div className="flex items-center gap-2">
                    <ArrowRightLeft className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">خروجی JSON</span>
                  </div>
                  {output && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={copyToClipboard}
                        className="h-8 gap-1"
                      >
                        <motion.div
                          animate={isCopied ? { scale: [1, 1.2, 1] } : {}}
                          transition={{ duration: 0.3 }}
                        >
                          {isCopied ? (
                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </motion.div>
                        کپی
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={download}
                        className="h-8 gap-1"
                      >
                        <Download className="w-3 h-3" />
                        دانلود
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-4">
                <AnimatePresence mode="wait">
                  {error ? (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      <Alert variant="destructive" className="border-0 bg-red-50 dark:bg-red-950/20">
                        <XCircle className="h-4 w-4" />
                        <AlertDescription className="font-mono text-sm">
                          {error}
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  ) : output ? (
                    <motion.div
                      key="output"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="relative"
                    >
                      <pre 
                        className="font-mono text-sm min-h-[500px] overflow-auto whitespace-pre-wrap break-words"
                        dir="ltr"
                        style={{ textAlign: "left" }}
                      >
                        <code>{output}</code>
                      </pre>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex flex-col items-center justify-center min-h-[500px] text-muted-foreground"
                      dir="rtl"
                    >
                      <motion.div
                        animate={{ 
                          scale: [1, 1.05, 1],
                          rotate: [0, -5, 5, -3, 3, 0]
                        }}
                        transition={{ 
                          duration: 3,
                          repeat: Infinity,
                          repeatDelay: 2
                        }}
                      >
                        <Braces className="w-16 h-16 mb-4 opacity-20" />
                      </motion.div>
                      <p className="text-center">
                        JSON فرمت شده در اینجا نمایش داده می‌شود
                      </p>
                      <p className="text-sm text-center mt-2">
                        برای شروع، JSON خود را در بخش ورودی جایگذاری کنید
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {statsData && output && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="p-4 border-t bg-muted/30"
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs" dir="rtl">
                    <div className="text-center">
                      <div className="text-muted-foreground mb-1">حجم خروجی</div>
                      <div className="font-mono font-semibold">
                        {(statsData.outputSize / 1024).toFixed(2)} KB
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-muted-foreground mb-1">تعداد خطوط</div>
                      <div className="font-mono font-semibold">
                        {statsData.outputLines}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-muted-foreground mb-1">فشرده‌سازی</div>
                      <div className={`font-mono font-semibold ${statsData.compression > 0 ? "text-green-600" : statsData.compression < 0 ? "text-orange-600" : ""}`}>
                        {statsData.compression > 0 ? "-" : "+"}{Math.abs(statsData.compression)}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-muted-foreground mb-1">حالت فعلی</div>
                      <div className="font-mono font-semibold">
                        {mode === "beautify" ? "زیبا‌سازی" : "مینی‌فای"}
                      </div>
                    </div>
                  </div>
                  
                  {/* Processing Location Badge */}
                  {processingLocation && (
                    <div className="mt-3 flex justify-center">
                      <Badge variant="outline" className="gap-1">
                        {processingLocation === "server" ? (
                          <>
                            <Cloud className="w-3 h-3" />
                            پردازش شده در سرور (فایل بزرگ)
                          </>
                        ) : (
                          <>
                            <Cpu className="w-3 h-3" />
                            پردازش شده در مرورگر (سریع و خصوصی)
                          </>
                        )}
                      </Badge>
                    </div>
                  )}
                </motion.div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Keyboard Shortcuts Hint - Persian RTL */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center text-xs text-muted-foreground"
          dir="rtl"
        >
          <span className="inline-flex items-center gap-4">
            <span>⌘ + Enter</span>
            <span className="text-muted-foreground/50">•</span>
            <span>زیبا‌سازی سریع</span>
            <span className="text-muted-foreground/50">•</span>
            <span>⌘ + M</span>
            <span className="text-muted-foreground/50">•</span>
            <span>مینی‌فای سریع</span>
          </span>
        </motion.div>
      </div>
    </div>
  )
}