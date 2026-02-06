"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Progress } from "@/src/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog"
import {
  Dumbbell,
  Users,
  LogOut,
  Plus,
  Clock,
  Target,
  Calendar,
  Crown,
  CreditCard,
  CheckCircle,
  Gift,
  Eye,
  Apple,
} from "lucide-react"
import CreateRoutineDialog from "../../components/trainer-dashboard/forms/createRoutine"
import CreateExerciseDialog from "../../components/trainer-dashboard/forms/createExercise"
import CreateUserDialog from "../../components/trainer-dashboard/forms/createUser"
import { signOut } from "@/src/app/actions/auth"
import { useApp } from "@/src/contexts/AppContext"

export default function TrainerDashboard() {
  const { gymId } = useApp();
  const [hasSubscription, setHasSubscription] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState(30); // Simular días de prueba restantes
  const [isTrialActive, setIsTrialActive] = useState(true);
  const [activePlan, setActivePlan] = useState("");
  const [assignedPrograms, setAssignedPrograms] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [openExerciseForm, setOpenExerciseForm] = useState(false);
  const [openCreateUser, setOpenCreateUser] = useState(false);

  useEffect(() => {
    // Check if user just subscribed
    const urlParams = new URLSearchParams(window.location.search)
    const subscribed = urlParams.get("subscribed")
    const plan = urlParams.get("plan")

    if (subscribed === "true") {
      setHasSubscription(true)
      setIsTrialActive(false)
      if (plan) {
        setActivePlan(plan)
      }
      // Clean URL
      window.history.replaceState({}, document.title, "/trainer-dashboard")
    }

    // Cargar programas asignados desde localStorage
    const loadAssignedPrograms = () => {
      const programs = JSON.parse(localStorage.getItem("assignedPrograms") || "[]")
      setAssignedPrograms(programs)
    }

    loadAssignedPrograms()

    // Actualizar cada 5 segundos para mostrar nuevas asignaciones
    const interval = setInterval(loadAssignedPrograms, 5000)

    return () => clearInterval(interval)
  }, [isTrialActive, trialDaysLeft])

  const handleLogout = async () => {
    await signOut()
  }

  const handleSubscribe = (plan: string) => {
    window.location.href = `/trainer-payment?plan=${plan}`
  }

  const plans = {
    basic: {
      name: "Básico",
      price: 29,
      features: ["Hasta 5 clientes", "Rutinas básicas", "Seguimiento", "Email support"],
    },
    premium: {
      name: "Premium",
      price: 59,
      features: [
        "Hasta 25 clientes",
        "Rutinas personalizadas",
        "Planes nutricionales",
        "Chat con clientes",
        "Análisis detallado",
      ],
    },
    elite: {
      name: "Elite",
      price: 99,
      features: [
        "Clientes ilimitados",
        "Entrenador personal",
        "Videollamadas 1:1",
        "Ajustes semanales",
        "Soporte 24/7",
      ],
    },
  }

  // Si el período de prueba ha expirado y no tiene suscripción
  const trialExpired = trialDaysLeft <= 0 && !hasSubscription

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
            <Badge className="bg-orange-600/20 text-orange-200 border-orange-400">Entrenador</Badge>
          </div>
          <div className="flex items-center space-x-4">
            {/* Trial Status */}
            {isTrialActive && trialDaysLeft > 0 && (
              <Badge className="bg-green-600/20 text-green-200 border-green-400">
                <Gift className="h-3 w-3 mr-1" />
                Prueba: {trialDaysLeft} días restantes
              </Badge>
            )}

            {/* Action Buttons */}
            {(isTrialActive && trialDaysLeft > 0) || hasSubscription ? (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Crear rutina
                  </Button>
                </DialogTrigger>
                <CreateRoutineDialog gymId={gymId ?? ""} onSuccess={() => {}} open={open} setOpen={setOpen} />
              </Dialog>
            ) : null}
            {(isTrialActive && trialDaysLeft > 0) || hasSubscription ? (
              <Dialog open={openCreateUser} onOpenChange={setOpenCreateUser}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Users className="h-4 w-4 mr-2" />
                    Nuevo miembro
                  </Button>
                </DialogTrigger>
                <CreateUserDialog
                  gymId={gymId ?? ""}
                  onSuccess={() => {}}
                  open={openCreateUser}
                  setOpen={setOpenCreateUser}
                />
              </Dialog>
            ) : null}
            {(isTrialActive && trialDaysLeft > 0) || hasSubscription ? (
              <Dialog open={openExerciseForm} onOpenChange={setOpenExerciseForm}>
                <CreateExerciseDialog gymId={gymId ?? ""} onSuccess={() => {}} />
              </Dialog>
            ) : null}

            {!hasSubscription && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <CreditCard className="h-4 w-4 mr-2" />
                    {trialExpired ? "Suscribirse Ahora" : "Ver Planes"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-purple-800/30 max-w-4xl">
                  <DialogHeader>
                    <DialogTitle className="text-white text-2xl">Planes de Suscripción</DialogTitle>
                    <DialogDescription className="text-purple-200">
                      {trialExpired
                        ? "Tu período de prueba ha terminado. Elige un plan para continuar."
                        : "Elige el plan que mejor se adapte a tus necesidades como entrenador"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid md:grid-cols-3 gap-6 mt-6">
                    <Card className="bg-black/40 border-purple-800/30 backdrop-blur-sm">
                      <CardHeader className="text-center">
                        <CardTitle className="text-white text-2xl">Básico</CardTitle>
                        <div className="text-4xl font-bold text-purple-400">€29</div>
                        <CardDescription className="text-purple-200">por mes</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {plans.basic.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="h-5 w-5 text-green-400" />
                            <span className="text-purple-200">{feature}</span>
                          </div>
                        ))}
                        <Button
                          onClick={() => handleSubscribe("basic")}
                          className="w-full bg-purple-600 hover:bg-purple-700 mt-6"
                        >
                          Elegir Plan
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="bg-black/40 border-purple-400 backdrop-blur-sm relative">
                      <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600">
                        Más Popular
                      </Badge>
                      <CardHeader className="text-center">
                        <CardTitle className="text-white text-2xl">Premium</CardTitle>
                        <div className="text-4xl font-bold text-purple-400">€59</div>
                        <CardDescription className="text-purple-200">por mes</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {plans.premium.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="h-5 w-5 text-green-400" />
                            <span className="text-purple-200">{feature}</span>
                          </div>
                        ))}
                        <Button
                          onClick={() => handleSubscribe("premium")}
                          className="w-full bg-purple-600 hover:bg-purple-700 mt-6"
                        >
                          Elegir Plan
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="bg-black/40 border-purple-800/30 backdrop-blur-sm">
                      <CardHeader className="text-center">
                        <CardTitle className="text-white text-2xl flex items-center justify-center">
                          <Crown className="h-5 w-5 mr-2 text-yellow-400" />
                          Elite
                        </CardTitle>
                        <div className="text-4xl font-bold text-purple-400">€99</div>
                        <CardDescription className="text-purple-200">por mes</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {plans.elite.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="h-5 w-5 text-green-400" />
                            <span className="text-purple-200">{feature}</span>
                          </div>
                        ))}
                        <Button
                          onClick={() => handleSubscribe("elite")}
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 mt-6"
                        >
                          Elegir Plan
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            <Avatar>
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback className="bg-purple-600">CM</AvatarFallback>
            </Avatar>
            <Button onClick={handleLogout} variant="ghost" size="sm" className="text-purple-200 hover:text-white">
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {trialExpired ? (
          // Trial Expired - Show subscription required
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* <div>
              <h2 className="text-4xl font-bold text-white mb-4">¡Tu Prueba Gratuita Ha Terminado! ⏰</h2>
              <p className="text-xl text-purple-200">
                Has disfrutado de 30 días completos de Luxion. Para continuar entrenando profesionalmente, elige tu
                plan.
              </p>
            </div> */}

            <Card className="bg-black/40 border-red-800/30 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="text-center space-y-4">
                  <Clock className="h-16 w-16 text-red-400 mx-auto" />
                  <h3 className="text-2xl font-bold text-white">Período de Prueba Finalizado</h3>
                  <p className="text-purple-200">
                    Durante tu prueba gratuita pudiste experimentar todas nuestras herramientas profesionales. ¡Ahora es
                    momento de continuar tu crecimiento profesional!
                  </p>
                  <div className="bg-purple-900/20 p-4 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Durante tu prueba utilizaste:</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm text-purple-200">
                      <div>✅ Biblioteca de 200+ ejercicios</div>
                      <div>✅ 150+ opciones nutricionales</div>
                      <div>✅ Sistema de asignación de programas</div>
                      <div>✅ Gestión de clientes</div>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-3">
                        Continuar con un Plan
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-purple-800/30 max-w-4xl">
                      <DialogHeader>
                        <DialogTitle className="text-white text-2xl">Elige tu Plan de Suscripción</DialogTitle>
                        <DialogDescription className="text-purple-200">
                          Continúa donde lo dejaste con acceso completo a todas las herramientas
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid md:grid-cols-3 gap-6 mt-6">
                        <Card className="bg-black/40 border-purple-800/30 backdrop-blur-sm">
                          <CardHeader className="text-center">
                            <CardTitle className="text-white text-2xl">Básico</CardTitle>
                            <div className="text-4xl font-bold text-purple-400">€29</div>
                            <CardDescription className="text-purple-200">por mes</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {plans.basic.features.map((feature, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <CheckCircle className="h-5 w-5 text-green-400" />
                                <span className="text-purple-200">{feature}</span>
                              </div>
                            ))}
                            <Button
                              onClick={() => handleSubscribe("basic")}
                              className="w-full bg-purple-600 hover:bg-purple-700 mt-6"
                            >
                              Elegir Plan
                            </Button>
                          </CardContent>
                        </Card>

                        <Card className="bg-black/40 border-purple-400 backdrop-blur-sm relative">
                          <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600">
                            Más Popular
                          </Badge>
                          <CardHeader className="text-center">
                            <CardTitle className="text-white text-2xl">Premium</CardTitle>
                            <div className="text-4xl font-bold text-purple-400">€59</div>
                            <CardDescription className="text-purple-200">por mes</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {plans.premium.features.map((feature, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <CheckCircle className="h-5 w-5 text-green-400" />
                                <span className="text-purple-200">{feature}</span>
                              </div>
                            ))}
                            <Button
                              onClick={() => handleSubscribe("premium")}
                              className="w-full bg-purple-600 hover:bg-purple-700 mt-6"
                            >
                              Elegir Plan
                            </Button>
                          </CardContent>
                        </Card>

                        <Card className="bg-black/40 border-purple-800/30 backdrop-blur-sm">
                          <CardHeader className="text-center">
                            <CardTitle className="text-white text-2xl flex items-center justify-center">
                              <Crown className="h-5 w-5 mr-2 text-yellow-400" />
                              Elite
                            </CardTitle>
                            <div className="text-4xl font-bold text-purple-400">€99</div>
                            <CardDescription className="text-purple-200">por mes</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {plans.elite.features.map((feature, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <CheckCircle className="h-5 w-5 text-green-400" />
                                <span className="text-purple-200">{feature}</span>
                              </div>
                            ))}
                            <Button
                              onClick={() => handleSubscribe("elite")}
                              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 mt-6"
                            >
                              Elegir Plan
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Active Trial or Subscription - Show full dashboard
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white">Panel de Entrenador 💪</h2>
                <p className="text-purple-200">
                  {isTrialActive && trialDaysLeft > 0
                    ? `Disfruta tu prueba gratuita - ${trialDaysLeft} días restantes`
                    : "Gestiona a tus clientes y programas"}
                </p>
              </div>
              {hasSubscription ? (
                <Badge className="bg-green-600/20 text-green-200 border-green-400">
                  Plan {activePlan ? plans[activePlan as keyof typeof plans]?.name : "Activo"}
                </Badge>
              ) : (
                <Badge className="bg-green-600/20 text-green-200 border-green-400">
                  <Gift className="h-4 w-4 mr-1" />
                  Prueba Gratuita
                </Badge>
              )}
            </div>

            {/* Trial Warning when less than 7 days */}
            {isTrialActive && trialDaysLeft <= 7 && trialDaysLeft > 0 && (
              <Card className="bg-yellow-900/20 border-yellow-600/30 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-6 w-6 text-yellow-400" />
                    <div className="flex-1">
                      <h3 className="text-yellow-400 font-semibold">¡Tu prueba gratuita termina pronto!</h3>
                      <p className="text-yellow-200 text-sm">
                        Te quedan {trialDaysLeft} días. Elige un plan para continuar sin interrupciones.
                      </p>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="border-yellow-400 text-yellow-400 hover:bg-yellow-900/20 bg-transparent"
                        >
                          Ver Planes
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-900 border-purple-800/30 max-w-4xl">
                        <DialogHeader>
                          <DialogTitle className="text-white text-2xl">No Pierdas el Acceso</DialogTitle>
                          <DialogDescription className="text-purple-200">
                            Elige tu plan ahora y continúa entrenando sin interrupciones
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid md:grid-cols-3 gap-6 mt-6">
                          {Object.entries(plans).map(([key, plan]) => (
                            <Card
                              key={key}
                              className={`bg-black/40 backdrop-blur-sm ${key === "premium" ? "border-purple-400 relative" : "border-purple-800/30"}`}
                            >
                              {key === "premium" && (
                                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600">
                                  Más Popular
                                </Badge>
                              )}
                              <CardHeader className="text-center">
                                <CardTitle className="text-white text-2xl flex items-center justify-center">
                                  {key === "elite" && <Crown className="h-5 w-5 mr-2 text-yellow-400" />}
                                  {plan.name}
                                </CardTitle>
                                <div className="text-4xl font-bold text-purple-400">€{plan.price}</div>
                                <CardDescription className="text-purple-200">por mes</CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                {plan.features.map((feature, index) => (
                                  <div key={index} className="flex items-center space-x-2">
                                    <CheckCircle className="h-5 w-5 text-green-400" />
                                    <span className="text-purple-200">{feature}</span>
                                  </div>
                                ))}
                                <Button
                                  onClick={() => handleSubscribe(key)}
                                  className={`w-full mt-6 ${key === "elite" ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" : "bg-purple-600 hover:bg-purple-700"}`}
                                >
                                  Elegir Plan
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            )}

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
                  <CardTitle className="text-sm text-purple-200">Programas Asignados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{assignedPrograms.length}</div>
                  <p className="text-xs text-purple-300">Total asignados</p>
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
                  Mis Clientes
                </TabsTrigger>
                <TabsTrigger value="programs" className="data-[state=active]:bg-purple-600">
                  <Target className="h-4 w-4 mr-2" />
                  Programas Asignados
                </TabsTrigger>
                <TabsTrigger value="schedule" className="data-[state=active]:bg-purple-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Horarios
                </TabsTrigger>
              </TabsList>

              <TabsContent value="clients" className="space-y-6">
                <Card className="bg-black/40 border-purple-800/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Clientes Activos</CardTitle>
                    <CardDescription className="text-purple-200">
                      Gestiona y supervisa el progreso de tus clientes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      {
                        name: "Ana García",
                        plan: "Premium",
                        progress: 85,
                        status: "Activo",
                        lastWorkout: "Hace 2 días",
                      },
                      { name: "Carlos López", plan: "Básico", progress: 62, status: "Activo", lastWorkout: "Ayer" },
                      { name: "María Rodríguez", plan: "Elite", progress: 91, status: "Activo", lastWorkout: "Hoy" },
                      {
                        name: "Luis Martín",
                        plan: "Premium",
                        progress: 74,
                        status: "Activo",
                        lastWorkout: "Hace 3 días",
                      },
                      { name: "Sofia Herrera", plan: "Básico", progress: 58, status: "Activo", lastWorkout: "Ayer" },
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
                            <p className="text-sm text-purple-300">
                              Plan {client.plan} • {client.lastWorkout}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-white">{client.progress}%</p>
                            <Progress value={client.progress} className="w-20 mt-1" />
                          </div>
                          <Link href="/assign-program">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              Asignar
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="programs" className="space-y-6">
                <Card className="bg-black/40 border-purple-800/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Programas Asignados Recientemente</CardTitle>
                    <CardDescription className="text-purple-200">
                      Revisa los programas que has asignado a tus clientes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {assignedPrograms.length === 0 ? (
                      <div className="text-center py-8">
                        <Target className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                        <h3 className="text-white font-medium mb-2">No hay programas asignados</h3>
                        <p className="text-purple-300 text-sm mb-4">
                          Comienza asignando rutinas y dietas personalizadas a tus clientes
                        </p>
                        <Link href="/assign-program">
                          <Button className="bg-green-600 hover:bg-green-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Asignar Primer Programa
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      assignedPrograms
                        .slice(-5)
                        .reverse()
                        .map((program, index) => (
                          <div key={index} className="p-4 bg-purple-900/20 rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="text-white font-medium">{program.clientName}</h4>
                                <p className="text-sm text-purple-300">
                                  Asignado el {new Date(program.assignedDate).toLocaleDateString("es-ES")}
                                </p>
                              </div>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-purple-400 text-purple-200 hover:bg-purple-800 bg-transparent"
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Ver Detalles
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-slate-900 border-purple-800/30 max-w-4xl max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle className="text-white text-2xl">
                                      Programa para {program.clientName}
                                    </DialogTitle>
                                    <DialogDescription className="text-purple-200">
                                      Detalles del programa asignado el{" "}
                                      {new Date(program.assignedDate).toLocaleDateString("es-ES")}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-6 mt-6">
                                    {program.workouts.length > 0 && (
                                      <div>
                                        <h3 className="text-white font-semibold mb-3 flex items-center">
                                          <Target className="h-5 w-5 mr-2 text-green-400" />
                                          Rutina de Ejercicios ({program.workouts.length})
                                        </h3>
                                        <div className="space-y-2 max-h-60 overflow-y-auto">
                                          {program.workouts.map((workout: string, idx: number) => (
                                            <div
                                              key={idx}
                                              className="text-sm text-green-300 flex items-start p-2 bg-green-900/20 rounded"
                                            >
                                              <span className="text-green-400 mr-2">•</span>
                                              <span className="flex-1">{workout}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {program.meals.length > 0 && (
                                      <div>
                                        <h3 className="text-white font-semibold mb-3 flex items-center">
                                          <Apple className="h-5 w-5 mr-2 text-orange-400" />
                                          Plan Nutricional ({program.meals.length})
                                        </h3>
                                        <div className="space-y-2 max-h-60 overflow-y-auto">
                                          {program.meals.map((meal: string, idx: number) => (
                                            <div
                                              key={idx}
                                              className="text-sm text-orange-300 flex items-start p-2 bg-orange-900/20 rounded"
                                            >
                                              <span className="text-orange-400 mr-2">•</span>
                                              <span className="flex-1">{meal}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {program.notes && (
                                      <div>
                                        <h3 className="text-white font-semibold mb-3">Notas Especiales</h3>
                                        <div className="p-3 bg-purple-900/20 rounded-lg">
                                          <p className="text-purple-200 text-sm">{program.notes}</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center space-x-2">
                                <Target className="h-4 w-4 text-green-400" />
                                <span className="text-purple-200">{program.workouts.length} ejercicios</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Apple className="h-4 w-4 text-orange-400" />
                                <span className="text-purple-200">{program.meals.length} comidas</span>
                              </div>
                            </div>
                          </div>
                        ))
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="schedule" className="space-y-6">
                <Card className="bg-black/40 border-purple-800/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Agenda de Hoy</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { time: "09:00", client: "Ana García", type: "Seguimiento Nutricional" },
                      { time: "10:30", client: "Carlos López", type: "Evaluación Inicial" },
                      { time: "14:00", client: "María Rodríguez", type: "Revisión de Rutina" },
                      { time: "16:00", client: "Luis Martín", type: "Consulta Virtual" },
                      { time: "17:30", client: "Sofia Herrera", type: "Asignación de Programa" },
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
