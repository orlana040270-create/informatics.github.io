import { useEffect, useState } from "react"
import { useLocation, useSearch } from "wouter"
import { useListResources, useListCategories, useListTags } from "@workspace/api-client-react"
import { ResourceCard, ResourceCardSkeleton } from "@/components/resource/resource-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, X, SlidersHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function ResourcesPage() {
  const searchString = useSearch()
  const [, setLocation] = useLocation()
  
  // Parse query params
  const queryParams = new URLSearchParams(searchString)
  const categoryParam = queryParams.get("category") || undefined
  const tagParam = queryParams.get("tag") || undefined
  const typeParam = queryParams.get("type") || undefined
  const difficultyParam = queryParams.get("difficulty") || undefined
  const qParam = queryParams.get("q") || undefined
  const featuredParam = queryParams.get("featured") === "true" ? true : undefined

  const [searchQuery, setSearchQuery] = useState(qParam || "")
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Sync state when URL changes
  useEffect(() => {
    setSearchQuery(qParam || "")
  }, [qParam])

  const { data: resources, isLoading: resourcesLoading } = useListResources({
    category: categoryParam,
    tag: tagParam,
    q: qParam,
    featured: featuredParam,
    // Note: our API schema doesn't explicitly mention type/difficulty filtering in ListResourcesParams,
    // but a real app would have it. Let's do client-side filtering for these if they are set, 
    // since we get all matching the other params.
  })
  
  const { data: categories } = useListCategories()
  const { data: tags } = useListTags()

  // Client-side filtering for type and difficulty if needed
  const filteredResources = resources?.filter(r => {
    if (typeParam && r.type !== typeParam) return false
    if (difficultyParam && r.difficulty !== difficultyParam) return false
    return true
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters({ q: searchQuery || null })
  }

  const updateFilters = (updates: Record<string, string | null | boolean>) => {
    const params = new URLSearchParams(searchString)
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === false) {
        params.delete(key)
      } else {
        params.set(key, value.toString())
      }
    })
    
    setLocation(`/resources?${params.toString()}`)
  }

  const clearFilters = () => {
    setLocation("/resources")
  }

  const hasActiveFilters = categoryParam || tagParam || typeParam || difficultyParam || qParam || featuredParam

  const resourceTypes = [
    { id: "article", name: "Стаття" },
    { id: "video", name: "Відео" },
    { id: "course", name: "Курс" },
    { id: "tool", name: "Інструмент" },
    { id: "dataset", name: "Набір даних" },
    { id: "platform", name: "Платформа" },
  ]

  const difficulties = [
    { id: "beginner", name: "Початковий" },
    { id: "intermediate", name: "Середній" },
    { id: "advanced", name: "Просунутий" },
  ]

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">Каталог ресурсів</h1>
          <p className="text-muted-foreground mt-2">
            Досліджуйте матеріали для навчання та викладання.
          </p>
        </div>
        
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto md:min-w-[320px]">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Пошук..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>
          <Button type="submit">Знайти</Button>
          <Button 
            type="button" 
            variant="outline" 
            size="icon" 
            className="md:hidden flex-shrink-0"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </form>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className={`w-full md:w-64 flex-shrink-0 space-y-8 ${showMobileFilters ? 'block' : 'hidden md:block'}`}>
          <div className="sticky top-24 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="font-serif font-semibold text-lg flex items-center gap-2">
                <Filter className="h-5 w-5 text-primary" /> Фільтри
              </h2>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2 text-xs text-muted-foreground">
                  Очистити
                </Button>
              )}
            </div>

            {/* Featured toggle */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={!!featuredParam}
                  onChange={(e) => updateFilters({ featured: e.target.checked || null })}
                  className="rounded border-input text-primary focus:ring-primary h-4 w-4"
                />
                <span className="text-sm font-medium">Тільки вибрані</span>
              </label>
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Категорія</h3>
              <div className="space-y-2">
                <button
                  onClick={() => updateFilters({ category: null })}
                  className={`block w-full text-left text-sm py-1 transition-colors ${!categoryParam ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
                >
                  Усі категорії
                </button>
                {categories?.map(cat => (
                  <button
                    key={cat.name}
                    onClick={() => updateFilters({ category: cat.name })}
                    className={`block w-full text-left text-sm py-1 flex justify-between items-center transition-colors ${categoryParam === cat.name ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
                  >
                    <span className="truncate pr-2">{cat.name}</span>
                    <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{cat.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Type */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Тип ресурсу</h3>
              <div className="space-y-2">
                <button
                  onClick={() => updateFilters({ type: null })}
                  className={`block w-full text-left text-sm py-1 transition-colors ${!typeParam ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
                >
                  Усі типи
                </button>
                {resourceTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => updateFilters({ type: type.id })}
                    className={`block w-full text-left text-sm py-1 transition-colors ${typeParam === type.id ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
                  >
                    {type.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Складність</h3>
              <div className="space-y-2">
                <button
                  onClick={() => updateFilters({ difficulty: null })}
                  className={`block w-full text-left text-sm py-1 transition-colors ${!difficultyParam ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
                >
                  Будь-яка
                </button>
                {difficulties.map(diff => (
                  <button
                    key={diff.id}
                    onClick={() => updateFilters({ difficulty: diff.id })}
                    className={`block w-full text-left text-sm py-1 transition-colors ${difficultyParam === diff.id ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
                  >
                    {diff.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Tags */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Популярні теги</h3>
              <div className="flex flex-wrap gap-2">
                {tags?.slice(0, 15).map(tag => (
                  <button
                    key={tag.name}
                    onClick={() => updateFilters({ tag: tagParam === tag.name ? null : tag.name })}
                    className={`px-2.5 py-1 rounded-full text-xs transition-colors border ${
                      tagParam === tag.name 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'bg-background hover:bg-muted text-foreground border-border'
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Active filters visualization */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-6 pb-6 border-b border-border/50">
              <span className="text-sm text-muted-foreground mr-2">Активні фільтри:</span>
              {qParam && (
                <Badge variant="secondary" className="flex items-center gap-1 font-normal bg-background border">
                  Пошук: {qParam}
                  <button onClick={() => updateFilters({ q: null })} className="ml-1 hover:text-destructive"><X className="h-3 w-3" /></button>
                </Badge>
              )}
              {categoryParam && (
                <Badge variant="secondary" className="flex items-center gap-1 font-normal bg-background border">
                  Категорія: {categoryParam}
                  <button onClick={() => updateFilters({ category: null })} className="ml-1 hover:text-destructive"><X className="h-3 w-3" /></button>
                </Badge>
              )}
              {tagParam && (
                <Badge variant="secondary" className="flex items-center gap-1 font-normal bg-background border">
                  Тег: {tagParam}
                  <button onClick={() => updateFilters({ tag: null })} className="ml-1 hover:text-destructive"><X className="h-3 w-3" /></button>
                </Badge>
              )}
              {typeParam && (
                <Badge variant="secondary" className="flex items-center gap-1 font-normal bg-background border">
                  Тип: {resourceTypes.find(t => t.id === typeParam)?.name || typeParam}
                  <button onClick={() => updateFilters({ type: null })} className="ml-1 hover:text-destructive"><X className="h-3 w-3" /></button>
                </Badge>
              )}
              {difficultyParam && (
                <Badge variant="secondary" className="flex items-center gap-1 font-normal bg-background border">
                  Складність: {difficulties.find(d => d.id === difficultyParam)?.name || difficultyParam}
                  <button onClick={() => updateFilters({ difficulty: null })} className="ml-1 hover:text-destructive"><X className="h-3 w-3" /></button>
                </Badge>
              )}
              {featuredParam && (
                <Badge variant="secondary" className="flex items-center gap-1 font-normal bg-background border text-amber-700 border-amber-200 bg-amber-50">
                  Вибрані
                  <button onClick={() => updateFilters({ featured: null })} className="ml-1 hover:text-destructive"><X className="h-3 w-3" /></button>
                </Badge>
              )}
            </div>
          )}

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resourcesLoading ? (
              Array(6).fill(0).map((_, i) => <ResourceCardSkeleton key={i} />)
            ) : filteredResources?.length ? (
              filteredResources.map(resource => (
                <ResourceCard key={resource.id} resource={resource} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center flex flex-col items-center justify-center bg-muted/20 rounded-xl border border-dashed border-border/60">
                <Search className="h-10 w-10 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-serif font-medium text-foreground">Нічого не знайдено</h3>
                <p className="text-muted-foreground mt-2 max-w-md">
                  Спробуйте змінити критерії пошуку або скинути активні фільтри.
                </p>
                {hasActiveFilters && (
                  <Button variant="outline" className="mt-6" onClick={clearFilters}>
                    Скинути всі фільтри
                  </Button>
                )}
              </div>
            )}
          </div>
          
          {filteredResources && filteredResources.length > 0 && (
            <div className="mt-12 text-center text-sm text-muted-foreground">
              Показано {filteredResources.length} ресурсів
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
