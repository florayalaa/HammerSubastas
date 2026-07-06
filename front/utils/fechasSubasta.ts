// El backend guarda fecha/hora de subastas como "hora de pared" (wall-clock) pero
// etiquetada como UTC (ej: "9:55" queda como "09:55:00.000Z" aunque en realidad
// significa las 9:55 en el huso horario local del dispositivo, no UTC real).
// Estas funciones reconstruyen el instante real correcto para poder comparar con `new Date()`.

export function comoInstanteLocal(iso?: string | null): Date | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds());
}

// Combina una fecha (solo día) con una hora (solo horario) — ambas etiquetadas como UTC —
// en un único instante local real.
export function combinarFechaYHora(fechaIso?: string | null, horaIso?: string | null): Date | null {
  if (!fechaIso) return null;
  const f = new Date(fechaIso);
  if (isNaN(f.getTime())) return null;
  let hh = 0, mm = 0, ss = 0;
  if (horaIso) {
    const h = new Date(horaIso);
    if (!isNaN(h.getTime())) {
      hh = h.getUTCHours();
      mm = h.getUTCMinutes();
      ss = h.getUTCSeconds();
    }
  }
  return new Date(f.getUTCFullYear(), f.getUTCMonth(), f.getUTCDate(), hh, mm, ss);
}
