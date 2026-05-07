import { Film } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm space-y-8 px-4">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="h-10 w-10 rounded-xl bg-foreground flex items-center justify-center">
              <Film className="h-5 w-5 text-background" />
            </div>
          </div>
          <h1 className="text-xl font-bold tracking-tight">Production Hub</h1>
          <p className="text-xs text-muted-foreground">
            For Artlist team members only
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Artlist Email</Label>
            <Input
              type="email"
              placeholder="you@artlist.io"
              className="h-9 text-sm"
            />
            <p className="text-[10px] text-muted-foreground">Only @artlist.io emails are accepted</p>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Password</Label>
            <Input
              type="password"
              placeholder="••••••••"
              className="h-9 text-sm"
            />
          </div>
          <Button className="w-full h-9 text-sm">Sign In</Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-3 text-[10px] text-muted-foreground">or</span>
          </div>
        </div>

        <Button variant="outline" className="w-full h-9 text-sm">
          Sign in with Magic Link
        </Button>

        <p className="text-center text-[11px] text-muted-foreground">
          No account? Contact an admin for an invitation.
        </p>
      </div>
    </div>
  )
}
