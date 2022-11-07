import type {RequestHandler} from '@sveltejs/kit';
import {getImage} from '../get-image';

export const GET: RequestHandler = getImage(
  ({slotId, extension}) => `fahrerbild(${slotId}).${extension}`
)
