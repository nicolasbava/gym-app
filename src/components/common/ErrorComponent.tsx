import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';

export const ErrorComponent = ({
    message,
    redirectTo = '/home',
}: {
    message: string;
    redirectTo?: string;
}) => {
    return (
        <div className="flex items-center justify-center min-h-[calc(80vh-150px)]">
            <div className="text-center">
                <div className="text-red-600 text-2xl font-bold flex items-center justify-center gap-2">
                    <AlertTriangle className="h-6 w-6" />
                    Ups, algo salió mal
                </div>
                <p className="text-gray-600 text-lg mb-2">{message}</p>
                <Button variant="outline" size="sm" asChild>
                    <Link href={redirectTo}>Volver al gym</Link>
                </Button>
            </div>
        </div>
    );
};

export default ErrorComponent;
