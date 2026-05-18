import ClientTracker from './components/ClientTracker';

export const metadata = {
  title: 'Expense Tracker',
  description: 'Expense tracker',
};

export default function Home() {
  // Start with an empty list as requested (no mock data)
  return (
    <main className="app-container">
      <ClientTracker initialExpenses={[]} />
    </main>
  );
}
