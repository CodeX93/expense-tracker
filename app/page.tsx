import ClientTracker from './components/ClientTracker';
import db from '@/lib/db';
import type { Expense } from '@/lib/types';

export const metadata = {
  title: 'Expense Tracker',
  description: 'Expense tracker',
};

export const dynamic = 'force-dynamic';

async function getExpenses(): Promise<Expense[]> {
  const stmt = db.prepare('SELECT * FROM expenses ORDER BY date DESC');
  return stmt.all() as Expense[];
}

export default async function Home() {
  const expenses = await getExpenses();
  
  return (
    <main className="app-container">
      <ClientTracker initialExpenses={expenses} />
    </main>
  );
}
