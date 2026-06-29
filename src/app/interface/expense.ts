// src/app/models/expense.model.ts
export interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: string;
  date: Date;
}
