import React from 'react';

const ScoreRing = ({ score }) => {
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-10 h-10 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90">
        <circle cx="20" cy="20" r={radius} fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
        <circle
          cx="20" cy="20" r={radius}
          fill="transparent"
          stroke="#7FE252"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default ScoreRing;
