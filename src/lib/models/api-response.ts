type Stringify<T extends string | number | bigint | boolean | null | undefined> = T|`${T}`;
type KeySlot = `${'bestrafung' |
  'fahrer' |
  'fahrerbild' |
  'fahrzeug' |
  'fahrzeugbild' |
  'id' |
  'pitin' |
  'position' |
  'restrunden' |
  'runde' |
  'rundenzeit' |
  'schnellsterunde' |
  'schnellsterunderd' |
  'tankbar'}(${Stringify<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | number>})`;
type KeyGlobal = `${'eventname' |
  'rennmodus' |
  'rennstatus' |
  'rennzeit' |
  'sollrennrunden'}(0)`;
export type ApiResponse = Record<KeySlot | KeyGlobal, string>
