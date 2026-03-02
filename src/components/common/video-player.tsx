import MuxPlayer from '@mux/mux-player-react';

export function VideoPlayer({ playbackId, title }: { playbackId: string; title: string }) {
    if (!playbackId)
        return (
            <div className="bg-gray-200 aspect-video flex items-center justify-center">
                Procesando...
            </div>
        );

    return (
        <MuxPlayer
            playbackId={playbackId}
            metadata={{ video_title: title }}
            accentColor="#ea580c" // Color de tu marca
            className="w-full aspect-video rounded-xl"
        />
    );
}
