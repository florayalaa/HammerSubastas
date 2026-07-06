import { prisma } from '../configuracion/baseDatos';

function fechaDefault(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d;
}

function horaDefault(): Date {
  const d = new Date();
  d.setHours(18, 0, 0, 0);
  return d;
}

function formatFecha(d: Date | null | undefined): string {
  if (!d) return 'por confirmar';
  return new Date(d).toLocaleDateString('es-AR');
}

function formatHora(d: Date | null | undefined): string {
  if (!d) return 'por confirmar';
  return new Date(d).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
}

// Ignora tildes/mayúsculas al comparar categorías (evita que un typo de carga manual bloquee el match)
function normalizarCategoria(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase();
}

// ─── insertar item en catálogo y actualizar estados ──────────────────────────

async function insertarItemYNotificar(sol: any, catalogoId: number, subasta: any) {
  const yaExiste = await prisma.itemsCatalogo.findFirst({
    where: { producto: sol.producto },
  });
  if (yaExiste) {
    console.warn(`[Poller] producto ${sol.producto} ya está en itemsCatalogo (id ${yaExiste.identificador}), saltando insert.`);
    await prisma.extra_solicitudesVenta.update({
      where: { producto: sol.producto },
      data: { estado: 'en_subasta', fechaActualizacion: new Date() },
    });
    return;
  }

  await prisma.$transaction([
    prisma.itemsCatalogo.create({
      data: {
        catalogo: catalogoId,
        producto: sol.producto,
        precioBase: sol.precioBase,
        comision: sol.comision,
        subastado: 'no',
      },
    }),
    prisma.extra_solicitudesVenta.update({
      where: { producto: sol.producto },
      data: { estado: 'en_subasta', fechaActualizacion: new Date() },
    }),
    prisma.productos.update({
      where: { identificador: sol.producto },
      data: { disponible: 'si' },
    }),
  ]);

  const titulo = sol.productos?.descripcionCatalogo ?? 'Tu artículo';
  const fecha  = formatFecha(subasta.fecha);
  const hora   = formatHora(subasta.hora);
  const lugar  = subasta.ubicacion ?? 'Sala Principal - Hammer Subastas';

  await prisma.notificaciones.create({
    data: {
      identificadorPersona: sol.cliente,
      mensaje: `"${titulo}" fue asignado a una subasta. Fecha: ${fecha}, ${hora} hs. Lugar: ${lugar}.`,
    },
  });
}

// ─── colección (≥4 productos del mismo cliente) ───────────────────────────────

async function asignarColeccion(clienteId: number, soles: any[], responsable: number) {
  const extraExistente = await prisma.extra_subastas.findFirst({
    where: { esColeccion: true, clienteColeccion: clienteId },
    include: { subastas: { include: { catalogos: true } } },
  });

  let subasta: any;
  let catalogoId: number;

  // Reusar si existe y no está carrada
  if (extraExistente && extraExistente.subastas.estado !== 'cerrada') {
    subasta = extraExistente.subastas;
    const cat = await prisma.catalogos.findFirst({ where: { subasta: subasta.identificador } });
    catalogoId = cat?.identificador ?? (await prisma.catalogos.create({
      data: { descripcion: `Colección cliente #${clienteId}`, subasta: subasta.identificador, responsable },
    })).identificador;
  } else {
    const clienteNombre = soles[0]?.clientes?.personas?.nombre ?? `Cliente #${clienteId}`;
    subasta = await prisma.subastas.create({
      data: { fecha: fechaDefault(), hora: horaDefault(), estado: 'abierta', ubicacion: 'Sala Principal - Hammer Subastas' },
    });
    await prisma.extra_subastas.create({
      data: {
        subasta: subasta.identificador,
        titulo: `Colección ${clienteNombre}`,
        descripcion: 'Subasta de colección privada',
        esColeccion: true,
        clienteColeccion: clienteId,
      },
    });
    catalogoId = (await prisma.catalogos.create({
      data: { descripcion: `Colección ${clienteNombre}`, subasta: subasta.identificador, responsable },
    })).identificador;
  }

  for (const sol of soles) {
    await insertarItemYNotificar(sol, catalogoId, subasta);
  }
}

// ─── búsqueda de subasta con espacio para una categoría ──────────────────────

