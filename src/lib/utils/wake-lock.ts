import {browser} from '$app/environment';

export const isWakeLockSupported = () => browser && 'wakeLock' in navigator;
let wakeLock: any;

let requesting = false;
let releasing = false;

export const requestWakeLock = async () => {
  if (!isWakeLockSupported() || requesting || wakeLock) {
    return;
  }
  requesting = true;
  try {
    wakeLock = await (navigator as any).wakeLock.request('screen');
  } finally {
    requesting = false;
  }
}
export const releaseWakeLock = async () => {
  if (releasing || !wakeLock) {
    return;
  }
  releasing = true;
  try {
    await wakeLock.release();
    wakeLock = undefined;
  } finally {
    releasing = false;
  }
}
