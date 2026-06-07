import { Router } from 'express';
import { articlesController } from './articles.controller';
import { requireAuth } from '../../middlewares/auth';

const router = Router();

router.post('/submit', requireAuth, articlesController.submitArticle.bind(articlesController));
router.get('/my-articles', requireAuth, articlesController.getMyArticles.bind(articlesController));

export const articlesRoutes = router;