async function buscarSubastaConEspacio(categoria: string) {
  const categoriaNormalizada = normalizarCategoria(categoria);

  const extras = await prisma.extra_subastas.findMany({
    where: { esColeccion: false },
    include: {
      subastas: {
        include: { catalogos: { include: { itemsCatalogo: true } } },
      },
    },
  });

  for (const extra of extras) {
    if (normalizarCategoria(extra.categoriaBien ?? '') !== categoriaNormalizada) continue;

    const s = extra.subastas;
    const totalItems = s.catalogos.reduce((sum: number, c: any) => sum + c.itemsCatalogo.length, 0);
    if (totalItems >= 10) continue;

    let catalogo: { identificador: number } | undefined = s.catalogos[0];
    if (!catalogo) {
      const empleado = await prisma.empleados.findFirst();
      if (!empleado) continue; // no hay responsable disponible para crear el catálogo

      catalogo = await prisma.catalogos.create({
        data: { descripcion: extra.titulo, subasta: s.identificador, responsable: empleado.identificador },
      });
      console.log(`[Poller] catálogo creado automáticamente para subasta ${s.identificador} ("${extra.titulo}")`);
    }

    return { subasta: s, catalogo };
  }
  return null;
}

// ─── categoría (<4 productos) ─────────────────────────────────────────────────
// No filtra por estado — la empresa lo maneja. Usa COUNT < 10 para ver si hay espacio.

async function asignarPorCategoria(sol: any) {
  const categoria = sol.categoria ?? 'Otros';

  console.log(`[Poller] producto ${sol.producto}, categoría: "${categoria}", precioBase: ${sol.precioBase}`);

  const match = await buscarSubastaConEspacio(categoria);
  if (!match) {
    console.warn(`[Poller] sin subasta disponible para "${categoria}" (producto ${sol.producto}). Se reintentará.`);
    return;
  }

  await insertarItemYNotificar(sol, match.catalogo.identificador, match.subasta);
  console.log(`[Poller] ✓ producto ${sol.producto} insertado en catálogo ${match.catalogo.identificador} (subasta ${match.subasta.identificador})`);
}

// ─── asignación inmediata (llamada al aceptar la propuesta) ─────────────────
// Devuelve true si encontró subasta compatible y lo agregó al catálogo, false si no.

export async function intentarAsignarInmediato(sol: any): Promise<boolean> {
  const categoria = sol.categoria ?? 'Otros';

  const match = await buscarSubastaConEspacio(categoria);
  if (!match) return false;

  await insertarItemYNotificar(sol, match.catalogo.identificador, match.subasta);
  return true;
}

// ─── ciclo principal ──────────────────────────────────────────────────────────

async function asignarProductosASubastas() {
  const solicitudes = await prisma.extra_solicitudesVenta.findMany({
    where: { estado: 'a_subastar', precioBase: { not: null }, comision: { not: null } },
    include: {
      productos: true,
      clientes: { include: { personas: true } },
    },
  });

  console.log(`[Poller] solicitudes a_subastar encontradas: ${solicitudes.length}`);
  if (solicitudes.length === 0) return;

  const empleado = await prisma.empleados.findFirst();
  if (!empleado) {
    console.error('[Poller] no hay empleados en el sistema');
    return;
  }

  const porCliente = new Map<number, typeof solicitudes>();
  for (const sol of solicitudes) {
    const lista = porCliente.get(sol.cliente) ?? [];
    lista.push(sol);
    porCliente.set(sol.cliente, lista);
  }

  for (const [clienteId, soles] of porCliente) {
    try {
      if (soles.length >= 4) {
        await asignarColeccion(clienteId, soles, empleado.identificador);
        console.log(`[Poller] colección asignada para cliente ${clienteId} (${soles.length} productos)`);
      } else {
        for (const sol of soles) {
          await asignarPorCategoria(sol);
        }
      }
    } catch (err) {
      console.error(`[Poller] error para cliente ${clienteId}:`, err);
    }
  }
}

export function iniciarPollingAsignacion(intervaloMs = 10000) {
  setInterval(async () => {
    try {
      await asignarProductosASubastas();
    } catch (err) {
      console.error('[Poller] error general:', err);
    }
  }, intervaloMs);
  console.log(`[Poller] asignación iniciado (cada ${intervaloMs / 1000}s)`);
}
