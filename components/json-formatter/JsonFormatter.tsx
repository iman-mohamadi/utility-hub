"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useJsonFormatter } from "@/hooks/useJsonFormatter"
import { Sparkles, Zap, Trash2, Copy, Download, Code } from "lucide-react"
import { toast } from "sonner"
import { useEffect } from "react"

export function JsonFormatter() {
  const formatter = useJsonFormatter()

  const handleCopy = async () => {
    const success = await formatter.copyToClipboard()
    if (success) {
      // ← Updated Sonner syntax
      toast.success("JSON در کلیپ‌بورد کپی شد!", {
        description: "می‌توانید آن را در هر جایی جایگذاری کنید",
        duration: 3000,
      })
    } else {
      toast.error("خطا در کپی کردن", {
        description: "لطفاً دوباره تلاش کنید",
      })
    }
  }

  const handleBeautify = () => {
    const success = formatter.beautify()
    if (success) {
      toast.success("JSON با موفقیت زیبا‌سازی شد", {
        icon: "✨",
      })
    }
  }

  const handleMinify = () => {
    const success = formatter.minify()
    if (success) {
      toast.success("JSON با موفقیت مینی‌فای شد", {
        icon: "⚡",
      })
    }
  }

  const handleClear = () => {
    formatter.clear()
    toast.info("همه چیز پاک شد", {
      icon: "🗑️",
    })
  }

  const handleLoadExample = () => {
    formatter.loadExample()
    toast.success("مثال JSON بارگذاری شد", {
      description: "حالا می‌توانید آن را ویرایش کنید",
    })
  }

  const handleDownload = () => {
    formatter.download()
    toast.success("فایل با موفقیت دانلود شد", {
      description: `فرمت: ${formatter.mode === "beautify" ? "زیبا‌سازی شده" : "مینی‌فای شده"}.json`,
    })
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault()
        formatter.beautify()
        toast.success("JSON زیبا‌سازی شد", { icon: "✨" })
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "m") {
        e.preventDefault()
        formatter.minify()
        toast.success("JSON مینی‌فای شد", { icon: "⚡" })
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [formatter])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">فرمت‌کننده JSON</h1>
        <p className="text-muted-foreground">
          فرمت، مینی‌فای و اعتبارسنجی JSON با آمار لحظه‌ای
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-3">
        <Button
          onClick={handleBeautify}
          disabled={formatter.isLoading}
          variant={formatter.mode === "beautify" ? "default" : "outline"}
        >
          <Sparkles className="ml-2 h-4 w-4" />
          زیبا‌سازی
        </Button>

        <Button
          onClick={handleMinify}
          disabled={formatter.isLoading}
          variant={formatter.mode === "minify" ? "default" : "outline"}
        >
          <Zap className="ml-2 h-4 w-4" />
          مینی‌فای
        </Button>

        <Button onClick={handleLoadExample} variant="outline">
          <Code className="ml-2 h-4 w-4" />
          مثال
        </Button>

        <Button onClick={handleClear} variant="destructive">
          <Trash2 className="ml-2 h-4 w-4" />
          پاک کردن
        </Button>
      </div>

      {/* Input & Output Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Input Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>ورودی JSON</span>
              {formatter.input && (
                <Badge variant={formatter.isValid ? "default" : "destructive"}>
                  {formatter.isValid ? "✓ JSON معتبر" : "✗ JSON نامعتبر"}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder='{"name": "example", "value": 123}'
              value={formatter.input}
              onChange={(e) => formatter.setInput(e.target.value)}
              className="min-h-[400px] font-mono text-sm"
              dir="ltr"
            />
            {formatter.error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{formatter.error}</AlertDescription>
              </Alert>
            )}
            {formatter.input && (
              <div className="mt-3 text-right text-xs text-muted-foreground">
                {formatter.input.length.toLocaleString("fa-IR")} کاراکتر
              </div>
            )}
          </CardContent>
        </Card>

        {/* Output Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>خروجی JSON</span>
              {formatter.output && (
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={handleCopy}>
                    <Copy className="ml-1 h-4 w-4" />
                    کپی
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleDownload}>
                    <Download className="ml-1 h-4 w-4" />
                    دانلود
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formatter.output}
              readOnly
              className="min-h-[400px] bg-muted font-mono text-sm"
              dir="ltr"
              placeholder="JSON فرمت شده در اینجا نمایش داده می‌شود..."
            />
            {formatter.stats && (
              <div className="mt-3 grid grid-cols-3 gap-3 text-center text-xs text-muted-foreground">
                <div>
                  <div className="font-semibold">حجم خروجی</div>
                  <div>{(formatter.stats.outputSize / 1024).toFixed(2)} KB</div>
                </div>
                <div>
                  <div className="font-semibold">تعداد خطوط</div>
                  <div>{formatter.stats.outputLines}</div>
                </div>
                <div>
                  <div className="font-semibold">فشرده‌سازی</div>
                  <div
                    className={
                      formatter.stats.compression > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {formatter.stats.compression > 0 ? "-" : "+"}
                    {Math.abs(formatter.stats.compression)}%
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pro Tips Alert */}
      <Alert>
        <AlertDescription className="text-right">
          <strong>💡 نکات حرفه‌ای:</strong>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              •{" "}
              <kbd className="rounded bg-muted px-1 py-0.5">
                Ctrl/Cmd + Enter
              </kbd>{" "}
              برای زیبا‌سازی
            </li>
            <li>
              • <kbd className="rounded bg-muted px-1 py-0.5">Ctrl/Cmd + M</kbd>{" "}
              برای مینی‌فای
            </li>
            <li>• پشتیبانی از فایل‌های بزرگ JSON (پردازش در مرورگر شما)</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  )
}
