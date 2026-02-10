'use client';

import { signInWithGoogle } from '@/src/app/actions/auth';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { Separator } from '@/src/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { Dumbbell, User, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [userType, setUserType] = useState<'client' | 'trainer'>('client');
    const [error, setError] = useState<string | null>(null);
    const searchParams = useSearchParams();

    useEffect(() => {
        const errorParam = searchParams.get('error');
        if (errorParam) {
            setError(errorParam);
        }
    }, [searchParams]);

    const handleGoogleSignIn = async () => {
        try {
            setError(null);
            await signInWithGoogle();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al iniciar sesión con Google');
        }
    };

    const handleLogin = () => {
        // Simular login y redirigir según el tipo de usuario
        if (userType === 'client') {
            window.location.href = '/client-dashboard';
        } else {
            window.location.href = '/trainer-dashboard';
        }
    };

    const inputClassName = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white';

    return (
        <Card className="bg-white border border-gray-200 shadow-sm">
            
            <CardHeader className="text-center pb-2">
                <CardTitle className="text-gray-900 text-2xl font-semibold">{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</CardTitle>
                <CardDescription className="text-gray-600 text-sm">
                    {isLogin ? 'Accede a tu cuenta de Luxion' : 'Únete a la comunidad Luxion'}
                </CardDescription>
            </CardHeader>

            <CardContent className="pt-4">
                {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
                <Tabs value={isLogin ? 'login' : 'register'} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
                        <TabsTrigger
                            value="login"
                            onClick={() => setIsLogin(true)}
                            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 rounded-md text-gray-600"
                        >
                            Iniciar Sesión
                        </TabsTrigger>
                        <TabsTrigger
                            value="register"
                            onClick={() => setIsLogin(false)}
                            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 rounded-md text-gray-600"
                        >
                            Registrarse
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="login" className="space-y-4 mt-6">
                        <Button
                            onClick={handleGoogleSignIn}
                            variant="outline"
                            className="w-full bg-white hover:bg-gray-50 text-gray-900 border-gray-300 cursor-pointer"
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
                                <Separator className="w-full border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-gray-500">O continúa con</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="userType" className="text-sm font-medium text-gray-700">
                                Tipo de Usuario
                            </Label>
                            <Select value={userType} onValueChange={(value: 'client' | 'trainer') => setUserType(value)}>
                                <SelectTrigger className={inputClassName}>
                                    <SelectValue placeholder="Selecciona tu perfil" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="client">
                                        <div className="flex items-center space-x-2">
                                            <User className="h-4 w-4" />
                                            <span>Cliente</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="trainer">
                                        <div className="flex items-center space-x-2">
                                            <UserCheck className="h-4 w-4" />
                                            <span>Entrenador</span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                Email
                            </Label>
                            <Input id="email" type="email" placeholder="tu@email.com" className={inputClassName} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                Contraseña
                            </Label>
                            <Input id="password" type="password" className={inputClassName} />
                        </div>
                        <div className="flex items-center justify-between">
                            <Link href="#" className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>
                        <Button onClick={handleLogin} className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                            Iniciar Sesión
                        </Button>
                    </TabsContent>

                    <TabsContent value="register" className="space-y-4 mt-6">
                        <Button
                            onClick={handleGoogleSignIn}
                            variant="outline"
                            className="w-full bg-white hover:bg-gray-50 text-gray-900 border-gray-300 cursor-pointer"
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
                                <Separator className="w-full border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-gray-500">O regístrate con</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="userType-reg" className="text-sm font-medium text-gray-700">
                                Tipo de Usuario
                            </Label>
                            <Select value={userType} onValueChange={(value: 'client' | 'trainer') => setUserType(value)}>
                                <SelectTrigger className={inputClassName}>
                                    <SelectValue placeholder="Selecciona tu perfil" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="client">
                                        <div className="flex items-center space-x-2">
                                            <User className="h-4 w-4" />
                                            <span>Cliente</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="trainer">
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
                                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                                    Nombre
                                </Label>
                                <Input id="firstName" placeholder="Juan" className={inputClassName} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                                    Apellido
                                </Label>
                                <Input id="lastName" placeholder="Pérez" className={inputClassName} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email-reg" className="text-sm font-medium text-gray-700">
                                Email
                            </Label>
                            <Input id="email-reg" type="email" placeholder="tu@email.com" className={inputClassName} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password-reg" className="text-sm font-medium text-gray-700">
                                Contraseña
                            </Label>
                            <Input id="password-reg" type="password" className={inputClassName} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                                Confirmar Contraseña
                            </Label>
                            <Input id="confirmPassword" type="password" className={inputClassName} />
                        </div>
                        <Button onClick={handleLogin} className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                            Crear Cuenta
                        </Button>
                    </TabsContent>
                </Tabs>

                <div className="mt-6 text-center">
                    <Link href="/" className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                        ← Volver al inicio
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}

export default function AuthPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="bg-blue-600 p-3 rounded-lg">
                        <Dumbbell className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Luxion</h1>
                </div>

                <Suspense
                    fallback={
                        <Card className="bg-white border border-gray-200 shadow-sm">
                            <CardContent className="p-6">
                                <div className="text-center text-gray-600">Cargando...</div>
                            </CardContent>
                        </Card>
                    }
                >
                    <AuthForm />
                </Suspense>
            </div>
        </div>
    );
}
