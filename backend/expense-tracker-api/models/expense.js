import { Schema, model } from 'mongoose';

const expenseSchema = new Schema({
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  isIncome: { type: Boolean, default: false },
  paymentMethod: { type: String },
  notes: { type: String },
}, { timestamps: true });

expenseSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
})

export const Expense = model('Expense', expenseSchema);