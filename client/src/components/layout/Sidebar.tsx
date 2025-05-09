import { Link, useLocation } from 'wouter';
import { User } from '@/types';
import { 
  CheckCircle, 
  ClipboardList, 
  Users, 
  History, 
  LogOut, 
  X
} from 'lucide-react';

interface SidebarProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export default function Sidebar({ user, isOpen, onClose, onLogout }: SidebarProps) {
  const [location] = useLocation();
  
  // Generate user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const userInitials = getInitials(user.name);
  
  const sidebarContent = (
    <>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between md:justify-start">
          <div className="flex items-center">
            <span className="text-primary text-3xl mr-2">
              <CheckCircle />
            </span>
            <h1 className="text-xl font-semibold text-gray-800">TaskShare</h1>
          </div>
          <button className="text-gray-500 md:hidden" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
      </div>
      
      {/* User profile */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          {/* User avatar */}
          {user.picture ? (
            <img 
              src={user.picture} 
              alt={user.name} 
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
              <span>{userInitials}</span>
            </div>
          )}
          
          <div className="flex-1">
            <p className="font-medium text-gray-800">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="p-2">
        <ul>
          <li className="mb-1">
            <Link 
              href="/" 
              className={`flex items-center px-4 py-2 rounded-md font-medium ${
                location === '/' 
                  ? 'text-primary bg-primary-light' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ClipboardList className="mr-3 h-5 w-5" />
              My Tasks
            </Link>
          </li>
          <li className="mb-1">
            <Link 
              href="/assigned" 
              className={`flex items-center px-4 py-2 rounded-md font-medium ${
                location === '/assigned' 
                  ? 'text-primary bg-primary-light' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Users className="mr-3 h-5 w-5" />
              Assigned to Others
            </Link>
          </li>
          <li className="mb-1">
            <Link 
              href="/history" 
              className={`flex items-center px-4 py-2 rounded-md font-medium ${
                location === '/history' 
                  ? 'text-primary bg-primary-light' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <History className="mr-3 h-5 w-5" />
              Task History
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
        <button 
          className="flex items-center text-gray-600 hover:text-gray-800"
          onClick={onLogout}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Sign Out
        </button>
      </div>
    </>
  );
  
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="bg-white w-64 border-r border-gray-200 shadow-sm hidden md:block h-full">
        {sidebarContent}
      </aside>
      
      {/* Mobile sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
