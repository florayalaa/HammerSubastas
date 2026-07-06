// La base guarda fecha/hora de subastas como hora de pared de Argentina, pero el
// driver la serializa como si fuera UTC (ej: "9:55" queda como "09:55:00.000Z").
// El proceso corre en UTC real (Azure), así que para comparar contra "ahora" hay que
// retroceder el reloj real 3 horas (Argentina no tiene horario de verano).
const OFFSET_MS_ARGENTINA = 3 * 60 * 60 * 1000;

export function ahoraComparable(): Date {
  return new Date(Date.now() - OFFSET_MS_ARGENTINA);
}
