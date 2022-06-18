import type {RequestHandler} from '@sveltejs/kit';
import {queryRaceData} from '$lib/service/race-data.service';

export const get: RequestHandler = async ({params}) => {
  try {
    const race = await queryRaceData(params.sessionName);

    if (!race) {
      return {
        status: 404,
      }
    }

    return {
      body: race as any,
    };
  } catch (e: any) {
    if (e.message === '404') {
      return {
        status: 404,
      }
    }
    console.log(e.message ?? e);
    return {
      status: 500,
    }
  }
}
