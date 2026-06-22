import { Router, Request, Response } from 'express';
import { articlesController } from './articulos.controller';
import { requireAuth } from '../../middlewares/autenticacion';
import { prisma } from '../../configuracion/baseDatos';

const router = Router();

router.get('/:id/foto', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).end();
  const foto = await prisma.fotos.findFirst({
    where: { producto: id },
    orderBy: { identificador: 'asc' },
  });
  if (!foto?.foto) {
    console.log(`[foto] producto ${id}: no encontrada`);
    return res.status(404).end();
  }
  const buf = Buffer.from(foto.foto);
  console.log(`[foto] producto ${id}: ${buf.length} bytes, byte0=0x${buf[0]?.toString(16)}`);

  const mime =
    buf[0] === 0x52 && buf[8] === 0x57 ? 'image/webp' :
    buf[0] === 0x89 && buf[1] === 0x50 ? 'image/png' :
    buf[0] === 0xFF && buf[1] === 0xD8 ? 'image/jpeg' : 'image/jpeg';
  res.setHeader('Content-Type', mime);
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.end(buf);
});

router.post('/admin/:id/aprobar', articlesController.aprobarSolicitud.bind(articlesController));
router.post('/enviar', requireAuth, articlesController.submitArticle.bind(articlesController));
router.get('/mis-articulos', requireAuth, articlesController.getMyArticles.bind(articlesController));
router.post('/:id/aceptar-propuesta', requireAuth, articlesController.aceptarPropuesta.bind(articlesController));
router.post('/:id/rechazar-propuesta', requireAuth, articlesController.rechazarPropuesta.bind(articlesController));
router.delete('/:id', requireAuth, articlesController.deleteArticle.bind(articlesController));

export const articulosRoutes = router;
