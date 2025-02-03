import type {Race} from '../../models/race';
import type {ApiResponse} from '../../models/api-response';
import type {Slot} from '../../models/slot';
import {dev} from '$app/environment';
import {getFakeRaceData} from './fake-race-data.service';

const STATUS_MAP: Record<Race['status'], string> = {
  running: 'gruen',
  starting: 'sc',
  stopped: 'rot',
}
const PENALTY_MAP: Record<Required<Slot>['penalty'], string> = {
  unknown: '/strafe.png',
  pit: '/boxenstrafe.png',
}

const parseInteger = (value: string | undefined): number | undefined => value?.trim() ? parseInt(value) : undefined;
const parseFloatingPoint = (value: string | undefined): number | undefined => value?.trim() ? parseFloat(value.replace(',', '.')) : undefined;
const parseImage = (sessionName: string, slotId: string, type: 'car' | 'driver', value: string) => {
  if (!value?.trim()) {
    return undefined;
  }

  const result = /src='(?<src>[a-zA-Z\d\-\/()]*).(?<extension>[a-zA-Z]*)\?t=[0-9]*'/.exec(value.trim());

  if (!result?.groups?.extension) {
    return undefined;
  }

  return `/api/sessions/${sessionName}/image/${slotId}/${result.groups.extension}/${type}.webp`;
};
const parseRemainingGas = (value: string): number | undefined => {
  if (!value?.trim()) {
    return undefined;
  }

  const result = /width='(?<width>[\d.]*)%'/.exec(value.trim());
  const float = parseFloatingPoint(result?.groups?.width);

  if (!float) {
    return undefined;
  }

  return float / 100;
};

const mapSlot = (sessionName: string, id: string, response: ApiResponse): Slot => {
  const slotId = response[`id(${Number(id)})`]

  const lastLap: Slot['lastLap'] = {
    time: parseFloatingPoint(response[`rundenzeit(${Number(id)})`]),
  };
  const fastestLap: Slot['fastestLap'] = {
    lap: parseInteger(response[`schnellsterunderd(${Number(id)})`]),
    time: parseFloatingPoint(response[`schnellsterunde(${Number(id)})`]),
  };
  const car: Slot['car'] = {
    name: response[`fahrzeug(${Number(id)})`],
    image: parseImage(sessionName, slotId, 'car', response[`fahrzeugbild(${Number(id)})`])
  }

  return {
    id: slotId,
    name: response[`fahrer(${Number(id)})`]!,
    car: car.image || car.name ? car : undefined,
    lastLap: lastLap.time ? lastLap : undefined,
    fastestLap: fastestLap.lap || fastestLap.time ? fastestLap : undefined,
    image: parseImage(sessionName, slotId, 'driver', response[`fahrerbild(${Number(id)})`]),
    inPit: !response[`pitin(${Number(id)})`]?.includes('blank.png'),
    lap: parseInteger(response[`runde(${Number(id)})`]),
    lapsToGo: parseInteger(response[`restrunden(${Number(id)})`]),
    position: parseInteger(response[`position(${Number(id)})`]),
    remainingGas: parseRemainingGas(response[`tankbar(${Number(id)})`]),
    penalty: Object.entries(PENALTY_MAP)
      .find(([, image]) => response[`bestrafung(${Number(id)})`]?.includes(image))?.[0] as Slot['penalty'],
  }
}
const mapThatBullshitResponseToASanesPeopleDataVersion = (sessionName: string, response: ApiResponse): Race => {
  const slots = Object.keys(response)
    .filter(key => key.startsWith('id'))
    .map(key => /id\((?<id>\d*)\)/.exec(key)?.groups?.id!)
    .filter(key => !!key)
    .map(id => mapSlot(sessionName, id, response))
    .sort(({position: a}, {position: b}) => Math.sign((a ?? 0) - (b ?? 0)))
  ;

  const status = Object
    .entries(STATUS_MAP)
    .find(([, color]) => response['rennstatus(0)']?.includes(`ampel-${color}`))
    ?.[0] as Race['status'];

  return {
    name: response['eventname(0)'],
    lapsToGo: parseInteger(response['sollrennrunden(0)']),
    mode: response['rennmodus(0)'],
    status: status ?? 'stopped',
    slots,
    time: response['rennzeit(0)'],
  };
}
const tryParseJson = <T>(data: string): T|undefined => {
  try {
    return JSON.parse(data);
  } catch (e) {
    return undefined;
  }
}
export const queryRaceData = async (sessionName: string): Promise<Race> => {
  if (dev && sessionName === 'fake') {
    return getFakeRaceData(sessionName);
  }
  const response = await fetch(
    `https://online.cockpit-xp.de/_system/request/webrequester.php?sessionname=${sessionName}&time=${+new Date() / 1000}`
  );

  const data = await response.text();
  const json = tryParseJson<ApiResponse>(data);

  const isValidData = json && !Array.isArray(json);
  if (response.status !== 200 || !isValidData) {
    throw new Error(String(!isValidData ? 404 : response.status));
  }

  return mapThatBullshitResponseToASanesPeopleDataVersion(sessionName, json);
};
