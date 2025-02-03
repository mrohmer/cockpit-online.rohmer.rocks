import {cleanSessionName} from '../../utils/clean-session-name';
import {dev} from '$app/environment';

const getImage = async (url: string): Promise<Buffer> => {
  const response = await fetch(url);

  if (response.status !== 200) {
    throw new Error(String(response.status));
  }

  return response.arrayBuffer();
}
export const queryImage = async (sessionName: string, imageName: string): Promise<Buffer> => {
  if (dev && sessionName === 'fake') {
    return getImage(`https://cataas.com/cat/says/${imageName}?width=500&height=500`);
  }

  return getImage(`https://online.cockpit-xp.de/${cleanSessionName(sessionName)}/${imageName}`)
};
