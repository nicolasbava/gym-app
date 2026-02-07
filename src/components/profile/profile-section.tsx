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
    <Card className={`bg-card/40 border-yellow-500/20 backdrop-blur-sm ${className ?? ""}`}>
      <CardHeader>
        <CardTitle className="text-foreground">{title}</CardTitle>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
