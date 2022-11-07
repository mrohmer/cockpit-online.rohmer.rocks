export const isDataSaveEnabled = () =>
  typeof navigator !== 'undefined'
  && 'connection' in navigator
  && (navigator as any).connection.saveData === true
