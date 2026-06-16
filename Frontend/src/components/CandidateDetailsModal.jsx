import React from 'react';
import ScoreRing from './ScoreRing';
import API_BASE_URL from '../config/api';

const CandidateDetailsModal = ({
  candidate,
  onClose,
  extractSkills,
  extractExperience,
  jobDescRaw
}) => {
  if (!candidate) return null;

  const pdfUrl = `${API_BASE_URL}/api/cvs/${encodeURIComponent(candidate.filename)}`;

  // Extract skills and experience
  const { required, matched, missing, candidateSkills } = extractSkills(jobDescRaw, candidate.text_preview);
  const experienceText = extractExperience(candidate.text_preview);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-[#0c0c0c] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl relative">

        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border border-[#7FE252] flex items-center justify-center text-[#7FE252] font-semibold text-lg">
              {candidate.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{candidate.name}</h2>
              <p className="text-sm text-gray-400">{candidate.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-white/10 hover:border-white/30 flex items-center justify-center text-gray-400 hover:text-white transition"
          >
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6 overflow-y-auto">

          {/* Left Column: Stats */}
          <div className="flex flex-col gap-5 border-b md:border-b-0 md:border-r border-white/5 pb-6 md:pb-0 md:pr-6">

            {/* Match Score Gauge */}
            <div className="bg-[#121212] border border-white/5 rounded-xl p-5 flex flex-col items-center text-center">
              <span className="text-xs text-gray-400 mb-3">Overall Match Score</span>
              <div className="relative w-24 h-24 flex items-center justify-center mb-2">
                <ScoreRing score={candidate.score} />
                <span className="absolute text-xl font-bold text-[#7FE252]">{candidate.score}%</span>
              </div>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest">Cosine Similarity</span>
            </div>

            {/* Experience & Details */}
            <div className="flex flex-col gap-3">
              <div className="bg-[#121212] border border-white/5 rounded-xl p-3 flex justify-between items-center">
                <span className="text-xs text-gray-400">Pengalaman</span>
                <span className="text-xs font-medium text-white">{experienceText}</span>
              </div>
              <div className="bg-[#121212] border border-white/5 rounded-xl p-3 flex flex-col gap-1">
                <span className="text-xs text-gray-400">Nama File</span>
                <span className="text-[10px] text-gray-300 truncate font-mono">{candidate.filename}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Skills & Preview */}
          <div className="flex flex-col gap-6 overflow-hidden">

            {/* Skills Section */}
            <div className="flex flex-col gap-4">
              {/* Matched Skills */}
              <div>
                <h4 className="text-xs text-gray-400 uppercase tracking-wider mb-2">Keahlian yang Cocok ({matched.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {matched.length > 0 ? (
                    matched.map(skill => (
                      <span key={skill} className="bg-[#7FE252]/10 text-[#7FE252] text-xs px-3 py-1 rounded-md border border-[#7FE252]/20 capitalize">
                        {skill}
                      </span>
                    ))
                  ) : required.length > 0 ? (
                    <span className="text-xs text-gray-500">— Tidak ada keahlian yang cocok —</span>
                  ) : (
                    // Jika tidak ada job description, tampilkan skill kandidat yang terdeteksi
                    candidateSkills.map(skill => (
                      <span key={skill} className="bg-[#7FE252]/10 text-[#7FE252] text-xs px-3 py-1 rounded-md border border-[#7FE252]/20 capitalize">
                        {skill}
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Missing Skills */}
              {required.length > 0 && (
                <div>
                  <h4 className="text-xs text-gray-400 uppercase tracking-wider mb-2">Keahlian yang Kurang ({missing.length})</h4>
                  <div className="flex flex-wrap gap-2">
                    {missing.length > 0 ? (
                      missing.map(skill => (
                        <span key={skill} className="bg-red-500/10 text-red-400 text-xs px-3 py-1 rounded-md border border-red-500/20 capitalize">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-500 font-medium text-[#7FE252]">✓ Semua keahlian cocok</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* CV Document View */}
            <div className="flex flex-col gap-2 flex-grow min-h-[400px]">
              <div className="flex justify-between items-center">
                <h4 className="text-xs text-gray-400 uppercase tracking-wider">Dokumen CV Asli</h4>
                <a 
                  href={pdfUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-[#7FE252] hover:underline flex items-center gap-1 font-medium"
                >
                  Buka di Tab Baru ↗
                </a>
              </div>
              <div className="bg-[#121212] border border-white/5 rounded-xl overflow-hidden flex-grow h-full min-h-[350px]">
                <iframe 
                  src={pdfUrl} 
                  title={`CV - ${candidate.name}`}
                  className="w-full h-full border-none"
                  style={{ background: '#121212' }}
                />
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default CandidateDetailsModal;
