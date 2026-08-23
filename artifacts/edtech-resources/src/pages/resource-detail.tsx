import { useParams, Link } from "wouter"
import { useGetResource, getGetResourceQueryKey } from "@workspace/api-client-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  ArrowLeft, 
  ExternalLink, 
  Calendar, 
  Code2, 
  Share2, 
  BookmarkPlus,
  Box,
  Hash
} from "lucide-react"
import { getDifficultyColor, getDifficultyName, getTypeIcon, getTypeName } from "@/components/resource/resource-card"

export function ResourceDetailPage() {
  const { id } = useParams()
  
  const { data: resource, isLoading, isError } = useGetResource(id || "", {
    query: {
      enabled: !!id,
      queryKey: getGetResourceQueryKey(id || ""),
    }
  })

  if (isLoading) {
    return <ResourceDetailSkeleton />
  }

  if (isError || !resource) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-lg">
        <h1 className="text-3xl font-serif font-bold mb-4">Ресурс не знайдено</h1>
        <p className="text-muted-foreground mb-8">
          Можливо, його було видалено, або посилання є неправильним.
        </p>
        <Link href="/resources">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" /> Повернутися до каталогу
          </Button>
        </Link>
      </div>
    )
  }

  const formattedDate = new Date(resource.createdAt).toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="bg-muted/10 min-h-[calc(100vh-4rem)] pb-12">
      {/* Top Breadcrumb area */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center text-sm text-muted-foreground">
            <Link href="/resources" className="hover:text-primary transition-colors flex items-center">
              <ArrowLeft className="h-4 w-4 mr-1" /> Каталог
            </Link>
            <span className="mx-2">/</span>
            <Link href={`/resources?category=${encodeURIComponent(resource.category)}`} className="hover:text-primary transition-colors">
              {resource.category}
            </Link>
            <span className="mx-2">/</span>
            <span className="truncate text-foreground max-w-[200px] sm:max-w-md">{resource.title}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="flex items-center gap-1.5 text-sm py-1 border-primary/20 bg-primary/5 text-primary font-medium">
                  {getTypeIcon(resource.type)}
                  {getTypeName(resource.type)}
                </Badge>
                {resource.featured && (
                  <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100 text-sm py-1 font-medium">
                    Вибір редакції
                  </Badge>
                )}
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-foreground leading-tight mb-6">
                {resource.title}
              </h1>
              
              <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground mb-8 text-pretty leading-relaxed">
                {/* Normally we'd render markdown or HTML here, but since it's just a string desc: */}
                <p>{resource.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4 border-t border-border/60">
              <a 
                href={resource.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button size="lg" className="w-full sm:w-auto text-base px-8">
                  Відкрити ресурс <ExternalLink className="ml-2 h-5 w-5" />
                </Button>
              </a>
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-background">
                <BookmarkPlus className="mr-2 h-5 w-5 text-muted-foreground" /> Зберегти
              </Button>
            </div>
          </div>
          
          {/* Sidebar metadata */}
          <aside className="space-y-6">
            <Card className="bg-background/50 border-border/60 shadow-sm backdrop-blur-sm">
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                    <Box className="h-3.5 w-3.5" /> Категорія
                  </h3>
                  <Link href={`/resources?category=${encodeURIComponent(resource.category)}`}>
                    <Badge variant="secondary" className="text-sm hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer">
                      {resource.category}
                    </Badge>
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/60">
                  <div>
                    <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Складність</h3>
                    <Badge variant="outline" className={`font-normal ${getDifficultyColor(resource.difficulty)}`}>
                      {getDifficultyName(resource.difficulty)}
                    </Badge>
                  </div>
                  
                  {resource.language && (
                    <div>
                      <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                        <Code2 className="h-3.5 w-3.5" /> Мова
                      </h3>
                      <span className="text-sm font-medium text-foreground">{resource.language}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-border/60">
                  <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                    <Hash className="h-3.5 w-3.5" /> Теги
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {resource.tags.map(tag => (
                      <Link key={tag} href={`/resources?tag=${encodeURIComponent(tag)}`}>
                        <Badge variant="outline" className="text-xs font-normal hover:border-primary transition-colors cursor-pointer bg-background">
                          {tag}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border/60">
                  <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" /> Додано
                  </h3>
                  <span className="text-sm text-foreground">{formattedDate}</span>
                </div>
              </div>
            </Card>
            
            <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground">
              <Share2 className="mr-2 h-4 w-4" /> Поділитися посиланням
            </Button>
          </aside>
          
        </div>
      </div>
    </div>
  )
}

function ResourceDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-32 rounded-full" />
          </div>
          <Skeleton className="h-12 w-full max-w-2xl" />
          <Skeleton className="h-12 w-3/4" />
          
          <div className="space-y-4 pt-6">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
          
          <div className="flex gap-4 pt-8">
            <Skeleton className="h-12 w-48 rounded-md" />
            <Skeleton className="h-12 w-32 rounded-md" />
          </div>
        </div>
        
        <aside>
          <Card className="p-6 space-y-6">
            <div className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-32 rounded-full" />
            </div>
            <div className="space-y-3 pt-4 border-t">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-28 rounded-full" />
            </div>
            <div className="space-y-3 pt-4 border-t">
              <Skeleton className="h-4 w-24" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  )
}
