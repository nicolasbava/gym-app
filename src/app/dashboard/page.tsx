"use client"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Progress } from "@/src/components/ui/progress"
import { Dumbbell, Calendar, Target, TrendingUp, Users, LogOut, Plus, Clock, Apple, Activity } from "lucide-react"

export default function DashboardPage() {
  const [userType, setUserType] = useState<"client" | "trainer">("client") // Simular tipo de usuario

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
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-black/20 rounded-lg p-2">
              <Button
                variant={userType === "client" ? "default" : "ghost"}
                size="sm"
                onClick={() => setUserType("client")}
                className={userType === "client" ? "bg-purple-600" : "text-purple-200 hover:text-white"}
              >
                Cliente
              </Button>
              <Button
                variant={userType === "trainer" ? "default" : "ghost"}
                size="sm"
                onClick={() => setUserType("trainer")}
                className={userType === "trainer" ? "bg-purple-600" : "text-purple-200 hover:text-white"}
              >
                Entrenador
              </Button>
            </div>
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback className="bg-purple-600">JD</AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="sm" className="text-purple-200 hover:text-white">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {userType === "client" ? (
          // CLIENT DASHBOARD
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
                  Rutina
                </TabsTrigger>
                <TabsTrigger value="nutrition" className="data-[state=active]:bg-purple-600">
                  <Apple className="h-4 w-4 mr-2" />
                  Nutrición
                </TabsTrigger>
                <TabsTrigger value="progress" className="data-[state=active]:bg-purple-600">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Progreso
                </TabsTrigger>
              </TabsList>

              <TabsContent value="workout" className="space-y-6">
                <Card className="bg-black/40 border-purple-800/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Rutina de Hoy</CardTitle>
                    <CardDescription className="text-purple-200">
                      Entrenamiento de fuerza - Tren superior
                    </CardDescription>
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
                    <div className="flex items-center justify-between p-3 bg-purple-900/20 rounded-lg">
                      <div>
                        <h4 className="text-white font-medium">Remo con mancuernas</h4>
                        <p className="text-sm text-purple-300">4 series x 10-12 reps | Descanso: 75s</p>
                      </div>
                      <Badge variant="outline" className="border-purple-400 text-purple-400">
                        Pendiente
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-900/20 rounded-lg">
                      <div>
                        <h4 className="text-white font-medium">Fondos en paralelas</h4>
                        <p className="text-sm text-purple-300">3 series x 8-10 reps | Descanso: 90s</p>
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
                    <CardTitle className="text-white">Plan Nutricional</CardTitle>
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
                    <div className="mt-4 p-4 bg-purple-900/20 rounded-lg">
                      <h4 className="text-white font-medium mb-3">Snacks Saludables</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm text-purple-300">
                        <div>• Frutos secos mixtos (30g)</div>
                        <div>• Batido de proteína con plátano</div>
                        <div>• Manzana con mantequilla de almendra</div>
                        <div>• Requesón con pepino</div>
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
        ) : (
          // TRAINER DASHBOARD
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white">Panel de Entrenador 💪</h2>
                <p className="text-purple-200">Gestiona a tus clientes y programas</p>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Cliente
              </Button>
            </div>

            {/* Trainer Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="bg-black/40 border-purple-800/30 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-purple-200">Clientes Activos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">32</div>
                  <p className="text-xs text-green-400">+3 este mes</p>
                </CardContent>
              </Card>
              <Card className="bg-black/40 border-purple-800/30 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-purple-200">Sesiones Hoy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">8</div>
                  <p className="text-xs text-purple-300">6 completadas</p>
                </CardContent>
              </Card>
              <Card className="bg-black/40 border-purple-800/30 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-purple-200">Ingresos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">€2,840</div>
                  <p className="text-xs text-green-400">Este mes</p>
                </CardContent>
              </Card>
              <Card className="bg-black/40 border-purple-800/30 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-purple-200">Valoración</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">4.9</div>
                  <p className="text-xs text-purple-300">⭐⭐⭐⭐⭐</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="clients" className="space-y-6">
              <TabsList className="bg-purple-900/20">
                <TabsTrigger value="clients" className="data-[state=active]:bg-purple-600">
                  <Users className="h-4 w-4 mr-2" />
                  Clientes
                </TabsTrigger>
                <TabsTrigger value="programs" className="data-[state=active]:bg-purple-600">
                  <Target className="h-4 w-4 mr-2" />
                  Programas
                </TabsTrigger>
                <TabsTrigger value="schedule" className="data-[state=active]:bg-purple-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Horarios
                </TabsTrigger>
              </TabsList>

              <TabsContent value="clients" className="space-y-6">
                <Card className="bg-black/40 border-purple-800/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Clientes Recientes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { name: "Ana García", plan: "Premium", progress: 85, status: "Activo" },
                      { name: "Carlos López", plan: "Básico", progress: 62, status: "Activo" },
                      { name: "María Rodríguez", plan: "Elite", progress: 91, status: "Activo" },
                    ].map((client, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-purple-900/20 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback className="bg-purple-600">
                              {client.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="text-white font-medium">{client.name}</h4>
                            <p className="text-sm text-purple-300">Plan {client.plan}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white">{client.progress}%</p>
                          <Progress value={client.progress} className="w-20 mt-1" />
                        </div>
                        <Badge className="bg-green-600/20 text-green-400 border-green-400">{client.status}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="programs" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-black/40 border-purple-800/30 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white">Rutinas Disponibles</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="p-3 bg-purple-900/20 rounded-lg">
                        <h4 className="text-white font-medium">Fuerza Principiante</h4>
                        <p className="text-sm text-purple-300">
                          3 días/semana - 8 semanas | Press, sentadillas, peso muerto
                        </p>
                      </div>
                      <div className="p-3 bg-purple-900/20 rounded-lg">
                        <h4 className="text-white font-medium">Cardio HIIT Avanzado</h4>
                        <p className="text-sm text-purple-300">
                          4 días/semana - 6 semanas | Burpees, sprints, mountain climbers
                        </p>
                      </div>
                      <div className="p-3 bg-purple-900/20 rounded-lg">
                        <h4 className="text-white font-medium">Tonificación Femenina</h4>
                        <p className="text-sm text-purple-300">5 días/semana - 12 semanas | Glúteos, core, brazos</p>
                      </div>
                      <div className="p-3 bg-purple-900/20 rounded-lg">
                        <h4 className="text-white font-medium">Funcional CrossFit</h4>
                        <p className="text-sm text-purple-300">
                          4 días/semana - 10 semanas | WODs, kettlebells, box jumps
                        </p>
                      </div>
                      <div className="p-3 bg-purple-900/20 rounded-lg">
                        <h4 className="text-white font-medium">Rehabilitación Postural</h4>
                        <p className="text-sm text-purple-300">
                          3 días/semana - 6 semanas | Corrección, movilidad, estabilidad
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-black/40 border-purple-800/30 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white">Planes Nutricionales</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="p-3 bg-purple-900/20 rounded-lg">
                        <h4 className="text-white font-medium">Pérdida de Peso</h4>
                        <p className="text-sm text-purple-300">
                          1800 kcal/día - Déficit calórico | Proteína alta, carbos moderados
                        </p>
                      </div>
                      <div className="p-3 bg-purple-900/20 rounded-lg">
                        <h4 className="text-white font-medium">Ganancia Muscular</h4>
                        <p className="text-sm text-purple-300">
                          2500 kcal/día - Alto en proteína | Superávit calórico controlado
                        </p>
                      </div>
                      <div className="p-3 bg-purple-900/20 rounded-lg">
                        <h4 className="text-white font-medium">Mantenimiento Saludable</h4>
                        <p className="text-sm text-purple-300">
                          2200 kcal/día - Equilibrado | 40% carbos, 30% proteína, 30% grasas
                        </p>
                      </div>
                      <div className="p-3 bg-purple-900/20 rounded-lg">
                        <h4 className="text-white font-medium">Dieta Mediterránea</h4>
                        <p className="text-sm text-purple-300">
                          2000 kcal/día - Antiinflamatoria | Pescado, aceite oliva, verduras
                        </p>
                      </div>
                      <div className="p-3 bg-purple-900/20 rounded-lg">
                        <h4 className="text-white font-medium">Vegetariana Deportiva</h4>
                        <p className="text-sm text-purple-300">
                          2300 kcal/día - Plant-based | Legumbres, quinoa, frutos secos
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="schedule" className="space-y-6">
                <Card className="bg-black/40 border-purple-800/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Próximas Sesiones</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { time: "09:00", client: "Ana García", type: "Entrenamiento Personal" },
                      { time: "10:30", client: "Carlos López", type: "Evaluación Inicial" },
                      { time: "14:00", client: "María Rodríguez", type: "Seguimiento" },
                      { time: "16:00", client: "Luis Martín", type: "Entrenamiento Personal" },
                    ].map((session, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-purple-900/20 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="bg-purple-600 p-2 rounded-lg">
                            <Clock className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <h4 className="text-white font-medium">{session.client}</h4>
                            <p className="text-sm text-purple-300">{session.type}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium">{session.time}</p>
                          <p className="text-sm text-purple-300">Hoy</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  )
}
