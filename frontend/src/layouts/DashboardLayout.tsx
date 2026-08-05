import { useState } from 'react';
import Header from './Header';

export default function DashboardLayout({ children, currentTab, setCurrentTab, userData, onLogout }: any) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-medical-gradient medical-pattern-bg text-slate-900 flex flex-col overflow-x-hidden">
      {/* Top Header Navbar */}
      <Header
        userData={userData}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onLogout={onLogout}
        onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
      />

      {/* Main Container */}
      <main className="flex-1 pt-16 min-h-screen max-w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
