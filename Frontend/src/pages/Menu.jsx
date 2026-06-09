import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const Menu = ({ setCurrentPage }) => (
  <div className="flex flex-col items-center">
    {/* Hero Section */}
    <section className="w-full max-w-6xl mx-auto px-6 py-24 text-center flex flex-col items-center">
      <h1 className="text-5xl md:text-6xl font-semibold mb-6 tracking-tight text-[#7FE252] max-w-3xl">
        Automated Recruitment<br />for Efficient Hiring
      </h1>
      <p className="text-gray-400 mb-10 max-w-xl mx-auto text-sm md:text-base">
        Recruit smarter, faster, and more accurately with AI-powered CV screening and candidate matching.
      </p>
      <button onClick={() => setCurrentPage('signup')} className="bg-[#7FE252] text-black px-8 py-3 rounded-full text-sm font-bold hover:bg-[#6ed243] transition mb-16">
        Get Started
      </button>

      {/* 3D Cubes Visual Placeholder */}
      <div className="flex items-center justify-center gap-8 mb-10 w-full max-w-3xl">
        <div className="w-24 h-24 bg-gradient-to-br from-[#2a2a2a] to-[#0a0a0a] border-t-2 border-[#7FE252] rounded-lg shadow-[0_0_30px_rgba(127,226,82,0.1)] transform rotate-12 flex items-center justify-center opacity-80 mt-12">
           <div className="w-full h-px bg-[#7FE252] shadow-[0_0_10px_#7FE252]"></div>
        </div>
        <div className="w-40 h-40 bg-gradient-to-br from-[#333] to-[#111] border-t-4 border-b-4 border-[#7FE252] rounded-xl shadow-[0_0_50px_rgba(127,226,82,0.2)] flex flex-col justify-around py-4 z-10">
           <div className="w-full h-1 bg-[#7FE252] shadow-[0_0_15px_#7FE252]"></div>
           <div className="w-full h-1 bg-[#7FE252] shadow-[0_0_15px_#7FE252]"></div>
        </div>
         <div className="w-24 h-24 bg-gradient-to-br from-[#2a2a2a] to-[#0a0a0a] border-b-2 border-[#7FE252] rounded-lg shadow-[0_0_30px_rgba(127,226,82,0.1)] transform -rotate-12 flex items-center justify-center opacity-80 mt-12">
           <div className="w-full h-px bg-[#7FE252] shadow-[0_0_10px_#7FE252]"></div>
        </div>
      </div>
    </section>

    {/* Features Section */}
    <section className="w-full max-w-7xl mx-auto px-6 py-20 bg-[#0a0a0a] border-t border-white/5">
      <h2 className="text-3xl md:text-4xl font-medium mb-16 ml-4">AI-Powered Recruitment Assistant</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-b border-white/5">
        {/* Feature 1 */}
        <div className="p-8 border-l border-[#7FE252] flex flex-col">
          <h3 className="text-xl mb-4">Resume Parsing</h3>
          <p className="text-sm text-gray-500 mb-12 flex-grow leading-relaxed">
            Automatically extract candidate skills, education, and experience from uploaded CVs using AI-powered parsing.
          </p>
          <div className="h-48 border border-white/10 rounded-md mb-8 flex items-center justify-center bg-[#111]">
            <div className="w-24 h-24 border border-white/20 border-b-0 border-r-0 relative">
               <div className="absolute bottom-0 right-0 w-12 h-12 border border-white/20 border-t-0 border-l-0"></div>
            </div>
          </div>
          <button className="self-start text-xs font-mono tracking-widest border border-white/20 rounded-full px-6 py-2 flex items-center gap-2 hover:bg-white/5">
            USE NOW <ArrowUpRight size={14} />
          </button>
        </div>

        {/* Feature 2 */}
        <div className="p-8 border-l border-[#7FE252] flex flex-col">
          <h3 className="text-xl mb-4">Candidate Matching</h3>
          <p className="text-sm text-gray-500 mb-12 flex-grow leading-relaxed">
            Match candidates with job descriptions using semantic similarity for more accurate recruitment results.
          </p>
          <div className="h-48 border border-white/10 rounded-md mb-8 bg-[#111] overflow-hidden flex flex-col">
             <div className="flex-grow relative flex items-center justify-center">
                <div className="absolute w-full h-px bg-white/5"></div>
                <div className="w-1.5 h-1.5 bg-[#7FE252] rounded-full absolute left-[40%] mb-4 shadow-[0_0_10px_#7FE252]"></div>
             </div>
          </div>
          <button className="self-start text-xs font-mono tracking-widest border border-white/20 rounded-full px-6 py-2 flex items-center gap-2 hover:bg-white/5">
            BUILD NOW <ArrowUpRight size={14} />
          </button>
        </div>

        {/* Feature 3 */}
        <div className="p-8 border-l border-[#7FE252] flex flex-col">
          <h3 className="text-xl mb-4">Smart Ranking</h3>
          <p className="text-sm text-gray-500 mb-12 flex-grow leading-relaxed">
            Rank candidates based on skill compatibility and overall relevance to help recruiters hire faster.
          </p>
          <div className="h-48 border border-white/10 rounded-md mb-8 flex items-center justify-center bg-[#111]">
             <div className="w-3/4 h-3/4 border border-white/10 flex flex-col gap-2 p-4">
                <div className="w-full h-px bg-white/20"></div>
                <div className="w-5/6 h-px bg-white/10"></div>
             </div>
          </div>
          <button className="self-start text-xs font-mono tracking-widest border border-white/20 rounded-full px-6 py-2 flex items-center gap-2 hover:bg-white/5">
            LEARN MORE <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </section>
  </div>
);

export default Menu;