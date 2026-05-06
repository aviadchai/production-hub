import type { Metadata } from 'next'
import { Heebo } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  variable: '--font-heebo',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Production Hub',
  description: 'מרכז הפרויקטים הפנימי של הצוות',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} dark`}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
        <Toaster position="bottom-center" dir="rtl" />
      </body>
    </html>
  )
}
