import { Router } from 'express';
import { countriesController } from './countries.controller';

const router = Router();

// Endpoint público para alimentar el selector de la App Mobile
router.get('/', countriesController.getAll);

export default router;