'use client';

import { Button } from '@/src/components/ui/button';
import { Label } from '@/src/components/ui/label';
import { useUploadVideo } from '@/src/hooks/useUploadVideo';
import type { ChangeEvent } from 'react';
import { useRef, useState } from 'react';

interface VideoUploaderProps {
    exerciseId: string;
    onUploadSuccess?: (uploadId: string) => void;
}

export const VideoUploader = ({ exerciseId, onUploadSuccess }: VideoUploaderProps) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

    const uploadMutation = useUploadVideo(exerciseId, {
        onSuccess: (uploadId) => onUploadSuccess?.(uploadId),
    });

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            setSelectedFileName(null);
            return;
        }

        setSelectedFileName(file.name);
        uploadMutation.mutate(file);
    };

    return (
        <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
                Vídeo del ejercicio (opcional)
            </Label>
            <p className="text-xs text-muted-foreground">
                Un solo vídeo. Formato MP4, WebM o similar. El archivo se sube a Supabase Storage.
            </p>
            <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleFileChange}
                aria-label="Seleccionar vídeo del ejercicio"
            />
            <div className="flex items-center gap-3">
                <Button
                    type="button"
                    variant="outline"
                    className="cursor-pointer"
                    disabled={uploadMutation.isPending}
                    onClick={() => fileInputRef.current?.click()}
                >
                    {uploadMutation.isPending ? 'Subiendo vídeo...' : 'Seleccionar vídeo'}
                </Button>
                {selectedFileName && (
                    <span className="max-w-[180px] truncate text-xs text-muted-foreground">
                        {selectedFileName}
                    </span>
                )}
            </div>
            {uploadMutation.isError && (
                <p className="text-xs text-red-600">
                    {uploadMutation.error instanceof Error
                        ? uploadMutation.error.message
                        : 'Error al subir el vídeo'}
                </p>
            )}
            {uploadMutation.isSuccess && (
                <p className="text-xs text-green-600">
                    Vídeo subido correctamente.
                </p>
            )}
        </div>
    );
};
