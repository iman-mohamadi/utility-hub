"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { ArrowLeft, Code, Clipboard, Link as LinkIcon, Sparkles, Zap, Shield, Infinity, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const features = [
    {
      icon: Code,
      title: "فرمت‌کننده JSON",
      description: "زیبا‌سازی، مینی‌فای و اعتبارسنجی JSON در لحظه",
      gradient: "from-blue-500 to-cyan-500",
      href: "/json-formatter",
      status: "active"
    },
    {
      icon: Clipboard,
      title: "اشتراک‌گذاری متن",
      description: "متن خود را با یک کد یکتا به اشتراک بگذارید",
      gradient: "from-purple-500 to-pink-500",
      href: "/copy-paste",
      status: "coming"
    },
    {
      icon: LinkIcon,
      title: "کوتاه‌کننده لینک",
      description: "لینک‌های طولانی را کوتاه و مدیریت کنید",
      gradient: "from-orange-500 to-red-500",
      href: "/url-shortener",
      status: "coming"
    }
  ]

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />

      {/* Animated Gradient Orbs with Motion */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-3xl"
        animate={{
          x: mousePosition.x / 20,
          y: mousePosition.y / 20,
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 100
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-gradient-to-l from-cyan-400/20 to-blue-400/20 blur-3xl"
        animate={{
          x: -mousePosition.x / 30,
          y: -mousePosition.y / 30,
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 100
        }}
      />

      <div className="relative container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
            className="inline-block mb-6"
          >
            <div className="text-sm px-6 py-2 rounded-full border-2 bg-white/50 backdrop-blur-sm dark:bg-slate-900/50 inline-block">
              <Sparkles className="inline-block ml-2 w-4 h-4 text-yellow-500" />
              کاملاً رایگان • بدون نیاز به ثبت‌نام
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 dark:from-white dark:via-blue-400 dark:to-white bg-clip-text text-transparent"
          >
            ابزارهای رایگان
            <br />
            برای توسعه‌دهندگان
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            مجموعه‌ای از ابزارهای حرفه‌ای برای افزایش بهره‌وری شما
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex gap-4 justify-center"
          >
            <Button asChild size="lg" className="group relative overflow-hidden">
              <Link href="/json-formatter">
                <span className="relative z-10 flex items-center">
                  شروع کنید
                  <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700"
                  initial={{ x: "100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="group">
              <a href="#features">
                مشاهده ابزارها
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mb-24"
        >
          {[
            { icon: Zap, label: "پردازش سریع", value: "< 100ms" },
            { icon: Shield, label: "حریم خصوصی", value: "۱۰۰٪ امن" },
            { icon: Infinity, label: "بدون محدودیت", value: "نامحدود" },
            { icon: Sparkles, label: "کاملاً رایگان", value: "برای همیشه" }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + idx * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              className="text-center p-4 rounded-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm border border-white/20"
            >
              <stat.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Section */}
        <motion.div
          id="features"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
              ابزارهای قدرتمند
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              هر آنچه برای توسعه نیاز دارید، در یک مکان
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <Link href={feature.href}>
                  <Card className={`group relative overflow-hidden p-6 h-full transition-all duration-300 hover:shadow-2xl cursor-pointer ${
                    feature.status === "coming" ? "opacity-60 hover:opacity-80" : ""
                  }`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                    <div className="relative">
                      <motion.div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <feature.icon className="w-7 h-7 text-white" />
                      </motion.div>

                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{feature.description}</p>

                      {feature.status === "coming" ? (
                        <Badge variant="secondary" className="absolute top-4 left-4">
                          به زودی
                        </Badge>
                      ) : (
                        <Button variant="ghost" className="p-0 h-auto group/btn">
                          <span className="text-sm">شروع کنید</span>
                          <ChevronLeft className="mr-1 h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                      )}
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 p-12 text-center"
        >
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            آماده‌اید بهره‌وری خود را افزایش دهید؟
          </h3>
          <p className="text-white/90 mb-6 max-w-md mx-auto">
            همین حالا شروع کنید و از ابزارهای رایگان ما استفاده کنید
          </p>
          <Button asChild size="lg" variant="secondary" className="group">
            <Link href="/json-formatter">
              شروع رایگان
              <Sparkles className="mr-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}