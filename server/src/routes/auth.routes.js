import { Router } from 'express';
import { loginHandler, getMeHandler, logoutHandler } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { loginSchema } from '../validators/auth.validator.js';

const router = Router();

router.post('/login', validate(loginSchema), loginHandler);
router.get('/me', authenticate, getMeHandler);
router.post('/logout', authenticate, logoutHandler);

export default router;
