import React from 'react';

const ScoreRing = ({ score, size = 40, strokeWidth = 4 }) => {
  const center = size / 2;
  const radius = center - (strokeWidth / 2);
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div 
      className="relative flex items-center justify-center"
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <svg className="w-full h-full transform -rotate-90">
        <circle 
          cx={center} 
          cy={center} 
          r={radius} 
          fill="transparent" 
          stroke="rgba(255,255,255,0.1)" 
          strokeWidth={strokeWidth} 
        />
        <circle
          cx={center} 
          cy={center} 
          r={radius}
          fill="transparent"
          stroke="#7FE252"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default ScoreRing;
