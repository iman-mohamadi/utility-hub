import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Code, Clipboard, Link as LinkIcon, Sparkles } from "lucide-react"

const features = [
  {
    title: "فرمت‌کننده JSON",
    description:
      "فرمت، مینی‌فای و اعتبارسنجی داده‌های JSON با هایلایت زیبا و آمار لحظه‌ای",
    icon: Code,
    href: "/json-formatter",
    badge: "فعال",
    color: "blue",
  },
  {
    title: "اشتراک‌گذاری متن",
    description:
      "به اشتراک‌گذاری سریع متن با یک کد یکتا. مناسب برای کدها و یادداشت‌ها",
    icon: Clipboard,
    href: "/copy-paste",
    badge: "به زودی",
    color: "green",
  },
  {
    title: "کوتاه‌کننده لینک",
    description: "کوتاه کردن لینک‌های طولانی با نام دلخواه، QR کد و آمار کلیک",
    icon: LinkIcon,
    href: "/url-shortener",
    badge: "به زودی",
    color: "purple",
  },
]

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="space-y-6 py-12 text-center">
        <Badge variant="outline" className="px-4 py-1 text-lg">
          🔥 ابزارهای رایگان آنلاین
        </Badge>
        <h1 className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-5xl font-bold text-transparent md:text-6xl">
          ابزارهای ضروری برای توسعه‌دهندگان
        </h1>
        <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
          ابزارهای رایگان شامل فرمت‌کننده JSON، اشتراک‌گذاری متن و کوتاه‌کننده
          لینک. بدون نیاز به ثبت‌نام و کاملاً رایگان.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/json-formatter">
              شروع کنید
              <Sparkles className="mr-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="#features">مشاهده امکانات</a>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="space-y-8">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold">ابزارهای قدرتمند در دستان شما</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            همه چیز برای افزایش بهره‌وری شما، کاملاً رایگان و آسان برای استفاده
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card
                key={feature.title}
                className="group transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-transform group-hover:scale-110">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge
                    variant={feature.badge === "فعال" ? "default" : "secondary"}
                  >
                    {feature.badge}
                  </Badge>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 gap-8 py-12 text-center md:grid-cols-4">
        <div>
          <div className="mb-2 text-4xl font-bold text-primary">۳+</div>
          <div className="text-sm text-muted-foreground">ابزار رایگان</div>
        </div>
        <div>
          <div className="mb-2 text-4xl font-bold text-primary">۱۰۰٪</div>
          <div className="text-sm text-muted-foreground">
            رایگان و بدون محدودیت
          </div>
        </div>
        <div>
          <div className="mb-2 text-4xl font-bold text-primary">🔒</div>
          <div className="text-sm text-muted-foreground">حریم خصوصی کامل</div>
        </div>
        <div>
          <div className="mb-2 text-4xl font-bold text-primary">⚡</div>
          <div className="text-sm text-muted-foreground">پردازش سریع</div>
        </div>
      </section>
    </div>
  )
}
