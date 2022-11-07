import type {PageLoad} from './$types';

export const load: PageLoad = async ({fetch}) => {
  const response = await fetch('/api/sessions/public');
  const publicSessions = await response.json();

  return {publicSessions};
}
