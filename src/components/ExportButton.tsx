import React from 'react';
import { Download } from 'lucide-react';
import { Button } from './ui/button';
import { jsPDF } from 'jspdf';
import { Course, Semester } from '../types';

interface ExportButtonProps {
  semesters: Semester[];
  cgpa: number;
  percentage: number;
}

export const ExportButton = ({ semesters, cgpa, percentage }: ExportButtonProps) => {
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(20);
    doc.text('University of Lahore - Academic Report', 20, 20);
    
    // Add CGPA and Percentage
    doc.setFontSize(16);
    doc.text(`CGPA: ${cgpa.toFixed(2)}`, 20, 40);
    doc.text(`Percentage: ${percentage.toFixed(1)}%`, 20, 50);
    
    // Add semester details
    let yPos = 70;
    semesters.forEach((semester, index) => {
      doc.setFontSize(14);
      doc.text(`Semester ${index + 1}`, 20, yPos);
      yPos += 10;
      
      // Add course headers
      doc.setFontSize(12);
      doc.text('Course', 30, yPos);
      doc.text('Grade', 120, yPos);
      doc.text('Credits', 150, yPos);
      yPos += 10;
      
      // Add courses
      semester.courses.forEach(course => {
        doc.text(course.name, 30, yPos);
        doc.text(course.grade, 120, yPos);
        doc.text(course.creditHours.toString(), 150, yPos);
        yPos += 8;
      });
      
      yPos += 10;
    });
    
    doc.save('academic-report.pdf');
  };

  return (
    <Button
      onClick={exportToPDF}
      className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700"
    >
      <Download size={16} />
      Export Report
    </Button>
  );
};