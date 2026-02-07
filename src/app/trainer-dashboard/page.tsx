"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { Progress } from "@/src/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
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
} from "lucide-react";
import CreateRoutineDialog from "../../components/trainer-dashboard/forms/create-routine";
import CreateExerciseDialog from "../../components/trainer-dashboard/exercises/exercise-form";
import CreateUserDialog from "../../components/trainer-dashboard/forms/create-user";
import { signOut } from "@/src/app/actions/auth";
import { useApp } from "@/src/contexts/AppContext";
import { UserProfile } from "../actions/users";
import ExercisesList from "@/src/components/trainer-dashboard/exercises-list";
import ClientsList from "@/src/components/trainer-dashboard/members-list";
import { useProfiles } from "@/src/modules/profiles/useProfiles";
import ScheduleTodayList from "@/src/components/trainer-dashboard/schedule-today-list";
import TrialExpired from "@/src/components/layout/trial-expired";
import ExerciseDialog from "@/src/components/trainer-dashboard/exercises/exercise-dialog";

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
    const urlParams = new URLSearchParams(window.location.search);
    const subscribed = urlParams.get("subscribed");
    const plan = urlParams.get("plan");

    if (subscribed === "true") {
      setHasSubscription(true);
      setIsTrialActive(false);
      if (plan) {
        setActivePlan(plan);
      }
      // Clean URL
      window.history.replaceState({}, document.title, "/trainer-dashboard");
    }

    // Cargar programas asignados desde localStorage
    const loadAssignedPrograms = () => {
      const programs = JSON.parse(
        localStorage.getItem("assignedPrograms") || "[]"
      );
      setAssignedPrograms(programs);
    };

    loadAssignedPrograms();

    // Actualizar cada 5 segundos para mostrar nuevas asignaciones
    const interval = setInterval(loadAssignedPrograms, 5000);

    return () => clearInterval(interval);
  }, [isTrialActive, trialDaysLeft]);

  const handleLogout = async () => {
    await signOut();
  };

  const handleSubscribe = (plan: string) => {
    window.location.href = `/trainer-payment?plan=${plan}`;
  };

  const plans = {
    basic: {
      name: "Básico",
      price: 29,
      features: [
        "Hasta 5 clientes",
        "Rutinas básicas",
        "Seguimiento",
        "Email support",
      ],
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
  };

  // Si el período de prueba ha expirado y no tiene suscripción
  const trialExpired = trialDaysLeft <= 0 && !hasSubscription;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white">
                Panel de Entrenador 💪
              </h2>
              <p className="text-purple-200">
                {isTrialActive && trialDaysLeft > 0
                  ? `Disfruta tu prueba gratuita - ${trialDaysLeft} días restantes`
                  : "Gestiona a tus clientes y programas"}
              </p>
            </div>
            {hasSubscription ? (
              <Badge className="bg-green-600/20 text-green-200 border-green-400">
                Plan{" "}
                {activePlan
                  ? plans[activePlan as keyof typeof plans]?.name
                  : "Activo"}
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
                    <h3 className="text-yellow-400 font-semibold">
                      ¡Tu prueba gratuita termina pronto!
                    </h3>
                    <p className="text-yellow-200 text-sm">
                      Te quedan {trialDaysLeft} días. Elige un plan para
                      continuar sin interrupciones.
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
                        <DialogTitle className="text-white text-2xl">
                          No Pierdas el Acceso
                        </DialogTitle>
                        <DialogDescription className="text-purple-200">
                          Elige tu plan ahora y continúa entrenando sin
                          interrupciones
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid md:grid-cols-3 gap-6 mt-6">
                        {Object.entries(plans).map(([key, plan]) => (
                          <Card
                            key={key}
                            className={`bg-black/40 backdrop-blur-sm ${
                              key === "premium"
                                ? "border-purple-400 relative"
                                : "border-purple-800/30"
                            }`}
                          >
                            {key === "premium" && (
                              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600">
                                Más Popular
                              </Badge>
                            )}
                            <CardHeader className="text-center">
                              <CardTitle className="text-white text-2xl flex items-center justify-center">
                                {key === "elite" && (
                                  <Crown className="h-5 w-5 mr-2 text-yellow-400" />
                                )}
                                {plan.name}
                              </CardTitle>
                              <div className="text-4xl font-bold text-purple-400">
                                €{plan.price}
                              </div>
                              <CardDescription className="text-purple-200">
                                por mes
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              {plan.features.map((feature, index) => (
                                <div
                                  key={index}
                                  className="flex items-center space-x-2"
                                >
                                  <CheckCircle className="h-5 w-5 text-green-400" />
                                  <span className="text-purple-200">
                                    {feature}
                                  </span>
                                </div>
                              ))}
                              <Button
                                onClick={() => handleSubscribe(key)}
                                className={`w-full mt-6 ${
                                  key === "elite"
                                    ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                                    : "bg-purple-600 hover:bg-purple-700"
                                }`}
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

          {/* <DataCards /> */}
          <Tabs defaultValue="clients" className="space-y-6">
            <TabsList className="bg-purple-900/20">
              <TabsTrigger
                value="clients"
                className="data-[state=active]:bg-purple-600"
              >
                <Users className="h-4 w-4 mr-2" />
                Mis Clientes
              </TabsTrigger>
              <TabsTrigger
                value="exercises"
                className="data-[state=active]:bg-purple-600"
              >
                <Target className="h-4 w-4 mr-2" />
                Ejercicios
              </TabsTrigger>
              <TabsTrigger
                value="schedule"
                className="data-[state=active]:bg-purple-600"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Horarios
              </TabsTrigger>
            </TabsList>

            <TabsContent value="clients" className="space-y-6">
              <ClientsList />
            </TabsContent>

            <TabsContent value="exercises" className="space-y-6">
              <Card className="bg-black/40 border-purple-800/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2 justify-between">
                    Ejercicios Asignados Recientemente
                    <ExerciseDialog />
                  </CardTitle>
                  <CardDescription className="text-purple-200">
                    Revisa los programas que has asignado a tus clientes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ExercisesList />
                  {assignedPrograms.length === 0 ? (
                    <div className="text-center py-8">
                      <Target className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                      <h3 className="text-white font-medium mb-2">
                        No hay ejercicios asignados
                      </h3>
                      <p className="text-purple-300 text-sm mb-4">
                        Comienza asignando rutinas y dietas personalizadas a tus
                        clientes
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
                        <div
                          key={index}
                          className="p-4 bg-purple-900/20 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="text-white font-medium">
                                {program.clientName}
                              </h4>
                              <p className="text-sm text-purple-300">
                                Asignado el{" "}
                                {new Date(
                                  program.assignedDate
                                ).toLocaleDateString("es-ES")}
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
                                    {new Date(
                                      program.assignedDate
                                    ).toLocaleDateString("es-ES")}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-6 mt-6">
                                  {program.workouts.length > 0 && (
                                    <div>
                                      <h3 className="text-white font-semibold mb-3 flex items-center">
                                        <Target className="h-5 w-5 mr-2 text-green-400" />
                                        Rutina de Ejercicios (
                                        {program.workouts.length})
                                      </h3>
                                      <div className="space-y-2 max-h-60 overflow-y-auto">
                                        {program.workouts.map(
                                          (workout: string, idx: number) => (
                                            <div
                                              key={idx}
                                              className="text-sm text-green-300 flex items-start p-2 bg-green-900/20 rounded"
                                            >
                                              <span className="text-green-400 mr-2">
                                                •
                                              </span>
                                              <span className="flex-1">
                                                {workout}
                                              </span>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  {program.meals.length > 0 && (
                                    <div>
                                      <h3 className="text-white font-semibold mb-3 flex items-center">
                                        <Apple className="h-5 w-5 mr-2 text-orange-400" />
                                        Plan Nutricional ({program.meals.length}
                                        )
                                      </h3>
                                      <div className="space-y-2 max-h-60 overflow-y-auto">
                                        {program.meals.map(
                                          (meal: string, idx: number) => (
                                            <div
                                              key={idx}
                                              className="text-sm text-orange-300 flex items-start p-2 bg-orange-900/20 rounded"
                                            >
                                              <span className="text-orange-400 mr-2">
                                                •
                                              </span>
                                              <span className="flex-1">
                                                {meal}
                                              </span>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  {program.notes && (
                                    <div>
                                      <h3 className="text-white font-semibold mb-3">
                                        Notas Especiales
                                      </h3>
                                      <div className="p-3 bg-purple-900/20 rounded-lg">
                                        <p className="text-purple-200 text-sm">
                                          {program.notes}
                                        </p>
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
                              <span className="text-purple-200">
                                {program.workouts.length} ejercicios
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Apple className="h-4 w-4 text-orange-400" />
                              <span className="text-purple-200">
                                {program.meals.length} comidas
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-6">
              <ScheduleTodayList />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
