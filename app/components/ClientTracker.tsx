'use client';

import { useState, FormEvent, useCallback } from 'react';
import type { Expense } from '@/lib/types';

export default function ClientTracker({ initialExpenses }: { initialExpenses: Expense[] }) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [filter, setFilter] = useState<string>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<'food' | 'transport' | 'utilities' | 'other'>('food');

  const fetchFilteredExpenses = useCallback(async (cat: string) => {
    try {
      const url = cat === 'all' ? '/api/expenses' : `/api/expenses?category=${cat}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setExpenses(data);
      }
    } catch(err) {
      console.error(err);
    }
  }, []);

  const handleFilterChange = (newCat: string) => {
    setFilter(newCat);
    fetchFilteredExpenses(newCat);
  };

  const totalSpend = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      const prevExpenses = [...expenses];
      
      // Optimistic delete UI update
      setExpenses(prev => prev.filter(e => e.id !== id));

      try {
        const res = await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Deletion failed');
      } catch (error) {
        console.error(error);
        alert('Failed to delete expense');
        // Revert on failure
        setExpenses(prevExpenses);
      }
    }
  };

  const handleAddSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          amount: parseFloat(amount),
          category,
          date: new Date().toISOString()
        })
      });

      if (!res.ok) throw new Error('Failed to add');

      // Re-fetch to update the list and get real DB IDs, applying current filter constraint
      await fetchFilteredExpenses(filter);
      
      setTitle('');
      setAmount('');
      setCategory('food');
    } catch (error) {
      console.error(error);
      alert('Failed to add expense');
    } finally {
      setIsSubmitting(false);
    }
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

          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Expense'}
          </button>
        </form>
      </div>

      <div className="filters">
        <h2>Your Expenses</h2>
        <select 
          value={filter} 
          onChange={e => handleFilterChange(e.target.value)}
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
        {expenses.length === 0 ? (
          <div className="empty-state">
            <p>No expenses found. Time to add one!</p>
          </div>
        ) : (
          expenses.map((expense) => (
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
