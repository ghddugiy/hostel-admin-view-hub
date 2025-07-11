
import React from 'react';
import { 
  Home, 
  Bed, 
  UserPlus, 
  CreditCard, 
  Calendar, 
  MessageSquare, 
  UtensilsCrossed,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout?: () => void;
}

const Sidebar = ({ activeSection, onSectionChange, onLogout }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'rooms', label: 'Manage Rooms', icon: Bed },
    { id: 'students', label: 'New Student', icon: UserPlus },
    { id: 'fees', label: 'Student Fee', icon: CreditCard },
    { id: 'leave', label: 'Leave Management', icon: Calendar },
    { id: 'complaints', label: 'Complaint & Maintenance', icon: MessageSquare },
    { id: 'mess', label: 'Mess & Food Management', icon: UtensilsCrossed },
  ];

  return (
    <div className="w-64 bg-background border-r border-border min-h-screen p-4">
      <div className="text-foreground text-xl font-bold mb-8 text-center">
        Hostel Management
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors",
                activeSection === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <button 
        onClick={onLogout}
        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors mt-8"
      >
        <LogOut className="h-5 w-5" />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;
