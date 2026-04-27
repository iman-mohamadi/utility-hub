import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Link as LinkIcon } from "lucide-react"

export const metadata = {
  title: "کوتاه‌کننده لینک - به زودی",
  description: "کوتاه‌کننده لینک با آمار بازدید. به زودی اضافه می‌شود.",
}

export default function UrlShortenerPage() {
  return (
    <div className="mx-auto max-w-2xl py-20 text-center">
      <Card>
        <CardHeader>
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <LinkIcon className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl">کوتاه‌کننده لینک</CardTitle>
          <CardDescription className="text-lg">
            این ابزار به زودی اضافه می‌شود
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            با این ابزار می‌توانید لینک‌های طولانی را کوتاه کرده و آمار بازدید
            دریافت کنید
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
