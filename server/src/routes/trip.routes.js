import { Router } from 'express';
import { HTTP_STATUS } from '../constants/httpStatus.js';

const router = Router();

router.all('*', (req, res) => {
  res.status(HTTP_STATUS.NOT_IMPLEMENTED).json({
    success: false,
    message: 'Trip module will be implemented in the next phase',
    errors: [],
  });
});

export default router;
