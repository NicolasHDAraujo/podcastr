export function convertDurationToTimeString(duration: number) {
  const hours = Math.floor(duration / 3600); // ou / (60 * 60)
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;

  const finalResult = [hours , minutes , seconds]
    .map(unit => String(unit).padStart(2, '0'))//hora minuto e segundo sempre vai ter dois digitos
    .join(':');

  return finalResult
}