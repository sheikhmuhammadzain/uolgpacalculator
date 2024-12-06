import React from 'react';
import { GraduationCap } from 'lucide-react';
import uollogo from './images.png'
export const Header = () => {
  return (
    <header className="bg-gradient-to-r from-green-600 to-green-800 p-6 text-white">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GraduationCap size={32} />
          <div>
            <h1 className="text-xl font-bold">The University of Lahore</h1>
            <p className="text-sm opacity-90">GPA Calculator</p>
          </div>
        </div>
        <img 
          src={uollogo} 
          alt="UOL Logo" 
          className="h-14 w-auto rounded-full"
        />
      </div>
    </header>
  );
}