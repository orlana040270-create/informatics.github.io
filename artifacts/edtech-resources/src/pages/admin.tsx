import { useState } from "react"
import { useLocation } from "wouter"
import { useQueryClient } from "@tanstack/react-query"
import { useCreateResource, useListCategories } from "@workspace/api-client-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, X, CheckCircle2, AlertCircle, Loader2, ExternalLink } from "lucide-react"

const RESOURCE_TYPES = [
  { id: "tool", label: "Інструмент" },
  { id: "platform", label: "Платформа" },
  { id: "article", label: "Стаття / Блог" },
  { id: "video", label: "Відео" },
  { id: "course", label: "Курс" },
  { id: "dataset", label: "Набір даних" },
]

const DIFFICULTIES = [
  { id: "beginner", label: "Початковий" },
  { id: "intermediate", label: "Середній" },
  { id: "advanced", label: "Просунутий" },
]

const FIELD_CLASS =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"

export function AdminPage() {
  const [, setLocation] = useLocation()
  const queryClient = useQueryClient()
  const { data: categories } = useListCategories()
  const { mutate: createResource, isPending } = useCreateResource()

  const [form, setForm] = useState({
    title: "",
    url: "",
    description: "",
    category: "",
    newCategory: "",
    type: "tool",
    difficulty: "beginner",
    featured: false,
  })
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const set = (key: string, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }))

  const addTag = () => {
    const t = tagInput.trim()
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t])
    setTagInput("")
  }

  const removeTag = (tag: string) =>
    setTags((prev) => prev.filter((t) => t !== tag))

  const handleTagKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag()
    }
  }

  const resolvedCategory = form.category === "__new__" ? form.newCategory.trim() : form.category

  const isValid =
    form.title.trim() &&
    form.url.trim() &&
    form.description.trim() &&
    resolvedCategory

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return

    setStatus("idle")
    setErrorMsg("")

    createResource(
      {
        data: {
          title: form.title.trim(),
          url: form.url.trim(),
          description: form.description.trim(),
          category: resolvedCategory,
          tags,
          type: form.type,
          difficulty: form.difficulty,
          language: "uk",
          featured: form.featured,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries()
          setStatus("success")
          setForm({
            title: "",
            url: "",
            description: "",
            category: "",
            newCategory: "",
            type: "tool",
            difficulty: "beginner",
            featured: false,
          })
          setTags([])
          setTagInput("")
          setTimeout(() => setStatus("idle"), 4000)
        },
        onError: (err: unknown) => {
          setStatus("error")
          const msg =
            err instanceof Error ? err.message : "Помилка при збереженні"
          setErrorMsg(msg)
        },
      }
    )
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground bg-muted/60 px-3 py-1 rounded-full mb-3">
          <PlusCircle className="h-3.5 w-3.5" />
          Адміністрування
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">
          Додати ресурс
        </h1>
        <p className="text-muted-foreground mt-2">
          Заповніть форму — ресурс одразу з'явиться в каталозі.
        </p>
      </div>

      {/* Success banner */}
      {status === "success" && (
        <div className="flex items-center gap-3 mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-800">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          <div>
            <p className="font-medium">Ресурс додано!</p>
            <p className="text-sm opacity-80">Він вже доступний у каталозі.</p>
          </div>
          <button
            className="ml-auto text-green-600 hover:text-green-800"
            onClick={() => setLocation("/resources")}
          >
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Error banner */}
      {status === "error" && (
        <div className="flex items-start gap-3 mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Помилка</p>
            <p className="text-sm opacity-80">{errorMsg}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">
            Назва <span className="text-destructive">*</span>
          </label>
          <Input
            placeholder="Наприклад: Scratch — програмування для дітей"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            required
          />
        </div>

        {/* URL */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">
            Посилання (URL) <span className="text-destructive">*</span>
          </label>
          <Input
            type="url"
            placeholder="https://..."
            value={form.url}
            onChange={(e) => set("url", e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">
            Опис <span className="text-destructive">*</span>
          </label>
          <textarea
            className={`${FIELD_CLASS} min-h-[90px] resize-y`}
            placeholder="Коротко опишіть, що це і кому корисно..."
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            required
          />
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">
            Категорія <span className="text-destructive">*</span>
          </label>
          <select
            className={FIELD_CLASS}
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            required
          >
            <option value="" disabled>
              Оберіть категорію...
            </option>
            {categories?.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name} ({c.count})
              </option>
            ))}
            <option value="__new__">＋ Нова категорія</option>
          </select>
          {form.category === "__new__" && (
            <Input
              className="mt-2"
              placeholder="Назва нової категорії"
              value={form.newCategory}
              onChange={(e) => set("newCategory", e.target.value)}
              required
            />
          )}
        </div>

        {/* Type + Difficulty — side by side */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Тип ресурсу</label>
            <select
              className={FIELD_CLASS}
              value={form.type}
              onChange={(e) => set("type", e.target.value)}
            >
              {RESOURCE_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Складність</label>
            <select
              className={FIELD_CLASS}
              value={form.difficulty}
              onChange={(e) => set("difficulty", e.target.value)}
            >
              {DIFFICULTIES.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Теги</label>
          <div className="flex gap-2">
            <Input
              placeholder="Введіть тег і натисніть Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKey}
            />
            <Button type="button" variant="outline" onClick={addTag} disabled={!tagInput.trim()}>
              Додати
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1 pr-1 font-normal"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-0.5 rounded hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Featured */}
        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-border/60 hover:bg-muted/30 transition-colors">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => set("featured", e.target.checked)}
            className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
          />
          <div>
            <span className="text-sm font-medium">Рекомендований ресурс</span>
            <p className="text-xs text-muted-foreground">
              З'явиться на головній сторінці у блоці «Вибрані матеріали»
            </p>
          </div>
        </label>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            type="submit"
            disabled={!isValid || isPending}
            className="min-w-[160px]"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Збереження…
              </>
            ) : (
              <>
                <PlusCircle className="mr-2 h-4 w-4" />
                Додати ресурс
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setLocation("/resources")}
          >
            Скасувати
          </Button>
        </div>
      </form>
    </div>
  )
}
