import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

const deptOptions = [
  { value: '1', label: 'פרודקשן' },
  { value: '2', label: 'עיצוב' },
  { value: '3', label: 'תוכן' },
]

export default function InvitePage() {
  return (
    <AppLayout title="הזמנת משתמש">
      <div className="space-y-6 max-w-md">
        <div>
          <h2 className="text-sm font-semibold">שליחת הזמנה</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            המשתמש יקבל מייל עם לינק כניסה ייחודי
          </p>
        </div>
        <Separator />

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">אימייל</Label>
            <Input type="email" placeholder="user@company.com" className="h-8 text-sm" dir="ltr" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">מחלקה</Label>
            <select className="w-full h-8 rounded-md border border-input bg-background px-3 text-sm text-right">
              {deptOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">תפקיד</Label>
            <select className="w-full h-8 rounded-md border border-input bg-background px-3 text-sm text-right">
              <option value="member">חבר צוות</option>
              <option value="admin">אדמין</option>
            </select>
          </div>

          <Button size="sm" className="h-8 text-sm w-full">שלח הזמנה</Button>
        </div>
      </div>
    </AppLayout>
  )
}
