import { Link } from "wouter"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-9xl font-serif font-bold text-muted/30">404</h1>
      <h2 className="text-3xl font-serif font-bold mt-4 mb-2">Сторінку не знайдено</h2>
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        Вибачте, матеріал або розділ, який ви шукаєте, не існує або був переміщений.
      </p>
      <Link href="/">
        <Button size="lg">
          <ArrowLeft className="mr-2 h-5 w-5" /> На головну
        </Button>
      </Link>
    </div>
  )
}
