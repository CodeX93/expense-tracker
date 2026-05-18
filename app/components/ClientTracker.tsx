'use client';

import { useState, FormEvent } from 'react';
import type { Expense } from '@/lib/types';

export default function ClientTracker({ initialExpenses }: { initialExpenses: Expense[] }) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [filter, setFilter] = useState<string>('all');

  // Form state
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<'food' | 'transport' | 'utilities' | 'other'>('food');

  const filteredExpenses = expenses.filter(e => filter === 'all' || e.category === filter);
  
  const totalSpend = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      setExpenses(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleAddSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;

    const newExpense: Expense = {
      id: crypto.randomUUID(),
      title,
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    setExpenses(prev => [newExpense, ...prev]);
    setTitle('');
    setAmount('');
    setCategory('food');
  };

  return (
    <div className="glass-panel">
      <div className="header">
        <h1>Expense Tracker</h1>
        <p>Total Spend: <strong className="expense-amount">${totalSpend.toFixed(2)}</strong></p>
      </div>

      <div className="glass-panel-inner">
        <h3>Add New Expense</h3>
        <form onSubmit={handleAddSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="E.g., Groceries" 
              required
            />
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Amount</label>
              <input 
                type="number" 
                step="0.01" 
                min="0.01" 
                value={amount} 
                onChange={e => setAmount(e.target.value)} 
                placeholder="0.00" 
                required
              />
            </div>
            
            <div className="form-group">
              <label>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value as any)}>
                <option value="food">Food</option>
                <option value="transport">Transport</option>
                <option value="utilities">Utilities</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn-primary">
            Add Expense
          </button>
        </form>
      </div>

      <div className="filters">
        <h2>Your Expenses</h2>
        <select 
          value={filter} 
          onChange={e => setFilter(e.target.value)}
          style={{ width: 'auto', minWidth: '160px' }}
        >
          <option value="all">All Categories</option>
          <option value="food">Food</option>
          <option value="transport">Transport</option>
          <option value="utilities">Utilities</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="expense-list">
        {filteredExpenses.length === 0 ? (
          <div className="empty-state">
            <p>No expenses found. Time to add one!</p>
          </div>
        ) : (
          filteredExpenses.map((expense) => (
            <div key={expense.id} className="expense-item">
              <div className="expense-info-left">
                <span className="expense-title">{expense.title}</span>
                <span className="expense-date">
                  {new Date(expense.date).toLocaleDateString()}
                </span>
                <span className={`expense-category-badge bg-${expense.category}`}>
                  {expense.category}
                </span>
              </div>
              <div className="expense-info-right">
                <span className="expense-amount">${expense.amount.toFixed(2)}</span>
                <button 
                  onClick={() => handleDelete(expense.id)} 
                  className="btn-danger"
                  aria-label="Delete Expense"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
