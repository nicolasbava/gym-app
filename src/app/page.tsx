'use client';
import { redirect } from 'next/navigation';
import { useApp } from '../contexts/AppContext';

export default function HomePage() {
    const { userProfile } = useApp();
    console.log('userProfile', userProfile);

    if (!userProfile) {
        redirect('/auth');
    }

    redirect('/dashboard');

    // return (
    // <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">

    //   <section className="py-20 px-4">
    //     <div className="container mx-auto text-center">
    //       <Badge className="mb-6 bg-purple-600/20 text-purple-200 border-purple-400">
    //         Plataforma Profesional de Fitness
    //       </Badge>
    //       <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
    //         Transforma tu
    //         <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"> Fitness</span>
    //       </h2>
    //       <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
    //         Conecta con entrenadores profesionales, obtén rutinas personalizadas y alcanza tus objetivos de fitness con
    //         Luxion.
    //       </p>
    //       <div className="flex justify-center">
    //         <Link href="/auth">
    //           <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-3">
    //             Comenzar Ahora
    //           </Button>
    //         </Link>
    //       </div>
    //     </div>
    //   </section>

    //   <section id="features" className="py-20 px-4">
    //     <div className="container mx-auto">
    //       <h3 className="text-4xl font-bold text-white text-center mb-12">Características Principales</h3>
    //       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
    //         <Card className="bg-black/40 border-purple-800/30 backdrop-blur-sm">
    //           <CardHeader>
    //             <Users className="h-12 w-12 text-purple-400 mb-4" />
    //             <CardTitle className="text-white">Doble Perfil</CardTitle>
    //             <CardDescription className="text-purple-200">
    //               Perfiles especializados para clientes y entrenadores profesionales
    //             </CardDescription>
    //           </CardHeader>
    //         </Card>
    //         <Card className="bg-black/40 border-purple-800/30 backdrop-blur-sm">
    //           <CardHeader>
    //             <Calendar className="h-12 w-12 text-purple-400 mb-4" />
    //             <CardTitle className="text-white">Rutinas Personalizadas</CardTitle>
    //             <CardDescription className="text-purple-200">
    //               Rutinas y dietas adaptadas a tus objetivos específicos
    //             </CardDescription>
    //           </CardHeader>
    //         </Card>
    //         <Card className="bg-black/40 border-purple-800/30 backdrop-blur-sm">
    //           <CardHeader>
    //             <Shield className="h-12 w-12 text-purple-400 mb-4" />
    //             <CardTitle className="text-white">Pagos Seguros</CardTitle>
    //             <CardDescription className="text-purple-200">
    //               Sistema de pagos 100% seguro con encriptación avanzada
    //             </CardDescription>
    //           </CardHeader>
    //         </Card>
    //       </div>
    //     </div>
    //   </section>

    //   <section id="pricing" className="py-20 px-4">
    //     <div className="container mx-auto">
    //       <h3 className="text-4xl font-bold text-white text-center mb-12">Planes de Suscripción</h3>
    //       <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
    //         <Card className="bg-black/40 border-purple-800/30 backdrop-blur-sm">
    //           <CardHeader className="text-center">
    //             <CardTitle className="text-white text-2xl">Básico</CardTitle>
    //             <div className="text-4xl font-bold text-purple-400">€29</div>
    //             <CardDescription className="text-purple-200">por mes</CardDescription>
    //           </CardHeader>
    //           <CardContent className="space-y-4">
    //             <div className="flex items-center space-x-2">
    //               <CheckCircle className="h-5 w-5 text-green-400" />
    //               <span className="text-purple-200">Rutinas básicas</span>
    //             </div>
    //             <div className="flex items-center space-x-2">
    //               <CheckCircle className="h-5 w-5 text-green-400" />
    //               <span className="text-purple-200">Seguimiento de progreso</span>
    //             </div>
    //             <div className="flex items-center space-x-2">
    //               <CheckCircle className="h-5 w-5 text-green-400" />
    //               <span className="text-purple-200">Soporte por email</span>
    //             </div>
    //             <Button className="w-full bg-purple-600 hover:bg-purple-700 mt-6">Elegir Plan</Button>
    //           </CardContent>
    //         </Card>

    //         <Card className="bg-black/40 border-purple-400 backdrop-blur-sm relative">
    //           <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600">Más Popular</Badge>
    //           <CardHeader className="text-center">
    //             <CardTitle className="text-white text-2xl">Premium</CardTitle>
    //             <div className="text-4xl font-bold text-purple-400">€59</div>
    //             <CardDescription className="text-purple-200">por mes</CardDescription>
    //           </CardHeader>
    //           <CardContent className="space-y-4">
    //             <div className="flex items-center space-x-2">
    //               <CheckCircle className="h-5 w-5 text-green-400" />
    //               <span className="text-purple-200">Rutinas personalizadas</span>
    //             </div>
    //             <div className="flex items-center space-x-2">
    //               <CheckCircle className="h-5 w-5 text-green-400" />
    //               <span className="text-purple-200">Planes nutricionales</span>
    //             </div>
    //             <div className="flex items-center space-x-2">
    //               <CheckCircle className="h-5 w-5 text-green-400" />
    //               <span className="text-purple-200">Chat con entrenador</span>
    //             </div>
    //             <div className="flex items-center space-x-2">
    //               <CheckCircle className="h-5 w-5 text-green-400" />
    //               <span className="text-purple-200">Análisis detallado</span>
    //             </div>
    //             <Button className="w-full bg-purple-600 hover:bg-purple-700 mt-6">Elegir Plan</Button>
    //           </CardContent>
    //         </Card>

    //         <Card className="bg-black/40 border-purple-800/30 backdrop-blur-sm">
    //           <CardHeader className="text-center">
    //             <CardTitle className="text-white text-2xl">Elite</CardTitle>
    //             <div className="text-4xl font-bold text-purple-400">€99</div>
    //             <CardDescription className="text-purple-200">por mes</CardDescription>
    //           </CardHeader>
    //           <CardContent className="space-y-4">
    //             <div className="flex items-center space-x-2">
    //               <CheckCircle className="h-5 w-5 text-green-400" />
    //               <span className="text-purple-200">Entrenador personal</span>
    //             </div>
    //             <div className="flex items-center space-x-2">
    //               <CheckCircle className="h-5 w-5 text-green-400" />
    //               <span className="text-purple-200">Videollamadas 1:1</span>
    //             </div>
    //             <div className="flex items-center space-x-2">
    //               <CheckCircle className="h-5 w-5 text-green-400" />
    //               <span className="text-purple-200">Ajustes semanales</span>
    //             </div>
    //             <div className="flex items-center space-x-2">
    //               <CheckCircle className="h-5 w-5 text-green-400" />
    //               <span className="text-purple-200">Soporte 24/7</span>
    //             </div>
    //             <Button className="w-full bg-purple-600 hover:bg-purple-700 mt-6">Elegir Plan</Button>
    //           </CardContent>
    //         </Card>
    //       </div>
    //     </div>
    //   </section>

    //   <footer className="border-t border-purple-800/20 bg-black/20 backdrop-blur-sm py-12">
    //     <div className="container mx-auto px-4 text-center">
    //       <div className="flex items-center justify-center space-x-3 mb-6">
    //         <div className="bg-black p-2 rounded-lg">
    //           <Dumbbell className="h-6 w-6 text-white" />
    //         </div>
    //         <h1 className="text-xl font-bold text-white">Luxion</h1>
    //       </div>
    //       <p className="text-purple-200 mb-4">Transformando vidas a través del fitness profesional</p>
    //       <div className="flex justify-center space-x-6 text-sm text-purple-300">
    //         <Link href="#" className="hover:text-white">
    //           Términos
    //         </Link>
    //         <Link href="#" className="hover:text-white">
    //           Privacidad
    //         </Link>
    //         <Link href="#" className="hover:text-white">
    //           Contacto
    //         </Link>
    //       </div>
    //     </div>
    //   </footer>
    // </div>
    // )
}
