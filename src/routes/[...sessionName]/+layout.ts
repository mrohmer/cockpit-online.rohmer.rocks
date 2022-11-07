import type { LayoutLoad } from "./$types";
import {error} from '@sveltejs/kit';
import {cleanSessionName} from '$lib/utils/clean-session-name';
import type {Race} from '$lib/models/race';

export const load: LayoutLoad = async ({params: {sessionName}, fetch, depends}) => {
  if (!sessionName) {
    throw error(400, 'Session nicht gefunden 🤷');
  }

  depends(`session:${sessionName}`);

  let response: any
  try {
    response = await fetch(`/api/sessions/${cleanSessionName(sessionName)}`);
  } catch (e: any) {
    if (e?.request?.status >= 300 && e?.request?.status < 500) {
      throw error(e?.request?.status, 'Session nicht gefunden 🤷')
    }
    throw error(500)
  }

  let data: Race
  try {
    data = await response.json();
  } catch(e) {
    throw error(404, 'Session nicht gefunden 🤷');
  }

  if (!data) {
    throw error(404, 'Session nicht gefunden 🤷')
  }

  return data;
}
