import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function ScheduleTodayList() {
    return (
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
    )
}