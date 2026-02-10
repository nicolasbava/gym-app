import { Loader2 } from 'lucide-react';

export default function ExercisesLoading() {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900">
                <Loader2 className="h-10 w-10 text-gray-900" />
            </div>
        </div>
    );
}
