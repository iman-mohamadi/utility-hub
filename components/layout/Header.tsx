"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, Code, Clipboard, Link as LinkIcon } from "lucide-react"

const navItems = [
  { name: "خانه", path: "/", icon: "🏠" },
  { name: "فرمت‌کننده JSON", path: "/json-formatter", icon: "📝" },
  { name: "اشتراک‌گذاری متن", path: "/copy-paste", icon: "📋" },
  { name: "کوتاه‌کننده لینک", path: "/url-shortener", icon: "🔗" },
]

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="fixed w-full top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-700">
              <span className="text-sm font-bold text-white">UH</span>
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-sm font-bold text-transparent">
              ابزارهای رایگان
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.path
                    ? "font-semibold text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <span className="ml-2">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            <ModeToggle />

            {/* Mobile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {navItems.map((item) => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link href={item.path} className="flex items-center gap-2">
                      <span>{item.icon}</span>
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
