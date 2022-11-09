import type {RequestHandler} from '@sveltejs/kit';
import {queryRaceData} from '$lib/service/race-data.service';
import {error} from '@sveltejs/kit';
import type {Race} from '$lib/models/race';

export const GET: RequestHandler = async ({params}) => {
  let race: Race;
  try {
    race = await queryRaceData(params.sessionName!);
  } catch (e: any) {
    if (e.message === '404') {
      throw error(404);
    }
    console.error(e.message ?? e);
    throw error(500);
  }


  if (!race) {
    throw error(404);
  }

  return new Response(JSON.stringify({date: new Date(), data: race}));
}
