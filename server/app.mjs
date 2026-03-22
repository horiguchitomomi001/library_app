import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import cors from 'cors';
import authRouter from './routes/authRoutes.mjs';
import booksRouter from './routes/booksRoutes.mjs';
import loansRouter from './routes/loansRoutes.mjs';
import reservationsRouter from './routes/reservationsRoutes.mjs';
import usersRouter from './routes/usersRoutes.mjs';

const app = express();
const PORT = 3000;

// ===== middleware =====
app.use(cors());
app.use(express.json());
app.use('/auth', authRouter);
app.use('/books', booksRouter);
app.use('/loans', loansRouter);
app.use('/reservations', reservationsRouter);
app.use('/users', usersRouter);
app.use('/users/:userId/reservations', usersRouter);
app.use('/users/:userId/loans', usersRouter);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
