export interface Exercise {
    id: string;
    name: string;
    description: string;
    video_url: string;
    image_url: string;
    muscle_group: string;
    equipment: string;
    instructions: string[];
}

export interface RoutineExercise {
    exerciseId: string;
    sets: number;
    reps: number;
    weight: number;
    restTime: number; // in seconds
}

export interface Routine {
    id: string;
    name: string;
    description: string;
    exercises: RoutineExercise[];
    createdAt: string;
}

export interface Member {
    id: string;
    name: string;
    email: string;
    phone: string;
    membershipStart: string;
    assignedRoutines: string[];
    profileImage: string;
}

export const mockExercises: Exercise[] = [
    {
        id: 'ex1',
        name: 'Barbell Bench Press',
        description: 'Compound chest exercise for building upper body strength',
        video_url: 'https://example.com/video1.mp4',
        image_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
        muscle_group: 'Chest',
        equipment: 'Barbell',
        instructions: [
            'Lie flat on bench with feet on floor',
            'Grip bar slightly wider than shoulder width',
            'Lower bar to chest with control',
            'Press bar up explosively',
            'Lock out arms at top',
        ],
    },
    {
        id: 'ex2',
        name: 'Barbell Squat',
        description: 'King of leg exercises for overall lower body development',
        video_url: 'https://example.com/video2.mp4',
        image_url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800',
        muscle_group: 'Legs',
        equipment: 'Barbell',
        instructions: [
            'Position bar on upper back',
            'Stand with feet shoulder-width apart',
            'Descend by pushing hips back',
            'Go down until thighs parallel to floor',
            'Drive through heels to stand',
        ],
    },
    {
        id: 'ex3',
        name: 'Deadlift',
        description: 'Full body compound movement for strength and muscle',
        video_url: 'https://example.com/video3.mp4',
        image_url: 'https://images.unsplash.com/photo-1584863231364-2edc166de576?w=800',
        muscle_group: 'Back',
        equipment: 'Barbell',
        instructions: [
            'Stand with feet hip-width apart',
            'Bend and grip bar just outside legs',
            'Keep back straight and chest up',
            'Drive through heels to lift',
            'Stand fully erect at top',
        ],
    },
    {
        id: 'ex4',
        name: 'Pull-ups',
        description: 'Bodyweight exercise for back and bicep development',
        video_url: 'https://example.com/video4.mp4',
        image_url: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800',
        muscle_group: 'Back',
        equipment: 'Pull-up Bar',
        instructions: [
            'Hang from bar with overhand grip',
            'Pull body up until chin over bar',
            'Keep core engaged',
            'Lower with control',
            'Full extension at bottom',
        ],
    },
    {
        id: 'ex5',
        name: 'Dumbbell Shoulder Press',
        description: 'Build strong, defined shoulders with this classic movement',
        video_url: 'https://example.com/video5.mp4',
        image_url: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800',
        muscle_group: 'Shoulders',
        equipment: 'Dumbbells',
        instructions: [
            'Sit with back supported',
            'Hold dumbbells at shoulder height',
            'Press weights overhead',
            'Extend arms fully',
            'Lower with control',
        ],
    },
];

export const mockRoutines: Routine[] = [
    {
        id: 'r1',
        name: 'Push Day',
        description: 'Upper body pushing muscles - chest, shoulders, triceps',
        exercises: [
            { exerciseId: 'ex1', sets: 4, reps: 8, weight: 80, restTime: 90 },
            { exerciseId: 'ex5', sets: 3, reps: 10, weight: 25, restTime: 60 },
        ],
        createdAt: '2024-01-15',
    },
    {
        id: 'r2',
        name: 'Pull Day',
        description: 'Upper body pulling muscles - back, biceps',
        exercises: [
            { exerciseId: 'ex3', sets: 5, reps: 5, weight: 120, restTime: 120 },
            { exerciseId: 'ex4', sets: 3, reps: 10, weight: 0, restTime: 90 },
        ],
        createdAt: '2024-01-16',
    },
    {
        id: 'r3',
        name: 'Leg Day',
        description: 'Complete lower body workout',
        exercises: [{ exerciseId: 'ex2', sets: 4, reps: 8, weight: 100, restTime: 120 }],
        createdAt: '2024-01-17',
    },
];

export const mockMembers: Member[] = [
    {
        id: 'm1',
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1 (555) 123-4567',
        membershipStart: '2024-01-01',
        assignedRoutines: ['r1', 'r2', 'r3'],
        profileImage: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400',
    },
    {
        id: 'm2',
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '+1 (555) 234-5678',
        membershipStart: '2024-01-15',
        assignedRoutines: ['r1', 'r2'],
        profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    },
    {
        id: 'm3',
        name: 'Mike Williams',
        email: 'mike.w@email.com',
        phone: '+1 (555) 345-6789',
        membershipStart: '2023-12-01',
        assignedRoutines: ['r1', 'r3'],
        profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    },
];
