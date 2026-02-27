import { Dumbbell } from 'lucide-react';

export default function MobileHeader() {
    return (
        <header className="md:hidden bg-white border-b px-4 py-3 flex items-center justify-center">
            <div className="flex items-center gap-2">
                <Dumbbell className="w-6 h-6 text-blue-600" />
                <h1 className="font-semibold text-gray-900">FitPro</h1>
            </div>
        </header>
    );
}
