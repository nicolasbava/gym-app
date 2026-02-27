// export interface Exercise {
//     id: string;
//     name: string;
//     description: string;
//     video_url: string;
//     image_url: string;
//     muscle_group: string;
//     equipment: string;
//     instructions: string[];
// }

// export interface RoutineExercise {
//     exerciseId: string;
//     sets: number;
//     reps: number;
//     weight: number;
//     restTime: number; // in seconds
// }

// export interface Routine {
//     id: string;
//     name: string;
//     description: string;
//     exercises: RoutineExercise[];
//     createdAt: string;
// }

// export interface Member {
//     id: string;
//     name: string;
//     email: string;
//     phone: string;
//     membershipStart: string;
//     assignedRoutines: string[];
//     profileImage: string;
// }

// export interface Coach {
//     id: string;
//     name: string;
//     email: string;
//     phone: string;
//     specialization: string;
//     joinedDate: string;
//     activeClients: number;
//     profileImage: string;
// }

// export interface Gym {
//     id: string;
//     name: string;
//     logoUrl: string;
//     primaryColor: string;
//     secondaryColor: string;
//     coachAdminFullName: string;
//     phoneNumber: string;
//     directions: string;
//     city: string;
//     createdAt: string;
//     totalMembers: number;
//     totalCoaches: number;
//     status: 'active' | 'inactive';
// }

// export interface WorkoutStats {
//     date: string;
//     workouts: number;
//     members: number;
// }

// export interface MuscleGroupStats {
//     name: string;
//     exercises: number;
// }

// // export const mockExercises: Exercise[] = [
// //     {
// //         id: 'ex1',
// //         name: 'Barbell Bench Press',
// //         description: 'Compound chest exercise for building upper body strength',
// //         video_url: 'https://example.com/video1.mp4',
// //         imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
// //         muscleGroup: 'Chest',
// //         equipment: 'Barbell',
// //         instructions: [
// //             'Lie flat on bench with feet on floor',
// //             'Grip bar slightly wider than shoulder width',
// //             'Lower bar to chest with control',
// //             'Press bar up explosively',
// //             'Lock out arms at top',
// //         ],
// //     },
// //     {
// //         id: 'ex2',
// //         name: 'Barbell Squat',
// //         description: 'King of leg exercises for overall lower body development',
// //         videoUrl: 'https://example.com/video2.mp4',
// //         imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800',
// //         muscleGroup: 'Legs',
// //         equipment: 'Barbell',
// //         instructions: [
// //             'Position bar on upper back',
// //             'Stand with feet shoulder-width apart',
// //             'Descend by pushing hips back',
// //             'Go down until thighs parallel to floor',
// //             'Drive through heels to stand',
// //         ],
// //     },
// //     {
// //         id: 'ex3',
// //         name: 'Deadlift',
// //         description: 'Full body compound movement for strength and muscle',
// //         videoUrl: 'https://example.com/video3.mp4',
// //         imageUrl: 'https://images.unsplash.com/photo-1584863231364-2edc166de576?w=800',
// //         muscleGroup: 'Back',
// //         equipment: 'Barbell',
// //         instructions: [
// //             'Stand with feet hip-width apart',
// //             'Bend and grip bar just outside legs',
// //             'Keep back straight and chest up',
// //             'Drive through heels to lift',
// //             'Stand fully erect at top',
// //         ],
// //     },
// //     {
// //         id: 'ex4',
// //         name: 'Pull-ups',
// //         description: 'Bodyweight exercise for back and bicep development',
// //         videoUrl: 'https://example.com/video4.mp4',
// //         imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800',
// //         muscleGroup: 'Back',
// //         equipment: 'Pull-up Bar',
// //         instructions: [
// //             'Hang from bar with overhand grip',
// //             'Pull body up until chin over bar',
// //             'Keep core engaged',
// //             'Lower with control',
// //             'Full extension at bottom',
// //         ],
// //     },
// //     {
// //         id: 'ex5',
// //         name: 'Dumbbell Shoulder Press',
// //         description: 'Build strong, defined shoulders with this classic movement',
// //         videoUrl: 'https://example.com/video5.mp4',
// //         imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800',
// //         muscleGroup: 'Shoulders',
// //         equipment: 'Dumbbells',
// //         instructions: [
// //             'Sit with back supported',
// //             'Hold dumbbells at shoulder height',
// //             'Press weights overhead',
// //             'Extend arms fully',
// //             'Lower with control',
// //         ],
// //     },
// // ];

