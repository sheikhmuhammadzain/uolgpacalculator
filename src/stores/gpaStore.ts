import { create } from 'zustand';
import { Course, Semester } from '../types';
import { calculateCGPA } from '../utils/calculations';

interface GpaState {
  semesters: Semester[];
  cgpa: number;
  setSemesters: (semesters: Semester[]) => void;
  addSemester: () => void;
  removeSemester: (index: number) => void;
  updateCourse: (semesterIndex: number, courseIndex: number, course: Course) => void;
}

export const useGpaStore = create<GpaState>((set) => ({
  semesters: [{ courses: [{ name: '', grade: '', creditHours: 0 }] }],
  cgpa: 0,
  setSemesters: (semesters) => 
    set((state) => ({
      semesters,
      cgpa: calculateCGPA(semesters.map(semester => semester.courses))
    })),
  addSemester: () =>
    set((state) => ({
      semesters: [...state.semesters, { courses: [{ name: '', grade: '', creditHours: 0 }] }]
    })),
  removeSemester: (index) =>
    set((state) => {
      const newSemesters = [...state.semesters];
      newSemesters.splice(index, 1);
      return {
        semesters: newSemesters,
        cgpa: calculateCGPA(newSemesters.map(semester => semester.courses))
      };
    }),
  updateCourse: (semesterIndex, courseIndex, course) =>
    set((state) => {
      const newSemesters = [...state.semesters];
      newSemesters[semesterIndex].courses[courseIndex] = course;
      return {
        semesters: newSemesters,
        cgpa: calculateCGPA(newSemesters.map(semester => semester.courses))
      };
    })
}));