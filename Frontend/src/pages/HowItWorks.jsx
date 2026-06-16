import React from 'react';
import { 
  UploadCloud, 
  Cpu, 
  Sliders, 
  BarChart3, 
  ArrowRight,
  ArrowUpRight
} from 'lucide-react';

const HowItWorks = ({ setCurrentPage }) => {
  const steps = [
    {
      number: '01',
      title: 'Upload CVs',
      description: 'Upload candidate resumes in PDF format. Our system supports batch uploads to save your time.',
      icon: UploadCloud,
      color: '#7FE252'
    },
    {
      number: '02',
      title: 'Select or Define Job Description',
      description: 'Choose from our job templates (Data Scientist, Software Engineer, etc.) or write your own custom requirements.',
      icon: Sliders,
      color: '#a3e635'
    },
    {
      number: '03',
      title: 'AI Processing & Extraction',
      description: 'Our system automatically structures CV details and extracts candidate skills, name, and contact information.',
      icon: Cpu,
      color: '#84cc16'
    },
    {
      number: '04',
      title: 'Semantic Scoring & Ranking',
      description: 'The IndoBERT neural network evaluates the candidate\'s deep semantic fit, and ranks them in a premium dashboard.',
      icon: BarChart3,
      color: '#65a30d'
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans">
      {/* Hero Section */}
      <section className="w-full max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <span className="text-[#7FE252] text-xs font-mono tracking-widest uppercase bg-[#7FE252]/10 px-4 py-1.5 rounded-full border border-[#7FE252]/20">
          The Process
        </span>
        <h1 className="text-4xl md:text-5xl font-semibold mt-6 mb-6 tracking-tight">
          How <span className="text-[#7FE252]">QuickHire</span> Works
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          QuickHire uses state-of-the-art NLP models to analyze and score candidate resumes against your job requirements, saving hours of manual review.
        </p>
      </section>

      {/* Steps Timeline Section */}
      <section className="w-full max-w-6xl mx-auto px-6 py-10 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 flex flex-col relative group hover:border-[#7FE252]/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-[#121212] flex items-center justify-center mb-6 border border-white/10 group-hover:border-[#7FE252]/50 transition-all duration-300">
                  <Icon size={22} className="text-[#7FE252]" />
                </div>
                
                <span className="text-4xl font-bold font-mono text-white/10 group-hover:text-[#7FE252]/20 transition-all absolute top-6 right-6 select-none">
                  {step.number}
                </span>

                <h3 className="text-lg font-medium text-white mb-3 group-hover:text-[#7FE252] transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed flex-grow">
                  {step.description}
                </p>

                {idx < 3 && (
                  <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10 text-gray-600">
                    <ArrowRight size={16} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Call To Action */}
        <div className="mt-20 bg-gradient-to-r from-[#0d0d0d] to-[#080808] border border-white/5 rounded-3xl p-10 md:p-16 text-center max-w-4xl mx-auto shadow-xl">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Ready to find your best matching candidate?</h2>
          <p className="text-sm text-gray-400 mb-8 max-w-lg mx-auto">
            Sign up for a free recruiter account and experience the power of semantic matching screening today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => setCurrentPage('signup')}
              className="bg-[#7FE252] text-black px-8 py-3 rounded-full text-sm font-bold hover:bg-[#6ed243] transition flex items-center justify-center gap-2"
            >
              Start Screening Free <ArrowUpRight size={16} />
            </button>
            <button 
              onClick={() => setCurrentPage('menu')}
              className="border border-white/10 text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-white/5 transition"
            >
              Back to Home
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
