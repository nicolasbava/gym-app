"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Separator } from "@/src/components/ui/separator"
import { Dumbbell, CreditCard, Shield, Lock, CheckCircle, ArrowLeft } from "lucide-react"

export default function PaymentPage() {
  const [selectedPlan, setSelectedPlan] = useState("premium")

  const plans = {
    basic: { name: "Básico", price: 29, features: ["Rutinas básicas", "Seguimiento", "Email support"] },
    premium: {
      name: "Premium",
      price: 59,
      features: ["Rutinas personalizadas", "Planes nutricionales", "Chat con entrenador", "Análisis detallado"],
    },
    elite: {
      name: "Elite",
      price: 99,
      features: ["Entrenador personal", "Videollamadas 1:1", "Ajustes semanales", "Soporte 24/7"],
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      {/* <header className="border-b border-purple-800/20 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-black p-2 rounded-lg">
              <Dumbbell className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">Luxion</h1>
          </div>
          <Link href="/dashboard">
            <Button variant="ghost" className="text-purple-200 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
        </div>
      </header> */}

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Pago Seguro</h2>
          <p className="text-purple-200">Completa tu suscripción con total seguridad</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Plan Selection */}
          <Card className="bg-black/40 border-purple-800/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Selecciona tu Plan</CardTitle>
              <CardDescription className="text-purple-200">
                Elige el plan que mejor se adapte a tus necesidades
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(plans).map(([key, plan]) => (
                <div
                  key={key}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedPlan === key
                      ? "border-purple-400 bg-purple-900/20"
                      : "border-purple-800/30 bg-purple-900/10 hover:border-purple-600"
                  }`}
                  onClick={() => setSelectedPlan(key)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-white font-semibold text-lg">{plan.name}</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-purple-400">€{plan.price}</span>
                        <span className="text-purple-300">/mes</span>
                      </div>
                    </div>
                    {selectedPlan === key && <CheckCircle className="h-6 w-6 text-green-400" />}
                  </div>
                  <ul className="space-y-1">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="text-sm text-purple-200 flex items-center">
                        <CheckCircle className="h-3 w-3 text-green-400 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card className="bg-black/40 border-purple-800/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="h-5 w-5 mr-2 text-green-400" />
                Información de Pago
              </CardTitle>
              <CardDescription className="text-purple-200">
                Tus datos están protegidos con encriptación SSL
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Payment Method */}
              <div className="space-y-3">
                <Label className="text-purple-200">Método de Pago</Label>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    className="border-purple-400 text-purple-200 hover:bg-purple-800 p-4 h-auto bg-transparent"
                  >
                    <CreditCard className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="outline"
                    className="border-purple-800/50 text-purple-300 p-4 h-auto opacity-50 bg-transparent"
                  >
                    PayPal
                  </Button>
                  <Button
                    variant="outline"
                    className="border-purple-800/50 text-purple-300 p-4 h-auto opacity-50 bg-transparent"
                  >
                    Apple Pay
                  </Button>
                </div>
              </div>

              {/* Card Details */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber" className="text-purple-200">
                    Número de Tarjeta
                  </Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    className="bg-black/20 border-purple-800/50 text-white placeholder:text-purple-300"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry" className="text-purple-200">
                      Vencimiento
                    </Label>
                    <Input
                      id="expiry"
                      placeholder="MM/AA"
                      className="bg-black/20 border-purple-800/50 text-white placeholder:text-purple-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv" className="text-purple-200">
                      CVV
                    </Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      className="bg-black/20 border-purple-800/50 text-white placeholder:text-purple-300"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardName" className="text-purple-200">
                    Nombre en la Tarjeta
                  </Label>
                  <Input
                    id="cardName"
                    placeholder="Juan Pérez"
                    className="bg-black/20 border-purple-800/50 text-white placeholder:text-purple-300"
                  />
                </div>
              </div>

              <Separator className="bg-purple-800/30" />

              {/* Order Summary */}
              <div className="space-y-3">
                <h3 className="text-white font-semibold">Resumen del Pedido</h3>
                <div className="flex justify-between text-purple-200">
                  <span>Plan {plans[selectedPlan as keyof typeof plans].name}</span>
                  <span>€{plans[selectedPlan as keyof typeof plans].price}</span>
                </div>
                <div className="flex justify-between text-purple-200">
                  <span>IVA (21%)</span>
                  <span>€{Math.round(plans[selectedPlan as keyof typeof plans].price * 0.21)}</span>
                </div>
                <Separator className="bg-purple-800/30" />
                <div className="flex justify-between text-white font-semibold text-lg">
                  <span>Total</span>
                  <span>€{Math.round(plans[selectedPlan as keyof typeof plans].price * 1.21)}</span>
                </div>
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center space-x-2 p-3 bg-green-900/20 rounded-lg border border-green-800/30">
                <Lock className="h-4 w-4 text-green-400" />
                <span className="text-sm text-green-400">Pago 100% Seguro - SSL Encriptado</span>
              </div>

              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-lg py-3">
                Confirmar Pago - €{Math.round(plans[selectedPlan as keyof typeof plans].price * 1.21)}
              </Button>

              <p className="text-xs text-purple-300 text-center">
                Al confirmar el pago, aceptas nuestros términos y condiciones. Puedes cancelar tu suscripción en
                cualquier momento.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
