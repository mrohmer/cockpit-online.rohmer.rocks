import type {RequestHandler} from '@sveltejs/kit';
import {getImage} from './_get-image';

export const get: RequestHandler = getImage(
  ({slotId, extension}) => `fahrzeugbild(${slotId}).${extension}`
)
