interface GenericSettings<K extends string, V> {
  key: K;
  value: V;
}


export type Settings =
  GenericSettings<'wakeLock', boolean>
  | GenericSettings<`slotDetailVibration${'Empty' | 'Full'}`, boolean>
  | GenericSettings<`slotDetailVibration${'Empty' | 'Full'}Threshold`, number>;
