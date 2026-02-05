"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Separator } from "@/src/components/ui/separator"
import { Dumbbell, User, UserCheck } from "lucide-react"
import { signInWithGoogle } from "@/src/app/actions/auth"

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [userType, setUserType] = useState<"client" | "trainer">("client")
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const errorParam = searchParams.get("error")
    if (errorParam) {
      setError(errorParam)
    }
  }, [searchParams])

  const handleGoogleSignIn = async () => {
    try {
      setError(null)
      await signInWithGoogle()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión con Google")
    }
  }

  const handleLogin = () => {
    // Simular login y redirigir según el tipo de usuario
    if (userType === "client") {
      window.location.href = "/client-dashboard"
    } else {
      window.location.href = "/trainer-dashboard"
    }
  }

  return (
    <Card className="bg-black/40 border-purple-800/30 backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-white text-2xl">{isLogin ? "Iniciar Sesión" : "Crear Cuenta"}</CardTitle>
        <CardDescription className="text-purple-200">
          {isLogin ? "Accede a tu cuenta de Luxion" : "Únete a la comunidad Luxion"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-md text-red-200 text-sm">
            {error}
          </div>
        )}
        <Tabs value={isLogin ? "login" : "register"} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-purple-900/20">
            <TabsTrigger
              value="login"
              onClick={() => setIsLogin(true)}
              className="data-[state=active]:bg-purple-600"
            >
              Iniciar Sesión
            </TabsTrigger>
            <TabsTrigger
              value="register"
              onClick={() => setIsLogin(false)}
              className="data-[state=active]:bg-purple-600"
            >
              Registrarse
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4 mt-6">
            <Button
              onClick={handleGoogleSignIn}
              variant="outline"
              className="w-full bg-white hover:bg-gray-100 text-gray-900 border-gray-300"
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continuar con Google
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full border-purple-800/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black/40 px-2 text-purple-300">O continúa con</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="userType" className="text-purple-200">
                Tipo de Usuario
              </Label>
              <Select value={userType} onValueChange={(value: "client" | "trainer") => setUserType(value)}>
                <SelectTrigger className="bg-black/20 border-purple-800/50 text-white">
                  <SelectValue placeholder="Selecciona tu perfil" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-purple-800/50">
                  <SelectItem value="client" className="text-white">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Cliente</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="trainer" className="text-white">
                    <div className="flex items-center space-x-2">
                      <UserCheck className="h-4 w-4" />
                      <span>Entrenador</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-purple-200">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                className="bg-black/20 border-purple-800/50 text-white placeholder:text-purple-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-purple-200">
                Contraseña
              </Label>
              <Input id="password" type="password" className="bg-black/20 border-purple-800/50 text-white" />
            </div>
            <div className="flex items-center justify-between">
              <Link href="#" className="text-sm text-purple-400 hover:text-purple-300">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <Button onClick={handleLogin} className="w-full bg-purple-600 hover:bg-purple-700">
              Iniciar Sesión
            </Button>
          </TabsContent>

          <TabsContent value="register" className="space-y-4 mt-6">
            <Button
              onClick={handleGoogleSignIn}
              variant="outline"
              className="w-full bg-white hover:bg-gray-100 text-gray-900 border-gray-300"
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continuar con Google
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full border-purple-800/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black/40 px-2 text-purple-300">O regístrate con</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="userType" className="text-purple-200">
                Tipo de Usuario
              </Label>
              <Select value={userType} onValueChange={(value: "client" | "trainer") => setUserType(value)}>
                <SelectTrigger className="bg-black/20 border-purple-800/50 text-white">
                  <SelectValue placeholder="Selecciona tu perfil" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-purple-800/50">
                  <SelectItem value="client" className="text-white">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Cliente</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="trainer" className="text-white">
                    <div className="flex items-center space-x-2">
                      <UserCheck className="h-4 w-4" />
                      <span>Entrenador</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-purple-200">
                  Nombre
                </Label>
                <Input
                  id="firstName"
                  placeholder="Juan"
                  className="bg-black/20 border-purple-800/50 text-white placeholder:text-purple-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-purple-200">
                  Apellido
                </Label>
                <Input
                  id="lastName"
                  placeholder="Pérez"
                  className="bg-black/20 border-purple-800/50 text-white placeholder:text-purple-300"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-purple-200">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                className="bg-black/20 border-purple-800/50 text-white placeholder:text-purple-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-purple-200">
                Contraseña
              </Label>
              <Input id="password" type="password" className="bg-black/20 border-purple-800/50 text-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-purple-200">
                Confirmar Contraseña
              </Label>
              <Input id="confirmPassword" type="password" className="bg-black/20 border-purple-800/50 text-white" />
            </div>
            <Button onClick={handleLogin} className="w-full bg-purple-600 hover:bg-purple-700">
              Crear Cuenta
            </Button>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-purple-400 hover:text-purple-300">
            ← Volver al inicio
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-3 mb-8">
          <div className="bg-black p-3 rounded-lg">
            <Dumbbell className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Luxion</h1>
        </div>

        <Suspense fallback={
          <Card className="bg-black/40 border-purple-800/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="text-center text-purple-200">Cargando...</div>
            </CardContent>
          </Card>
        }>
          <AuthForm />
        </Suspense>
      </div>
    </div>
  )
}