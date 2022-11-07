import type {RequestHandler} from '@sveltejs/kit';
import {queryRaceData} from '$lib/service/race-data.service';
import {error} from '@sveltejs/kit';

export const GET: RequestHandler = async ({params}) => {
  try {
    const race = await queryRaceData(params.sessionName!);

    if (!race) {
      throw error(404);
    }

    return new Response(JSON.stringify(race));
  } catch (e: any) {
    if (e.message === '404') {
      throw error(404);
    }
    console.log(e.message ?? e);
    throw error(500);
  }
}
