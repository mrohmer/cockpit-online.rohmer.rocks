import type {Race} from '../models/race';
import type {Slot} from '../models/slot';

const getSlot = (sessionName: string, slotId: number): Slot => {
  const lastLap: Slot['lastLap'] = {
    time: +((slotId * 1.222).toFixed(3)),
  };
  const fastestLap: Slot['fastestLap'] = {
    lap: slotId * 11,
    time: +((slotId * 1.111).toFixed(3)),
  };
  const car: Slot['car'] = {
    name: `Auto ${slotId}`,
    image: `/api/sessions/${sessionName}/image/${slotId}/jpg/car.webp`
  }

  const remainingGas = Math.floor(Math.abs(((+new Date() / 1000 + 82 * slotId) % 50) - 25) * 4) / 100;
  const penalty = Math.max(Math.min(Math.floor(Math.abs((+new Date() / 1000 + 3 * slotId) % 20) / 5), 4), 0);

  return {
    id: String(slotId),
    name: `Fahrer ${slotId}`,
    car: car.image || car.name ? car : undefined,
    lastLap: lastLap.time ? lastLap : undefined,
    fastestLap: fastestLap.lap || fastestLap.time ? fastestLap : undefined,
    image: `/api/sessions/${sessionName}/image/${slotId}/jpg/driver.webp`,
    inPit: false,
    lap: slotId * 22,
    lapsToGo: 100 - slotId * 22,
    position: slotId,
    remainingGas,
    penalty: [undefined, 'unknown', undefined, 'pit'][penalty] as any,
  }
}
export const getFakeRaceData = async (sessionName: string): Promise<Race> => {
  const slots = [1, 2, 3, 4, 5, 6]
    .map(id => getSlot(sessionName, id))
    .sort(({position: a}, {position: b}) => Math.sign((a ?? 0) - (b ?? 0)))
  ;

  return {
    name: 'Fake Rennen',
    lapsToGo: 100,
    mode: 'Freies Training',
    status: 'stopped',
    slots,
    time: '00:00:00',
  };
};
