# Expense Tracker

A blazing fast, single-page expense tracking application built using Next.js App Router and a robust native SQLite database. Designed specifically without complex ORMs or UI libraries, emphasizing raw SQL and vanilla CSS.

## 🚀 Key Features

- **Single Page Application:** Experience seamless operations. Actions automatically re-poll API routes to keep your DOM matched optimally with your backend without harsh page reloads.
- **Optimistic UI Deletions:** Deleting an expense removes the item from your screen instantly before pinging the backend, maximizing perceived speed.
- **Dynamic Category Filtering:** Toggle effortlessly through distinct expenditure profiles natively mapped via REST parameters (`?category=food`).
- **Server Components Initiation:** Initial page painting connects to the SQLite backend directly from Next.js server components, ensuring fully instantiated initial data fetches without loading spinners.
- **Computed Spend Summations:** Total spending is proactively computed in real time based strictly on the retrieved payload list visible on your dashboard.
- **Robust Delete Protections:** Native browser alert confirmations prevent accidental removals of historical expense logs.

## 🛠️ Technology Stack

- **Frontend Framework:** Next.js (App Router) + React
- **Styling:** Pure Vanilla CSS (Clean, box-model oriented architecture)
- **Database:** SQLite natively integrated via `better-sqlite3`
- **Typing:** Strict TypeScript mapping schemas

## 📂 Implementation Details & Architecture

The application adopts a robust separation of concerns, operating strictly through Next.js Route Handlers. 

- `app/api/expenses/route.ts`: Exposes powerful `GET` and `POST` hooks to manage your tracking list. Includes server-side validation rejecting invalid schema requests.
- `app/api/expenses/[id]/route.ts`: Contains specific `DELETE` dynamic operations executing localized `DELETE FROM expenses WHERE id = ?` queries directly.
- `lib/db.ts`: Houses the absolute SQLite configuration connecting to `expenses.db` locally, running your `CREATE TABLE IF NOT EXISTS` operations natively on boot.
- `app/components/ClientTracker.tsx`: Main interactive state hub managing filter categories and binding inputs natively to dynamic Next endpoints.
- `app/page.tsx`: Initial server-oriented hook fetching SQLite logs transparently.

## 📦 Installation & Setup

1. **Clone the repository** (if applicable) and navigate to the root directory.

2. **Install all dependencies:**
```bash
npm install
```

3. **Start the local Next.js development server:**
```bash
npm run dev
```

4. **Initialize Your Application:**
Open up [http://localhost:3000](http://localhost:3000) in your native browser. An `expenses.db` file will automatically compile in your project root upon load containing your newly scaffolded tables!

## 📡 API Reference

- `GET /api/expenses`
  - Fetches the current list.
  - Optional Query: `?category=food` filters outputs strictly based on constraints.
- `POST /api/expenses`
  - Body: `{ title: string, amount: number, category: string, date: string }`
  - Validates fields to ensure numerical validity on costs and string mappings on categorizations. Creates new UUID mapped records.
- `DELETE /api/expenses/:id`
  - Wipes out records based completely upon strictly isolated UUID definitions.

## 🧩 How the Implementation Works & Modifying the App

The architecture connects standard Next.js components to a local SQLite database, avoiding complex state-management libraries. Here's a breakdown of how the data flows and how you can alter it:

### 1. The Database (`lib/db.ts` & `lib/types.ts`)
We use `better-sqlite3` to generate a lightweight file called `expenses.db` directly inside your project root. 
- **Modifying the Schema:** To add a new field (e.g., `notes` or `tag`), update the `CREATE TABLE` execution string natively inside `lib/db.ts`. You must subsequently update your typescript definitions inside `lib/types.ts` to ensure frontend type safety. Since there's no ORM, no complex migrations are required—although you may need to delete your existing `expenses.db` file to let the script safely regenerate the new table logic on boot.

### 2. Backend API Routes (`app/api/expenses/...`)
Next.js handles all isolated backend operations securely. The `GET` and `POST` handlers validate incoming payloads and pipe them as raw SQL commands directly to SQLite. 
- **Altering Backend Endpoints:** If you want to implement new URL parameters (like sorting by total `amount` instead of `date`), open up `app/api/expenses/route.ts`. Inside the `GET` function block, add a new variable parsing your parameter out of `searchParams.get(...)` and define your new conditional `db.prepare(SELECT ... ORDER BY x)` string.

### 3. Frontend State (`app/components/ClientTracker.tsx`)
The frontend visually updates entirely through standard React `useState` hooks mapped directly to DOM nodes. 
- **Understanding UI Flows:** When users interact with buttons, we execute an immediate standard browser `fetch()` calling the Next.js API. For instance, `handleDelete` executes an "Optimistic UI Update". It physically rewrites your local React state to instantly hide the expense on the screen, pinging the database in the background via the API and silently reversing the state back if the server errors out. 
- **Modifying Frontend Interactions:** If you want to change what occurs when an item is submitted, edit the `handleAddSubmit` function logic to inject new fields or to toggle loading state `setIsSubmitting` triggers.

## 📝 License
This project operates under the standard MIT License.