// // export const mockRoutines: Routine[] = [
// //     {
// //         id: 'r1',
// //         name: 'Push Day',
// //         description: 'Upper body pushing muscles - chest, shoulders, triceps',
// //         exercises: [
// //             { exerciseId: 'ex1', sets: 4, reps: 8, weight: 80, restTime: 90 },
// //             { exerciseId: 'ex5', sets: 3, reps: 10, weight: 25, restTime: 60 },
// //         ],
// //         createdAt: '2024-01-15',
// //     },
// //     {
// //         id: 'r2',
// //         name: 'Pull Day',
// //         description: 'Upper body pulling muscles - back, biceps',
// //         exercises: [
// //             { exerciseId: 'ex3', sets: 5, reps: 5, weight: 120, restTime: 120 },
// //             { exerciseId: 'ex4', sets: 3, reps: 10, weight: 0, restTime: 90 },
// //         ],
// //         createdAt: '2024-01-16',
// //     },
// //     {
// //         id: 'r3',
// //         name: 'Leg Day',
// //         description: 'Complete lower body workout',
// //         exercises: [{ exerciseId: 'ex2', sets: 4, reps: 8, weight: 100, restTime: 120 }],
// //         createdAt: '2024-01-17',
// //     },
// // ];

// export const mockMembers: Member[] = [
//     {
//         id: 'm1',
//         name: 'John Smith',
//         email: 'john.smith@email.com',
//         phone: '+1 (555) 123-4567',
//         membershipStart: '2024-01-01',
//         assignedRoutines: ['r1', 'r2', 'r3'],
//         profileImage: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400',
//     },
//     {
//         id: 'm2',
//         name: 'Sarah Johnson',
//         email: 'sarah.j@email.com',
//         phone: '+1 (555) 234-5678',
//         membershipStart: '2024-01-15',
//         assignedRoutines: ['r1', 'r2'],
//         profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
//     },
//     {
//         id: 'm3',
//         name: 'Mike Williams',
//         email: 'mike.w@email.com',
//         phone: '+1 (555) 345-6789',
//         membershipStart: '2023-12-01',
//         assignedRoutines: ['r1', 'r3'],
//         profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
//     },
//     {
//         id: 'm4',
//         name: 'Emily Davis',
//         email: 'emily.d@email.com',
//         phone: '+1 (555) 456-7890',
//         membershipStart: '2024-02-01',
//         assignedRoutines: ['r1'],
//         profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
//     },
//     {
//         id: 'm5',
//         name: 'David Brown',
//         email: 'david.b@email.com',
//         phone: '+1 (555) 567-8901',
//         membershipStart: '2024-01-20',
//         assignedRoutines: ['r2', 'r3'],
//         profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
//     },
// ];

// export const mockCoaches: Coach[] = [
//     {
//         id: 'c1',
//         name: 'Alex Thompson',
//         email: 'alex.thompson@fitpro.com',
//         phone: '+1 (555) 111-2222',
//         specialization: 'Strength Training',
//         joinedDate: '2023-06-01',
//         activeClients: 12,
//         profileImage: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400',
//     },
//     {
//         id: 'c2',
//         name: 'Jessica Martinez',
//         email: 'jessica.m@fitpro.com',
//         phone: '+1 (555) 222-3333',
//         specialization: 'CrossFit & HIIT',
//         joinedDate: '2023-08-15',
//         activeClients: 15,
//         profileImage: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400',
//     },
//     {
//         id: 'c3',
//         name: 'Marcus Johnson',
//         email: 'marcus.j@fitpro.com',
//         phone: '+1 (555) 333-4444',
//         specialization: 'Bodybuilding',
//         joinedDate: '2023-05-20',
//         activeClients: 18,
//         profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
//     },
//     {
//         id: 'c4',
//         name: 'Rachel Kim',
//         email: 'rachel.k@fitpro.com',
//         phone: '+1 (555) 444-5555',
//         specialization: 'Yoga & Flexibility',
//         joinedDate: '2024-01-10',
//         activeClients: 8,
//         profileImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
//     },
// ];

