import { useState } from 'react';
import { Menu, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { User } from '@/types';

interface HeaderProps {
  onOpenSidebar: () => void;
  user: User;
  title?: string;
}

export default function Header({ onOpenSidebar, user, title = "My Tasks" }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
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
  
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center">
          {/* Mobile menu button */}
          <button 
            className="mr-4 text-gray-600 md:hidden" 
            onClick={onOpenSidebar}
          >
            <Menu size={24} />
          </button>
          
          <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
        </div>
        
        {/* Search bar - desktop */}
        <div className="hidden md:block relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
            <Search size={18} className="text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-64 rounded-lg"
          />
        </div>
        
        {/* User profile / actions for mobile */}
        <div className="flex items-center md:hidden">
          <button className="p-2 text-gray-600 mr-2">
            <Search size={20} />
          </button>
          {user.picture ? (
            <img 
              src={user.picture} 
              alt={user.name} 
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
              <span className="text-sm">{userInitials}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
