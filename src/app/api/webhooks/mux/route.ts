import { supabaseAdmin } from '@/src/utils/supabase/admin';
import Mux from '@mux/mux-node';

const webhookSecret = process.env.MUX_WEBHOOK_SECRET ?? process.env.NEXT_PUBLIC_MUX_WEBHOOK_SECRET;

export async function POST(req: Request) {
    if (!webhookSecret) {
        return new Response('Webhook secret not configured', { status: 500 });
    }

    const rawBody = await req.text();
    const signature = req.headers.get('mux-signature');
    if (!signature) {
        return new Response('Missing Mux-Signature header', { status: 401 });
    }

    console.log('VENGO POR AQUI 1');

    const mux = new Mux({ webhookSecret });
    try {
        mux.webhooks.verifySignature(rawBody, { 'mux-signature': signature }, webhookSecret);
    } catch {
        return new Response('Invalid webhook signature', { status: 401 });
    }

    const event = JSON.parse(rawBody) as {
        type: string;
        data: { id: string; playback_ids?: Array<{ id: string }>; upload_id?: string };
    };
    console.log('VENGO POR AQUI 2');

    if (event.type === 'video.asset.ready') {
        const playbackIds = event.data.playback_ids;
        const playbackId = playbackIds?.[0]?.id;
        const uploadId = event.data.upload_id;

        if (playbackId && uploadId) {
            const { error } = await supabaseAdmin
                .from('exercises')
                .update({
                    mux_playback_id: playbackId,
                    mux_status: 'ready',
                })
                .eq('mux_upload_id', uploadId);
            console.log('VENGO POR AQUI EXITO UPDATE');
            console.log('uploadId', uploadId);

            if (error) {
                console.error('Mux webhook: Supabase update failed', error);
            }
        }
    }

    return new Response('OK', { status: 200 });
}
