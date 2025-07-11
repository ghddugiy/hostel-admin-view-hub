
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import ManageRooms from '@/components/ManageRooms';
import NewStudent from '@/components/NewStudent';
import StudentFee from '@/components/StudentFee';
import LeaveManagement from '@/components/LeaveManagement';
import ComplaintManagement from '@/components/ComplaintManagement';
import MessManagement from '@/components/MessManagement';
import LoginPage from '@/components/LoginPage';
import AdminDashboard from '@/components/AdminDashboard';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isAdminMode, setIsAdminMode] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveSection('dashboard');
    setIsAdminMode(false);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveSection} />;
      case 'rooms':
        return <ManageRooms />;
      case 'students':
        return <NewStudent />;
      case 'fees':
        return <StudentFee />;
      case 'leave':
        return <LeaveManagement />;
      case 'complaints':
        return <ComplaintManagement />;
      case 'mess':
        return <MessManagement />;
      default:
        return <Dashboard onNavigate={setActiveSection} />;
    }
  };

  if (isAdminMode) {
    return <AdminDashboard />;
  }

  if (!isLoggedIn) {
    return (
      <div>
        <LoginPage onLogin={handleLogin} />
        <div className="fixed top-4 right-4 z-20">
          <button
            onClick={() => setIsAdminMode(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            Admin Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
        onLogout={handleLogout}
      />
      <div className="flex-1">
        {renderActiveSection()}
      </div>
    </div>
  );
};

export default Index;
