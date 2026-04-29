import { Suspense } from "react"
import { CopyPaste } from "@/components/copy-paste/CopyPaste"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "اشتراک‌گذاری متن و کد - هاب ابزار",
  description: "متن و کدهای خود را به سادگی و با امنیت بالا به اشتراک بگذارید.",
}

export default function CopyPastePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-slate-500">
          در حال بارگذاری...
        </div>
      }
    >
      <CopyPaste />
    </Suspense>
  )
}
