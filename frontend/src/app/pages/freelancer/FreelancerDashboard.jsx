import { Card } from '../../components/ui/card.jsx';
import { Button } from '../../components/ui/button.jsx';
import { Badge } from '../../components/ui/badge.jsx';
import { Progress } from '../../components/ui/progress.jsx';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Briefcase,
  DollarSign,
  Star,
  ArrowRight,
  Zap,
  Target,
  Award,
  Clock,
  CheckCircle,
  Upload,
  MessageSquare,
  X,
  FileUp
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { mockApplications, mockGrowthTimeline, mockSkillGap } from '../../data/mockData';
import { useState, useEffect } from 'react';
import jobService from '../../services/jobService';
import proposalService from '../../services/proposalService';
import submissionService from '../../services/submissionService';
import { toast } from 'sonner';

export default function FreelancerDashboard() {
  const { user: currentUser, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeProjects, setActiveProjects] = useState([]);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submissionData, setSubmissionData] = useState({
    message: '',
    files: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [matchedJobRes, propRes] = await Promise.all([
          jobService.getMatchedJobs(),
          proposalService.getMyProposals()
        ]);

        if (matchedJobRes.success) setMatchedJobs(matchedJobRes.jobs || []);
        if (propRes.success) {
          setApplications(propRes.proposals);
          // Filter active projects (where status is accepted)
          const active = propRes.proposals.filter(p => p.status === 'accepted');
          setActiveProjects(active);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const topJobs = (matchedJobs || []).slice(0, 3);

  const recentApplications = applications.slice(0, 3);

  const calculateProgress = (deadline) => {
    const end = new Date(deadline).getTime();
    const now = new Date().getTime();
    const start = new Date(currentUser.createdAt).getTime(); // Rough estimation
    const total = end - start;
    const elapsed = now - start;
    return Math.min(Math.max(Math.round((elapsed / total) * 100), 10), 95);
  };

  const handleOpenSubmission = (project) => {
    setSelectedProject(project);
    setIsSubmissionModalOpen(true);
  };

  const handleSubmitWork = async (e) => {
    e.preventDefault();
    if (!submissionData.message || submissionData.files.length === 0) {
      return toast.error("Please provide a message and upload at least one file");
    }

    try {
      setSubmitLoading(true);
      const formData = new FormData();
      formData.append('jobId', selectedProject.jobId._id);
      formData.append('proposalId', selectedProject._id);
      formData.append('message', submissionData.message);
      
      submissionData.files.forEach(file => {
        formData.append('workFiles', file);
      });

      await submissionService.submitWork(formData);
      toast.success("Work submitted successfully!");
      setIsSubmissionModalOpen(false);
      setSubmissionData({ message: '', files: [] });
    } catch (error) {
      toast.error(error.message || "Failed to submit work");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (!currentUser) return null;

  // Prepare skill gap data for radar chart
  const skillGapData = Object.keys(mockSkillGap.current).map(skill => ({
    skill,
    current: mockSkillGap.current[skill],
    market: mockSkillGap.market[skill],
  }));

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome back, {currentUser.fullName?.split(' ')[0] || 'User'}! 👋</h2>
            <p className="text-indigo-100">You have {topJobs.length} new job matches and 2 unread messages</p>
          </div>
          <Link to="/freelancer/jobs">
            <Button className="bg-white text-indigo-600 hover:bg-indigo-50">
              Browse Jobs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
            </div>
            <Badge className="bg-green-100 text-green-700">+12%</Badge>
          </div>
          <div className="text-3xl font-bold mb-1">{currentUser.employabilityScore || 0}</div>
          <div className="text-sm text-gray-600">Employability Score</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-purple-600" />
            </div>
            <Badge className="bg-blue-100 text-blue-700">Active</Badge>
          </div>
          <div className="text-3xl font-bold mb-1">{currentUser.completedProjects || 0}</div>
          <div className="text-sm text-gray-600">Jobs Completed</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <Badge className="bg-green-100 text-green-700">+$450</Badge>
          </div>
          <div className="text-3xl font-bold mb-1">₹{(currentUser.earnings || 0).toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Earnings</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <Badge className="bg-yellow-100 text-yellow-700">Excellent</Badge>
          </div>
          <div className="text-3xl font-bold mb-1">{currentUser.rating || 0}</div>
          <div className="text-sm text-gray-600">Average Rating</div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - AI Job Matches */}
        <div className="lg:col-span-2 space-y-6">
          {/* 💼 Active Projects Section */}
          <Card className="p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600" />
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold">Active Projects</h3>
              </div>
              <Badge variant="outline" className="text-indigo-600 font-bold">
                {activeProjects.length} Running
              </Badge>
            </div>

            <div className="space-y-6">
              {activeProjects.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <p className="text-gray-500 text-sm">No active projects at the moment.</p>
                </div>
              ) : (
                activeProjects.map((project) => (
                  <div key={project._id} className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className="font-bold text-gray-900">{project.jobId.jobTitle}</h4>
                        <div className="flex items-center gap-3 text-xs font-semibold text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-indigo-400" />
                            Deadline: {new Date(project.jobId.deadline).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3 text-green-400" />
                            ₹{project.bidAmount}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-indigo-600 font-black italic">{calculateProgress(project.jobId.deadline)}% Completed</span>
                      </div>
                      <Progress value={calculateProgress(project.jobId.deadline)} className="h-1.5 bg-indigo-50" />
                    </div>
                    <div className="h-px bg-gray-100" />
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* AI Job Recommendations */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-bold">Matched Jobs for You</h3>
              </div>
              <Link to="/freelancer/jobs">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-10 text-gray-500">Loading matches...</div>
              ) : topJobs.length === 0 ? (
                <div className="text-center py-10 text-gray-500">No matches found</div>
              ) : (
                topJobs.map((job) => (
                  <div key={job._id} className="p-4 border rounded-lg hover:border-indigo-600 transition-all">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 font-bold overflow-hidden border shrink-0 text-sm">
                        {job.clientId?.profileImage || job.clientId?.companyLogo ? (
                          <img
                            src={job.clientId?.profileImage || job.clientId?.companyLogo}
                            alt={job.clientId?.companyName || job.clientId?.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          (job.clientId?.companyName || job.clientId?.fullName)?.[0]?.toUpperCase() || 'C'
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-bold text-gray-900 line-clamp-1">{job.jobTitle}</h4>
                          <div className="flex flex-col items-end gap-1">
                            <Badge className="bg-green-100 text-green-700 border-green-200">
                              {job.matchPercentage}% Match
                            </Badge>
                            <span className="text-[10px] font-bold text-gray-400">Budget: ₹{job.budget}</span>
                          </div>
                        </div>
                        <p className="text-xs font-semibold text-indigo-600 truncate">{job.clientId?.companyName || job.clientId?.fullName}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-4 line-clamp-2 leading-relaxed">{job.jobDescription}</p>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex flex-wrap gap-1.5 flex-1">
                        {job.skillsRequired?.slice(0, 4).map((skill) => {
                          const isMatched = job.matchedSkills?.some(s => s.toLowerCase() === skill.toLowerCase());
                          return (
                            <Badge 
                              key={skill} 
                              variant={isMatched ? "default" : "secondary"} 
                              className={`text-[9px] px-2 py-0.5 font-bold uppercase tracking-wider ${
                                isMatched ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400 opacity-60'
                              }`}
                            >
                              {skill}
                            </Badge>
                          );
                        })}
                      </div>
                      <Link to={`/freelancer/jobs/${job._id}`} className="shrink-0">
                        <Button size="sm" className="bg-gray-900 hover:bg-indigo-600 text-white font-bold h-8 px-4 transition-all">
                          Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link to="/freelancer/jobs">
                <Button className="w-full justify-start bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Browse Jobs
                </Button>
              </Link>
              <Link to="/freelancer/profile">
                <Button variant="outline" className="w-full justify-start">
                  <Award className="mr-2 h-4 w-4" />
                  Update Profile
                </Button>
              </Link>
            </div>
          </Card>

          {/* Recent Applications */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Recent Applications</h3>
              <Link to="/freelancer/applications">
                <Button variant="ghost" size="sm">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {recentApplications.map((app) => (
                <div key={app._id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold line-clamp-1">{app.jobId?.jobTitle}</h4>
                      <p className="text-xs text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Badge className={
                    app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                      app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                  }>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

        </div>
      </div>

      {/* 📁 Work Submission Modal */}
      <AnimatePresence>
        {isSubmissionModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !submitLoading && setIsSubmissionModalOpen(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
            >
              {/* Header */}
              <div className="p-6 border-b flex items-center justify-between bg-gradient-to-r from-indigo-50 to-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                    <FileUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Work Submission</h3>
                    <p className="text-xs text-gray-500 font-medium">{selectedProject?.jobId.jobTitle}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  disabled={submitLoading}
                  onClick={() => setIsSubmissionModalOpen(false)}
                  className="rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </Button>
              </div>

              <form onSubmit={handleSubmitWork} className="p-6 space-y-6">
                {/* File Upload Section */}
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-400 uppercase tracking-widest">Deliverables</label>
                  <div className="relative group">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => setSubmissionData({ ...submissionData, files: Array.from(e.target.files) })}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center group-hover:border-indigo-400 group-hover:bg-indigo-50/50 transition-all duration-300">
                      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-white group-hover:shadow-md transition-all">
                        <Upload className="w-6 h-6 text-gray-400 group-hover:text-indigo-600" />
                      </div>
                      <p className="text-sm font-bold text-gray-600 mb-1">
                        {submissionData.files.length > 0 
                          ? `${submissionData.files.length} files selected` 
                          : "Drop files here or click to browse"}
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium">MAX 10MB per file (PDF, ZIP, PNG, JS, etc.)</p>
                    </div>
                  </div>
                  {submissionData.files.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {submissionData.files.map((file, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-indigo-50 text-indigo-700 text-[10px] px-2 py-0.5 border border-indigo-100">
                          {file.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Message Section */}
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-400 uppercase tracking-widest">Submission Note</label>
                  <div className="relative">
                    <MessageSquare className="absolute top-3 left-3 w-4 h-4 text-gray-400" />
                    <textarea
                      required
                      placeholder="Briefly describe your progress or notes for the client..."
                      className="w-full h-32 pl-10 pr-4 py-3 border-2 border-gray-100 rounded-xl focus:border-indigo-400 focus:ring-0 transition-all text-sm font-medium placeholder:text-gray-300 resize-none"
                      value={submissionData.message}
                      onChange={(e) => setSubmissionData({ ...submissionData, message: e.target.value })}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={submitLoading}
                  className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm uppercase tracking-widest rounded-xl shadow-xl shadow-indigo-100 transition-all disabled:opacity-50"
                >
                  {submitLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    "Complete & Submit Work"
                  )}
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
