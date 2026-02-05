"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Checkbox } from "@/src/components/ui/checkbox"
import { Textarea } from "@/src/components/ui/textarea"
import { Label } from "@/src/components/ui/label"
import { Dumbbell, ArrowLeft, Target, Apple, Save, CheckCircle } from "lucide-react"

export default function AssignProgramPage() {
  const [selectedClient, setSelectedClient] = useState("")
  const [selectedWorkouts, setSelectedWorkouts] = useState<string[]>([])
  const [selectedMeals, setSelectedMeals] = useState<string[]>([])
  const [programNotes, setProgramNotes] = useState("")
  const [isAssigning, setIsAssigning] = useState(false)
  const [programAssigned, setProgramAssigned] = useState(false)

  const clients = [
    { id: "1", name: "Ana García", plan: "Premium", goal: "Pérdida de peso" },
    { id: "2", name: "Carlos López", plan: "Básico", goal: "Ganancia muscular" },
    { id: "3", name: "María Rodríguez", plan: "Elite", goal: "Tonificación" },
    { id: "4", name: "Luis Martín", plan: "Premium", goal: "Fuerza" },
    { id: "5", name: "Sofia Herrera", plan: "Básico", goal: "Resistencia" },
    { id: "6", name: "Diego Fernández", plan: "Elite", goal: "Rehabilitación" },
    { id: "7", name: "Carmen Ruiz", plan: "Premium", goal: "Flexibilidad" },
    { id: "8", name: "Javier Moreno", plan: "Básico", goal: "Resistencia cardiovascular" },
  ]

  const workoutLibrary = [
    {
      category: "💪 FUERZA - PECHO",
      color: "bg-red-900/20 border-red-600/30",
      exercises: [
        "Press de banca plano con barra - 4x8-10 reps | 90s descanso",
        "Press de banca inclinado con barra - 4x8-10 reps | 90s descanso",
        "Press de banca declinado con barra - 3x8-10 reps | 75s descanso",
        "Press de banca con mancuernas plano - 4x8-12 reps | 90s descanso",
        "Press de banca inclinado con mancuernas - 4x8-12 reps | 90s descanso",
        "Press de banca declinado con mancuernas - 3x8-12 reps | 75s descanso",
        "Aperturas con mancuernas plano - 3x10-12 reps | 60s descanso",
        "Aperturas inclinadas con mancuernas - 3x10-12 reps | 60s descanso",
        "Aperturas declinadas con mancuernas - 3x10-12 reps | 60s descanso",
        "Fondos en paralelas - 3x8-12 reps | 90s descanso",
        "Fondos en banco - 3x10-15 reps | 60s descanso",
        "Flexiones diamante - 3x12-15 reps | 60s descanso",
        "Flexiones normales - 3x15-20 reps | 60s descanso",
        "Flexiones inclinadas - 3x10-15 reps | 60s descanso",
        "Flexiones declinadas - 3x8-12 reps | 75s descanso",
        "Pullover con mancuerna - 3x10-12 reps | 75s descanso",
        "Pullover con barra - 3x10-12 reps | 75s descanso",
        "Press con mancuernas agarre neutro - 4x8-10 reps | 90s descanso",
        "Cruces en polea alta - 3x12-15 reps | 60s descanso",
        "Cruces en polea baja - 3x12-15 reps | 60s descanso",
        "Press en máquina - 3x10-12 reps | 75s descanso",
        "Pec deck - 3x12-15 reps | 60s descanso",
        "Flexiones con palmada - 3x6-8 reps | 90s descanso",
        "Flexiones archer - 3x5-8 cada lado | 90s descanso",
        "Press landmine - 3x8-10 reps | 75s descanso",
      ],
    },
    {
      category: "🏋️ FUERZA - ESPALDA",
      color: "bg-blue-900/20 border-blue-600/30",
      exercises: [
        "Dominadas pronadas - 3x6-10 reps | 2min descanso",
        "Dominadas supinas - 3x6-10 reps | 2min descanso",
        "Dominadas neutras - 3x6-10 reps | 2min descanso",
        "Dominadas asistidas - 3x8-12 reps | 90s descanso",
        "Dominadas con peso - 3x4-6 reps | 2min descanso",
        "Remo con barra pronado - 4x8-10 reps | 90s descanso",
        "Remo con barra supino - 4x8-10 reps | 90s descanso",
        "Remo con mancuernas a una mano - 4x10-12 reps | 75s descanso",
        "Remo con mancuernas a dos manos - 4x8-10 reps | 90s descanso",
        "Remo en T - 3x8-10 reps | 90s descanso",
        "Jalones al pecho - 3x10-12 reps | 75s descanso",
        "Jalones tras nuca - 3x10-12 reps | 75s descanso",
        "Jalones con agarre cerrado - 3x10-12 reps | 75s descanso",
        "Remo en polea baja - 3x10-12 reps | 75s descanso",
        "Remo en polea alta - 3x10-12 reps | 75s descanso",
        "Peso muerto convencional - 4x6-8 reps | 2min descanso",
        "Peso muerto rumano - 4x8-10 reps | 90s descanso",
        "Peso muerto sumo - 4x6-8 reps | 2min descanso",
        "Hiperextensiones - 3x12-15 reps | 60s descanso",
        "Buenos días - 3x10-12 reps | 75s descanso",
        "Face pulls - 3x15-20 reps | 45s descanso",
        "Encogimientos de hombros con barra - 3x12-15 reps | 60s descanso",
        "Encogimientos de hombros con mancuernas - 3x12-15 reps | 60s descanso",
        "Remo invertido - 3x8-12 reps | 75s descanso",
        "Muscle ups - 3x3-5 reps | 2min descanso",
        "Remo con cable unilateral - 3x10-12 cada lado | 60s descanso",
        "Pulldowns con cuerda - 3x12-15 reps | 60s descanso",
        "Remo en máquina - 3x10-12 reps | 75s descanso",
      ],
    },
    {
      category: "💪 FUERZA - HOMBROS",
      color: "bg-yellow-900/20 border-yellow-600/30",
      exercises: [
        "Press militar con barra - 3x8-10 reps | 90s descanso",
        "Press militar con mancuernas - 3x8-10 reps | 90s descanso",
        "Press Arnold - 3x10-12 reps | 75s descanso",
        "Press tras nuca - 3x8-10 reps | 90s descanso",
        "Press con mancuernas sentado - 3x8-10 reps | 90s descanso",
        "Press en máquina - 3x10-12 reps | 75s descanso",
        "Elevaciones laterales con mancuernas - 3x12-15 reps | 60s descanso",
        "Elevaciones laterales con cable - 3x12-15 reps | 60s descanso",
        "Elevaciones laterales en máquina - 3x12-15 reps | 60s descanso",
        "Elevaciones frontales con mancuernas - 3x10-12 reps | 60s descanso",
        "Elevaciones frontales con barra - 3x10-12 reps | 60s descanso",
        "Elevaciones frontales con cable - 3x10-12 reps | 60s descanso",
        "Elevaciones posteriores con mancuernas - 3x12-15 reps | 60s descanso",
        "Elevaciones posteriores en máquina - 3x12-15 reps | 60s descanso",
        "Elevaciones posteriores con cable - 3x12-15 reps | 60s descanso",
        "Remo al mentón con barra - 3x10-12 reps | 75s descanso",
        "Remo al mentón con mancuernas - 3x10-12 reps | 75s descanso",
        "Pájaros con mancuernas - 3x12-15 reps | 60s descanso",
        "Pájaros en máquina - 3x12-15 reps | 60s descanso",
        "Elevaciones en cruz - 3x10-12 reps | 60s descanso",
        "Press Pike - 3x8-10 reps | 90s descanso",
        "Handstand push-ups - 3x5-8 reps | 2min descanso",
        "Elevaciones laterales 21s - 3 series | 90s descanso",
        "Press landmine unilateral - 3x8-10 cada lado | 75s descanso",
        "Elevaciones Y-T-W - 3x8 cada posición | 60s descanso",
      ],
    },
    {
      category: "💪 FUERZA - BRAZOS",
      color: "bg-green-900/20 border-green-600/30",
      exercises: [
        "Curl de bíceps con barra - 3x10-12 reps | 60s descanso",
        "Curl de bíceps con mancuernas - 3x10-12 reps | 60s descanso",
        "Curl martillo - 3x10-12 reps | 60s descanso",
        "Curl concentrado - 3x8-10 reps | 60s descanso",
        "Curl en predicador con barra - 3x8-10 reps | 75s descanso",
        "Curl en predicador con mancuernas - 3x8-10 reps | 75s descanso",
        "Curl en cable - 3x10-12 reps | 60s descanso",
        "Curl 21s - 3 series | 90s descanso",
        "Curl inclinado - 3x8-10 reps | 75s descanso",
        "Curl spider - 3x10-12 reps | 60s descanso",
        "Extensiones de tríceps con barra - 3x10-12 reps | 60s descanso",
        "Extensiones de tríceps con mancuernas - 3x10-12 reps | 60s descanso",
        "Press francés - 3x8-10 reps | 75s descanso",
        "Patadas de tríceps - 3x10-12 reps | 60s descanso",
        "Dips en banco - 3x10-15 reps | 60s descanso",
        "Dips en paralelas - 3x8-12 reps | 90s descanso",
        "Extensiones en polea alta - 3x12-15 reps | 60s descanso",
        "Extensiones en polea con cuerda - 3x12-15 reps | 60s descanso",
        "Press cerrado - 3x8-10 reps | 90s descanso",
        "Extensiones overhead - 3x10-12 reps | 75s descanso",
        "Curl en polea baja - 3x10-12 reps | 60s descanso",
        "Curl cruzado - 3x10-12 reps | 60s descanso",
        "Extensiones diamante - 3x8-10 reps | 75s descanso",
        "Curl isométrico - 3x30s | 60s descanso",
        "Tríceps en banco - 3x12-15 reps | 60s descanso",
      ],
    },
    {
      category: "🦵 FUERZA - PIERNAS",
      color: "bg-purple-900/20 border-purple-600/30",
      exercises: [
        "Sentadilla trasera con barra - 4x8-10 reps | 2min descanso",
        "Sentadilla frontal con barra - 3x8-10 reps | 90s descanso",
        "Sentadilla búlgara - 3x10-12 cada pierna | 75s descanso",
        "Sentadilla sumo - 3x10-12 reps | 90s descanso",
        "Sentadilla overhead - 3x8-10 reps | 90s descanso",
        "Sentadilla con salto - 3x8-10 reps | 90s descanso",
        "Sentadilla pistol - 3x5-8 cada pierna | 90s descanso",
        "Sentadilla goblet - 3x12-15 reps | 75s descanso",
        "Sentadilla hack - 3x10-12 reps | 90s descanso",
        "Peso muerto rumano - 3x8-10 reps | 90s descanso",
        "Peso muerto sumo - 3x8-10 reps | 90s descanso",
        "Peso muerto a una pierna - 3x8-10 cada pierna | 75s descanso",
        "Peso muerto con mancuernas - 3x10-12 reps | 75s descanso",
        "Prensa de piernas - 4x12-15 reps | 75s descanso",
        "Prensa inclinada - 3x12-15 reps | 75s descanso",
        "Zancadas frontales - 3x10-12 cada pierna | 60s descanso",
        "Zancadas laterales - 3x8-10 cada pierna | 60s descanso",
        "Zancadas hacia atrás - 3x10-12 cada pierna | 60s descanso",
        "Zancadas caminando - 3x20 pasos | 90s descanso",
        "Extensiones de cuádriceps - 3x12-15 reps | 60s descanso",
        "Curl femoral acostado - 3x12-15 reps | 60s descanso",
        "Curl femoral sentado - 3x12-15 reps | 60s descanso",
        "Curl femoral de pie - 3x10-12 cada pierna | 60s descanso",
        "Elevaciones de gemelos de pie - 4x15-20 reps | 45s descanso",
        "Elevaciones de gemelos sentado - 4x15-20 reps | 45s descanso",
        "Hip thrust con barra - 3x12-15 reps | 75s descanso",
        "Hip thrust con mancuernas - 3x12-15 reps | 75s descanso",
        "Puente de glúteo - 3x15-20 reps | 60s descanso",
        "Patadas de glúteo - 3x12-15 cada pierna | 60s descanso",
        "Abductores en máquina - 3x15-20 reps | 45s descanso",
        "Aductores en máquina - 3x15-20 reps | 45s descanso",
        "Step ups - 3x10-12 cada pierna | 60s descanso",
        "Wall sit - 3x30-60s | 60s descanso",
        "Caminata de pato - 3x20 pasos | 60s descanso",
      ],
    },
    {
      category: "🔥 CARDIO HIIT",
      color: "bg-orange-900/20 border-orange-600/30",
      exercises: [
        "Burpees - 30s trabajo, 15s descanso x8 rondas",
        "Burpees con salto - 30s trabajo, 15s descanso x6 rondas",
        "Burpees laterales - 30s trabajo, 15s descanso x6 rondas",
        "Mountain climbers - 30s trabajo, 15s descanso x8 rondas",
        "Mountain climbers cruzados - 30s trabajo, 15s descanso x6 rondas",
        "Jumping jacks - 30s trabajo, 15s descanso x8 rondas",
        "Jumping jacks cruzados - 30s trabajo, 15s descanso x6 rondas",
        "High knees - 30s trabajo, 15s descanso x8 rondas",
        "Butt kickers - 30s trabajo, 15s descanso x6 rondas",
        "Sprints en cinta - 30s trabajo, 30s descanso x10 rondas",
        "Sprints en bicicleta - 30s trabajo, 30s descanso x8 rondas",
        "Box jumps - 20 reps, 1min descanso x5 series",
        "Box step ups - 30s trabajo, 15s descanso x6 rondas",
        "Battle ropes - 30s trabajo, 15s descanso x8 rondas",
        "Battle ropes alternadas - 30s trabajo, 15s descanso x6 rondas",
        "Kettlebell swings - 30s trabajo, 15s descanso x8 rondas",
        "Kettlebell snatches - 30s trabajo, 15s descanso x6 rondas",
        "Thrusters - 45s trabajo, 15s descanso x6 rondas",
        "Thrusters con salto - 30s trabajo, 15s descanso x6 rondas",
        "Squat jumps - 30s trabajo, 15s descanso x8 rondas",
        "Tuck jumps - 30s trabajo, 15s descanso x6 rondas",
        "Push-up burpees - 20 reps, 1min descanso x4 series",
        "Plank jacks - 30s trabajo, 15s descanso x6 rondas",
        "Plank up-downs - 30s trabajo, 15s descanso x6 rondas",
        "Russian twists - 45s trabajo, 15s descanso x6 rondas",
        "V-ups - 30s trabajo, 15s descanso x6 rondas",
        "Bear crawl - 30s trabajo, 30s descanso x5 rondas",
        "Crab walk - 30s trabajo, 30s descanso x5 rondas",
        "Bicycle crunches - 45s trabajo, 15s descanso x6 rondas",
        "Dead bugs - 30s trabajo, 15s descanso x6 rondas",
        "Tabata squats - 20s trabajo, 10s descanso x8 rondas",
        "Tabata push-ups - 20s trabajo, 10s descanso x8 rondas",
        "Remo en máquina - 250m sprints, 1min descanso x6 series",
        "Assault bike - 30s trabajo, 30s descanso x8 rondas",
      ],
    },
    {
      category: "⚡ FUNCIONAL",
      color: "bg-teal-900/20 border-teal-600/30",
      exercises: [
        "Thrusters con barra - 3x12 reps | 90s descanso",
        "Thrusters con mancuernas - 3x12 reps | 90s descanso",
        "Clean and press - 3x8 reps | 2min descanso",
        "Clean and jerk - 3x6 reps | 2min descanso",
        "Snatch - 3x5 reps | 2min descanso",
        "Turkish get-ups - 3x5 cada lado | 90s descanso",
        "Windmills - 3x8 cada lado | 75s descanso",
        "Farmer's walk - 3x30m | 60s descanso",
        "Farmer's walk con una mano - 3x20m cada lado | 60s descanso",
        "Bear crawl - 3x20m | 75s descanso",
        "Bear crawl lateral - 3x15m cada lado | 75s descanso",
        "Wall balls - 3x15 reps | 90s descanso",
        "Wall ball shots - 3x20 reps | 90s descanso",
        "Plank to push-up - 3x10 reps | 60s descanso",
        "Plank walks - 3x8 cada lado | 60s descanso",
        "Single leg deadlift - 3x8 cada pierna | 75s descanso",
        "Single leg RDL - 3x10 cada pierna | 75s descanso",
        "Kettlebell goblet squat - 3x12 reps | 75s descanso",
        "Kettlebell front squat - 3x10 reps | 90s descanso",
        "Medicine ball slams - 3x15 reps | 60s descanso",
        "Medicine ball throws - 3x10 reps | 90s descanso",
        "TRX rows - 3x12 reps | 60s descanso",
        "TRX squats - 3x15 reps | 60s descanso",
        "TRX push-ups - 3x10 reps | 75s descanso",
        "Battle rope waves - 3x30s | 60s descanso",
        "Battle rope spirals - 3x30s | 60s descanso",
        "Sled push - 3x20m | 2min descanso",
        "Sled pull - 3x20m | 2min descanso",
        "Tire flips - 3x8 reps | 90s descanso",
        "Tire jumps - 3x10 reps | 75s descanso",
        "Rope climbing - 3x subidas | 2min descanso",
        "Atlas stones - 3x5 reps | 2min descanso",
        "Sandbag carries - 3x30m | 90s descanso",
        "Overhead carries - 3x25m | 90s descanso",
      ],
    },
    {
      category: "🧘 YOGA & FLEXIBILIDAD",
      color: "bg-pink-900/20 border-pink-600/30",
      exercises: [
        "Saludo al sol A - 5 repeticiones fluidas",
        "Saludo al sol B - 5 repeticiones fluidas",
        "Saludo al sol C - 3 repeticiones fluidas",
        "Guerrero I - 1min cada lado, respiración profunda",
        "Guerrero II - 1min cada lado, mantener fuerza",
        "Guerrero III - 30s cada lado, equilibrio",
        "Guerrero reverso - 45s cada lado",
        "Triángulo - 1min cada lado, estiramiento lateral",
        "Triángulo extendido - 1min cada lado",
        "Perro boca abajo - 2min, estiramiento completo",
        "Perro boca arriba - 30s x3 repeticiones",
        "Cobra - 30s x3 repeticiones, apertura pecho",
        "Cobra real - 20s x3 repeticiones",
        "Gato-vaca - 10 repeticiones lentas",
        "Gato-vaca dinámico - 15 repeticiones",
        "Torsión espinal sentado - 1min cada lado",
        "Torsión espinal acostado - 1min cada lado",
        "Postura del niño - 2min, relajación total",
        "Postura del niño extendida - 1min cada lado",
        "Mariposa - 2min, apertura cadera",
        "Mariposa reclinada - 2min, relajación",
        "Paloma - 1min cada lado, cadera profunda",
        "Paloma real - 30s cada lado",
        "Estiramiento de isquiotibiales - 1min cada pierna",
        "Estiramiento de isquiotibiales con correa - 1min cada pierna",
        "Estiramiento de cuádriceps - 1min cada pierna",
        "Estiramiento de cuádriceps acostado - 1min cada pierna",
        "Estiramiento de psoas - 1min cada pierna",
        "Estiramiento de glúteos - 1min cada pierna",
        "Estiramiento de pantorrillas - 1min cada pierna",
        "Flexión lateral - 45s cada lado",
        "Flexión hacia adelante - 2min, relajación",
        "Flexión hacia adelante con piernas separadas - 1min",
        "Torsión de columna - 1min cada lado",
        "Postura del árbol - 1min cada pierna",
        "Postura del águila - 45s cada lado",
        "Postura de la montaña - 2min, concentración",
        "Shavasana - 5min, relajación completa",
      ],
    },
    {
      category: "🏃 CARDIO TRADICIONAL",
      color: "bg-indigo-900/20 border-indigo-600/30",
      exercises: [
        "Caminata rápida - 30min ritmo moderado (5-6 km/h)",
        "Caminata inclinada - 25min pendiente 8-12%",
        "Caminata con intervalos - 30min (2min rápido, 1min lento)",
        "Trote suave - 20min ritmo conversacional",
        "Trote moderado - 25min ritmo constante",
        "Carrera - 15min ritmo intenso (8-10 km/h)",
        "Carrera con intervalos - 20min (1min rápido, 2min lento)",
        "Carrera en cuesta - 15min subidas y bajadas",
        "Bicicleta estática - 25min resistencia media",
        "Bicicleta con intervalos - 30min (2min intenso, 1min suave)",
        "Bicicleta de montaña - 45min terreno variado",
        "Spinning clase completa - 45min con instructor",
        "Elíptica - 20min intervalos de resistencia",
        "Elíptica marcha atrás - 15min, músculos diferentes",
        "Remo en máquina - 15min ritmo constante",
        "Remo con intervalos - 20min (500m rápido, 1min descanso)",
        "Escaladora - 10min intervalos intensos",
        "Escaladora ritmo constante - 15min moderado",
        "Natación libre - 20min estilo libre",
        "Natación mixta - 25min (libre, espalda, braza)",
        "Aqua aeróbicos - 30min clase acuática",
        "Aqua running - 20min correr en agua profunda",
        "Caminata nórdica - 35min con bastones",
        "Senderismo - 60min terreno variado",
        "Escalada en rocódromo - 45min diferentes rutas",
        "Baile aeróbico - 30min coreografía",
        "Zumba - 45min baile fitness",
        "Step aeróbicos - 30min con plataforma",
        "Kickboxing aeróbico - 30min sin contacto",
        "Boxeo con saco - 20min rounds de 3min",
        "Saltar la cuerda - 15min intervalos",
        "Trampolín - 20min saltos variados",
        "Patinaje - 30min ritmo constante",
        "Esquí de fondo - 45min (simulador o real)",
      ],
    },
    {
      category: "🏋️ POWERLIFTING",
      color: "bg-gray-900/20 border-gray-600/30",
      exercises: [
        "Sentadilla competición - 5x3 reps | 3min descanso",
        "Sentadilla con pausa - 4x2 reps | 3min descanso",
        "Sentadilla box - 4x3 reps | 2min descanso",
        "Sentadilla pin - 3x2 reps | 3min descanso",
        "Press banca competición - 5x3 reps | 3min descanso",
        "Press banca con pausa - 4x2 reps | 3min descanso",
        "Press banca pin - 3x2 reps | 3min descanso",
        "Press banca con cadenas - 4x3 reps | 2min descanso",
        "Peso muerto competición - 5x2 reps | 3min descanso",
        "Peso muerto déficit - 4x3 reps | 2min descanso",
        "Peso muerto pin - 3x2 reps | 3min descanso",
        "Peso muerto con bandas - 4x3 reps | 2min descanso",
        "Sentadilla frontal - 4x5 reps | 2min descanso",
        "Press inclinado - 4x6 reps | 90s descanso",
        "Remo con barra - 4x6 reps | 90s descanso",
        "Press militar - 4x5 reps | 2min descanso",
        "Peso muerto rumano - 4x6 reps | 90s descanso",
        "Good mornings - 3x8 reps | 90s descanso",
        "Sentadilla búlgara - 3x8 cada pierna | 75s descanso",
        "Press cerrado - 4x6 reps | 90s descanso",
      ],
    },
    {
      category: "🤸 CALISTENIA",
      color: "bg-cyan-900/20 border-cyan-600/30",
      exercises: [
        "Flexiones normales - 3x15-20 reps | 60s descanso",
        "Flexiones diamante - 3x10-15 reps | 75s descanso",
        "Flexiones archer - 3x5-8 cada lado | 90s descanso",
        "Flexiones a una mano - 3x3-5 cada lado | 2min descanso",
        "Flexiones con palmada - 3x6-10 reps | 90s descanso",
        "Dominadas pronadas - 3x8-12 reps | 90s descanso",
        "Dominadas supinas - 3x8-12 reps | 90s descanso",
        "Dominadas a una mano - 3x1-3 cada lado | 3min descanso",
        "Muscle ups - 3x3-5 reps | 2min descanso",
        "Fondos en paralelas - 3x10-15 reps | 75s descanso",
        "Fondos en anillas - 3x6-10 reps | 90s descanso",
        "L-sit - 3x20-30s | 90s descanso",
        "Front lever - 3x10-15s | 2min descanso",
        "Back lever - 3x10-15s | 2min descanso",
        "Human flag - 3x5-10s cada lado | 2min descanso",
        "Handstand - 3x30-60s | 90s descanso",
        "Handstand push-ups - 3x5-10 reps | 2min descanso",
        "Pistol squats - 3x8-12 cada pierna | 75s descanso",
        "Shrimp squats - 3x5-8 cada pierna | 90s descanso",
        "Dragon squats - 3x3-5 cada pierna | 2min descanso",
      ],
    },
  ]

  const nutritionLibrary = [
    {
      category: "🌅 DESAYUNOS ENERGÉTICOS",
      color: "bg-yellow-900/20 border-yellow-600/30",
      meals: [
        "Avena con arándanos y nueces - 450 kcal | Rica en fibra, antioxidantes y omega-3",
        "Avena overnight con chía y mango - 420 kcal | Preparación nocturna, probióticos",
        "Porridge de quinoa con frutas - 480 kcal | Proteína completa, sin gluten",
        "Tostadas integrales con aguacate y huevo - 520 kcal | Grasas saludables, proteína de calidad",
        "Tostada de centeno con salmón ahumado - 480 kcal | Omega-3, proteína magra",
        "Tostada de pan ezequiel con mantequilla de almendra - 420 kcal | Granos germinados",
        "Smoothie de proteína con plátano y espinacas - 380 kcal | Post-entreno ideal, hierro",
        "Smoothie verde con kale, manzana y jengibre - 320 kcal | Detox, antiinflamatorio",
        "Batido de cacao con plátano y avena - 400 kcal | Antioxidantes, energía sostenida",
        "Yogur griego con granola casera y frutas - 420 kcal | Probióticos, fibra prebiótica",
        "Yogur de coco con semillas de hemp - 350 kcal | Vegano, proteína vegetal",
        "Kéfir con frutos rojos y miel - 280 kcal | Probióticos, antioxidantes",
        "Tortilla de claras con verduras - 320 kcal | Alto en proteína, bajo en grasa",
        "Tortilla francesa con espinacas y queso feta - 380 kcal | Hierro, calcio",
        "Huevos revueltos con setas y hierbas - 340 kcal | Proteína completa, vitamina D",
        "Pancakes de avena con arándanos - 480 kcal | Carbohidratos complejos, antioxidantes",
        "Pancakes de plátano y huevo - 320 kcal | Sin harina, natural",
        "Waffles integrales con yogur griego - 450 kcal | Fibra, proteína",
        "Chia pudding con coco y mango - 350 kcal | Omega-3, fibra soluble",
        "Pudding de semillas con cacao - 380 kcal | Magnesio, antioxidantes",
        "Tazón de açaí con granola y coco - 460 kcal | Superalimento, energía natural",
        "Bowl de pitaya con kiwi y granola - 420 kcal | Vitamina C, fibra",
        "Muesli casero con leche de almendra - 340 kcal | Sin azúcar añadido, calcio",
        "Granola casera con yogur natural - 400 kcal | Avena, frutos secos",
        "Huevos benedictinos saludables - 480 kcal | Proteína de calidad, grasas buenas",
        "Huevos pochados con aguacate - 420 kcal | Folato, potasio",
        "Quinoa breakfast bowl con frutas - 420 kcal | Proteína completa, minerales",
        "Bowl de amaranto con canela - 380 kcal | Calcio, hierro",
        "Smoothie bowl tropical con coco - 380 kcal | Vitaminas, electrolitos",
        "Bowl de maca con cacao - 400 kcal | Adaptógeno, energía",
        "Wrap de desayuno con pavo y verduras - 440 kcal | Proteína magra, vitaminas",
        "Burrito de desayuno con frijoles negros - 480 kcal | Fibra, proteína vegetal",
        "Crepes de trigo sarraceno con frutas - 420 kcal | Sin gluten, antioxidantes",
        "Tostada francesa integral con canela - 390 kcal | Carbohidratos, especias",
      ],
    },
    {
      category: "🥗 ALMUERZOS BALANCEADOS",
      color: "bg-green-900/20 border-green-600/30",
      meals: [
        "Pollo a la plancha con quinoa y verduras - 650 kcal | Proteína completa, aminoácidos esenciales",
        "Pechuga de pollo al curry con arroz basmati - 680 kcal | Especias antiinflamatorias, carbohidratos",
        "Pollo teriyaki con brócoli y arroz integral - 620 kcal | Antioxidantes, fibra",
        "Salmón al horno con arroz integral - 720 kcal | Omega-3, selenio, vitamina D",
        "Salmón a la plancha con quinoa y espárragos - 680 kcal | Proteína, folato",
        "Filete de salmón con puré de coliflor - 580 kcal | Bajo en carbohidratos, cremoso",
        "Atún sellado con ensalada de quinoa - 620 kcal | Proteína magra, minerales",
        "Ensalada de atún con garbanzos y aguacate - 580 kcal | Proteína, fibra, grasas saludables",
        "Atún con pasta integral y verduras - 640 kcal | Carbohidratos complejos",
        "Pavo al curry con arroz basmati - 680 kcal | Proteína magra, especias digestivas",
        "Pechuga de pavo rellena con espinacas - 590 kcal | Hierro, proteína",
        "Wrap de pavo con hummus y verduras - 520 kcal | Fibra, proteína vegetal",
        "Bowl de tofu con vegetales asiáticos - 520 kcal | Proteína vegetal, fitoestrógenos",
        "Tofu marinado con arroz de coliflor - 450 kcal | Bajo en carbohidratos, isoflavonas",
        "Curry de tofu con leche de coco - 580 kcal | Cremoso, especias",
        "Tempeh salteado con verduras - 540 kcal | Fermentado, probióticos",
        "Seitan a la plancha con quinoa - 560 kcal | Proteína vegetal, gluten",
        "Pasta integral con pollo y pesto - 750 kcal | Carbohidratos, albahaca",
        "Pasta de lentejas con verduras - 620 kcal | Proteína vegetal, hierro",
        "Lasaña de berenjena con ricotta - 580 kcal | Baja en carbohidratos, calcio",
        "Wrap de hummus con vegetales frescos - 480 kcal | Fibra, proteína de legumbres",
        "Wrap de falafel con tahini - 560 kcal | Proteína vegetal, calcio",
        "Burrito bowl con pollo y frijoles - 640 kcal | Completo, saciante",
        "Risotto de champiñones con pollo - 690 kcal | Cremoso, umami",
        "Risotto de calabaza con salvia - 620 kcal | Betacarotenos, cremoso",
        "Paella de verduras con azafrán - 580 kcal | Antioxidantes, tradicional",
        "Ensalada César con pollo a la plancha - 580 kcal | Clásica, proteína",
        "Ensalada griega con queso feta - 520 kcal | Mediterránea, calcio",
        "Ensalada de rúcula con salmón - 560 kcal | Hierro, omega-3",
        "Bowl de quinoa con salmón y aguacate - 620 kcal | Superalimento completo",
        "Bowl de arroz integral con pollo - 600 kcal | Fibra, proteína",
        "Buddha bowl con tempeh - 580 kcal | Colorido, nutritivo",
        "Tacos de pescado con aguacate - 540 kcal | Grasas saludables, fresco",
        "Tacos de pollo con salsa verde - 520 kcal | Especias, proteína",
        "Quesadilla de pollo con verduras - 580 kcal | Calcio, proteína",
        "Curry de lentejas con arroz - 560 kcal | Proteína vegetal, especias",
        "Dal de lentejas con naan integral - 540 kcal | Tradicional, fibra",
        "Chili de frijoles con quinoa - 520 kcal | Proteína vegetal, picante",
        "Poke bowl hawaiano con atún - 590 kcal | Fresco, nutritivo",
        "Poke bowl vegano con tofu - 520 kcal | Colorido, vegetal",
        "Ceviche de pescado con camote - 480 kcal | Vitamina C, betacarotenos",
        "Ensalada mediterránea con garbanzos - 520 kcal | Fibra, grasas saludables",
        "Taboulé con pollo desmenuzado - 540 kcal | Hierbas frescas, proteína",
        "Gazpacho con huevo duro y pan - 420 kcal | Refrescante, proteína",
      ],
    },
    {
      category: "🌙 CENAS LIGERAS",
      color: "bg-blue-900/20 border-blue-600/30",
      meals: [
        "Salmón con brócoli al vapor - 580 kcal | Omega-3, vitamina K, fácil digestión",
        "Salmón a la plancha con espárragos - 520 kcal | Folato, antioxidantes",
        "Filete de salmón con ensalada verde - 500 kcal | Ligero, nutritivo",
        "Pechuga de pollo con ensalada mixta - 520 kcal | Proteína magra, vitaminas",
        "Pollo al limón con verduras asadas - 480 kcal | Cítricos, fibra",
        "Pollo a las hierbas con calabacín - 460 kcal | Aromático, bajo en calorías",
        "Merluza con verduras al horno - 450 kcal | Pescado blanco, fácil digestión",
        "Bacalao con pimientos asados - 420 kcal | Proteína magra, vitamina C",
        "Lenguado a la plancha con limón - 380 kcal | Delicado, bajo en grasa",
        "Tofu salteado con vegetales - 420 kcal | Proteína vegetal, colorido",
        "Tofu al curry con espinacas - 460 kcal | Cremoso, hierro",
        "Tempeh con verduras al wok - 480 kcal | Fermentado, crujiente",
        "Tortilla francesa con espárragos - 380 kcal | Ligera, nutritiva",
        "Tortilla de claras con champiñones - 320 kcal | Baja en grasa, saciante",
        "Revuelto de huevos con espinacas - 360 kcal | Hierro, proteína",
        "Caldo de verduras con pollo desmenuzado - 320 kcal | Hidratante, reconfortante",
        "Sopa de miso con tofu y algas - 250 kcal | Probióticos, minerales",
        "Crema de calabaza con semillas - 320 kcal | Betacarotenos, grasas saludables",
        "Ensalada de quinoa con salmón - 550 kcal | Proteína completa, omega-3",
        "Ensalada tibia de lentejas - 460 kcal | Fibra, proteína vegetal",
        "Ensalada de garbanzos con atún - 480 kcal | Proteína, fibra",
        "Verduras al wok con tempeh - 480 kcal | Fermentados, crujientes",
        "Salteado de verduras con tofu - 420 kcal | Colorido, ligero",
        "Wok de brócoli con almendras - 380 kcal | Vitamina C, grasas saludables",
        "Gazpacho andaluz tradicional - 280 kcal | Refrescante, antioxidantes",
        "Gazpacho de remolacha con yogur - 260 kcal | Probióticos, nitratos",
        "Vichyssoise de puerro light - 240 kcal | Cremosa, baja en calorías",
        "Crema de brócoli con queso - 340 kcal | Calcio, vitamina K",
        "Sopa de tomate con albahaca - 220 kcal | Licopeno, aromática",
        "Consomé de verduras con huevo - 180 kcal | Ligero, proteína",
        "Ensalada de rúcula con pavo - 420 kcal | Hierro, proteína magra",
        "Ensalada caprese con mozzarella - 380 kcal | Calcio, fresca",
        "Ensalada de espinacas con nueces - 360 kcal | Hierro, omega-3",
        "Pescado a la papillote con hierbas - 380 kcal | Cocción saludable, aromático",
        "Lubina al horno con limón - 360 kcal | Proteína magra, cítricos",
        "Dorada a la sal con verduras - 400 kcal | Tradicional, sabroso",
        "Rollitos de lechuga con pollo - 340 kcal | Bajo en carbohidratos, fresco",
        "Wraps de col con carne magra - 380 kcal | Vitamina C, proteína",
        "Carpaccio de ternera con rúcula - 420 kcal | Hierro, elegante",
        "Tataki de atún con ensalada - 460 kcal | Omega-3, fresco",
      ],
    },
    {
      category: "🥜 SNACKS SALUDABLES",
      color: "bg-orange-900/20 border-orange-600/30",
      meals: [
        "Frutos secos mixtos (30g) - 180 kcal | Grasas saludables, vitamina E, magnesio",
        "Almendras crudas (25g) - 150 kcal | Vitamina E, fibra, proteína",
        "Nueces de Brasil (20g) - 140 kcal | Selenio, grasas monoinsaturadas",
        "Pistachos sin sal (30g) - 160 kcal | Potasio, antioxidantes",
        "Anacardos tostados (25g) - 140 kcal | Magnesio, zinc",
        "Manzana con mantequilla de almendra - 220 kcal | Fibra, proteína, grasas saludables",
        "Pera con mantequilla de cacahuete - 240 kcal | Fibra, proteína vegetal",
        "Plátano con mantequilla de nuez - 260 kcal | Potasio, energía rápida",
        "Yogur natural con semillas de chía - 150 kcal | Probióticos, omega-3, calcio",
        "Yogur griego con miel y nueces - 180 kcal | Proteína, antioxidantes",
        "Kéfir con arándanos - 120 kcal | Probióticos, antioxidantes",
        "Batido de proteína post-entreno - 200 kcal | Recuperación muscular, aminoácidos",
        "Smoothie de espinacas y manzana - 140 kcal | Hierro, vitamina C",
        "Batido verde con apio y pepino - 100 kcal | Hidratante, depurativo",
        "Hummus con bastones de zanahoria - 160 kcal | Fibra, proteína vegetal, betacarotenos",
        "Hummus con apio y pepino - 140 kcal | Bajo en calorías, saciante",
        "Guacamole con bastones de verduras - 180 kcal | Grasas saludables, potasio",
        "Requesón con pepino y hierbas - 120 kcal | Proteína, refrescante",
        "Requesón con tomates cherry - 130 kcal | Licopeno, proteína",
        "Queso cottage con piña - 140 kcal | Enzimas digestivas, proteína",
        "Tostada de centeno con tomate - 180 kcal | Carbohidratos complejos, licopeno",
        "Tostada integral con aguacate - 200 kcal | Grasas monoinsaturadas, fibra",
        "Crackers integrales con hummus - 170 kcal | Fibra, proteína vegetal",
        "Mix de semillas y pasas - 190 kcal | Energía natural, minerales",
        "Trail mix casero - 200 kcal | Frutos secos, frutas deshidratadas",
        "Granola casera (30g) - 150 kcal | Avena, miel natural",
        "Edamame con sal marina - 130 kcal | Proteína vegetal, folato",
        "Edamame especiado - 140 kcal | Isoflavonas, fibra",
        "Garbanzos tostados - 120 kcal | Proteína, fibra, crujiente",
        "Palitos de apio con mantequilla de cacahuete - 170 kcal | Grasas saludables, proteína",
        "Apio con queso crema light - 100 kcal | Bajo en calorías, calcio",
        "Pepino con tzatziki - 80 kcal | Hidratante, probióticos",
        "Berries con yogur griego - 140 kcal | Antioxidantes, proteína",
        "Fresas con chocolate negro - 120 kcal | Antioxidantes, flavonoides",
        "Arándanos con almendras - 160 kcal | Antocianinas, vitamina E",
        "Huevo duro con aguacate - 200 kcal | Proteína completa, grasas buenas",
        "Huevo duro con sal de apio - 80 kcal | Proteína, bajo en calorías",
        "Tortilla mini de claras - 60 kcal | Proteína pura, saciante",
        "Chips de kale horneados - 80 kcal | Vitamina K, bajo en calorías",
        "Chips de remolacha - 90 kcal | Nitratos, colorido",
        "Chips de boniato al horno - 110 kcal | Betacarotenos, dulce natural",
        "Batido de cacao y plátano - 160 kcal | Antioxidantes, potasio",
        "Smoothie de mango y coco - 150 kcal | Vitamina A, electrolitos",
        "Agua de coco con chía - 80 kcal | Hidratante, omega-3",
      ],
    },
    {
      category: "🥤 BEBIDAS NUTRITIVAS",
      color: "bg-purple-900/20 border-purple-600/30",
      meals: [
        "Batido verde detox - 120 kcal | Espinacas, pepino, manzana, limón, jengibre",
        "Smoothie verde energético - 140 kcal | Kale, plátano, mango, agua de coco",
        "Jugo verde prensado en frío - 90 kcal | Apio, pepino, espinacas, limón",
        "Smoothie de proteína chocolate - 180 kcal | Proteína whey, plátano, cacao",
        "Batido de proteína vainilla - 170 kcal | Proteína vegetal, leche de almendra",
        "Smoothie post-entreno - 200 kcal | Proteína, plátano, avena, canela",
        "Agua de coco natural - 60 kcal | Electrolitos naturales, potasio",
        "Agua de coco con limón - 70 kcal | Hidratante, vitamina C",
        "Agua infusionada con pepino - 10 kcal | Hidratante, refrescante",
        "Té verde con limón - 5 kcal | Antioxidantes, catequinas",
        "Té verde matcha - 10 kcal | L-teanina, clorofila",
        "Té blanco con menta - 5 kcal | Antioxidantes suaves",
        "Batido de frutas rojas - 140 kcal | Antocianinas, vitamina C",
        "Smoothie de arándanos - 130 kcal | Antioxidantes, fibra",
        "Batido de fresa y plátano - 150 kcal | Potasio, vitamina C",
        "Leche dorada (cúrcuma) - 100 kcal | Antiinflamatorio, especias",
        "Golden milk con jengibre - 110 kcal | Digestivo, calentante",
        "Chai latte casero - 120 kcal | Especias, reconfortante",
        "Kombucha casera - 30 kcal | Probióticos, fermentado",
        "Kombucha de jengibre - 35 kcal | Digestivo, probióticos",
        "Kéfir de agua con frutas - 40 kcal | Probióticos, refrescante",
        "Batido de mango y jengibre - 130 kcal | Digestivo, tropical",
        "Smoothie tropical - 160 kcal | Piña, mango, coco",
        "Batido de papaya y lima - 120 kcal | Enzimas digestivas",
        "Agua infusionada con menta - 5 kcal | Refrescante, digestiva",
        "Agua con limón y chía - 20 kcal | Hidratante, omega-3",
        "Agua de jamaica - 15 kcal | Antioxidantes, refrescante",
        "Smoothie de piña y coco - 150 kcal | Bromelina, electrolitos",
        "Batido de coco y lima - 140 kcal | Grasas saludables, cítricos",
        "Lassi de mango - 160 kcal | Probióticos, cremoso",
        "Té de hierbas relajante - 0 kcal | Sin cafeína, calmante",
        "Infusión de manzanilla - 0 kcal | Relajante, digestiva",
        "Té de jengibre con miel - 25 kcal | Digestivo, antibacteriano",
        "Batido de chocolate y almendra - 170 kcal | Antioxidantes, saciante",
        "Smoothie de cacao y plátano - 160 kcal | Magnesio, potasio",
        "Chocolate caliente saludable - 150 kcal | Cacao puro, leche vegetal",
        "Jugo verde prensado - 90 kcal | Vitaminas, minerales",
        "Zumo de apio puro - 40 kcal | Depurativo, minerales",
        "Jugo de remolacha - 80 kcal | Nitratos, energía",
        "Café con leche de avena - 80 kcal | Energizante, fibra",
        "Café bulletproof - 200 kcal | Grasas saludables, energía sostenida",
        "Café con leche de coco - 90 kcal | Cremoso, grasas MCT",
        "Batido de vainilla y canela - 160 kcal | Antioxidante, aromático",
        "Smoothie de dátiles y almendra - 180 kcal | Endulzante natural, calcio",
      ],
    },
    {
      category: "🍰 POSTRES SALUDABLES",
      color: "bg-pink-900/20 border-pink-600/30",
      meals: [
        "Mousse de chocolate con aguacate - 180 kcal | Sin azúcar añadido, grasas saludables",
        "Mousse de cacao y plátano - 160 kcal | Potasio, antioxidantes",
        "Mousse de mango y coco - 170 kcal | Vitamina A, cremoso",
        "Helado de plátano casero - 120 kcal | Solo fruta, sin aditivos",
        "Nice cream de frutas rojas - 110 kcal | Antioxidantes, refrescante",
        "Helado de coco y chía - 140 kcal | Omega-3, cremoso",
        "Pudding de chía con cacao - 150 kcal | Rico en fibra, magnesio",
        "Pudding de chía con vainilla - 140 kcal | Omega-3, proteína",
        "Pudding de semillas con frutas - 160 kcal | Fibra, vitaminas",
        "Muffins de avena y arándanos - 160 kcal | Integral, antioxidantes",
        "Muffins de plátano y nueces - 180 kcal | Sin azúcar refinado",
        "Magdalenas de limón saludables - 150 kcal | Cítricos, fibra",
        "Trufas de dátiles y cacao - 90 kcal | Endulzante natural, hierro",
        "Energy balls de cacao - 100 kcal | Energía natural, magnesio",
        "Bolitas de coco y almendra - 80 kcal | Grasas saludables, proteína",
        "Gelatina de frutas casera - 60 kcal | Sin azúcar, colágeno",
        "Gelatina de agar con frutas - 50 kcal | Vegana, fibra",
        "Panna cotta de coco light - 120 kcal | Cremosa, baja en calorías",
        "Cookies de avena y pasas - 140 kcal | Fibra, energía sostenida",
        "Galletas de almendra - 130 kcal | Sin gluten, proteína",
        "Crackers dulces de semillas - 120 kcal | Omega-3, crujientes",
        "Parfait de yogur y granola - 170 kcal | Probióticos, fibra",
        "Parfait de chía y frutas - 160 kcal | Omega-3, antioxidantes",
        "Trifle saludable de frutas - 150 kcal | Colorido, vitaminas",
        "Brownie de frijoles negros - 130 kcal | Proteína vegetal, fibra",
        "Brownie de remolacha - 140 kcal | Antioxidantes, húmedo",
        "Blondies de garbanzos - 120 kcal | Proteína, sin gluten",
        "Sorbete de frutas naturales - 80 kcal | Refrescante, vitaminas",
        "Granita de limón - 70 kcal | Cítricos, refrescante",
        "Paletas de frutas caseras - 60 kcal | Sin azúcar añadido",
        "Tarta de manzana sin azúcar - 150 kcal | Canela natural, fibra",
        "Tarta de calabaza especiada - 160 kcal | Betacarotenos, especias",
        "Cheesecake de yogur griego - 140 kcal | Alto en proteína, cremoso",
        "Flan de coco light - 110 kcal | Bajo en grasa, tropical",
        "Flan de vainilla sin azúcar - 100 kcal | Proteína, cremoso",
        "Natillas de almendra - 120 kcal | Calcio, cremosas",
        "Compota de frutas casera - 70 kcal | Sin aditivos, fibra",
        "Compota de manzana y canela - 80 kcal | Antioxidantes, especias",
        "Mermelada de chía y frutas - 60 kcal | Omega-3, sin azúcar refinado",
        "Crema de cacao y aguacate - 170 kcal | Grasas saludables, antioxidantes",
        "Tiramisu saludable - 180 kcal | Proteína, menos calorías",
        "Pannacotta de matcha - 130 kcal | Antioxidantes, cremosa",
        "Soufflé de chocolate light - 140 kcal | Aireado, menos grasa",
        "Crème brûlée saludable - 150 kcal | Proteína, cremosa",
      ],
    },
    {
      category: "🥙 COMIDAS ÉTNICAS",
      color: "bg-red-900/20 border-red-600/30",
      meals: [
        "Curry tailandés de pollo - 580 kcal | Leche de coco, especias aromáticas",
        "Pad thai con camarones - 620 kcal | Fideos de arroz, tamarindo",
        "Tom yum con pollo - 320 kcal | Sopa picante, hierba limón",
        "Sushi bowl con salmón - 540 kcal | Arroz sushi, algas nori",
        "Ramen saludable con pollo - 480 kcal | Caldo de hueso, verduras",
        "Bibimbap coreano - 560 kcal | Arroz, verduras fermentadas",
        "Tacos mexicanos de pescado - 450 kcal | Tortillas de maíz, cilantro",
        "Burrito bowl tex-mex - 580 kcal | Frijoles negros, aguacate",
        "Chiles rellenos saludables - 420 kcal | Poblanos, queso fresco",
        "Paella valenciana light - 520 kcal | Azafrán, mariscos",
        "Gazpacho andaluz - 180 kcal | Tomates, pepino, pimiento",
        "Tortilla española fitness - 380 kcal | Patatas, huevos, cebolla",
        "Hummus libanés con pita - 320 kcal | Garbanzos, tahini, limón",
        "Taboulé mediterráneo - 280 kcal | Bulgur, perejil, tomate",
        "Falafel al horno - 340 kcal | Garbanzos, especias, horneado",
        "Moussaka griega light - 480 kcal | Berenjena, carne magra",
        "Souvlaki de pollo - 420 kcal | Marinado, yogur griego",
        "Risotto italiano de setas - 520 kcal | Arroz arborio, parmesano",
        "Pasta puttanesca - 480 kcal | Tomates, aceitunas, alcaparras",
        "Minestrone italiano - 280 kcal | Verduras, frijoles, pasta",
        "Couscous marroquí - 460 kcal | Sémola, verduras, especias",
        "Tagine de pollo - 520 kcal | Ciruelas, almendras, canela",
        "Shakshuka israelí - 320 kcal | Huevos, tomates, pimientos",
        "Butter chicken indio - 580 kcal | Pollo, salsa cremosa, especias",
        "Dal de lentejas indio - 380 kcal | Lentejas, cúrcuma, comino",
        "Biryani de verduras - 520 kcal | Arroz basmati, especias",
        "Pho vietnamita - 420 kcal | Caldo de hueso, fideos de arroz",
        "Banh mi saludable - 380 kcal | Pan integral, verduras encurtidas",
        "Larb tailandés - 340 kcal | Carne picada, hierbas, lima",
        "Ceviche peruano - 280 kcal | Pescado, lima, ají, cebolla",
        "Anticuchos peruanos - 420 kcal | Corazón de res, ají panca",
        "Quinoa a la huancaína - 460 kcal | Quinoa, salsa amarilla",
        "Empanadas argentinas - 320 kcal | Masa integral, carne magra",
        "Chimichurri con carne - 480 kcal | Hierbas frescas, ajo",
        "Feijoada brasileña light - 520 kcal | Frijoles negros, carnes magras",
      ],
    },
  ]

  const handleWorkoutToggle = (exercise: string) => {
    setSelectedWorkouts((prev) => (prev.includes(exercise) ? prev.filter((e) => e !== exercise) : [...prev, exercise]))
  }

  const handleMealToggle = (meal: string) => {
    setSelectedMeals((prev) => (prev.includes(meal) ? prev.filter((m) => m !== meal) : [...prev, meal]))
  }

  const handleSaveProgram = () => {
    setIsAssigning(true)
    setTimeout(() => {
      setIsAssigning(false)
      setProgramAssigned(true)
      // Guardar en localStorage para simular persistencia
      const assignedProgram = {
        clientId: selectedClient,
        clientName: clients.find((c) => c.id === selectedClient)?.name,
        workouts: selectedWorkouts,
        meals: selectedMeals,
        notes: programNotes,
        assignedDate: new Date().toISOString(),
      }

      const existingPrograms = JSON.parse(localStorage.getItem("assignedPrograms") || "[]")
      existingPrograms.push(assignedProgram)
      localStorage.setItem("assignedPrograms", JSON.stringify(existingPrograms))

      // Limpiar formulario después de 2 segundos
      setTimeout(() => {
        setSelectedClient("")
        setSelectedWorkouts([])
        setSelectedMeals([])
        setProgramNotes("")
        setProgramAssigned(false)
      }, 2000)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-purple-800/20 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-black p-2 rounded-lg">
              <Dumbbell className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">Luxion</h1>
            <Badge className="bg-orange-600/20 text-orange-200 border-orange-400">Entrenador</Badge>
          </div>
          <Link href="/trainer-dashboard">
            <Button variant="ghost" className="text-purple-200 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Asignar Programa Personalizado</h2>
            <p className="text-xl text-purple-200">
              Biblioteca completa con más de 200 ejercicios y 150 opciones nutricionales organizadas por categorías
            </p>
          </div>

          {/* Success Message */}
          {programAssigned && (
            <Card className="bg-green-900/20 border-green-600/30 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                  <div>
                    <h3 className="text-green-400 font-semibold">¡Programa asignado exitosamente!</h3>
                    <p className="text-green-200 text-sm">
                      El programa ha sido asignado al cliente. Puedes verlo en el dashboard.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Client Selection */}
          <Card className="bg-black/40 border-purple-800/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Seleccionar Cliente</CardTitle>
              <CardDescription className="text-purple-200">
                Elige el cliente para asignar el programa personalizado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger className="bg-black/20 border-purple-800/50 text-white">
                  <SelectValue placeholder="Elige un cliente" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-purple-800/50">
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id} className="text-white">
                      {client.name} - Plan {client.plan} | Objetivo: {client.goal}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedClient && (
            <>
              <Tabs defaultValue="workout" className="space-y-6">
                <TabsList className="bg-purple-900/20">
                  <TabsTrigger value="workout" className="data-[state=active]:bg-purple-600">
                    <Target className="h-4 w-4 mr-2" />
                    Rutina de Ejercicios ({selectedWorkouts.length})
                  </TabsTrigger>
                  <TabsTrigger value="nutrition" className="data-[state=active]:bg-purple-600">
                    <Apple className="h-4 w-4 mr-2" />
                    Plan Nutricional ({selectedMeals.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="workout" className="space-y-6">
                  <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {workoutLibrary.map((category, categoryIndex) => (
                      <Card
                        key={categoryIndex}
                        className={`bg-black/40 border-purple-800/30 backdrop-blur-sm ${category.color}`}
                      >
                        <CardHeader className="pb-3">
                          <CardTitle className="text-white text-lg font-bold">{category.category}</CardTitle>
                          <CardDescription className="text-purple-200">
                            {category.exercises.length} ejercicios disponibles
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                          {category.exercises.map((exercise, exerciseIndex) => (
                            <div
                              key={exerciseIndex}
                              className={`flex items-start space-x-3 p-3 rounded-lg transition-all cursor-pointer ${
                                selectedWorkouts.includes(exercise)
                                  ? "bg-green-900/40 border border-green-500/50"
                                  : "bg-purple-900/20 hover:bg-purple-800/30"
                              }`}
                              onClick={() => handleWorkoutToggle(exercise)}
                            >
                              <Checkbox
                                checked={selectedWorkouts.includes(exercise)}
                                onChange={() => handleWorkoutToggle(exercise)}
                              />
                              <label className="text-purple-200 text-sm cursor-pointer flex-1 leading-relaxed">
                                {exercise}
                              </label>
                              {selectedWorkouts.includes(exercise) && (
                                <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                              )}
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="nutrition" className="space-y-6">
                  <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {nutritionLibrary.map((category, categoryIndex) => (
                      <Card
                        key={categoryIndex}
                        className={`bg-black/40 border-purple-800/30 backdrop-blur-sm ${category.color}`}
                      >
                        <CardHeader className="pb-3">
                          <CardTitle className="text-white text-lg font-bold">{category.category}</CardTitle>
                          <CardDescription className="text-purple-200">
                            {category.meals.length} opciones disponibles
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                          {category.meals.map((meal, mealIndex) => (
                            <div
                              key={mealIndex}
                              className={`flex items-start space-x-3 p-3 rounded-lg transition-all cursor-pointer ${
                                selectedMeals.includes(meal)
                                  ? "bg-green-900/40 border border-green-500/50"
                                  : "bg-purple-900/20 hover:bg-purple-800/30"
                              }`}
                              onClick={() => handleMealToggle(meal)}
                            >
                              <Checkbox
                                checked={selectedMeals.includes(meal)}
                                onChange={() => handleMealToggle(meal)}
                              />
                              <label className="text-purple-200 text-sm cursor-pointer flex-1 leading-relaxed">
                                {meal}
                              </label>
                              {selectedMeals.includes(meal) && (
                                <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                              )}
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              {/* Program Summary and Notes */}
              {(selectedWorkouts.length > 0 || selectedMeals.length > 0) && (
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Selected Items Summary */}
                  <Card className="bg-black/40 border-green-800/30 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-green-400 flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Resumen del Programa
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedWorkouts.length > 0 && (
                        <div>
                          <h4 className="text-white font-medium mb-2">
                            Ejercicios Seleccionados ({selectedWorkouts.length})
                          </h4>
                          <div className="max-h-40 overflow-y-auto space-y-1">
                            {selectedWorkouts.map((exercise, index) => (
                              <div key={index} className="text-sm text-green-300 flex items-start">
                                <span className="text-green-400 mr-2">•</span>
                                <span className="flex-1">{exercise}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedMeals.length > 0 && (
                        <div>
                          <h4 className="text-white font-medium mb-2">
                            Comidas Seleccionadas ({selectedMeals.length})
                          </h4>
                          <div className="max-h-40 overflow-y-auto space-y-1">
                            {selectedMeals.map((meal, index) => (
                              <div key={index} className="text-sm text-green-300 flex items-start">
                                <span className="text-green-400 mr-2">•</span>
                                <span className="flex-1">{meal}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Program Notes */}
                  <Card className="bg-black/40 border-purple-800/30 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white">Notas del Programa</CardTitle>
                      <CardDescription className="text-purple-200">
                        Agrega instrucciones especiales para el cliente
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="notes" className="text-purple-200">
                          Instrucciones Especiales
                        </Label>
                        <Textarea
                          id="notes"
                          placeholder="Ej: Realizar calentamiento de 10 minutos antes de cada sesión. Hidratarse cada 15 minutos durante el entrenamiento..."
                          value={programNotes}
                          onChange={(e) => setProgramNotes(e.target.value)}
                          className="bg-black/20 border-purple-800/50 text-white placeholder:text-purple-300 min-h-[120px]"
                        />
                      </div>
                      <Button
                        onClick={handleSaveProgram}
                        disabled={isAssigning}
                        className="w-full bg-green-600 hover:bg-green-700 text-lg py-3"
                      >
                        {isAssigning ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Asignando Programa...
                          </>
                        ) : (
                          <>
                            <Save className="h-5 w-5 mr-2" />
                            Asignar Programa Completo
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
