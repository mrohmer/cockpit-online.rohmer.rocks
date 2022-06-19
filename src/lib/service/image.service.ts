import axios from 'axios';
import type {Race} from '../models/race';
import type {ApiResponse} from '../models/api-response';
import type {Slot} from '../models/slot';
import {cleanSessionName} from '../utils/clean-session-name';

export const queryImage = async (sessionName: string, imageName: string): Promise<Buffer> => {
  const response = await axios.get<Buffer>(`https://online.cockpit-xp.de/${cleanSessionName(sessionName)}/${imageName}`, {
    responseType: 'arraybuffer'
  });

  if (response.status !== 200) {
    throw new Error(String(response.status));
  }

  return response.data;
};
