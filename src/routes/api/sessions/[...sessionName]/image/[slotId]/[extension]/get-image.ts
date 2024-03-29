import type {RequestHandler} from '@sveltejs/kit';
import {queryImage} from '$lib/service/image.service';
import type {AxiosError} from 'axios';
import sharp from 'sharp';
import {error} from '@sveltejs/kit';

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
    const {sessionName, slotId, extension} = params as Record<string, any>;

    if (!SUPPORTED_EXTENSIONS.includes(extension)) {
      throw error(404);
    }
    if (sessionName?.trim().length <= 3) {
      throw error(404);
    }
    if (!/^[1-8]$/.test(slotId)) {
      throw error(404);
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
          'Cache-Control': 'max-age=3600, s-max-age=3600'
        },
      });
    } catch (e: any|AxiosError) {
      if (e.response?.status && e.response?.status >= 400) {
        throw error(e.response.status);
      }

      throw error(500);
    }
  }
}
