export type Grade = 'A' | 'A-' | 'B+' | 'B' | 'C+' | 'C' | 'D+' | 'D' | 'F' | 'W' | '';

export interface Course {
  name: string;
  grade: Grade;
  creditHours: number;
}

export interface Semester {
  courses: Course[];
}