import React, { useState } from 'react';
import {
  UploadCloud,
  X,
  CheckCircle2,
  ShieldCheck,
  Code,
  BarChart,
  Monitor,
  Network,
  Globe,
  PenTool,
  Bell,
  ChevronDown,
  Check,
  LogOut
} from 'lucide-react';
import { Logo } from '../components/Navigation';
import { useAuth } from '../context/AuthContext';
import cvService from '../services/cvService';

const Dashboard = ({ setCurrentPage }) => {
  const { user, logout, getUserInitials } = useAuth();
  const [activeTab, setActiveTab] = useState('template');
  const [selectedJob, setSelectedJob] = useState('data-scientist');
  const [customJobDescription, setCustomJobDescription] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isScreening, setIsScreening] = useState(false);
  const [screeningMessage, setScreeningMessage] = useState('');

  const removeFile = (idToRemove) => {
    setUploadedFiles(uploadedFiles.filter(file => file.id !== idToRemove));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file, index) => {
      if (file.type === 'application/pdf' && file.size <= 10 * 1024 * 1024) {
        setUploadedFiles([...uploadedFiles, {
          id: Date.now() + index,
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
          file: file
        }]);
      }
    });
  };

  const handleScreening = async () => {
    if (uploadedFiles.length === 0) {
      setScreeningMessage('Silakan upload minimal satu CV');
      return;
    }

    // Get job description based on active tab
    let jobDescription = '';
    if (activeTab === 'template') {
      const selectedJobTemplate = jobTemplates.find(j => j.id === selectedJob);
      jobDescription = selectedJobTemplate ? selectedJobTemplate.desc : '';
    } else {
      jobDescription = customJobDescription.trim();
    }

    if (!jobDescription) {
      setScreeningMessage('Silakan pilih atau masukkan deskripsi pekerjaan');
      return;
    }

    setIsScreening(true);
    setScreeningMessage('Processing...');

    try {
      const formData = new FormData();
      uploadedFiles.forEach(f => {
        formData.append('files', f.file);
      });
      formData.append('jobDescription', jobDescription);

      const result = await cvService.uploadCVs(formData);

      if (result.success) {
        setScreeningMessage('Screening berhasil! Mengarahkan ke hasil...');
        // Save screening_id untuk diambil di halaman Ranking
        localStorage.setItem('screening_id', result.data.screening_id);
        setTimeout(() => {
          setCurrentPage('ranking');
        }, 2000);
      } else {
        setScreeningMessage('Screening gagal: ' + (result.data.message || 'Coba lagi'));
      }
    } catch (error) {
      setScreeningMessage('Error: ' + error.message);
    } finally {
      setIsScreening(false);
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentPage('login');
  };

  const jobTemplates = [
    { id: 'data-scientist', title: 'Data Scientist', desc: 'Analyze data and build machine learning models.', icon: Code },
    { id: 'ml-engineer', title: 'Machine Learning Engineer', desc: 'Build and deploy machine learning models.', icon: Network },
    { id: 'data-analyst', title: 'Data Analyst', desc: 'Extract insight from data and create reports.', icon: BarChart },
    { id: 'software-engineer', title: 'Software Engineer', desc: 'Design and build scalable software solutions.', icon: Globe },
    { id: 'business-analyst', title: 'Business Analyst', desc: 'Analyze business needs and provide data solution.', icon: Monitor },
    { id: 'ui-ux', title: 'UI/UX Designer', desc: 'Design user-centered interfaces and experiences.', icon: PenTool },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans">

      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#0a0a0a]">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentPage('menu')}>
          <div className="scale-75"><Logo /></div>
          <span className="text-lg font-semibold tracking-wide">QuickHire</span>
        </div>

        <div className="flex items-center gap-6">
          <button className="text-gray-400 hover:text-white transition">
            <Bell size={20} />
          </button>
          <div className="flex items-center gap-3 cursor-pointer border-l border-white/10 pl-6 group relative">
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
                <UploadCloud size={14} className="text-[#7FE252]" /> Upload CV
              </button>
              <button
                onClick={() => setCurrentPage('ranking')}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-gray-300 hover:text-white hover:bg-[#2a2a2a] transition"
              >
                <BarChart size={14} className="text-[#7FE252]" /> Dashboard Ranking
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
      <main className="flex-grow p-8 max-w-7xl mx-auto w-full">

        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4 w-full">
          <div>
            <h1 className="text-3xl font-semibold mb-2"><span className="text-[#7FE252]">Upload CVs</span> & Select Job</h1>
            <p className="text-gray-400 text-sm">Upload candidate CVs and select a job to start AI-powered screening and ranking.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={() => setCurrentPage('ranking')}
              className="border border-[#7FE252]/30 hover:border-[#7FE252]/60 text-[#7FE252] hover:bg-[#7FE252]/10 px-4 py-2.5 rounded-lg text-sm font-medium transition text-center whitespace-nowrap"
            >
              Go to Rankings Dashboard
            </button>

            {/* Breadcrumbs / How it works */}
            <div className="bg-[#121212] border border-white/5 rounded-lg p-4 flex flex-col gap-3 min-w-[300px]">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <ShieldCheck size={16} className="text-[#7FE252]" /> How it works
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="text-[#7FE252]">1</span> <span className="text-white">Upload CVs</span>
                <span>›</span>
                <span className="text-[#7FE252]">2</span> <span className="text-white">Select Job</span>
                <span>›</span>
                <span className="text-[#7FE252]">3</span> <span>Get Ranking</span>
              </div>
            </div>
          </div>
        </div>

          {/* Two Column Layout */ }
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

    {/* Left Column: Upload CVs */}
    <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6 flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-white/5 rounded flex items-center justify-center text-[#7FE252] text-sm font-mono">1</div>
        <div>
          <h2 className="text-lg font-medium">Upload CVs</h2>
          <p className="text-xs text-gray-500">Upload multiple CV files (PDF only)</p>
        </div>
      </div>

      {/* Drag & Drop Zone */}
      <div className="border border-dashed border-white/20 rounded-xl p-10 flex flex-col items-center justify-center text-center bg-[#121212] hover:bg-[#1a1a1a] transition cursor-pointer group">
        <input
          type="file"
          id="cv-upload"
          multiple
          accept=".pdf"
          onChange={handleFileUpload}
          className="hidden"
        />
        <label htmlFor="cv-upload" className="w-full cursor-pointer flex flex-col items-center">
          <UploadCloud size={48} className="text-[#7FE252] mb-4 group-hover:scale-110 transition-transform" />
          <p className="text-sm mb-2">Drag & drop CV files here</p>
          <p className="text-xs text-gray-500 mb-4">or</p>
          <button type="button" className="border border-[#7FE252] text-[#7FE252] px-6 py-2 rounded-lg text-sm hover:bg-[#7FE252]/10 transition">
            Browse Files
          </button>
          <p className="text-xs text-gray-500 mt-4">PDF format only max 10MB per file</p>
        </label>
      </div>

      {/* Uploaded Files List */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-300">Uploaded Files ({uploadedFiles.length})</span>
          <button className="text-[#7FE252] text-xs hover:underline">Clear All</button>
        </div>

        <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
          {uploadedFiles.map((file) => (
            <div key={file.id} className="flex items-center justify-between bg-[#121212] p-3 rounded-lg border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500/10 rounded flex items-center justify-center">
                  <span className="text-red-500 text-xs font-bold">PDF</span>
                </div>
                <span className="text-sm text-gray-300">{file.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-500">{file.size}</span>
                <button onClick={() => removeFile(file.id)} className="text-gray-500 hover:text-white transition">
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {uploadedFiles.length > 0 && (
          <div className="bg-[#7FE252]/10 border border-[#7FE252]/20 text-[#7FE252] p-3 rounded-lg flex items-center gap-2 text-sm mt-2">
            <CheckCircle2 size={16} />
            <span>{uploadedFiles.length} files uploaded successfully</span>
          </div>
        )}
      </div>
    </div>

    {/* Right Column: Select Job */}
    <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6 flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-white/5 rounded flex items-center justify-center text-[#7FE252] text-sm font-mono">2</div>
        <div>
          <h2 className="text-lg font-medium">Select Job / Job Description</h2>
          <p className="text-xs text-gray-500">Choose a job or input custom job description</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex rounded-lg bg-[#121212] p-1 border border-white/5">
        <button
          onClick={() => setActiveTab('template')}
          className={`flex-1 py-2 text-sm text-center rounded-md transition ${activeTab === 'template' ? 'bg-[#1a1a1a] text-[#7FE252] border-b-2 border-[#7FE252]' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Choose from Template
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={`flex-1 py-2 text-sm text-center rounded-md transition ${activeTab === 'custom' ? 'bg-[#1a1a1a] text-[#7FE252] border-b-2 border-[#7FE252]' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Custom Job Description
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'template' ? (
        <div className="flex flex-col gap-4 flex-grow">
          <span className="text-sm text-gray-300">Popular Jobs</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-grow overflow-y-auto pr-2 custom-scrollbar max-h-[350px]">
            {jobTemplates.map((job) => {
              const Icon = job.icon;
              const isSelected = selectedJob === job.id;
              return (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition flex flex-col gap-3 relative overflow-hidden ${isSelected ? 'border-[#7FE252] bg-[#7FE252]/5' : 'border-white/5 bg-[#121212] hover:border-white/20'}`}
                >
                  <div className="flex items-start justify-between">
                    <Icon size={24} className={isSelected ? 'text-[#7FE252]' : 'text-gray-500'} />
                    {isSelected && <CheckCircle2 size={20} className="text-[#7FE252]" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">{job.title}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{job.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 flex-grow">
          <label className="text-sm text-gray-300">Job Description</label>
          <textarea
            value={customJobDescription}
            onChange={(e) => setCustomJobDescription(e.target.value)}
            className="w-full flex-grow bg-[#121212] border border-white/10 rounded-lg p-4 text-sm text-gray-300 focus:border-[#7FE252] outline-none resize-none transition"
            placeholder="Paste or type the detailed job description here. Our AI will match candidates against these specific requirements..."
          />
        </div>
      )}

      {/* Submit Button */}
      <div className="mt-auto pt-4 flex flex-col gap-3">
        {screeningMessage && (
          <div className={`text-center text-sm p-3 rounded-lg ${screeningMessage.includes('berhasil')
            ? 'bg-[#7FE252]/10 text-[#7FE252]'
            : screeningMessage.includes('Processing')
              ? 'bg-blue-500/10 text-blue-400'
              : 'bg-red-500/10 text-red-400'
            }`}>
            {screeningMessage}
          </div>
        )}
        <button
          onClick={handleScreening}
          disabled={isScreening}
          className="w-full bg-[#7FE252] text-black font-semibold py-4 rounded-lg hover:bg-[#6ed243] transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isScreening ? 'Processing...' : 'Start Screening'}
        </button>
        <p className="text-center text-xs text-gray-500">You can review before starting</p>
      </div>

    </div>
  </div>

  {/* Footer Note */ }
  <div className="mt-8 flex items-center gap-3 bg-[#0a0a0a] border border-white/5 p-4 rounded-lg w-fit">
    <ShieldCheck size={24} className="text-[#7FE252]" />
    <div>
      <p className="text-sm font-medium">Your data is secure and confidential</p>
      <p className="text-xs text-gray-500">We only use your data for AI-powered screening and analysis.</p>
    </div>
  </div>
      </main >
    </div >
  );
};

export default Dashboard;