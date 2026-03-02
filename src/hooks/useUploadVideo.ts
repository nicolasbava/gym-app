import { setExerciseMuxUploadId } from '@/src/app/actions/exercises';
import { createUploadUrl } from '@/src/app/actions/mux-action';
import { useMutation } from '@tanstack/react-query';

export const useUploadVideo = (
    exerciseId: string,
    options?: { onSuccess?: (uploadId: string) => void },
) => {
    return useMutation({
        mutationFn: async (file: File) => {
            const { url, uploadId } = await createUploadUrl();
            console.log('>>>> url', url);
            console.log('>>>> uploadId', uploadId);
            const response = await fetch(url, {
                method: 'PUT',
                body: file,
                headers: { 'Content-Type': file.type },
            });

            if (!response.ok) {
                throw new Error('Failed to upload video');
            }

            await setExerciseMuxUploadId(exerciseId, uploadId);

            return uploadId;
        },
        onSuccess: (uploadId) => {
            options?.onSuccess?.(uploadId);
        },
    });
};


