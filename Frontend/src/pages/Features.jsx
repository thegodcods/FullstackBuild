import React from 'react';
import { 
  FileText, 
  Cpu, 
  LayoutDashboard, 
  Search, 
  Shield, 
  FileSpreadsheet,
  ArrowUpRight 
} from 'lucide-react';

const Features = ({ setCurrentPage }) => {
  const featuresList = [
    {
      title: 'Advanced Resume Parsing',
      description: 'Supports text-based resumes and scanned images. Integrates pdfplumber and Tesseract OCR to accurately extract text under any formatting.',
      icon: FileText
    },
    {
      title: 'IndoBERT Semantic Ranking',
      description: 'Uses a deep learning transformer (IndoBERT Cross-Encoder) to measure true semantic compatibility rather than simplistic keyword counts.',
      icon: Cpu
    },
    {
      title: 'Premium Analytics Dashboard',
      description: 'Real-time metrics tracking including average matching scores, top candidate highlights, and automated shortlisted tags.',
      icon: LayoutDashboard
    },
    {
      title: 'Embedded Original CV Viewer',
      description: 'Review the formatted PDF resumes directly side-by-side with match details. No external viewers required.',
      icon: Search
    },
    {
      title: 'Category-Based Aggregation',
      description: 'Automatically merges candidate pools by job role (e.g. Software Engineer, Data Scientist) to avoid duplicate entries and fragmented sessions.',
      icon: FileSpreadsheet
    },
    {
      title: 'Recruiter-First Security',
      description: 'Secure recruiter authentication powered by JWT and bcrypt password hashing to safeguard candidate data.',
      icon: Shield
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans">
      {/* Hero Section */}
      <section className="w-full max-w-5xl mx-auto px-6 pt-20 pb-12 text-center">
        <span className="text-[#7FE252] text-xs font-mono tracking-widest uppercase bg-[#7FE252]/10 px-4 py-1.5 rounded-full border border-[#7FE252]/20">
          Core Capabilities
        </span>
        <h1 className="text-4xl md:text-5xl font-semibold mt-6 mb-6 tracking-tight">
          Supercharged with <span className="text-[#7FE252]">AI Features</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          QuickHire combines state-of-the-art NLP models with a modern interface to revolutionize resume screening.
        </p>
      </section>

      {/* Grid List Section */}
      <section className="w-full max-w-6xl mx-auto px-6 py-10 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuresList.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 hover:border-[#7FE252]/30 transition-all duration-300 flex flex-col">
                <div className="w-10 h-10 rounded-lg bg-[#7FE252]/10 flex items-center justify-center text-[#7FE252] mb-5 border border-[#7FE252]/10">
                  <Icon size={20} />
                </div>
                <h3 className="text-lg font-medium text-white mb-3">{feat.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed flex-grow">{feat.description}</p>
              </div>
            );
          })}
        </div>

        {/* CTA section */}
        <div className="mt-20 text-center py-6">
          <button 
            onClick={() => setCurrentPage('signup')}
            className="bg-[#7FE252] text-black px-8 py-3 rounded-full text-sm font-bold hover:bg-[#6ed243] transition inline-flex items-center gap-2"
          >
            Get Started Now <ArrowUpRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default Features;
