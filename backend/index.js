import express from 'express';
import dotenv from 'dotenv';
import { authRoutes, userRoutes, bookRoutes, blockchainRoutes } from './routes/index.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/books', bookRoutes);
app.use('/blockchain', blockchainRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
