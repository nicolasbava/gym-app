import { type ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"

interface ProfileSectionProps {
  title: string
  description?: string
  children: ReactNode
  className?: string
}

export function ProfileSection({ title, description, children, className }: ProfileSectionProps) {
  return (
    <Card className={`bg-black/40 border-purple-800/30 backdrop-blur-sm ${className ?? ""}`}>
      <CardHeader>
        <CardTitle className="text-white">{title}</CardTitle>
        {description && <p className="text-sm text-purple-200 mt-1">{description}</p>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
