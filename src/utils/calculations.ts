import { Course, Grade } from '../types';

const gradePoints: Record<Grade, number> = {
  'A': 4.00,
  'A-': 3.75,
  'B+': 3.50,
  'B': 3.00,
  'C+': 2.50,
  'C': 2.00,
  'D+': 1.50,
  'D': 1.00,
  'F': 0.00,
  'W': 0.00,
  '': 0.00
};

export const calculateSemesterGPA = (courses: Course[]): number => {
  const validCourses = courses.filter(course => course.grade !== 'W');
  const totalCreditHours = validCourses.reduce((sum, course) => sum + course.creditHours, 0);
  const totalPoints = validCourses.reduce((sum, course) => {
    return sum + (course.creditHours * gradePoints[course.grade]);
  }, 0);

  return totalCreditHours ? totalPoints / totalCreditHours : 0;
};

export const calculateCGPA = (semesters: Course[][]): number => {
  const allCourses = semesters.flat();
  return calculateSemesterGPA(allCourses);
};

export const calculatePercentage = (gpa: number): number => {
  // UOL specific percentage calculation
  if (gpa >= 4.00) return 100;
  if (gpa >= 3.75) return 84;
  if (gpa >= 3.50) return 79;
  if (gpa >= 3.00) return 74;
  if (gpa >= 2.50) return 69;
  if (gpa >= 2.00) return 64;
  if (gpa >= 1.50) return 59;
  if (gpa >= 1.00) return 54;
  return Math.max(0, (gpa / 4.0) * 50);
};