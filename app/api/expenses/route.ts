import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let expenses;
    if (category) {
      const stmt = db.prepare('SELECT * FROM expenses WHERE category = ? ORDER BY date DESC');
      expenses = stmt.all(category);
    } else {
      const stmt = db.prepare('SELECT * FROM expenses ORDER BY date DESC');
      expenses = stmt.all();
    }

    return NextResponse.json(expenses);
  } catch (error) {
    console.error('Failed to fetch expenses:', error);
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, amount, category, date } = body;

    // Server-side validation
    if (!title || typeof title !== 'string') {
      return NextResponse.json({ error: 'Invalid title' }, { status: 400 });
    }
    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Amount must be a positive number' }, { status: 400 });
    }
    const validCategories = ['food', 'transport', 'utilities', 'other'];
    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }
    
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return NextResponse.json({ error: 'Invalid date (must be ISO string)' }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const stmt = db.prepare(
      'INSERT INTO expenses (id, title, amount, category, date, createdAt) VALUES (?, ?, ?, ?, ?, ?)'
    );
    
    stmt.run(id, title, amount, category, dateObj.toISOString(), createdAt);

    const newExpense = {
      id,
      title,
      amount,
      category,
      date: dateObj.toISOString(),
      createdAt
    };

    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    console.error('Failed to create expense:', error);
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
  }
}
