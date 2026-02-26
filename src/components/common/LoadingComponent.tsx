export const LoadingComponent = ({ message }: { message?: string }) => {
    return (
        <div className="flex items-center justify-center min-h-[calc(20vh)]">
            <div className="text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando {message}...</p>
            </div>
        </div>
    );
};

export default LoadingComponent;
