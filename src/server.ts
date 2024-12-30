import express from 'express';
import cors from 'cors';
import errorHandler from './middlewares/errorHandler';
import authRouter from './routes/auth';
const port = process.env.PORT || 3000;
const app = express();

// body-parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cors middleware
app.use(cors());

// routes
app.use('/api/v1/auth', authRouter);
// error handler middleware
app.use(errorHandler);

// start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
