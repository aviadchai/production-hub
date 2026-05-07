'use client'

import { useState } from 'react'
import { UserPlus, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const mockTeam = [
  { id: '1', name: 'Aviad Chai', email: 'aviad.c@artlist.io', dept: 'Production' },
  { id: '2', name: 'Sarah Levy', email: 'sarah.l@artlist.io', dept: 'Design' },
  { id: '3', name: 'Michael Cohen', email: 'michael.c@artlist.io', dept: 'Content' },
  { id: '4', name: 'Noa Shapira', email: 'noa.s@artlist.io', dept: 'Production' },
  { id: '5', name: 'Yosef Abraham', email: 'yosef.a@artlist.io', dept: 'Design' },
]

interface AssignMembersButtonProps {
  initialMembers?: string[]
}

export function AssignMembersButton({ initialMembers = ['1'] }: AssignMembersButtonProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [assigned, setAssigned] = useState<string[]>(initialMembers)

  const filtered = mockTeam.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
  )

  const toggle = (id: string) => {
    setAssigned((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const assignedMembers = mockTeam.filter((m) => assigned.includes(m.id))

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          {assignedMembers.slice(0, 4).map((m) => (
            <div
              key={m.id}
              title={m.name}
              className="h-6 w-6 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-[10px] font-bold"
            >
              {m.name.charAt(0)}
            </div>
          ))}
          {assignedMembers.length > 4 && (
            <div className="h-6 w-6 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-[10px] font-bold text-muted-foreground">
              +{assignedMembers.length - 4}
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setOpen(true)}
          className="h-6 w-6 p-0 rounded-full border border-dashed border-border hover:border-foreground/50 transition-colors"
        >
          <UserPlus className="h-3 w-3" />
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm">Assign Team Members</DialogTitle>
          </DialogHeader>

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="h-8 text-sm"
            autoFocus
          />

          <div className="space-y-1 max-h-60 overflow-y-auto">
            {filtered.map((member) => {
              const isAssigned = assigned.includes(member.id)
              return (
                <button
                  key={member.id}
                  onClick={() => toggle(member.id)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-secondary/60 transition-colors text-left"
                >
                  <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center text-xs font-bold shrink-0">
                    {member.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{member.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{member.dept}</p>
                  </div>
                  {isAssigned && <Check className="h-3.5 w-3.5 text-foreground shrink-0" />}
                </button>
              )
            })}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setOpen(false)}>
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
