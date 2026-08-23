import { useGetStats, useListFeaturedResources } from "@workspace/api-client-react"
import { Link } from "wouter"
import { ArrowRight, BookOpen, Layers, Zap, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ResourceCard, ResourceCardSkeleton } from "@/components/resource/resource-card"

export function HomePage() {
  const { data: stats, isLoading: statsLoading } = useGetStats()
  const { data: featuredResources, isLoading: featuredLoading } = useListFeaturedResources()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero-banner.png')] bg-cover bg-center pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020d1f]/60 via-[#020d1f]/50 to-[#020d1f]/80 pointer-events-none" />
        
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <Badge className="mb-6 bg-accent text-accent-foreground hover:bg-accent border-none text-sm px-3 py-1">
            Академічний архів
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight mb-6 leading-tight">
            Знання для майбутнього <br className="hidden md:block"/>
            <span className="text-secondary/90 italic font-medium">комп'ютерних наук</span>
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            Ретельно відібрана колекція курсів, статей, інструментів та наборів даних для викладачів і студентів, які вивчають програмування та штучний інтелект.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/resources" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-background text-foreground hover:bg-background/90 text-base h-12 px-8">
                <Search className="mr-2 h-5 w-5" />
                Дослідити ресурси
              </Button>
            </Link>
            <Link href="/categories" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground/30 hover:bg-primary-foreground/10 text-base h-12 px-8">
                Переглянути категорії
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-b bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-border">
            <div className="flex flex-col items-center justify-center text-center px-4">
              <BookOpen className="h-8 w-8 text-accent mb-3" />
              <span className="text-4xl font-serif font-bold text-foreground">
                {statsLoading ? "-" : stats?.totalResources || 0}
              </span>
              <span className="text-sm font-medium text-muted-foreground mt-1 uppercase tracking-wider">Матеріалів</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center px-4">
              <Layers className="h-8 w-8 text-accent mb-3" />
              <span className="text-4xl font-serif font-bold text-foreground">
                {statsLoading ? "-" : stats?.byCategory?.length || 0}
              </span>
              <span className="text-sm font-medium text-muted-foreground mt-1 uppercase tracking-wider">Напрямків</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center px-4">
              <Zap className="h-8 w-8 text-accent mb-3" />
              <span className="text-4xl font-serif font-bold text-foreground">
                {statsLoading ? "-" : stats?.recentCount || 0}
              </span>
              <span className="text-sm font-medium text-muted-foreground mt-1 uppercase tracking-wider">Нових за тиждень</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center px-4">
              <span className="text-4xl font-serif font-bold text-foreground">
                {statsLoading ? "-" : stats?.byType?.length || 0}
              </span>
              <span className="text-sm font-medium text-muted-foreground mt-1 uppercase tracking-wider">Форматів</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-serif font-bold text-foreground">Вибрані матеріали</h2>
              <p className="text-muted-foreground mt-2">Найкращі ресурси, відзначені викладачами.</p>
            </div>
            <Link href="/resources?featured=true" className="hidden sm:flex items-center text-primary font-medium hover:underline group">
              Дивитись усі
              <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredLoading ? (
              Array(3).fill(0).map((_, i) => <ResourceCardSkeleton key={i} />)
            ) : featuredResources?.length ? (
              featuredResources.slice(0, 6).map(resource => (
                <ResourceCard key={resource.id} resource={resource} />
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-muted-foreground bg-background rounded-lg border border-dashed">
                Немає вибраних ресурсів
              </div>
            )}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Link href="/resources?featured=true">
              <Button variant="outline" className="w-full">
                Дивитись усі вибрані
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Quick Links */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold">Тематичні напрямки</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Від фундаментальних алгоритмів до сучасних моделей машинного навчання — архів охоплює ключові галузі знань.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {statsLoading ? (
              Array(6).fill(0).map((_, i) => <div key={i} className="h-16 bg-muted animate-pulse rounded-md" />)
            ) : stats?.byCategory?.slice(0, 9).map(cat => (
              <Link 
                key={cat.name} 
                href={`/resources?category=${encodeURIComponent(cat.name)}`}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:border-primary hover:shadow-sm transition-all group"
              >
                <span className="font-medium text-foreground group-hover:text-primary transition-colors">{cat.name}</span>
                <span className="bg-muted text-muted-foreground text-xs py-1 px-2 rounded-full font-medium">
                  {cat.count}
                </span>
              </Link>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/categories">
              <Button variant="secondary" size="lg" className="rounded-full px-8">
                Усі напрямки
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function Badge({ className, children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`} {...props}>
      {children}
    </span>
  )
}
