import React from 'react';

interface GpaGaugeProps {
  gpa: number;
  percentage: number;
}

export const GpaGauge = ({ gpa, percentage }: GpaGaugeProps) => {
  const getGpaColor = (gpa: number) => {
    if (gpa >= 3.5) return 'text-green-500';
    if (gpa >= 2.5) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getGpaStatus = (gpa: number) => {
    if (gpa >= 3.5) return 'Excellent';
    if (gpa >= 3.0) return 'Very Good';
    if (gpa >= 2.5) return 'Good';
    if (gpa >= 2.0) return 'Satisfactory';
    return 'Needs Improvement';
  };

  return (
    <div className="relative w-48 h-48 transition-all duration-500 transform hover:scale-105">
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className={`text-4xl font-bold ${getGpaColor(gpa)} transition-colors duration-300`}>
          {gpa.toFixed(2)}
        </div>
        <div className="text-sm font-medium text-gray-600">CGPA</div>
        <div className="text-sm text-gray-500 mt-2">{percentage.toFixed(1)}%</div>
        <div className={`text-sm font-medium mt-2 ${getGpaColor(gpa)}`}>
          {getGpaStatus(gpa)}
        </div>
      </div>
      <svg className="transform -rotate-90 w-48 h-48">
        <circle
          cx="96"
          cy="96"
          r="88"
          fill="none"
          stroke="#eee"
          strokeWidth="12"
          className="transition-all duration-300"
        />
        <circle
          cx="96"
          cy="96"
          r="88"
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          strokeDasharray={553}
          strokeDashoffset={553 - (553 * percentage) / 100}
          className={`${getGpaColor(gpa)} transition-all duration-700`}
        />
      </svg>
    </div>
  );
}