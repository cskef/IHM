import React from 'react';
import { Users } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="py-6 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-sm border border-indigo-50">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <Users className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-slate-800 text-lg tracking-tight">CountAI</span>
      </div>
    </header>
  );
};