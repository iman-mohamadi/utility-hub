// components/copy-paste/CopyPaste.tsx
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
  Lock,
  Unlock,
  Trash2,
  ShieldCheck,
  EyeOff,
} from "lucide-react"
import { toast } from "sonner"

// Helper to manage delete tokens in local storage
const tokenStorage = {
  save: (id: string, token: string) => {
    if (typeof window === "undefined") return
    const tokens = JSON.parse(localStorage.getItem("paste_tokens") || "{}")
    tokens[id] = token
    localStorage.setItem("paste_tokens", JSON.stringify(tokens))
  },
  get: (id: string) => {
    if (typeof window === "undefined") return null
    const tokens = JSON.parse(localStorage.getItem("paste_tokens") || "{}")
    return tokens[id] || null
  },
  remove: (id: string) => {
    if (typeof window === "undefined") return
    const tokens = JSON.parse(localStorage.getItem("paste_tokens") || "{}")
    delete tokens[id]
    localStorage.setItem("paste_tokens", JSON.stringify(tokens))
  },
}

export function CopyPaste() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [content, setContent] = useState("")
  const [searchCode, setSearchCode] = useState("")
  const [currentCode, setCurrentCode] = useState<string | null>(null)

  // Loading states
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Password Feature States
  const [createPassword, setCreatePassword] = useState("")
  const [showPasswordInput, setShowPasswordInput] = useState(false)

  // Unlock Feature States
  const [isLocked, setIsLocked] = useState(false)
  const [unlockPassword, setUnlockPassword] = useState("")

  // Copy States
  const [isUrlCopied, setIsUrlCopied] = useState(false)
  const [isContentCopied, setIsContentCopied] = useState(false)

  // 1. Fetch text by code
  const handleFetchCode = useCallback(
    async (codeToFetch: string, passwordAttempt?: string) => {
      if (!codeToFetch.trim()) return

      setIsLoading(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

      try {
        const headers: HeadersInit = {}
        // Send password in header if attempting to unlock
        if (passwordAttempt) {
          headers["x-paste-password"] = passwordAttempt
        }

        const response = await fetch(`${apiUrl}/api/pastes/${codeToFetch}`, {
          headers,
        })
        const data = await response.json()

        // Handle Password Protected Paste
        if (response.status === 401 || data.requirePassword) {
          setIsLocked(true)
          setCurrentCode(codeToFetch)
          if (passwordAttempt) {
            toast.error("رمز عبور اشتباه است", {
              className:
                "bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-200 border-red-200 dark:border-red-900",
            })
          }
          setIsLoading(false)
          return
        }

        if (response.ok) {
          setContent(data.content)
          setCurrentCode(codeToFetch)
          setIsLocked(false)
          setUnlockPassword("")
          toast.success("متن با موفقیت دریافت شد", {
            className:
              "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white",
          })
        } else {
          toast.error(data.error || "کد نامعتبر است یا منقضی شده", {
            className:
              "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-900 text-red-600 dark:text-red-200",
          })
          router.replace("/copy-paste")
        }
      } catch (error) {
        toast.error("خطا در ارتباط با سرور", {
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

  useEffect(() => {
    const codeFromUrl = searchParams.get("code")

    if (codeFromUrl) {
      if (codeFromUrl !== currentCode) {
        setSearchCode(codeFromUrl)
        handleFetchCode(codeFromUrl)
      }
    } else {
      if (currentCode !== null) {
        setContent("")
        setSearchCode("")
        setCurrentCode(null)
        setIsLocked(false)
        setCreatePassword("")
        setShowPasswordInput(false)
      }
    }
  }, [searchParams, handleFetchCode, currentCode])

  // 2. Share text
  const handleShare = useCallback(async () => {
    if (!content.trim() || currentCode) return

    setIsSaving(true)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

    try {
      const payload: any = { content }
      if (createPassword.trim()) {
        payload.password = createPassword.trim()
      }

      const response = await fetch(`${apiUrl}/api/pastes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok) {
        const newCode = data.id

        // SAVE DELETE TOKEN TO LOCAL STORAGE
        if (data.deleteToken) {
          tokenStorage.save(newCode, data.deleteToken)
        }

        setCurrentCode(newCode)
        setSearchCode(newCode)
        router.push(`/copy-paste?code=${newCode}`)

        toast.success(
          createPassword
            ? "متن با رمز عبور قفل و ذخیره شد!"
            : "لینک و کد با موفقیت ساخته شد!",
          {
            icon: createPassword ? "🔒" : "🎉",
            className:
              "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white",
          }
        )
      } else {
        toast.error(data.error || "خطا در ایجاد لینک")
      }
    } catch (error) {
      toast.error("خطا در ارتباط با سرور")
    } finally {
      setIsSaving(false)
    }
  }, [content, currentCode, router, createPassword])

  // 3. Delete text
  const handleDelete = async () => {
    if (!currentCode) return
    const token = tokenStorage.get(currentCode)
    if (!token) return

    setIsDeleting(true)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

    try {
      const response = await fetch(`${apiUrl}/api/pastes/${currentCode}`, {
        method: "DELETE",
        headers: {
          "x-delete-token": token,
        },
      })

      if (response.ok) {
        toast.success("متن با موفقیت از سرور حذف شد", { icon: "🗑️" })
        tokenStorage.remove(currentCode)
        router.push("/copy-paste")
      } else {
        const data = await response.json()
        toast.error(data.error || "خطا در حذف متن")
      }
    } catch (e) {
      toast.error("خطا در ارتباط با سرور")
    } finally {
      setIsDeleting(false)
    }
  }

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault()
        if (content.trim() && !currentCode && !isLocked) {
          handleShare()
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [content, currentCode, isLocked, handleShare])

  const copyUrlToClipboard = async () => {
    const urlToCopy = `${window.location.origin}/copy-paste?code=${currentCode}`
    await navigator.clipboard.writeText(urlToCopy)
    setIsUrlCopied(true)
    toast.success("لینک کپی شد")
    setTimeout(() => setIsUrlCopied(false), 2000)
  }

  const copyContentToClipboard = async () => {
    if (!content) return
    await navigator.clipboard.writeText(content)
    setIsContentCopied(true)
    toast.success("متن کپی شد")
    setTimeout(() => setIsContentCopied(false), 2000)
  }

  const statsData = {
    chars: content.length,
    lines: content ? content.split("\n").length : 0,
    words: content.trim() ? content.trim().split(/\s+/).length : 0,
  }

  // Check if current user is the owner (has the delete token)
  const isOwner = currentCode ? !!tokenStorage.get(currentCode) : false

  return (
    <div
      className="min-h-[calc(100vh-4rem)] bg-slate-50 py-8 text-slate-900 transition-colors duration-300 dark:bg-[#000000] dark:text-zinc-300"
      dir="rtl"
    >
      <div className="container mx-auto flex h-[calc(100vh-8rem)] max-w-[1000px] flex-col px-4">
        {/* Header */}
        <div className="mb-6 flex shrink-0 flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="mb-2 flex items-center gap-2 text-2xl font-semibold text-slate-900 dark:text-white">
              <Clipboard className="h-5 w-5 text-purple-500" />
              اشتراک‌گذاری کد و متن
            </h1>
            <p className="text-xs text-slate-500 dark:text-zinc-500">
              متن خود را بنویسید، ایمن کنید و اشتراک‌گذاری کنید.
            </p>
          </div>

          <div className="flex w-full items-center rounded-lg border border-slate-200 bg-white p-1 shadow-sm backdrop-blur-sm focus-within:border-purple-500/30 focus-within:ring-2 focus-within:ring-purple-500/20 md:w-auto dark:border-white/10 dark:bg-zinc-900/50">
            <div className="relative flex w-full items-center md:w-48">
              <input
                type="text"
                placeholder="کد دریافت (مثلاً 2258)"
                value={searchCode}
                onChange={(e) => {
                  const val = e.target.value
                  setSearchCode(val)
                  if (val.trim() === "") router.push("/copy-paste")
                }}
                onKeyDown={(e) => {
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
                    onClick={() => router.push("/copy-paste")}
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
              onClick={() => router.push(`/copy-paste?code=${searchCode}`)}
              disabled={isLoading || !searchCode.trim()}
              className="flex items-center gap-2 rounded-md px-4 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 disabled:opacity-50 dark:text-zinc-300 dark:hover:bg-white/5"
            >
              {isLoading && !isLocked ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Search className="h-3.5 w-3.5" />
              )}
              مشاهده
            </button>
          </div>
        </div>

        {/* Main Editor/Viewer Area */}
        <div className="group relative flex flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:border-slate-300 dark:border-white/10 dark:bg-[#0a0a0a] dark:hover:border-white/20">
          {/* Unlock Overlay */}
          <AnimatePresence>
            {isLocked && currentCode && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-md dark:bg-[#0a0a0a]/80"
              >
                <div className="flex w-full max-w-sm flex-col items-center rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-white/10 dark:bg-zinc-900">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
                    <Lock className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                    محتوای محافظت شده
                  </h3>
                  <p className="mb-6 text-center text-xs text-slate-500 dark:text-zinc-400">
                    این متن توسط سازنده با رمز عبور قفل شده است. برای مشاهده،
                    رمز عبور را وارد کنید.
                  </p>

                  <div className="flex w-full flex-col gap-3">
                    <input
                      type="password"
                      placeholder="رمز عبور..."
                      value={unlockPassword}
                      onChange={(e) => setUnlockPassword(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        handleFetchCode(currentCode, unlockPassword)
                      }
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-colors outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 dark:border-zinc-800 dark:bg-[#050505] dark:text-white"
                      dir="ltr"
                      autoComplete="one-time-code"
                      name="unlock-paste-password"
                      id="unlock-paste-password"
                      data-1p-ignore="true"
                      data-lpignore="true"
                      data-form-type="other"
                    />
                    <button
                      onClick={() =>
                        handleFetchCode(currentCode, unlockPassword)
                      }
                      disabled={isLoading || !unlockPassword}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Unlock className="h-4 w-4" />
                      )}
                      باز کردن قفل
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {content && !isLocked && (
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
              if (currentCode) router.replace("/copy-paste")
            }}
            className="h-full w-full flex-1 resize-none overflow-y-auto border-0 bg-transparent p-6 pt-14 pb-24 text-left font-mono text-[14px] leading-relaxed text-slate-800 outline-none placeholder:text-slate-400 focus-visible:ring-0 md:pt-6 dark:text-zinc-300 dark:placeholder:text-zinc-800"
            dir="ltr"
            spellCheck={false}
          />

          {/* Action Bar */}
          <div
            className="absolute bottom-4 left-4 flex flex-col items-start gap-3 md:flex-row md:items-center"
            dir="ltr"
          >
            <AnimatePresence mode="wait">
              {!currentCode ? (
                <motion.div
                  key="create-mode"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 rounded-xl bg-white p-1 shadow-lg ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10"
                >
                  <button
                    type="button"
                    onClick={handleShare}
                    disabled={isSaving || !content.trim()}
                    className="flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white transition-all hover:bg-slate-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Share2 className="h-4 w-4" />
                    )}
                    Share
                  </button>

                  <div className="flex items-center overflow-hidden rounded-lg bg-slate-50 transition-all dark:bg-[#050505]">
                    <button
                      onClick={() => setShowPasswordInput(!showPasswordInput)}
                      className={`flex h-9 items-center justify-center px-3 text-slate-400 transition-colors hover:text-slate-700 dark:hover:text-zinc-300 ${createPassword ? "text-purple-500 dark:text-purple-400" : ""}`}
                      title="Set Password"
                    >
                      {createPassword ? (
                        <ShieldCheck className="h-4 w-4" />
                      ) : (
                        <Lock className="h-4 w-4" />
                      )}
                    </button>

                    <AnimatePresence>
                      {showPasswordInput && (
                        <motion.input
                          initial={{ width: 0, opacity: 0 }}
                          animate={{ width: 140, opacity: 1 }}
                          exit={{ width: 0, opacity: 0 }}
                          type="password"
                          placeholder="Password..."
                          value={createPassword}
                          onChange={(e) => setCreatePassword(e.target.value)}
                          className="h-9 bg-transparent px-2 text-sm outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-zinc-600"
                          autoComplete="new-password"
                          name="new-paste-password"
                          id="new-paste-password"
                          data-1p-ignore="true"
                          data-lpignore="true"
                          data-form-type="other"
                        />
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="shared-mode"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 rounded-xl bg-white p-1.5 shadow-lg ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10"
                >
                  <div className="flex items-center rounded-lg bg-purple-50 px-3 py-1.5 dark:bg-purple-500/10">
                    <span className="font-mono text-sm font-bold text-purple-700 dark:text-purple-400">
                      Code: {currentCode}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={copyUrlToClipboard}
                    className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-white/5"
                  >
                    {isUrlCopied ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <LinkIcon className="h-3.5 w-3.5" />
                    )}
                    Copy Link
                  </button>

                  {/* ONLY show to the creator */}
                  {isOwner && (
                    <>
                      <div className="mx-1 h-4 w-px bg-slate-200 dark:bg-white/10"></div>
                      <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
                      >
                        {isDeleting ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div
            className="absolute right-6 bottom-6 hidden items-center gap-4 font-mono text-[10px] tracking-wider text-slate-400 uppercase transition-opacity md:flex dark:text-zinc-600"
            dir="ltr"
          >
            <span>{statsData.chars} Chars</span>
            <span>{statsData.words} Words</span>
            <span>{statsData.lines} Lines</span>
          </div>
        </div>
      </div>
    </div>
  )
}
