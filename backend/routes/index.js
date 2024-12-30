import express from 'express';

import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import bookRoutes from './bookRoutes.js';
import pinataRoutes from './pinataRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/books', bookRoutes);
router.use('/pinata', pinataRoutes);

export default router;
