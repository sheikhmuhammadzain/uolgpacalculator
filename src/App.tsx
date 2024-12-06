import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SemesterForm } from './components/SemesterForm';
import { GpaGauge } from './components/GpaGauge';
import { DirectGpaInput } from './components/DirectGpaInput';
import { StudyTimer } from './components/StudyTimer';
import { ExportButton } from './components/ExportButton';
import { ThemeToggle } from './components/ThemeToggle';
import { ChatBot } from './components/ChatBot';
import { Course, Semester } from './types';
import { calculateSemesterGPA, calculateCGPA, calculatePercentage } from './utils/calculations';
import { Button } from './components/ui/button';
import { Plus } from 'lucide-react';
import { useTheme } from './hooks/useTheme';

function App() {
  const { theme } = useTheme();
  const [isDirectInput, setIsDirectInput] = useState(false);
  const [semesters, setSemesters] = useState<Semester[]>([{ courses: [{ name: '', grade: '', creditHours: 0 }] }]);
  const [directGpas, setDirectGpas] = useState<number[]>([0]);

  useEffect(() => {
    // Initialize theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleAddSemester = () => {
    if (isDirectInput) {
      setDirectGpas([...directGpas, 0]);
    } else {
      setSemesters([...semesters, { courses: [{ name: '', grade: '', creditHours: 0 }] }]);
    }
  };

  const handleRemoveSemester = (index: number) => {
    if (isDirectInput) {
      const newGpas = [...directGpas];
      newGpas.splice(index, 1);
      setDirectGpas(newGpas);
    } else {
      const newSemesters = [...semesters];
      newSemesters.splice(index, 1);
      setSemesters(newSemesters);
    }
  };

  const handleDirectGpaChange = (index: number, value: number) => {
    const newGpas = [...directGpas];
    newGpas[index] = Math.min(4, Math.max(0, value));
    setDirectGpas(newGpas);
  };

  const handleAddCourse = (semesterIndex: number) => {
    const newSemesters = [...semesters];
    newSemesters[semesterIndex].courses.push({ name: '', grade: '', creditHours: 0 });
    setSemesters(newSemesters);
  };

  const handleRemoveCourse = (semesterIndex: number, courseIndex: number) => {
    const newSemesters = [...semesters];
    newSemesters[semesterIndex].courses.splice(courseIndex, 1);
    if (newSemesters[semesterIndex].courses.length === 0) {
      newSemesters.splice(semesterIndex, 1);
    }
    setSemesters(newSemesters);
  };

  const handleCourseChange = (semesterIndex: number, courseIndex: number, field: keyof Course, value: any) => {
    const newSemesters = [...semesters];
    newSemesters[semesterIndex].courses[courseIndex][field] = value;
    setSemesters(newSemesters);
  };

  const cgpa = isDirectInput
    ? directGpas.reduce((sum, gpa) => sum + gpa, 0) / directGpas.length
    : calculateCGPA(semesters.map(semester => semester.courses));
  const percentage = calculatePercentage(cgpa);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 dark:text-white transition-colors duration-300">
      <Header />
      <ThemeToggle />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 inline-flex">
            <Button
              variant={!isDirectInput ? "gradient" : "ghost"}
              onClick={() => setIsDirectInput(false)}
              className="rounded-r-none"
            >
              Course-wise
            </Button>
            <Button
              variant={isDirectInput ? "gradient" : "ghost"}
              onClick={() => setIsDirectInput(true)}
              className="rounded-l-none"
            >
              Direct GPA
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {isDirectInput ? (
              directGpas.map((gpa, index) => (
                <DirectGpaInput
                  key={index}
                  semesterNumber={index + 1}
                  gpa={gpa}
                  onGpaChange={(value) => handleDirectGpaChange(index, value)}
                  onRemove={() => handleRemoveSemester(index)}
                />
              ))
            ) : (
              semesters.map((semester, semesterIndex) => (
                <SemesterForm
                  key={semesterIndex}
                  semesterNumber={semesterIndex + 1}
                  courses={semester.courses}
                  onAddCourse={() => handleAddCourse(semesterIndex)}
                  onRemoveCourse={(courseIndex) => handleRemoveCourse(semesterIndex, courseIndex)}
                  onCourseChange={(courseIndex, field, value) => 
                    handleCourseChange(semesterIndex, courseIndex, field, value)
                  }
                />
              ))
            )}
            
            <Button
              variant="gradient"
              onClick={handleAddSemester}
              className="w-full"
            >
              <Plus className="mr-2" size={20} />
              Add {isDirectInput ? 'Semester GPA' : 'Semester'}
            </Button>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-4 border border-green-100 dark:border-gray-700 space-y-6">
              <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Overall Performance
              </h2>
              <div className="flex justify-center">
                <GpaGauge gpa={cgpa} percentage={percentage} />
              </div>
              
              <div className="mt-6 space-y-2">
                {isDirectInput ? (
                  directGpas.map((gpa, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>Semester {index + 1} GPA:</span>
                      <span className="font-semibold">{gpa.toFixed(2)}</span>
                    </div>
                  ))
                ) : (
                  semesters.map((semester, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>Semester {index + 1} GPA:</span>
                      <span className="font-semibold">
                        {calculateSemesterGPA(semester.courses).toFixed(2)}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <StudyTimer />
              <ExportButton 
                semesters={semesters}
                cgpa={cgpa}
                percentage={percentage}
              />
            </div>
          </div>
        </div>
      </main>
      
      <ChatBot />
      <Footer />
    </div>
  );
}

export default App;