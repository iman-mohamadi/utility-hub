"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"
import { Textarea } from "@/components/ui/textarea"
import {
  Share2,
  Search,
  Clipboard,
  Copy,
  CheckCircle2,
  Loader2,
  Link as LinkIcon,
  X,
  Keyboard,
} from "lucide-react"
import { toast } from "sonner"

export function CopyPaste() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [content, setContent] = useState("")
  const [searchCode, setSearchCode] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentCode, setCurrentCode] = useState<string | null>(null)

  const [isUrlCopied, setIsUrlCopied] = useState(false)
  const [isContentCopied, setIsContentCopied] = useState(false)

  // 1. Fetch text by code (Only called by useEffect now)
  const handleFetchCode = useCallback(
    async (codeToFetch: string) => {
      if (!codeToFetch.trim()) return

      setIsLoading(true)
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      try {
        const response = await fetch(`${apiUrl}/api/pastes/${codeToFetch}`)
        const data = await response.json()

        if (response.ok) {
          setContent(data.content)
          setCurrentCode(codeToFetch)
          toast.success("متن با موفقیت دریافت شد", {
            className:
              "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white",
          })
          // حذف شد: ما دیگر اینجا router.replace نمی‌کنیم چون خود URL باعث این درخواست شده است
        } else {
          toast.error(data.error || "کد نامعتبر است یا منقضی شده", {
            className:
              "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-900 text-red-600 dark:text-red-200",
          })
          // اگر کد اشتباه بود، URL را پاک می‌کنیم
          router.replace("/copy-paste")
        }
      } catch (error) {
        toast.error("خطا در ارتباط با سرور (آیا سرور بک‌اند روشن است؟)", {
          className:
            "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-900 text-red-600 dark:text-red-200",
        })
        router.replace("/copy-paste")
      } finally {
        setIsLoading(false)
      }
    },
    [router]
  )

  // 2. The Single Source of Truth (تنها منبع حقیقت)
  // 2. The Single Source of Truth (تنها منبع حقیقت)
  useEffect(() => {
    const codeFromUrl = searchParams.get("code")

    if (codeFromUrl) {
      if (codeFromUrl !== currentCode) {
        setSearchCode(codeFromUrl)
        handleFetchCode(codeFromUrl)
      }
    } else {
      // FIX: Only reset the screen if we ACTUALLY had a code loaded before.
      // Do not touch the content if the user is just typing on a fresh page!
      if (currentCode !== null) {
        setContent("")
        setSearchCode("")
        setCurrentCode(null)
      }
    }
  }, [searchParams, handleFetchCode, currentCode])

  // 3. Share text and generate code
  const handleShare = useCallback(async () => {
    if (!content.trim() || currentCode) return

    setIsSaving(true)

    try {
      const response = await fetch("http://localhost:5000/api/pastes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })

      const data = await response.json()

      if (response.ok) {
        const newCode = data.id

        // اول استیت را آپدیت می‌کنیم تا useEffect بداند که این کد مال خودمان است و نباید دوباره فچ کند
        setCurrentCode(newCode)
        setSearchCode(newCode)

        // سپس URL را تغییر می‌دهیم
        router.push(`/copy-paste?code=${newCode}`)

        toast.success("لینک و کد با موفقیت ساخته شد!", {
          icon: "🎉",
          className:
            "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white",
        })
      } else {
        toast.error(data.error || "خطا در ایجاد لینک")
      }
    } catch (error) {
      toast.error("خطا در ارتباط با سرور", {
        className:
          "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-900 text-red-600 dark:text-red-200",
      })
    } finally {
      setIsSaving(false)
    }
  }, [content, currentCode, router])

  // 4. Keyboard Shortcuts (Cmd/Ctrl + S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault()
        if (content.trim() && !currentCode) {
          handleShare()
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [content, currentCode, handleShare])

  const handleClearSearch = () => {
    router.push("/copy-paste")
  }

  const copyUrlToClipboard = async () => {
    const urlToCopy = `${window.location.origin}/copy-paste?code=${currentCode}`
    await navigator.clipboard.writeText(urlToCopy)
    setIsUrlCopied(true)
    toast.success("لینک در کلیپ‌بورد کپی شد", {
      className:
        "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white",
    })
    setTimeout(() => setIsUrlCopied(false), 2000)
  }

  const copyContentToClipboard = async () => {
    if (!content) return
    await navigator.clipboard.writeText(content)
    setIsContentCopied(true)
    toast.success("متن در کلیپ‌بورد کپی شد", {
      className:
        "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white",
    })
    setTimeout(() => setIsContentCopied(false), 2000)
  }

  const statsData = {
    chars: content.length,
    lines: content ? content.split("\n").length : 0,
    words: content.trim() ? content.trim().split(/\s+/).length : 0,
  }

  return (
    <div
      className="min-h-[calc(100vh-4rem)] bg-slate-50 py-8 text-slate-900 transition-colors duration-300 dark:bg-[#000000] dark:text-zinc-300"
      dir="rtl"
    >
      <div className="container mx-auto flex h-[calc(100vh-8rem)] max-w-[1000px] flex-col px-4">
        <div className="mb-6 flex shrink-0 flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="mb-2 flex items-center gap-2 text-2xl font-semibold text-slate-900 dark:text-white">
              <Clipboard className="h-5 w-5 text-purple-500" />
              اشتراک‌گذاری کد و متن
            </h1>
            <p className="text-xs text-slate-500 dark:text-zinc-500">
              متن خود را بنویسید، اشتراک‌گذاری کنید و کد دریافت نمایید.
            </p>
          </div>

          <div className="flex w-full items-center rounded-lg border border-slate-200 bg-white p-1 shadow-sm backdrop-blur-sm transition-all focus-within:border-purple-500/30 focus-within:ring-2 focus-within:ring-purple-500/20 md:w-auto dark:border-white/10 dark:bg-zinc-900/50 dark:shadow-none">
            <div className="relative flex w-full items-center md:w-48">
              <input
                type="text"
                placeholder="کد دریافت (مثلاً 2258)"
                value={searchCode}
                onChange={(e) => {
                  const val = e.target.value
                  setSearchCode(val)
                  if (val.trim() === "") {
                    router.push("/copy-paste")
                  }
                }}
                onKeyDown={(e) => {
                  // تغییر اصلی: فقط URL را عوض می‌کنیم، نه اجرای مستقیم fetch
                  if (e.key === "Enter" && searchCode.trim()) {
                    router.push(`/copy-paste?code=${searchCode}`)
                  }
                }}
                className="w-full bg-transparent px-3 py-1.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none dark:text-zinc-200 dark:placeholder:text-zinc-600"
                dir="ltr"
              />
              <AnimatePresence>
                {searchCode && (
                  <motion.button
                    type="button"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={handleClearSearch}
                    className="absolute right-2 rounded-full bg-white p-1 text-slate-400 transition-colors hover:text-slate-600 dark:bg-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-300"
                  >
                    <X className="h-3.5 w-3.5" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <div className="mx-1 h-5 w-px bg-slate-200 dark:bg-white/10"></div>

            <button
              type="button"
              // تغییر اصلی: فقط URL را عوض می‌کنیم
              onClick={() => router.push(`/copy-paste?code=${searchCode}`)}
              disabled={isLoading || !searchCode.trim()}
              className="flex items-center gap-2 rounded-md px-4 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 disabled:opacity-50 dark:text-zinc-300 dark:hover:bg-white/5"
            >
              {isLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Search className="h-3.5 w-3.5" />
              )}
              مشاهده
            </button>
          </div>
        </div>

        <div className="group relative flex flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-slate-300 dark:border-white/10 dark:bg-[#0a0a0a] dark:shadow-none dark:hover:border-white/20">
          <AnimatePresence>
            {content && (
              <motion.button
                type="button"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={copyContentToClipboard}
                className="absolute top-4 right-4 z-10 rounded-md border border-slate-200 bg-slate-100 p-2 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                title="کپی کردن متن"
              >
                {isContentCopied ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </motion.button>
            )}
          </AnimatePresence>

          <Textarea
            placeholder="کد یا متن خود را اینجا وارد کنید..."
            value={content}
            onChange={(e) => {
              setContent(e.target.value)
              if (currentCode) {
                router.replace("/copy-paste")
              }
            }}
            className="h-full w-full flex-1 resize-none overflow-y-auto border-0 bg-transparent p-6 pt-14 pb-20 text-left font-mono text-[14px] leading-relaxed text-slate-800 outline-none placeholder:text-slate-400 focus-visible:ring-0 md:pt-6 dark:text-zinc-300 dark:placeholder:text-zinc-800"
            dir="ltr"
            spellCheck={false}
          />

          <div
            className="absolute bottom-4 left-4 flex items-center gap-2"
            dir="ltr"
          >
            <AnimatePresence mode="wait">
              {!currentCode ? (
                <motion.button
                  key="share-btn"
                  type="button"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={handleShare}
                  disabled={isSaving || !content.trim()}
                  className="flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:bg-slate-800 disabled:bg-slate-900/50 dark:bg-white dark:text-black dark:hover:bg-zinc-200 dark:disabled:bg-white/50 dark:disabled:text-black/50"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Share2 className="h-4 w-4" />
                  )}
                  {isSaving ? "Saving..." : "Share text"}

                  <span className="ml-2 hidden items-center border-l border-white/20 pl-2 text-[10px] opacity-70 md:flex dark:border-black/20">
                    <Keyboard className="mr-1 h-3 w-3" />
                    ⌘S
                  </span>
                </motion.button>
              ) : (
                <motion.div
                  key="shared-state"
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="flex items-center rounded-lg border border-purple-200 bg-purple-50 p-1 shadow-lg backdrop-blur-md dark:border-purple-500/20 dark:bg-purple-500/10"
                >
                  <span className="px-3 font-mono text-sm font-bold text-purple-700 dark:text-purple-400">
                    Code: {currentCode}
                  </span>
                  <div className="mx-1 h-5 w-px bg-purple-200 dark:bg-purple-500/20"></div>
                  <button
                    type="button"
                    onClick={copyUrlToClipboard}
                    className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-purple-700 transition-colors hover:bg-purple-100 dark:text-purple-400 dark:hover:bg-purple-500/20"
                  >
                    {isUrlCopied ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <LinkIcon className="h-3.5 w-3.5" />
                    )}
                    Copy Link
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div
            className="absolute right-6 bottom-6 flex items-center gap-4 font-mono text-[10px] tracking-wider text-slate-400 uppercase transition-opacity dark:text-zinc-600"
            dir="ltr"
          >
            <span>{statsData.chars} Chars</span>
            <span className="hidden md:inline">{statsData.words} Words</span>
            <span>{statsData.lines} Lines</span>
          </div>
        </div>
      </div>
    </div>
  )
}
