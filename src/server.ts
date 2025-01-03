import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import errorHandler from './middlewares/errorHandler';
import authRouter from './routes/auth';
import jobsRouter from './routes/jobs';
import employeeTypesRouter from './routes/employeeTypes';
import usersRouter from './routes/users';
import workModesRouter from './routes/workModes';
import qualificationsRouter from './routes/qualifications';
import educationsRouter from './routes/educations';
import experiencesRouter from './routes/experiences';
import companiesRouter from './routes/companies';
import cookieParser from 'cookie-parser';
import authenticate from './middlewares/authenticate';

const port = process.env.PORT || 3000;
const app = express();
// parser middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// cors middleware
app.use(cors());

// static route for images
app.use('/images', express.static('uploads/images'));

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', jobsRouter);
app.use('/api/v1/employee-types', employeeTypesRouter);
app.use('/api/v1/work-modes', workModesRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/qualifications', qualificationsRouter);
app.use('/api/v1/educations', educationsRouter);
app.use('/api/v1/experiences', experiencesRouter);
app.use('/api/v1/companies', companiesRouter);
app.get(
  '/test',
  authenticate(['user', 'company']),
  (req: Request, res: Response, next: NextFunction) => {
    console.log(req.profile);
    res.sendStatus(200);
  }
);
// error handler middleware
app.use(errorHandler);

// start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
