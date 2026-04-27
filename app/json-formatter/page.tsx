import { JsonFormatter } from "@/components/json-formatter/JsonFormatter"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "فرمت‌کننده JSON - ابزار آنلاین رایگان",
  description:
    "ابزار رایگان فرمت‌کننده و مینی‌فای JSON با قابلیت اعتبارسنجی و آمار لحظه‌ای",
}

export default function JsonFormatterPage() {
  return (
    <div>
      <JsonFormatter />
    </div>
  )
}
