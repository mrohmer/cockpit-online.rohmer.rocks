interface GenericSettings<K extends string, V> {
  key: K;
  value: V;
}


export type Settings = GenericSettings<'wakeLock', boolean>;
