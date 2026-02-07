import { CheckCircle, Clock, Crown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";


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

export default function TrialExpired() {
    const handleSubscribe = (plan: string) => {
        console.log(`Subiendo plan: ${plan}`);
    }
    return (
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
    )
}