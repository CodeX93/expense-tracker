export type Expense = {
  id: string;
  title: string;
  amount: number;
  category: 'food' | 'transport' | 'utilities' | 'other';
  date: string;
  createdAt: string;
};
