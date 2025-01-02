import express from 'express';
import { checkAccess, addNewBook } from '../controllers/blockchainController.js';

const router = express.Router();

router.get('/hasAccess/:bookHash/:userAddress', checkAccess);
router.post('/addBook', addNewBook);

export default router;