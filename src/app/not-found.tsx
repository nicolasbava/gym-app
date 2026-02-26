import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)]">
            <h2>Ups, esta parte del gym no existe, pero puedes volver al inicio.</h2>
            <Link href="/">Volver al inicio</Link>
        </div>
    );
}
