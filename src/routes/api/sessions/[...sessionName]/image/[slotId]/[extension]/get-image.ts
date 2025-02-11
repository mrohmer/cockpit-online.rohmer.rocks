import type {RequestHandler} from '@sveltejs/kit';
import {queryImage} from '$lib/server/service/image.service';
import sharp from 'sharp';
import {error} from '@sveltejs/kit';
import {INCLUDE_IMAGES} from '$env/static/private';

type ImageNameBuilderFn = (data: Record<'slotId'|'extension', string>) => string

const SUPPORTED_EXTENSIONS = [
  'jpg',
  'jpeg',
  'png',
  'svg',
  'gif',
  'webp',
]

export const getImage: (imageNameBuilder: ImageNameBuilderFn) => RequestHandler = (imageNameBuilder: ImageNameBuilderFn) => {
  return async ({params}) => {
    if (INCLUDE_IMAGES !== 'true') {
      error(404);
    }

    const {sessionName, slotId, extension} = params as Record<string, any>;

    if (!SUPPORTED_EXTENSIONS.includes(extension)) {
      error(404);
    }
    if (sessionName?.trim().length <= 3) {
      error(404);
    }
    if (!/^[1-8]$/.test(slotId)) {
      error(404);
    }

    try {
      const data = await queryImage(sessionName, imageNameBuilder({slotId, extension}));

      const body = await sharp(data)
        .resize({
          width: 56,
          height: 56,
          fit: 'contain',
          fastShrinkOnLoad: true,
          withoutEnlargement: true,
        })
        .webp({nearLossless: true})
        .toBuffer();

      return new Response(body, {
        headers: {
          'Content-Type': 'image/webp',
          'Netlify-CDN-Cache-Control': 'public, durable, max-age=18000, s-maxage=18000',
          'Cache-Control': 'public, max-age=18000, s-maxage=18000'
        },
      });
    } catch (e: any) {
      if (e.response?.status && e.response?.status >= 400) {
        error(e.response.status);
      }

      error(500);
    }
  }
}
