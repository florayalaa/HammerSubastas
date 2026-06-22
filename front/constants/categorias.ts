export interface Categoria {
  valor: string;
  ejemplos: string;
}

export const CATEGORIAS: Categoria[] = [
  { valor: 'Arte',                   ejemplos: 'pinturas, esculturas, fotografías artísticas' },
  { valor: 'Joyería',                ejemplos: 'anillos, collares, pulseras, relojes de lujo' },
  { valor: 'Antigüedades',           ejemplos: 'muebles, porcelanas, objetos de época' },
  { valor: 'Numismática',            ejemplos: 'monedas y billetes de colección' },
  { valor: 'Filatelia',              ejemplos: 'estampillas y sellos postales' },
  { valor: 'Vinos y Spirits',        ejemplos: 'botellas de colección, añadas especiales' },
  { valor: 'Libros y Manuscritos',   ejemplos: 'primeras ediciones, documentos históricos' },
  { valor: 'Instrumentos Musicales', ejemplos: 'violines, guitarras históricas' },
  { valor: 'Tecnología Vintage',     ejemplos: 'cámaras, radios, consolas antiguas' },
  { valor: 'Otros',                  ejemplos: 'cualquier bien que no encaje en las anteriores' },
];
