import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { currentUser, departments } from '@/lib/mock-data'

export default function SettingsPage() {
  const dept = departments.find((d) => d.id === currentUser.department_id)

  return (
    <AppLayout title="הגדרות">
      <div className="space-y-8 max-w-xl">
        <section className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold">פרופיל אישי</h2>
            <p className="text-xs text-muted-foreground mt-0.5">עדכן את פרטיך האישיים</p>
          </div>
          <Separator />
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">שם מלא</Label>
              <Input defaultValue={currentUser.full_name} className="h-8 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">אימייל</Label>
              <Input defaultValue={currentUser.email} className="h-8 text-sm" disabled />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">מחלקה</Label>
              <Input defaultValue={dept?.name_he} className="h-8 text-sm" disabled />
            </div>
            <Button size="sm" className="h-7 text-xs">שמור שינויים</Button>
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold">שפה ותצוגה</h2>
            <p className="text-xs text-muted-foreground mt-0.5">שפה וכיוון הדף</p>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">שפה</p>
              <p className="text-xs text-muted-foreground">עברית (ברירת מחדל)</p>
            </div>
            <div className="flex gap-1">
              <button className="px-3 py-1.5 rounded-md text-xs font-medium bg-foreground text-background">
                עברית
              </button>
              <button className="px-3 py-1.5 rounded-md text-xs font-medium bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                English
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">מצב תצוגה</p>
              <p className="text-xs text-muted-foreground">כהה (ברירת מחדל)</p>
            </div>
            <div className="flex gap-1">
              <button className="px-3 py-1.5 rounded-md text-xs font-medium bg-foreground text-background">
                כהה
              </button>
              <button className="px-3 py-1.5 rounded-md text-xs font-medium bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                בהיר
              </button>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold">אבטחה</h2>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">שינוי סיסמה</p>
              <p className="text-xs text-muted-foreground">יישלח לינק לאימייל שלך</p>
            </div>
            <Button variant="outline" size="sm" className="h-7 text-xs">שלח לינק</Button>
          </div>
        </section>
      </div>
    </AppLayout>
  )
}
