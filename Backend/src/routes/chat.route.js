import express from 'express';
import { jwtVerify } from '../middleware/auth.middleware.js';
import { getStreamToken } from '../controllers/chat.controller.js';

const router = express.Router();

router.route('/token').get(jwtVerify,getStreamToken);

export default router;