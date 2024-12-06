import React from 'react';
import { Plus, X } from 'lucide-react';
import { Course, Grade } from '../types';
import { Button } from './ui/button';

interface SemesterFormProps {
  semesterNumber: number;
  courses: Course[];
  onAddCourse: () => void;
  onRemoveCourse: (index: number) => void;
  onCourseChange: (index: number, field: keyof Course, value: any) => void;
}

const grades: Grade[] = ['A', 'A-', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F', 'W'];

export const SemesterForm = ({
  semesterNumber,
  courses,
  onAddCourse,
  onRemoveCourse,
  onCourseChange,
}: SemesterFormProps) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-green-50 transition-all duration-200 hover:shadow-xl">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
        Semester {semesterNumber}
      </h2>
      
      {courses.map((course, index) => (
        <div key={index} className="group grid grid-cols-12 gap-4 mb-4 p-4 rounded-lg hover:bg-green-50 transition-all duration-200">
          <input
            type="text"
            placeholder="Course Name"
            className="col-span-5 p-3 border-2 border-green-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            value={course.name}
            onChange={(e) => onCourseChange(index, 'name', e.target.value)}
          />
          <select
            className="col-span-3 p-3 border-2 border-green-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            value={course.grade}
            onChange={(e) => onCourseChange(index, 'grade', e.target.value as Grade)}
          >
            <option value="">Select Grade</option>
            {grades.map((grade) => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </select>
          <input
            type="number"
            min="1"
            max="4"
            placeholder="Credit Hours"
            className="col-span-3 p-3 border-2 border-green-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            value={course.creditHours || ''}
            onChange={(e) => onCourseChange(index, 'creditHours', Number(e.target.value))}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemoveCourse(index)}
            className="col-span-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400 hover:text-red-500 hover:bg-red-50"
          >
            <X size={20} />
          </Button>
        </div>
      ))}
      
      <Button
        variant="ghost"
        onClick={onAddCourse}
        className="flex items-center gap-2 mt-4 text-green-600 hover:text-green-700 hover:bg-green-50"
      >
        <Plus size={20} />
        Add Course
      </Button>
    </div>
  );
}