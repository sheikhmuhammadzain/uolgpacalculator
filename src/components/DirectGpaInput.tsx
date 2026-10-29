import React from 'react';
import { Button } from './ui/button';
import { X } from 'lucide-react';

interface DirectGpaInputProps {
  semesterNumber: number;
  gpa: number;
  onGpaChange: (value: number) => void;
  onRemove: () => void;
}

export const DirectGpaInput = ({ semesterNumber, gpa, onGpaChange, onRemove }: DirectGpaInputProps) => {
  return (
    <div className="group flex items-center gap-4 p-6 bg-white rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl border border-green-50">
      <div className="flex-1">
        <label className="block text-lg font-semibold text-gray-700 mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Semester {semesterNumber}
        </label>
        <input
          type="number"
          min="0"
          max="4"
          step="0.01"
          value={gpa === 0 ? '' : gpa}
          onChange={(e) => {
            const value = e.target.value === '' ? 0 : Number(e.target.value);
            onGpaChange(Math.min(4, Math.max(0, value)));
          }}
          className="w-full p-3 border-2 border-green-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
          placeholder="Enter GPA (0.00 - 4.00)"
        />
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400 hover:text-red-500 hover:bg-red-50"
        onClick={onRemove}
      >
        <X size={20} />
      </Button>
    </div>
  );
}