import type {PageLoad} from "./$types";
import {error} from '@sveltejs/kit';
import type {Race} from '$lib/models/race';

export const load: PageLoad = async ({params: {sessionName, slotId}, parent}) => {
  if (!sessionName || !slotId) {
    throw error(400, 'Session nicht gefunden 🤷');
  }

  const data = await parent() as Race;

  if (!data?.slots) {
    throw error(400, 'Session nicht gefunden 🤷');
  }

  if (!data.slots.find(slot => slot.id === slotId)) {
    throw error(404, 'Slot nicht gefunden 🤷')
  }

  return data;
}
