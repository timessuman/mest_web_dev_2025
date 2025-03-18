import { Schema, model } from 'mongoose';


// Default categories
export const DEFAULT_CATEGORIES = [
  { name: "Food & Dining", color: "#ff9800", iconName: "🍔" },
  { name: "Bills & Utilities", color: "#f44336", iconName: "💸" },
  { name: "Transportation", color: "#2196f3", iconName: "🚗" },
  { name: "Shopping", color: "#9c27b0", iconName: "🛍️" },
  { name: "Entertainment", color: "#00bcd4", iconName: "🎮" },
  { name: "Housing", color: "#4caf50", iconName: "🏠" },
  { name: "Income", color: "#8bc34a", iconName: "💰" },
];

const categorySchema = new Schema({
  name: { type: String, required: true },
  color: { type: String, required: true },
  iconName: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
}, { timestamps: true });

categorySchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  }
});

export const Category = model('Category', categorySchema, 'categories');
