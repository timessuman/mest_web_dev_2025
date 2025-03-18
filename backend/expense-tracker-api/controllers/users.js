import bcrypt from "bcrypt";
import { User } from "../models/user.js";
import { Category, DEFAULT_CATEGORIES } from "../models/category.js";

export const getUsers = async (req, res) => {
  const { filter, sort, order = "asc", page = 1, limit = 10 } = req.query;
  const query = filter
    ? {
        $or: [
          { email: new RegExp(filter, "i") },
          { name: { $regex: new RegExp(filter, "i") } },
        ],
      }
    : {};

  const sorting = sort ? { [sort]: order === "desc" ? -1 : 1 } : {};

  const totalUsers = await User.countDocuments(query);
  const message = totalUsers > 0 
    ? `${totalUsers} ${totalUsers === 1 ? "user" : "users"} found'` 
    : `No user matches the filter value '${filter}'`;

  if (totalUsers <= 0) {
    return res.json({
      success: true,
      message,
      page: 1,
      limit,
      totalPages: 0,
      totalDocuments: 0,
      data: [],
    });
  }

  const totalPages = Math.ceil(totalUsers / limit);
  const currentPage = Math.min(page, totalPages);
  const skip = (currentPage - 1) * limit;

  const users = await User.find(query)
    .sort(sorting)
    .skip(skip)
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    message,
    page: currentPage,
    limit: parseInt(limit),
    totalPages: totalPages,
    totalUsers: totalUsers,
    users: users,
  });
};

export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(200).json({ user: user });
};



export const addUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    return res.status(409).json({ error: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ ...req.body, password: hashedPassword });

  const categoriesToInsert = DEFAULT_CATEGORIES.map((category) => ({
    ...category,
    userId: newUser.id,
  }));

  await Category.insertMany(categoriesToInsert);

  res.status(201).json({ message: "User added successfully", user: newUser });
};

export const changeUserPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.value;
  const userId = req.user.id;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const passwordCorrect = await bcrypt.compare(currentPassword, user.password);

  if (!passwordCorrect) {
    return res.status(401).json({ error: "Current password incorrect" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await User.findByIdAndUpdate(userId, { password: hashedPassword });

  res.status(200).json({ message: "Password changed successfully" });
}
