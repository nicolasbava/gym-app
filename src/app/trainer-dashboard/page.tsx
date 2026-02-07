'use client';

import ExerciseDialog from '@/src/components/trainer-dashboard/exercises/exercise-dialog';
import ExercisesList from '@/src/components/trainer-dashboard/exercises/exercises-list';
import MembersDialog from '@/src/components/trainer-dashboard/members/members-dialog';
import MembersList from '@/src/components/trainer-dashboard/members/members-list';
import RoutinesDialog from '@/src/components/trainer-dashboard/routines/routines-dialog';
import RoutinesList from '@/src/components/trainer-dashboard/routines/routines-list';
import ScheduleTodayList from '@/src/components/trainer-dashboard/schedule-today-list';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { useApp } from '@/src/contexts/AppContext';
import { Calendar, Dumbbell, Target, Users } from 'lucide-react';

export default function TrainerDashboard() {
    // const [hasSubscription, setHasSubscription] = useState(false);
    // const [trialDaysLeft, setTrialDaysLeft] = useState(30); // Simular días de prueba restantes

    // const handleSubscribe = (plan: string) => {
    //   window.location.href = `/trainer-payment?plan=${plan}`;
    // };

    // const plans = {
    //   basic: {
    //     name: 'Básico',
    //     price: 29,
    //     features: ['Hasta 5 clientes', 'Rutinas básicas', 'Seguimiento', 'Email support'],
    //   },
    //   premium: {
    //     name: 'Premium',
    //     price: 59,
    //     features: ['Hasta 25 clientes', 'Rutinas personalizadas', 'Planes nutricionales', 'Chat con clientes', 'Análisis detallado'],
    //   },
    //   elite: {
    //     name: 'Elite',
    //     price: 99,
    //     features: ['Clientes ilimitados', 'Entrenador personal', 'Videollamadas 1:1', 'Ajustes semanales', 'Soporte 24/7'],
    //   },
    // };

    // // Si el período de prueba ha expirado y no tiene suscripción
    // const trialExpired = trialDaysLeft <= 0 && !hasSubscription;

    const { userProfile } = useApp();
    console.log('userProfile', userProfile);
    const defaultTab = 'clients';

    const tabsComponents = [
        {
            label: 'Mis Clientes',
            value: 'clients',
            icon: Users,
            component: <MembersList />,
        },
        {
            label: 'Rutinas',
            value: 'routines',
            icon: Dumbbell,
            component: <h1>Rutinas</h1>,
        },
        {
            label: 'Ejercicios',
            value: 'exercises',
            icon: Target,
            component: <ExercisesList />,
        },
        {
            label: 'Horarios',
            value: 'schedule',
            icon: Calendar,
            component: <ScheduleTodayList />,
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-16">
            <div className="container mx-auto px-4 py-8">
                <div className="space-y-8">
                    <Tabs defaultValue={defaultTab} className="space-y-6">
                        <TabsList className="bg-purple-900/20">
                            {tabsComponents.map((tab) => (
                                <TabsTrigger key={tab.value} value={tab.value} className="data-[state=active]:bg-purple-600 cursor-pointer">
                                    <tab.icon className="h-4 w-4 mr-2" />
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <TabsContent value="clients" className="space-y-6">
                            <Card className="bg-black/40 border-purple-800/30 backdrop-blur-sm">
                                <CardHeader>
                                    <div className="flex items-center gap-2 justify-between">
                                        <div>
                                            <CardTitle className="text-white">Clientes Activos</CardTitle>
                                            <CardDescription className="text-purple-200">Gestiona y supervisa el progreso de tus clientes</CardDescription>
                                        </div>
                                        <MembersDialog />
                                    </div>
                                    <CardContent className="space-y-4">
                                        <MembersList />
                                    </CardContent>
                                </CardHeader>
                            </Card>
                        </TabsContent>

                        <TabsContent value="routines" className="space-y-6">
                            <Card className="bg-black/40 border-purple-800/30 backdrop-blur-sm">
                                <CardHeader>
                                    <div className="flex items-center gap-2 justify-between">
                                        <div>
                                            <CardTitle className="text-white">Rutinas</CardTitle>
                                            <CardDescription className="text-purple-200">Gestiona y supervisa las rutinas de tus clientes</CardDescription>
                                        </div>
                                        {<RoutinesDialog />}
                                    </div>
                                    <CardContent className="space-y-4">{<RoutinesList />}</CardContent>
                                </CardHeader>
                            </Card>
                        </TabsContent>

                        <TabsContent value="exercises" className="space-y-6">
                            <Card className="bg-black/40 border-purple-800/30 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-2 justify-between">
                                        Ejercicios Asignados Recientemente
                                        <ExerciseDialog />
                                    </CardTitle>
                                    <CardDescription className="text-purple-200">Revisa los programas que has asignado a tus clientes</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <ExercisesList />
                                    {/* {assignedPrograms.length === 0 ? (
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
                  )} */}
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
