import { useState } from 'react';
import Header from './Header';

export default function DashboardLayout({ children, currentTab, setCurrentTab, userData, onLogout }: any) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-alabaster dark:bg-ink-950 text-ink-900 dark:text-slate-100 font-sans flex flex-col overflow-x-hidden">
      {/* Top Header Navbar */}
      <Header
        userData={userData}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onLogout={onLogout}
        onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
      />

      {/* Main Container */}
      <main className="flex-1 pt-16 min-h-screen w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 min-w-0 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
