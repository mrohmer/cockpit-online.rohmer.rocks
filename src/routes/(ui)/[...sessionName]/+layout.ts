import type { LayoutLoad } from "./$types";
import {error} from '@sveltejs/kit';
import {cleanSessionName} from '$lib/utils/clean-session-name';
import type {Race} from '$lib/models/race';
import type {ApiData} from '$lib/models/api-data';

export const load: LayoutLoad = async ({params: {sessionName}, fetch, depends}) => {
  if (!sessionName) {
    error(400, 'Session nicht gefunden 🤷');
  }

  depends(`session:${sessionName}`);

  let response: any
  try {
    response = await fetch(`/api/sessions/${cleanSessionName(sessionName)}`);
  } catch (e: any) {
    if (e?.request?.status >= 300 && e?.request?.status < 500) {
      error(e?.request?.status, 'Session nicht gefunden 🤷');
    }
    error(500);
  }

  let data: ApiData<Race>
  try {
    data = await response.json();
  } catch(e) {
    error(404, 'Session nicht gefunden 🤷');
  }

  if (!data?.data?.slots?.length) {
    error(404, 'Session nicht gefunden 🤷');
  }

  return data;
}
