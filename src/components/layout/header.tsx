"use client";
import {
  Dumbbell,
  Badge,
  Gift,
  Users,
  Plus,
  LogOut,
  CreditCard,
  CheckCircle,
  Crown,
} from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { Badge as BadgeUI } from "../ui/badge";
import { Dialog, DialogTrigger, Dialog as DialogUI } from "../ui/dialog";
import { Button as ButtonUI } from "../ui/button";
import { Avatar as AvatarUI } from "../ui/avatar";
import { Card as CardUI } from "../ui/card";
import { signOut } from "@/src/app/actions/auth";
import { useEffect, useState } from "react";
import CreateRoutineDialog from "../trainer-dashboard/forms/create-routine";
import CreateUserDialog from "../trainer-dashboard/forms/create-user";
import CreateExerciseDialog from "../trainer-dashboard/exercises/exercise-form";
import { useApp } from "@/src/contexts/AppContext";

export default function Header() {
  // const { gymId } = useApp();
  const [hasSubscription, setHasSubscription] = useState(false);
  const [isTrialActive, setIsTrialActive] = useState(true);
  const [activePlan, setActivePlan] = useState("");
  const [assignedPrograms, setAssignedPrograms] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [openExerciseForm, setOpenExerciseForm] = useState(false);
  const [openCreateUser, setOpenCreateUser] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState(30); // Simular días de prueba restantes

  const trialExpired = trialDaysLeft <= 0 && !hasSubscription;

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

  return (
    <header className="border-b border-purple-800/20 bg-black/20 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-black p-2 rounded-lg">
            <Dumbbell className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">Luxion</h1>
          <Badge className="bg-orange-600/20 text-orange-200 border-orange-400">
            Entrenador
          </Badge>
        </div>
        <div className="flex items-center space-x-4">
          {/* Trial Status */}
          {isTrialActive && trialDaysLeft > 0 && (
            <Badge className="bg-green-600/20 text-green-200 border-green-400">
              <Gift className="h-3 w-3 mr-1" />
              Prueba: {trialDaysLeft} días restantes
            </Badge>
          )}

          
          {/* {!hasSubscription && (
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
            )} */}

          <Avatar>
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback className="bg-purple-600">CM</AvatarFallback>
          </Avatar>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="text-purple-200 hover:text-white"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </header>
  );
}
