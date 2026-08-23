import { Link, useLocation } from "wouter"
import { BookOpen, Search, Menu, X, PlusCircle } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const [location] = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { href: "/", label: "Головна" },
    { href: "/resources", label: "Ресурси" },
    { href: "/categories", label: "Категорії" },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2" data-testid="link-home">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="font-serif font-bold text-xl tracking-tight hidden sm:block">
                Інформатика та ШІ
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location === link.href ? "text-primary" : "text-muted-foreground"
                  }`}
                  data-testid={`link-nav-${link.href.replace("/", "") || "home"}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            
            <div className="flex items-center gap-3">
              <Link href="/resources" className="text-muted-foreground hover:text-primary" data-testid="link-nav-search">
                <Search className="h-5 w-5" />
              </Link>
              <Link href="/admin">
                <Button size="sm" className="gap-1.5">
                  <PlusCircle className="h-4 w-4" />
                  Додати
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(!mobileOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-md px-3 py-2 text-base font-medium ${
                  location === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