// export const mockGyms: Gym[] = [
//     {
//         id: 'g1',
//         name: 'FitPro Gym',
//         logoUrl: 'https://images.unsplash.com/photo-1555620575-6688185f44e7?w=200',
//         primaryColor: '#FF5733',
//         secondaryColor: '#33FF57',
//         coachAdminFullName: 'Alex Thompson',
//         phoneNumber: '+1 (555) 111-2222',
//         directions: '123 Main St, Suite 100',
//         city: 'Anytown',
//         createdAt: '2023-01-01',
//         totalMembers: 150,
//         totalCoaches: 10,
//         status: 'active',
//     },
//     {
//         id: 'g2',
//         name: 'StrongFit Gym',
//         logoUrl: 'https://images.unsplash.com/photo-1555620575-6688185f44e7?w=200',
//         primaryColor: '#33FF57',
//         secondaryColor: '#FF5733',
//         coachAdminFullName: 'Jessica Martinez',
//         phoneNumber: '+1 (555) 222-3333',
//         directions: '456 Elm St, Suite 200',
//         city: 'Othertown',
//         createdAt: '2023-02-01',
//         totalMembers: 120,
//         totalCoaches: 8,
//         status: 'active',
//     },
// ];

// export const mockWorkoutStats: WorkoutStats[] = [
//     { date: '2024-01-21', workouts: 45, members: 28 },
//     { date: '2024-01-22', workouts: 52, members: 31 },
//     { date: '2024-01-23', workouts: 48, members: 29 },
//     { date: '2024-01-24', workouts: 55, members: 33 },
//     { date: '2024-01-25', workouts: 50, members: 30 },
//     { date: '2024-01-26', workouts: 38, members: 25 },
//     { date: '2024-01-27', workouts: 42, members: 27 },
//     { date: '2024-01-28', workouts: 58, members: 35 },
//     { date: '2024-01-29', workouts: 54, members: 32 },
//     { date: '2024-01-30', workouts: 51, members: 31 },
//     { date: '2024-01-31', workouts: 56, members: 34 },
//     { date: '2024-02-01', workouts: 49, members: 30 },
//     { date: '2024-02-02', workouts: 44, members: 28 },
//     { date: '2024-02-03', workouts: 47, members: 29 },
//     { date: '2024-02-04', workouts: 53, members: 32 },
//     { date: '2024-02-05', workouts: 60, members: 36 },
//     { date: '2024-02-06', workouts: 57, members: 34 },
//     { date: '2024-02-07', workouts: 52, members: 31 },
//     { date: '2024-02-08', workouts: 55, members: 33 },
//     { date: '2024-02-09', workouts: 48, members: 29 },
//     { date: '2024-02-10', workouts: 51, members: 30 },
//     { date: '2024-02-11', workouts: 59, members: 35 },
//     { date: '2024-02-12', workouts: 54, members: 32 },
//     { date: '2024-02-13', workouts: 50, members: 30 },
//     { date: '2024-02-14', workouts: 46, members: 28 },
//     { date: '2024-02-15', workouts: 53, members: 31 },
//     { date: '2024-02-16', workouts: 58, members: 34 },
//     { date: '2024-02-17', workouts: 62, members: 37 },
//     { date: '2024-02-18', workouts: 56, members: 33 },
//     { date: '2024-02-19', workouts: 60, members: 35 },
//     { date: '2024-02-20', workouts: 65, members: 38 },
//     { date: '2024-02-21', workouts: 61, members: 36 },
// ];

// export const mockMuscleGroupStats: MuscleGroupStats[] = [
//     { name: 'Chest', exercises: 245 },
//     { name: 'Back', exercises: 312 },
//     { name: 'Legs', exercises: 289 },
//     { name: 'Shoulders', exercises: 198 },
//     { name: 'Arms', exercises: 176 },
//     { name: 'Core', exercises: 154 },
// ];
