import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Clipboard } from "lucide-react"

export const metadata = {
  title: "اشتراک‌گذاری متن - به زودی",
  description: "ابزار اشتراک‌گذاری متن با کد یکتا. به زودی اضافه می‌شود.",
}

export default function CopyPastePage() {
  return (
    <div className="mx-auto max-w-2xl py-20 text-center">
      <Card>
        <CardHeader>
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Clipboard className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl">اشتراک‌گذاری متن</CardTitle>
          <CardDescription className="text-lg">
            این ابزار به زودی اضافه می‌شود
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            با این ابزار می‌توانید متن خود را با یک کد یکتا به اشتراک بگذارید
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
