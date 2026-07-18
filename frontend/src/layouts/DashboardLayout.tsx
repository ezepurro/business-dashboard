import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}
