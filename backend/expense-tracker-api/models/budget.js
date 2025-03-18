import { Schema, model } from 'mongoose';

// export interface IBudget extends Document {
//   amount: number;
//   categoryId: Schema.Types.ObjectId;
//   userId: Schema.Types.ObjectId;
//   period: string;
// }

const budgetSchema = new Schema({
  amount: { type: Number, required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  period: { type: String, required: true },
}, { timestamps: true });

budgetSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

export const Budget = model('Budget', budgetSchema);