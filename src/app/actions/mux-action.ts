// app/actions/mux-actions.ts
"use server"

import Mux from '@mux/mux-node';

const { video } = new Mux({
  tokenId: process.env.NEXT_PUBLIC_MUX_TOKEN_ID,
  tokenSecret: process.env.NEXT_PUBLIC_MUX_TOKEN_SECRET,
});

export async function createUploadUrl() {
  const upload = await video.uploads.create({
    new_asset_settings: { playback_policy: ['public'] },
    cors_origin: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000', // En prod usa tu dominio
  });

  return {
    uploadId: upload.id,
    url: upload.url, // Esta es la URL temporal para el cliente
  };
}