import { Router } from 'express';
import { addExpense, deleteUserExpense, getUserExpenses } from '../controllers/expenses.js';

const expenseRouter = Router();


expenseRouter.get('/expenses', getUserExpenses)

expenseRouter.post('/expenses', addExpense);

expenseRouter.delete('/expenses/:id', deleteUserExpense);

export default expenseRouter;