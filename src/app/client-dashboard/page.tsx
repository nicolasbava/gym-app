"use client"

import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Progress } from "@/src/components/ui/progress"
import { Dumbbell, TrendingUp, LogOut, Apple, Activity } from "lucide-react"
import { signOut } from "@/src/app/actions/auth"

export default function ClientDashboard() {
  const handleLogout = async () => {
    await signOut()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-purple-800/20 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-black p-2 rounded-lg">
              <Dumbbell className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">Luxion</h1>
            <Badge className="bg-blue-600/20 text-blue-200 border-blue-400">Cliente</Badge>
          </div>
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback className="bg-purple-600">JD</AvatarFallback>
            </Avatar>
            <Button onClick={handleLogout} variant="ghost" size="sm" className="text-purple-200 hover:text-white">
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white">¡Hola, Juan! 👋</h2>
              <p className="text-purple-200">Continúa con tu progreso fitness</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="bg-black/40 border-purple-800/30 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-purple-200">Entrenamientos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">24</div>
                <p className="text-xs text-purple-300">Este mes</p>
              </CardContent>
            </Card>
            <Card className="bg-black/40 border-purple-800/30 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-purple-200">Calorías</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">2,450</div>
                <p className="text-xs text-purple-300">Hoy</p>
              </CardContent>
            </Card>
            <Card className="bg-black/40 border-purple-800/30 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-purple-200">Peso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">75kg</div>
                <p className="text-xs text-green-400">-2kg este mes</p>
              </CardContent>
            </Card>
            <Card className="bg-black/40 border-purple-800/30 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-purple-200">Progreso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">78%</div>
                <Progress value={78} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="workout" className="space-y-6">
            <TabsList className="bg-purple-900/20">
              <TabsTrigger value="workout" className="data-[state=active]:bg-purple-600">
                <Activity className="h-4 w-4 mr-2" />
                Mi Rutina
              </TabsTrigger>
              <TabsTrigger value="nutrition" className="data-[state=active]:bg-purple-600">
                <Apple className="h-4 w-4 mr-2" />
                Mi Dieta
              </TabsTrigger>
              <TabsTrigger value="progress" className="data-[state=active]:bg-purple-600">
                <TrendingUp className="h-4 w-4 mr-2" />
                Progreso
              </TabsTrigger>
            </TabsList>

            <TabsContent value="workout" className="space-y-6">
              <Card className="bg-black/40 border-purple-800/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Rutina Asignada por tu Entrenador</CardTitle>
                  <CardDescription className="text-purple-200">Entrenamiento de fuerza - Tren superior</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-purple-900/20 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Press de banca inclinado</h4>
                      <p className="text-sm text-purple-300">4 series x 8-10 reps | Descanso: 90s</p>
                    </div>
                    <Badge variant="outline" className="border-green-400 text-green-400">
                      Completado
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-900/20 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Dominadas asistidas</h4>
                      <p className="text-sm text-purple-300">3 series x 6-8 reps | Descanso: 2min</p>
                    </div>
                    <Badge variant="outline" className="border-yellow-400 text-yellow-400">
                      En progreso
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-900/20 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Flexiones diamante</h4>
                      <p className="text-sm text-purple-300">3 series x 12-15 reps | Descanso: 60s</p>
                    </div>
                    <Badge variant="outline" className="border-purple-400 text-purple-400">
                      Pendiente
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="nutrition" className="space-y-6">
              <Card className="bg-black/40 border-purple-800/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Plan Nutricional Personalizado</CardTitle>
                  <CardDescription className="text-purple-200">
                    Dieta personalizada para pérdida de peso
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-purple-900/20 rounded-lg text-center">
                      <h4 className="text-white font-medium">Desayuno</h4>
                      <p className="text-sm text-purple-300 mt-2">
                        Avena con arándanos y nueces
                        <br />
                        Huevos revueltos con espinacas
                        <br />
                        Yogur griego con miel
                        <br />
                        Café negro o té verde
                      </p>
                      <p className="text-xs text-green-400 mt-2">520 kcal</p>
                    </div>
                    <div className="p-4 bg-purple-900/20 rounded-lg text-center">
                      <h4 className="text-white font-medium">Almuerzo</h4>
                      <p className="text-sm text-purple-300 mt-2">
                        Pechuga de pollo a la plancha
                        <br />
                        Arroz integral con verduras
                        <br />
                        Ensalada de rúcula y tomate
                        <br />
                        Aguacate y aceite de oliva
                      </p>
                      <p className="text-xs text-green-400 mt-2">680 kcal</p>
                    </div>
                    <div className="p-4 bg-purple-900/20 rounded-lg text-center">
                      <h4 className="text-white font-medium">Cena</h4>
                      <p className="text-sm text-purple-300 mt-2">
                        Salmón al horno con limón
                        <br />
                        Brócoli y coliflor al vapor
                        <br />
                        Quinoa con almendras
                        <br />
                        Infusión de manzanilla
                      </p>
                      <p className="text-xs text-green-400 mt-2">580 kcal</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="progress" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-black/40 border-purple-800/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Progreso de Peso</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-32 bg-purple-900/20 rounded-lg flex items-center justify-center">
                      <p className="text-purple-300">Gráfico de progreso</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-black/40 border-purple-800/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Fuerza</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-purple-200">Press banca</span>
                        <span className="text-white">80kg (+5kg)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-200">Sentadilla</span>
                        <span className="text-white">100kg (+10kg)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-200">Peso muerto</span>
                        <span className="text-white">120kg (+15kg)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
