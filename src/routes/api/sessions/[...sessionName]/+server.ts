import type {RequestHandler} from '@sveltejs/kit';
import {error} from '@sveltejs/kit';
import {queryRaceData} from '$lib/server/service/race-data.service';
import type {Race} from '$lib/models/race';
import {INCLUDE_IMAGES} from '$env/static/private';


export const GET: RequestHandler = async ({params}) => {
  let race: Race;
  try {
    race = await queryRaceData(params.sessionName!, INCLUDE_IMAGES === 'true');
  } catch (e: any) {
    if (e.message === '404') {
      error(404);
    }
    console.error(e.message ?? e);
    error(500);
  }


  if (!race) {
    error(404);
  }

  return new Response(JSON.stringify({date: new Date(), data: race}), {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Request-Headers': 'Vary',
      'Content-Type': 'application/json',
      'Netlify-CDN-Cache-Control': 'public, durable, max-age=1, s-maxage=1',
      'Cache-Control': 'public, max-age=1, s-maxage=1'
    }
  });
}
export const OPTIONS: RequestHandler = async () => new Response('', {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Request-Headers': 'Vary',
    'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS',
  }
});
