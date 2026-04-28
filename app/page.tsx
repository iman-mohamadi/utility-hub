"use client"

import Link from "next/link"
import { motion } from "motion/react"
import {
  Code,
  Clipboard,
  Link as LinkIcon,
  Sparkles,
  Zap,
  Shield,
  Infinity,
  ArrowLeft,
} from "lucide-react"

export default function Home() {
  const features = [
    {
      icon: Code,
      title: "فرمت‌کننده JSON",
      description:
        "اعتبارسنجی، زیبا‌سازی و مینی‌فای کدهای JSON در یک محیط حرفه‌ای و تمیز.",
      href: "/json-formatter",
      status: "active",
    },
    {
      icon: Clipboard,
      title: "اشتراک‌گذاری کد",
      description:
        "کدها و متن‌های خود را در محیطی امن با سینتکس هایلایت به اشتراک بگذارید.",
      href: "/copy-paste",
      status: "coming",
    },
    {
      icon: LinkIcon,
      title: "کوتاه‌کننده لینک",
      description:
        "لینک‌های طولانی را به آدرس‌های کوتاه و قابل ردیابی تبدیل کنید.",
      href: "/url-shortener",
      status: "coming",
    },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 font-sans text-slate-900 transition-colors duration-300 selection:bg-blue-500/30 dark:bg-[#000000] dark:text-zinc-200">
      {/* Background Grid - Adapts to Light/Dark */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[size:50px_50px] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)]" />

      {/* Spotlight Effect */}
      <div className="pointer-events-none absolute top-0 right-0 left-0 flex justify-center">
        <div className="h-[500px] w-full max-w-[800px] translate-y-[-50%] rounded-full bg-blue-500/10 blur-[100px] dark:bg-blue-500/15" />
      </div>

      <div className="relative z-10 container mx-auto flex min-h-screen flex-col items-center justify-center px-4 pt-32 pb-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto max-w-3xl space-y-8 text-center"
        >
          {/* Minimal Badge */}
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/50 px-4 py-1.5 text-xs font-medium text-slate-600 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:text-zinc-400 dark:shadow-none">
            <Sparkles className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
            <span>ابزارهای مینیمال توسعه‌دهندگان</span>
          </div>

          <h1 className="text-5xl leading-tight font-bold tracking-tight text-slate-900 md:text-7xl dark:text-white">
            کدنویسی بدون <br />
            <span className="bg-gradient-to-b from-blue-600 to-blue-800 bg-clip-text text-transparent dark:from-blue-400 dark:to-blue-700">
              حواس‌پرتی
            </span>
          </h1>

          <p className="mx-auto max-w-xl text-lg leading-relaxed text-slate-600 md:text-xl dark:text-zinc-400">
            مجموعه‌ای از ابزارهای قدرتمند و سریع که برای تمرکز کامل شما طراحی
            شده‌اند. بدون تبلیغات، کاملاً رایگان.
          </p>

          <div className="flex justify-center pt-6">
            <Link href="/json-formatter">
              <button className="group relative inline-flex h-12 overflow-hidden rounded-full p-[1px] shadow-md focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-background focus:outline-none dark:shadow-none">
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#cbd5e1_0%,#3b82f6_50%,#cbd5e1_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <span className="inline-flex h-full w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-1 text-sm font-medium text-slate-800 backdrop-blur-3xl transition-colors hover:bg-slate-50 dark:bg-zinc-950 dark:text-white dark:group-hover:bg-zinc-900">
                  شروع کنید
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                </span>
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Minimal Bento Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-32 grid w-full max-w-5xl gap-4 md:grid-cols-3"
        >
          {features.map((feature, idx) => (
            <Link
              key={idx}
              href={feature.href}
              className={`block h-full ${feature.status === "coming" ? "pointer-events-none" : ""}`}
            >
              <div className="group relative h-full overflow-hidden rounded-2xl border border-slate-200 bg-white/50 p-6 shadow-sm transition-all hover:bg-white hover:shadow-md dark:border-white/10 dark:bg-zinc-950/50 dark:shadow-none dark:hover:bg-zinc-900/50">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative z-10">
                  <div
                    className={`mb-6 inline-flex rounded-xl border border-slate-100 bg-slate-50 p-3 transition-colors group-hover:border-blue-500/30 dark:border-white/5 dark:bg-zinc-900`}
                  >
                    <feature.icon className="h-5 w-5 text-slate-700 transition-colors group-hover:text-blue-600 dark:text-zinc-300 dark:group-hover:text-blue-400" />
                  </div>

                  <h3 className="mb-2 flex items-center justify-between text-lg font-medium text-slate-900 dark:text-zinc-100">
                    {feature.title}
                    {feature.status === "coming" && (
                      <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500 dark:border-transparent dark:bg-zinc-800 dark:text-zinc-400">
                        به زودی
                      </span>
                    )}
                  </h3>

                  <p className="text-sm leading-relaxed text-slate-500 dark:text-zinc-500">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </motion.div>

        {/* Minimalist Stats Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-24 flex w-full max-w-3xl flex-wrap justify-center gap-10 pt-8"
        >
          {[
            { icon: Zap, label: "پردازش سریع" },
            { icon: Shield, label: "امنیت کامل" },
            { icon: Infinity, label: "بدون محدودیت" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 text-slate-500 dark:text-zinc-500"
            >
              <stat.icon className="h-4 w-4 text-blue-500/70 dark:text-blue-500/50" />
              <span className="text-xs tracking-wider">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
