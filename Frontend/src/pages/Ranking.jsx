import React, { useState, useEffect } from 'react';
import {
  Bell,
  ChevronDown,
  Users,
  Star,
  BarChart2,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Upload,
  LogOut,
  Loader
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import cvService from '../services/cvService';
import ScoreRing from '../components/ScoreRing';
import CandidateDetailsModal from '../components/CandidateDetailsModal';
import { Logo } from '../components/Navigation';

const getShortJobTitle = (desc) => {
  if (!desc) return 'Job Screening';
  const cleanDesc = desc.toLowerCase();
  if (cleanDesc.includes('data scientist')) return 'Data Scientist';
  if (cleanDesc.includes('machine learning engineer') || cleanDesc.includes('ml engineer')) return 'Machine Learning Engineer';
  if (cleanDesc.includes('data analyst')) return 'Data Analyst';
  if (cleanDesc.includes('software engineer')) return 'Software Engineer';
  if (cleanDesc.includes('business analyst')) return 'Business Analyst';
  if (cleanDesc.includes('ui/ux designer') || cleanDesc.includes('ui/ux')) return 'UI/UX Designer';
  return desc.length > 30 ? desc.substring(0, 30) + '...' : desc;
};

const Ranking = ({ setCurrentPage }) => {
  const { user, logout, getUserInitials } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [jobTitle, setJobTitle] = useState('Job Screening');
  const [stats, setStats] = useState({
    total: 0,
    topScore: 0,
    avgScore: 0,
    shortlisted: 0
  });

  // State baru untuk Pagination dan Dropdown Riwayat
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [showDropdown, setShowDropdown] = useState(false);
  const [historyList, setHistoryList] = useState([]);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  // State baru untuk Detail Modal & Job Desc Mentah
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [jobDescRaw, setJobDescRaw] = useState('');

  const itemsPerPage = 5;

  useEffect(() => {
    const fetchRankings = async () => {
      const screeningId = localStorage.getItem('screening_id');
      if (!screeningId) {
        setError('No screening ID found. Please upload CVs first.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Reset ke halaman 1 setiap kali mengambil ranking baru
        setCurrentPageNum(1);

        // Fetch candidates rankings
        const rankingResult = await cvService.getRankings(screeningId);

        // Fetch job description / general results info
        const resultInfo = await cvService.getResults(screeningId);

        if (rankingResult.success) {
          const list = rankingResult.data.rankings || [];
          setCandidates(list);

          // Calculate statistics
          const topScore = list.length > 0 ? list[0].score : 0;
          const totalScore = list.reduce((acc, c) => acc + (c.score || 0), 0);
          const avgScore = list.length > 0 ? Math.round(totalScore / list.length) : 0;
          const shortlisted = list.filter(c => c.score >= 80).length;

          setStats({
            total: list.length,
            topScore,
            avgScore,
            shortlisted
          });
        } else {
          setError(rankingResult.data?.message || 'Failed to fetch rankings');
        }

        if (resultInfo.success) {
          const desc = resultInfo.data.job_description || 'Job Screening';
          setJobTitle(getShortJobTitle(desc));
          setJobDescRaw(desc);
        }
      } catch (err) {
        setError('Error loading rankings: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchHistory = async () => {
      try {
        const historyResult = await cvService.getHistory();
        if (historyResult.success) {
          setHistoryList(historyResult.data.history || []);
        }
      } catch (err) {
        console.error('Error fetching history:', err);
      }
    };

    fetchRankings();
    fetchHistory();
  }, [reloadTrigger]);

  const handleLogout = () => {
    logout();
    setCurrentPage('login');
  };

  const extractSkills = (jobDesc, cvText) => {
    const skillsList = [
      "python", "javascript", "react", "node.js", "node", "express", "mongodb", "postgresql", "mysql", "sql",
      "html", "css", "machine learning", "deep learning", "nlp", "tensorflow", "pytorch", "java", "c++",
      "docker", "kubernetes", "aws", "gcp", "azure", "git", "data analysis", "data science", "tableau",
      "power bi", "excel", "ui", "ux", "figma", "agile", "scrum", "kotlin", "swift", "flutter",
      "react native", "django", "flask", "spring boot", "devops", "ci/cd", "rest api", "graphql", "tailwind",
      "typescript", "product design", "project management", "php", "laravel", "vue", "angular"
    ];

    const cleanJob = (jobDesc || "").toLowerCase();
    const cleanCv = (cvText || "").toLowerCase();

    // Find skills mentioned in the job description
    const required = skillsList.filter(skill => {
      const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'i');
      return regex.test(cleanJob);
    });

    // Find skills mentioned in the CV
    const candidateSkills = skillsList.filter(skill => {
      const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'i');
      return regex.test(cleanCv);
    });

    const matched = required.filter(s => candidateSkills.includes(s));
    const missing = required.filter(s => !candidateSkills.includes(s));

    return { required, candidateSkills, matched, missing };
  };

  const extractExperience = (cvText) => {
    if (!cvText) return "Tidak terdeteksi";
    const text = cvText.toLowerCase();
    const matchYears = text.match(/(\d+)\s*(?:years?|thn|tahun)\s*(?:of\s*)?(?:exp|experience|pengalaman)/i);
    if (matchYears) {
      return `${matchYears[1]} Tahun`;
    }
    const matchIndo = text.match(/(?:pengalaman|kerja)\s*(\d+)\s*tahun/i);
    if (matchIndo) {
      return `${matchIndo[1]} Tahun`;
    }
    return "Ditinjau di CV";
  };

  // Hitung data untuk pagination
  const totalPages = Math.max(1, Math.ceil(candidates.length / itemsPerPage));
  const indexOfLastItem = currentPageNum * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCandidates = candidates.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans">

      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#0a0a0a]">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentPage('menu')}>
          <div className="scale-75"><Logo /></div>
          <span className="text-lg font-semibold tracking-wide">QuickHire</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 cursor-pointer group relative">
            <div className="w-8 h-8 rounded-full bg-[#7FE252] flex items-center justify-center text-black font-bold text-sm">
              {getUserInitials()}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium leading-tight">{user?.username || 'User'}</span>
              <span className="text-xs text-gray-500">{user?.role || 'Recruiter'}</span>
            </div>
            <ChevronDown size={16} className="text-gray-400 ml-2" />

            {/* Dropdown Menu */}
            <div className="absolute right-0 top-12 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 w-48 py-1">
              <button
                onClick={() => setCurrentPage('dashboard')}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-gray-300 hover:text-white hover:bg-[#2a2a2a] transition"
              >
                <Upload size={14} className="text-[#7FE252]" /> Upload CV
              </button>
              <button
                onClick={() => setCurrentPage('ranking')}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-gray-300 hover:text-white hover:bg-[#2a2a2a] transition"
              >
                <BarChart2 size={14} className="text-[#7FE252]" /> Dashboard Ranking
              </button>
              <div className="h-px bg-white/5 my-1"></div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-red-400 hover:text-red-300 hover:bg-[#2a2a2a] transition border-t border-white/5"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-8 max-w-[1400px] mx-auto w-full">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-semibold mb-2"><span className="text-[#7FE252]">Candidate</span> Ranking</h1>
            <p className="text-gray-400 text-sm">AI-powered ranking based on job description match and candidate relevance.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <div
                onClick={() => setShowDropdown(!showDropdown)}
                className="bg-[#121212] border border-white/10 rounded-lg px-4 py-2 flex items-center gap-10 cursor-pointer hover:border-white/20 transition"
              >
                <span className="text-sm">{jobTitle}</span>
                <ChevronDown size={16} className="text-gray-400" />
              </div>

              {showDropdown && historyList.length > 0 && (
                <div className="absolute right-0 top-12 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-lg z-50 w-72 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {historyList.map((item) => (
                    <button
                      key={item.screening_id}
                      onClick={() => {
                        localStorage.setItem('screening_id', item.screening_id);
                        setShowDropdown(false);
                        setReloadTrigger(prev => prev + 1);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-[#2a2a2a] transition border-t border-white/5 first:border-t-0 rounded-lg"
                    >
                      <span className="block truncate font-medium">{getShortJobTitle(item.job_description)}</span>
                      <span className="block text-[10px] text-gray-500 mt-1">
                        {item.created_at ? new Date(item.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }) : '—'} • {item.cv_count} CV
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => setCurrentPage('dashboard')} className="bg-[#7FE252] text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#6ed243] transition flex items-center gap-2">
              <Upload size={16} /> Upload More CVs
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1 */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-5 flex items-center gap-5">
            <div className="w-12 h-12 rounded-lg bg-[#7FE252]/10 flex items-center justify-center text-[#7FE252]">
              <Users size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Total Candidates</p>
              <h3 className="text-3xl font-semibold text-[#7FE252]">{candidates.length}</h3>
              <p className="text-xs text-gray-500 mt-1">CVs analyzed</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-5 flex items-center gap-5">
            <div className="w-12 h-12 rounded-lg bg-[#7FE252]/10 flex items-center justify-center text-[#7FE252]">
              <Star size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Top Match Score</p>
              <h3 className="text-3xl font-semibold text-[#7FE252]">{stats.topScore}%</h3>
              <p className="text-xs text-gray-500 mt-1">Best candidate match</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-5 flex items-center gap-5">
            <div className="w-12 h-12 rounded-lg bg-[#7FE252]/10 flex items-center justify-center text-[#7FE252]">
              <BarChart2 size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Average Match Score</p>
              <h3 className="text-3xl font-semibold text-[#7FE252]">{stats.avgScore}%</h3>
              <p className="text-xs text-gray-500 mt-1">Across all candidates</p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-5 flex items-center gap-5">
            <div className="w-12 h-12 rounded-lg bg-[#7FE252]/10 flex items-center justify-center text-[#7FE252]">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Selected Candidates</p>
              <h3 className="text-3xl font-semibold text-[#7FE252]">{stats.shortlisted}</h3>
              <p className="text-xs text-gray-500 mt-1">{"Shortlisted (>= 80%)"}</p>
            </div>
          </div>
        </div>

        {/* Ranking Results Table/List */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6 overflow-x-auto">
          <h2 className="text-lg font-medium mb-6">Ranking Results</h2>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-3">
                <Loader size={32} className="text-[#7FE252] animate-spin" />
                <p className="text-gray-400">Loading rankings...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg text-center">
              {error}
            </div>
          ) : candidates.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              No candidates found. Please upload CVs first.
            </div>
          ) : (
            <div className="min-w-[1000px]">
              {/* Table Header */}
              <div className="grid grid-cols-[60px_220px_160px_1fr_180px_100px_140px] gap-4 mb-4 text-xs text-gray-400 font-medium px-2">
                <div>Rank</div>
                <div>Candidate</div>
                <div>Match Score</div>
                <div>Matched Skills</div>
                <div>Missing Skills</div>
                <div>Experience</div>
                <div>Actions</div>
              </div>

              {/* Table Rows */}
              <div className="flex flex-col gap-3">
                {currentCandidates.map((candidate, index) => (
                  <div key={candidate.id} className="grid grid-cols-[60px_220px_160px_1fr_180px_100px_140px] gap-4 items-center bg-[#121212] border border-white/5 rounded-xl p-3 hover:border-white/10 transition">

                    {/* Rank */}
                    <div className="flex justify-center">
                      <div className="w-8 h-8 rounded bg-[#7FE252] text-black flex items-center justify-center font-bold text-sm">
                        {candidate.rank || (indexOfFirstItem + index + 1)}
                      </div>
                    </div>

                    {/* Candidate Info */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border border-[#7FE252] flex items-center justify-center text-[#7FE252] font-medium text-sm">
                        {candidate.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{candidate.name}</span>
                        <span className="text-xs text-gray-500">{candidate.email}</span>
                      </div>
                    </div>

                    {/* Match Score */}
                    <div className="flex items-center gap-3">
                      <ScoreRing score={candidate.score} />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">{candidate.score}%</span>
                        <span className="text-[10px] text-gray-400">Match</span>
                      </div>
                    </div>

                    {/* Matched Skills */}
                    <div className="flex flex-wrap gap-1.5 items-center max-w-[200px] overflow-hidden truncate">
                      {(() => {
                        const { required, matched, candidateSkills } = extractSkills(jobDescRaw, candidate.text_preview);
                        const displayList = required.length > 0 ? matched : candidateSkills.slice(0, 3);
                        return displayList.length > 0 ? (
                          displayList.map(skill => (
                            <span key={skill} className="bg-[#7FE252]/10 text-[#7FE252] text-[10px] px-2 py-1 rounded-md border border-[#7FE252]/20 capitalize">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500">—</span>
                        );
                      })()}
                    </div>

                    {/* Missing Skills */}
                    <div className="flex flex-wrap gap-1.5 items-center max-w-[180px] overflow-hidden truncate">
                      {(() => {
                        const { required, missing } = extractSkills(jobDescRaw, candidate.text_preview);
                        return required.length > 0 && missing.length > 0 ? (
                          missing.slice(0, 3).map(skill => (
                            <span key={skill} className="bg-red-500/10 text-red-400 text-[10px] px-2 py-1 rounded-md border border-red-500/20 capitalize">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500">—</span>
                        );
                      })()}
                    </div>

                    {/* Experience */}
                    <div className="text-xs text-gray-300">
                      {extractExperience(candidate.text_preview)}
                    </div>

                    {/* Actions */}
                    <div>
                      <button
                        onClick={() => setSelectedCandidate(candidate)}
                        className="flex items-center justify-between w-full border border-white/20 text-xs px-3 py-2 rounded-lg hover:bg-white/5 transition"
                      >
                        View Details <ChevronRight size={14} className="text-gray-400" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-8 px-2">
                <span className="text-xs text-gray-400">
                  {candidates.length > 0
                    ? `Showing ${indexOfFirstItem + 1} to ${Math.min(indexOfLastItem, candidates.length)} of ${candidates.length} candidates`
                    : 'Showing 0 to 0 of 0 candidates'
                  }
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    disabled={currentPageNum === 1}
                    onClick={() => setCurrentPageNum(prev => Math.max(1, prev - 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-gray-400 hover:bg-white/5 transition disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={14} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPageNum(pageNum)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg border transition ${currentPageNum === pageNum
                        ? 'border-[#7FE252] text-[#7FE252] bg-[#7FE252]/5'
                        : 'border-white/10 text-gray-400 hover:bg-white/5'
                        }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    disabled={currentPageNum === totalPages}
                    onClick={() => setCurrentPageNum(prev => Math.min(totalPages, prev + 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-gray-400 hover:bg-white/5 transition disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>

      </main>

      {/* Detail Candidate Modal */}
      <CandidateDetailsModal
        candidate={selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        extractSkills={extractSkills}
        extractExperience={extractExperience}
        jobDescRaw={jobDescRaw}
      />
    </div >
  );
};

export default Ranking;