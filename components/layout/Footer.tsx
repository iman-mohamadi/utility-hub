export default function Footer() {
  return (
    <footer className="mt-auto border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-700">
                <span className="text-xs font-bold text-white">آ</span>
              </div>
              <span className="font-bold">ابزارهای رایگان</span>
            </div>
            <p className="text-sm text-muted-foreground">
              ابزارهای رایگان آنلاین برای توسعه‌دهندگان و کاربران عادی
            </p>
          </div>

          <div>
            <h3 className="mb-3 font-semibold">ابزارها</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/json-formatter" className="hover:text-primary">
                  فرمت‌کننده JSON
                </a>
              </li>
              <li>
                <a href="/copy-paste" className="hover:text-primary">
                  اشتراک‌گذاری متن
                </a>
              </li>
              <li>
                <a href="/url-shortener" className="hover:text-primary">
                  کوتاه‌کننده لینک
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-semibold">لینک‌ها</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary">
                  درباره ما
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  حریم خصوصی
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  شرایط استفاده
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-semibold">فناوری‌ها</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Next.js 14</li>
              <li>React 18</li>
              <li>shadcn/ui</li>
              <li>Tailwind CSS</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} ابزارهای رایگان - تمامی حقوق محفوظ است
          </p>
        </div>
      </div>
    </footer>
  )
}
