import axios from 'axios';
import type {Race} from '$lib/models/race';
import {cleanSessionName} from '$lib/utils/clean-session-name';

export class RaceDataLoader {
  public async load(name: string) {
    const response = await axios.get<Race>(`/api/${cleanSessionName(name)}`);

    return response.data as Race;
  }
}
