import { AppLayout } from '@/components/layout/AppLayout'
import { PromptCard } from '@/components/prompts/PromptCard'
import { prompts } from '@/lib/mock-data'

export default function FavoritesPage() {
  const favorited = prompts.filter((p) => p.is_favorited)

  return (
    <AppLayout title="המועדפים שלי">
      <div className="space-y-6 max-w-5xl">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {favorited.length} פרומפטים שמורים
          </p>
        </div>

        {favorited.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground text-sm border border-dashed border-border rounded-xl">
            <p className="font-medium mb-1">אין מועדפים עדיין</p>
            <p className="text-xs">לחץ על הלב בכל פרומפט כדי לשמור אותו</p>
          </div>
        ) : (
          <div className="space-y-4">
            {favorited.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
