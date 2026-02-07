import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function DataCards() {

    return (
        <div>
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
                  <div className="text-2xl font-bold text-white">214</div>
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
        </div>
    )
}