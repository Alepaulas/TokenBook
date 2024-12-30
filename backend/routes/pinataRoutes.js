import express from 'express';
import { uploadBook, createBookGender, listBooks, addBookToGender } from '../controllers/pinataController.js';

const router = express.Router();

router.post('/upload', uploadBook);
router.post('/create-gender', createBookGender);
router.get('/list-books', listBooks);
router.put('/add-book-to-gender', addBookToGender);

export default router;
