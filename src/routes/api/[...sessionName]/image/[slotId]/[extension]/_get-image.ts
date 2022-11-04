import type {RequestHandler} from '@sveltejs/kit';
import {queryImage} from '$lib/service/image.service';
import type {AxiosError} from 'axios';
import sharp from 'sharp';

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
    const {sessionName, slotId, extension} = params;

    if (!SUPPORTED_EXTENSIONS.includes(extension)) {
      return {
        status: 404,
      };
    }
    if (sessionName?.trim().length <= 3) {
      return {
        status: 404,
      };
    }
    if (!/^[1-8]$/.test(slotId)) {
      return {
        status: 404,
      };
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

      return {
        headers: {
          'Content-Type': 'image/webp',
          'Cache-Control': 'max-age=3600, s-max-age=3600'
        },
        body,
      }
    } catch (e: any|AxiosError) {
      if (e.response?.status && e.response?.status >= 400) {
        return {
          status: e.response.status,
        };
      }

      return {status: 500};
    }
  }
}
