import { Link } from "wouter"
import { useListCategories } from "@workspace/api-client-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Layers, ArrowRight } from "lucide-react"

export function CategoriesPage() {
  const { data: categories, isLoading } = useListCategories()

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 max-w-5xl">
      <div className="text-center mb-16">
        <Badge className="mb-4 bg-accent/10 text-accent hover:bg-accent/20">Навігація</Badge>
        <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-4">Напрямки знань</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Усі матеріали розбиті на ключові категорії для зручного пошуку потрібної інформації.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array(9).fill(0).map((_, i) => (
            <Card key={i} className="h-[120px]">
              <CardHeader className="h-full justify-center">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-8 rounded-full" />
                </div>
              </CardHeader>
            </Card>
          ))
        ) : categories?.length ? (
          categories.map(category => (
            <Link key={category.name} href={`/resources?category=${encodeURIComponent(category.name)}`}>
              <Card className="h-full transition-all hover:shadow-md hover:border-primary/40 group cursor-pointer bg-card overflow-hidden relative">
                {/* Decorative accent line */}
                <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors" />
                
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start mb-2">
                    <Layers className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="bg-muted px-2.5 py-0.5 rounded-full text-xs font-medium text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      {category.count}
                    </span>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center text-sm text-muted-foreground mt-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                    Переглянути ресурси <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-muted-foreground border rounded-lg bg-muted/20">
            Категорій не знайдено
          </div>
        )}
      </div>
    </div>
  )
}

function Badge({ className, children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`} {...props}>
      {children}
    </span>
  )
}