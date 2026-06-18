import React from 'react';
import { 
  Target, 
  Eye, 
  Award
} from 'lucide-react';

const AboutUs = ({ setCurrentPage }) => {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans">
      {/* Hero Section */}
      <section className="w-full max-w-5xl mx-auto px-6 pt-20 pb-12 text-center">
        <span className="text-[#7FE252] text-xs font-mono tracking-widest uppercase bg-[#7FE252]/10 px-4 py-1.5 rounded-full border border-[#7FE252]/20">
          Our Story
        </span>
        <h1 className="text-4xl md:text-5xl font-semibold mt-6 mb-6 tracking-tight">
          About <span className="text-[#7FE252]">QuickHire</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          We are on a mission to build a fairer, faster, and more intelligent recruitment system by bringing cutting-edge machine learning models into daily HR operations.
        </p>
      </section>

      {/* Grid Values Section */}
      <section className="w-full max-w-6xl mx-auto px-6 py-10 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 hover:border-[#7FE252]/20 transition-all">
            <div className="w-10 h-10 rounded-lg bg-[#7FE252]/10 flex items-center justify-center text-[#7FE252] mb-6">
              <Target size={20} />
            </div>
            <h3 className="text-lg font-medium text-white mb-3">Our Mission</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              To automate CV screening with deep semantic awareness, removing the fatigue and bias of manual keywords scanning.
            </p>
          </div>

          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 hover:border-[#7FE252]/20 transition-all">
            <div className="w-10 h-10 rounded-lg bg-[#7FE252]/10 flex items-center justify-center text-[#7FE252] mb-6">
              <Eye size={20} />
            </div>
            <h3 className="text-lg font-medium text-white mb-3">Our Vision</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              To create an ecosystem where recruiters can find matching talent instantaneously and applicants are evaluated on their true qualifications.
            </p>
          </div>

          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 hover:border-[#7FE252]/20 transition-all">
            <div className="w-10 h-10 rounded-lg bg-[#7FE252]/10 flex items-center justify-center text-[#7FE252] mb-6">
              <Award size={20} />
            </div>
            <h3 className="text-lg font-medium text-white mb-3">Our Value</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              We prioritize accuracy, user privacy, and technical excellence. Our algorithms are continuously calibrated for fairness.
            </p>
          </div>
        </div>

        {/* Tech Stack overview */}
        <div className="border border-white/5 bg-[#0a0a0a] rounded-3xl p-10 max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/2">
            <span className="text-xs font-mono text-[#7FE252] uppercase tracking-widest block mb-2">Technological Foundation</span>
            <h3 className="text-xl md:text-2xl font-semibold text-white mb-4">Powered by Modern AI Tech Stack</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              QuickHire is built using a React frontend and a Flask backend. The core ML model is based on <strong>IndoBERT</strong> (Bidirectional Encoder Representations from Transformers), fine-tuned for semantic text reranking using PyTorch and Hugging Face.
            </p>
          </div>
          <div className="md:w-1/2 w-full grid grid-cols-2 gap-4">
            <div className="bg-[#121212] border border-white/5 rounded-xl p-4 text-center">
              <span className="block text-[#7FE252] text-lg font-semibold font-mono">React</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 block">Frontend</span>
            </div>
            <div className="bg-[#121212] border border-white/5 rounded-xl p-4 text-center">
              <span className="block text-[#7FE252] text-lg font-semibold font-mono">Flask</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 block">Backend API</span>
            </div>
            <div className="bg-[#121212] border border-white/5 rounded-xl p-4 text-center">
              <span className="block text-[#7FE252] text-lg font-semibold font-mono">IndoBERT</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 block">Neural Model</span>
            </div>
            <div className="bg-[#121212] border border-white/5 rounded-xl p-4 text-center">
              <span className="block text-[#7FE252] text-lg font-semibold font-mono">MongoDB</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 block">Database</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
