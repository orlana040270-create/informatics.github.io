import { Resource } from "@workspace/api-client-react"
import { Link } from "wouter"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ExternalLink, BookOpen, MonitorPlay, GraduationCap, PenTool, Database, Box } from "lucide-react"

interface ResourceCardProps {
  resource: Resource
}

export function getTypeIcon(type: string) {
  switch (type) {
    case 'article': return <BookOpen className="h-4 w-4" />
    case 'video': return <MonitorPlay className="h-4 w-4" />
    case 'course': return <GraduationCap className="h-4 w-4" />
    case 'tool': return <PenTool className="h-4 w-4" />
    case 'dataset': return <Database className="h-4 w-4" />
    case 'platform': return <Box className="h-4 w-4" />
    default: return <ExternalLink className="h-4 w-4" />
  }
}

export function getTypeName(type: string) {
  const types: Record<string, string> = {
    article: "Стаття",
    video: "Відео",
    course: "Курс",
    tool: "Інструмент",
    dataset: "Набір даних",
    platform: "Платформа"
  }
  return types[type] || type
}

export function getDifficultyColor(diff: string) {
  switch (diff) {
    case 'beginner': return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
    case 'intermediate': return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800"
    case 'advanced': return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
    default: return "bg-muted text-muted-foreground"
  }
}

export function getDifficultyName(diff: string) {
  const levels: Record<string, string> = {
    beginner: "Початковий",
    intermediate: "Середній",
    advanced: "Просунутий"
  }
  return levels[diff] || diff
}

export function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all hover:shadow-md hover:border-primary/50 group" data-testid={`card-resource-${resource.id}`}>
      <CardHeader className="pb-3 gap-2">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className="flex items-center gap-1.5 font-medium border-primary/20 bg-primary/5 text-primary">
            {getTypeIcon(resource.type)}
            {getTypeName(resource.type)}
          </Badge>
          <Badge variant="outline" className={getDifficultyColor(resource.difficulty)}>
            {getDifficultyName(resource.difficulty)}
          </Badge>
        </div>
        <Link href={`/resources/${resource.id}`} className="hover:text-primary transition-colors inline-block mt-2">
          <CardTitle className="line-clamp-2 text-xl group-hover:text-primary transition-colors">
            {resource.title}
          </CardTitle>
        </Link>
      </CardHeader>
      
      <CardContent className="pb-4 flex-grow">
        <CardDescription className="line-clamp-3 text-base">
          {resource.description}
        </CardDescription>
        
        {resource.tags && resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {resource.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs font-normal px-2 py-0">
                {tag}
              </Badge>
            ))}
            {resource.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs font-normal px-2 py-0">
                +{resource.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0 flex justify-between items-center border-t mt-auto border-border/50 py-3 bg-muted/20">
        <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Box className="w-3.5 h-3.5" />
          {resource.category}
        </span>
        <Link href={`/resources/${resource.id}`} className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
          Детальніше
          <ExternalLink className="h-3 w-3" />
        </Link>
      </CardFooter>
    </Card>
  )
}

export function ResourceCardSkeleton() {
  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <CardHeader className="pb-3 gap-2">
        <div className="flex justify-between">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="h-7 w-full mt-2" />
        <Skeleton className="h-7 w-2/3" />
      </CardHeader>
      <CardContent className="pb-4 flex-grow space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <div className="flex gap-2 mt-4">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
      </CardContent>
      <CardFooter className="pt-3 border-t">
        <div className="flex justify-between w-full">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      </CardFooter>
    </Card>
  )
}
