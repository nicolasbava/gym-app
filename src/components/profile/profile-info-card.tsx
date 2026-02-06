import { type ReactNode } from "react"
import { Card, CardContent } from "@/src/components/ui/card"

interface ProfileInfoItemProps {
  label: string
  value: string | null | undefined
  icon?: ReactNode
}

export function ProfileInfoItem({ label, value, icon }: ProfileInfoItemProps) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-purple-800/20 last:border-0">
      {icon && <div className="mt-0.5 text-purple-400">{icon}</div>}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-purple-200">{label}</p>
        <p className="text-base text-white mt-1 break-words">
          {value ?? <span className="text-purple-400 italic">No especificado</span>}
        </p>
      </div>
    </div>
  )
}

interface ProfileInfoCardProps {
  children: ReactNode
  className?: string
}

export function ProfileInfoCard({ children, className }: ProfileInfoCardProps) {
  return (
    <Card className={`bg-black/20 border-purple-800/20 ${className ?? ""}`}>
      <CardContent className="pt-6">{children}</CardContent>
    </Card>
  )
}
