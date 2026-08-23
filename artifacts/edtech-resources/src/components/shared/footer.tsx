import { Link } from "wouter"
import { BookOpen } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-muted/40 mt-auto">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link href="/" className="flex items-center gap-2 text-primary" data-testid="link-footer-home">
              <BookOpen className="h-6 w-6" />
              <span className="font-serif font-bold text-lg">Інформатика та ШІ</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm text-center md:text-left">
              Збірник ресурсів для вивчення комп'ютерних наук та штучного інтелекту.
              Відібрано викладачами для студентів та колег.
            </p>
          </div>
          
          <div className="flex gap-8 text-sm text-muted-foreground">
            <div className="flex flex-col gap-2 text-center md:text-left">
              <span className="font-semibold text-foreground">Навігація</span>
              <Link href="/" className="hover:text-primary">Головна</Link>
              <Link href="/resources" className="hover:text-primary">Каталог</Link>
              <Link href="/categories" className="hover:text-primary">Категорії</Link>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Інформатика та ШІ. Усі права захищено.</p>
          <p>Створено для освітніх цілей.</p>
        </div>
      </div>
    </footer>
  )
}
