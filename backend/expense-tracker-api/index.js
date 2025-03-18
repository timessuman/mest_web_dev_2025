import config from './utils/config.js';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import { connect } from 'mongoose';
import userRouter from './routes/users.js';
import expenseRouter from './routes/expenses.js';
import loginRouter from './routes/login.js';
import { requestValidator } from './middlewares/validator.js';
import { authenticateToken } from './middlewares/authentication.js';
import logger from './utils/logger.js';
import { unknownEndPoint, errorHandler } from './middlewares/errors.js';


const app = express();

logger.info('connecting to mongoddb');
connect(config.MONGODB_URI).then(() => logger.info('connected to mongoddb'));


app.use(cors());

app.use(express.json());

// Validator middleware
app.use(requestValidator);

// Login route
app.use('/api/v1', loginRouter);

// User routes
app.use('/api/v1', userRouter);

// Authentication middleware
app.use(authenticateToken);

// Expense routes
app.use('/api/v1', expenseRouter);


// Error handling middleware
app.use(unknownEndPoint);

app.use(errorHandler);



app.listen(
  config.PORT, () => logger.info(`Server running on port ${config.PORT}`)
);