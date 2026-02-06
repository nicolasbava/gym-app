// 'use client'
// import { useState, useEffect } from "react"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { z } from "zod"
// import { useRouter } from "next/navigation"
// import { Button } from "@/src/components/ui/button"
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/src/components/ui/form"
// import { Input } from "@/src/components/ui/input"
// import { updateUserProfile, type UserProfile } from "@/src/app/actions/users"
// import { Loader2, Save } from "lucide-react"

// const profileFormSchema = z.object({
//   name: z.string().min(3, "El nombre debe tener al menos 3 caracteres").max(100, "El nombre no debe tener más de 100 caracteres"),
//   phone: z.string().optional().or(z.literal("")),
// })

// type ProfileFormValues = z.infer<typeof profileFormSchema>

// interface ProfileEditFormProps {
//   profile: UserProfile
//   onSuccess?: () => void
// }

// export function ProfileEditForm({ profile, onSuccess }: ProfileEditFormProps) {
//   const router = useRouter()
//   const [isMounted, setIsMounted] = useState(false)
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

//   const form = useForm<ProfileFormValues>({
//     resolver: zodResolver(profileFormSchema),
//     defaultValues: {
//       name: profile.name,
//       phone: profile.phone ?? "",
//     },
//   })

//   useEffect(() => {
//     setIsMounted(true)
//   }, [])

//   async function onSubmit(data: ProfileFormValues) {
//     setIsSubmitting(true)
//     setMessage(null)

//     const result = await updateUserProfile({
//       name: data.name,
//       phone: data.phone || undefined,
//     })

//     if (result.success) {
//       setMessage({ type: "success", text: result.message ?? "Perfil actualizado correctamente" })
//       router.refresh()
//       onSuccess?.()
//     } else {
//       setMessage({ type: "error", text: result.error ?? "Error al actualizar el perfil" })
//     }

//     setIsSubmitting(false)
//   }

//   if (!isMounted) {
//     return (
//       <div className="space-y-6">
//         <div className="space-y-2">
//           <div className="h-4 w-24 bg-black/20 rounded animate-pulse" />
//           <div className="h-9 w-full bg-black/20 rounded animate-pulse" />
//         </div>
//         <div className="space-y-2">
//           <div className="h-4 w-24 bg-black/20 rounded animate-pulse" />
//           <div className="h-9 w-full bg-black/20 rounded animate-pulse" />
//         </div>
//         <div className="flex justify-end gap-3">
//           <div className="h-9 w-20 bg-black/20 rounded animate-pulse" />
//           <div className="h-9 w-32 bg-black/20 rounded animate-pulse" />
//         </div>
//       </div>
//     )
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)} className="space-y-6">
//         <FormField
//           control={form.control}
//           name="name"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel className="text-purple-200">Nombre completo</FormLabel>
//               <FormControl>
//                 <Input
//                   {...field}
//                   className="bg-black/20 border-purple-800/50 text-white placeholder:text-purple-300"
//                   placeholder="Juan Pérez"
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="phone"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel className="text-purple-200">Teléfono</FormLabel>
//               <FormControl>
//                 <Input
//                   {...field}
//                   type="tel"
//                   className="bg-black/20 border-purple-800/50 text-white placeholder:text-purple-300"
//                   placeholder="+54 911 1234 5678"
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {message && (
//           <div
//             className={`rounded-md p-3 text-sm ${
//               message.type === "success"
//                 ? "bg-green-500/20 text-green-400 border border-green-500/30"
//                 : "bg-red-500/20 text-red-400 border border-red-500/30"
//             }`}
//           >
//             {message.text}
//           </div>
//         )}

//         <div className="flex justify-end gap-3">
//           <Button
//             type="button"
//             variant="ghost"
//             onClick={() => form.reset()}
//             disabled={isSubmitting}
//             className="text-purple-200 hover:text-white"
//           >
//             Cancelar
//           </Button>
//           <Button
//             type="submit"
//             disabled={isSubmitting}
//             className="bg-purple-600 hover:bg-purple-700"
//           >
//             {isSubmitting ? (
//               <>
//                 <Loader2 className="mr-2 size-4 animate-spin" />
//                 Guardando...
//               </>
//             ) : (
//               <>
//                 <Save className="mr-2 size-4" />
//                 Guardar cambios
//               </>
//             )}
//           </Button>
//         </div>
//       </form>
//     </Form>
//   )
// }