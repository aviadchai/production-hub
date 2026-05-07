import { Sidebar } from './Sidebar'
import { Header } from './Header'

interface AppLayoutProps {
  children: React.ReactNode
  title?: string
}

export function AppLayout({ children, title }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-56 flex flex-col min-h-screen">
        <Header title={title} />
        <div className="flex-1 p-6">{children}</div>
      </main>
    </div>
  )
}
