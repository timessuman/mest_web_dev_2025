import { Expense } from '../models/expense.js';
import { Category } from '../models/category.js';


export const getUserExpenses = async (req, res) => {
  const { filter, sort, order="asc", page=1, limit=10 } = req.query;
  const query = filter 
    ? {
        $or: [
          // { amount: filter },
          { description: { $regex: new RegExp(filter, "i") } },
        ],
      }
    : {};
  const seacrhQuery = { ...query, userId: req.user.id };

  const sorting = sort ? { [sort]: order === "desc" ? -1 : 1 } : {};

  // Count total expenses for the user
  const totalExpenses = await Expense.countDocuments(seacrhQuery);
  const message = totalExpenses > 0 
    ? `${totalExpenses} ${totalExpenses === 1 ? "expense" : "expenses"} found'` 
    : `No expense matches the filter value '${filter}'`;

  if (totalExpenses <= 0) {
    return res.json({
      success: true,
      message,
      page: 1,
      limit,
      totalPages: 0,
      totalExpenses: 0,
      data: [],
    });
  }

  const totalPages = Math.ceil(totalExpenses / limit);
  const currentPage = Math.min(page, totalPages);
  const skip = (currentPage - 1) * limit;

  // Get expenses for the user with pagination and sorting options
  const expenses = await Expense
    .find(seacrhQuery)
    .sort(sorting)
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    message,
    page: currentPage,
    limit,
    totalPages,
    totalExpenses: totalExpenses,
    data: expenses,
  });
}


export const addExpense = async (req, res) => {
  const { category } = req.value;
  const userId = req.user.id;

  // Check if category exists and is associated with the current user
  const userCategory = await Category.findOne({name: category, userId: req.user.id });
  if (!(userCategory && userCategory.userId.toString() === userId)) {
    return res.status(404).json({ error: "User category not found" });
  }

  const newExpense = await Expense.create({
    ...req.body, 
    categoryId: userCategory._id.toString(),
    userId: userId,
  });
  res.status(201).json(newExpense);
}

export const deleteUserExpense = async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  if (!expense) return res.status(404).json({ error: 'Expense not found' });
  if (expense.userId.toString()!== req.user.id) {
    return res.status(403).json({ error: 'Unauthorized to delete this expense' });
  }
  await Expense.findByIdAndDelete(req.params.id);
  res.status(204).end();
}