import { Course, Grade } from '../types';

interface NLPResult {
  intent: 'calculate_gpa' | 'course_impact' | 'grade_info' | 'unknown';
  entities: {
    grade?: Grade;
    creditHours?: number;
    courseName?: string;
  };
}

const gradePatterns = {
  'A': /\b[Aa]\b(?!-)/,
  'A-': /\b[Aa]-\b/,
  'B+': /\b[Bb]\+\b/,
  'B': /\b[Bb]\b(?!\+)/,
  'C+': /\b[Cc]\+\b/,
  'C': /\b[Cc]\b(?!\+)/,
  'D+': /\b[Dd]\+\b/,
  'D': /\b[Dd]\b(?!\+)/,
  'F': /\b[Ff]\b/,
  'W': /\b[Ww]\b/
};

const extractGrade = (text: string): Grade | undefined => {
  for (const [grade, pattern] of Object.entries(gradePatterns)) {
    if (pattern.test(text)) {
      return grade as Grade;
    }
  }
  return undefined;
};

const extractCreditHours = (text: string): number | undefined => {
  const match = text.match(/(\d+)\s*(?:credit|cr\.?|hours?)/i);
  return match ? parseInt(match[1]) : undefined;
};

const extractCourseName = (text: string): string | undefined => {
  const coursePatterns = [
    /(?:in|for)\s+([A-Za-z\s]+?)(?=\s+(?:course|class|subject))/i,
    /([A-Za-z\s]+?)\s+(?:course|class|subject)/i
  ];

  for (const pattern of coursePatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  return undefined;
};

export const analyzeQuery = (text: string): NLPResult => {
  const lowercaseText = text.toLowerCase();
  
  // Detect intent
  let intent: NLPResult['intent'] = 'unknown';
  if (lowercaseText.includes('what') && lowercaseText.includes('gpa')) {
    intent = 'calculate_gpa';
  } else if (lowercaseText.includes('impact') || lowercaseText.includes('affect')) {
    intent = 'course_impact';
  } else if (lowercaseText.includes('grade') && lowercaseText.includes('point')) {
    intent = 'grade_info';
  }

  // Extract entities
  const entities = {
    grade: extractGrade(text),
    creditHours: extractCreditHours(text),
    courseName: extractCourseName(text)
  };

  return { intent, entities };
};

export const generateResponse = (
  result: NLPResult,
  currentGPA: number,
  courses: Course[]
): string => {
  const { intent, entities } = result;

  switch (intent) {
    case 'calculate_gpa':
      if (entities.grade && entities.creditHours) {
        const newCourse: Course = {
          name: entities.courseName || 'New Course',
          grade: entities.grade,
          creditHours: entities.creditHours
        };
        const allCourses = [...courses, newCourse];
        const totalPoints = allCourses.reduce((sum, course) => {
          const gradePoints = {
            'A': 4.00, 'A-': 3.75, 'B+': 3.50, 'B': 3.00,
            'C+': 2.50, 'C': 2.00, 'D+': 1.50, 'D': 1.00,
            'F': 0.00, 'W': 0.00
          };
          return sum + (course.creditHours * gradePoints[course.grade]);
        }, 0);
        const totalHours = allCourses.reduce((sum, course) => sum + course.creditHours, 0);
        const newGPA = totalPoints / totalHours;
        
        return `If you get a ${entities.grade} in a ${entities.creditHours}-credit course, your new GPA would be ${newGPA.toFixed(2)}.`;
      }
      return "I need more information about the grade and credit hours to calculate the GPA impact.";

    case 'course_impact':
      if (entities.grade) {
        const gradePoints = {
          'A': 4.00, 'A-': 3.75, 'B+': 3.50, 'B': 3.00,
          'C+': 2.50, 'C': 2.00, 'D+': 1.50, 'D': 1.00,
          'F': 0.00, 'W': 0.00
        };
        const impact = gradePoints[entities.grade] - currentGPA;
        const direction = impact > 0 ? 'increase' : 'decrease';
        return `Getting a ${entities.grade} would ${direction} your GPA by ${Math.abs(impact).toFixed(2)} points.`;
      }
      return "I need to know what grade you're considering to calculate its impact.";

    case 'grade_info':
      if (entities.grade) {
        const gradePoints = {
          'A': '4.00 (85-100%)',
          'A-': '3.75 (80-84%)',
          'B+': '3.50 (75-79%)',
          'B': '3.00 (70-74%)',
          'C+': '2.50 (65-69%)',
          'C': '2.00 (60-64%)',
          'D+': '1.50 (55-59%)',
          'D': '1.00 (50-54%)',
          'F': '0.00 (Below 50%)',
          'W': 'Withdrawal (No GPA impact)'
        };
        return `A grade of ${entities.grade} is worth ${gradePoints[entities.grade]}.`;
      }
      return "Please specify which grade you'd like information about.";

    default:
      return "I'm not sure I understand. Try asking about GPA calculations, grade impacts, or grade information.";
  }
};