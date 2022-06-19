import axios from 'axios';
import type {Race} from '../models/race';
import type {ApiResponse} from '../models/api-response';
import type {Slot} from '../models/slot';

export const queryImage = async (sessionName: string, imageName: string): Promise<Buffer> => {
  sessionName = sessionName.trim().replace(/(^\/*)|(\/*$)/g, '');
  const response = await axios.get<Buffer>(`https://online.cockpit-xp.de/${sessionName}/${imageName}`, {
    responseType: 'arraybuffer'
  });

  if (response.status !== 200) {
    throw new Error(String(response.status));
  }

  return response.data;
};
