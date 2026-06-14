import { useState, useEffect, useCallback } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Briefcase,
  Clock,
  DollarSign,
  Calendar,
  Target,
  Users,
  Star,
  Shield,
  ArrowLeft,
  Send,
  Loader2,
  IndianRupee,
  FileText,
  Zap
} from 'lucide-react';
import { Progress } from '../../components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { toast } from 'sonner';
import jobService from '../../services/jobService';
import proposalService from '../../services/proposalService';
import { useAuth } from '../../context/AuthContext';

export default function JobDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [resume, setResume] = useState(null);

  const fetchJob = useCallback(async () => {
    try {
      const response = await jobService.getJobById(id);
      if (response.success) {
        setJob(response.job);
        setBidAmount(response.job.budget.toString());
      }
    } catch (error) {
      toast.error('Failed to fetch job details');
      navigate('/freelancer/jobs');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!coverLetter || !bidAmount || !deliveryTime) {
      return toast.error('Please fill in all fields');
    }

    setApplying(true);
    try {
      const formData = new FormData();
      formData.append('jobId', id);
      formData.append('coverLetter', coverLetter);
      formData.append('bidAmount', Number(bidAmount));
      formData.append('deliveryTime', Number(deliveryTime));
      if (resume) {
        formData.append('resume', resume);
      }

      const response = await proposalService.applyToJob(formData);

      if (response.success) {
        toast.success('Proposal submitted successfully!');
        setIsApplying(false);
        navigate('/freelancer/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit proposal');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-500">Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold mb-4">Job not found</h2>
        <Link to="/freelancer/jobs">
          <Button>Back to Jobs</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Breadcrumb / Back */}
      <div className="flex items-center justify-between">
        <Link to="/freelancer/jobs">
          <Button variant="ghost" size="sm" className="hover:bg-indigo-50 text-gray-500 hover:text-indigo-600 font-medium">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Job Feed
          </Button>
        </Link>
        <div className="text-sm text-gray-400">
          Job ID: <span className="font-mono">{job._id.slice(-8)}</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white border-b pb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-4 flex-1">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-tight uppercase">
              {job.jobTitle}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-none px-3 py-1 font-bold uppercase tracking-wider">
                {job.category}
              </Badge>
              <Badge variant="outline" className="border-gray-200 text-gray-600 px-3 py-1 font-bold uppercase">
                {job.experienceLevel}
              </Badge>
              <span className="flex items-center gap-1.5 text-gray-400 font-medium">
                <Clock className="w-4 h-4" />
                Posted {new Date(job.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1.5 text-gray-400 font-medium">
                <Calendar className="w-4 h-4" />
                Ends {new Date(job.deadline).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <div className="text-3xl font-black text-indigo-600">₹{job.budget}</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Fixed Budget</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description Card */}
          <Card className="p-8 border-none shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Job Description
            </h2>
            <div className="text-gray-700 whitespace-pre-wrap leading-relaxed text-lg">
              {job.jobDescription}
            </div>
          </Card>

          {/* Skills Required */}
          <Card className="p-8 border-none shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              Skills & Expertise
            </h2>
            <div className="flex flex-wrap gap-2">
              {job.skillsRequired?.map((skill) => (
                <Badge
                  key={skill}
                  className="bg-gray-100 text-gray-700 hover:bg-indigo-600 hover:text-white transition-colors duration-300 border-none px-4 py-2 rounded-full font-bold text-xs uppercase"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Project Details Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 border-none shadow-sm bg-indigo-50/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600">
                  <IndianRupee className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-400 uppercase">Budget</div>
                  <div className="text-xl font-black text-indigo-600">₹{job.budget}</div>
                </div>
              </div>
            </Card>
            <Card className="p-6 border-none shadow-sm bg-purple-50/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-purple-600">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-400 uppercase">Project Type</div>
                  <div className="text-xl font-black text-purple-600">Fixed Price</div>
                </div>
              </div>
            </Card>
            <Card className="p-6 border-none shadow-sm bg-green-50/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-green-600">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-400 uppercase">Experience</div>
                  <div className="text-xl font-black text-green-600 uppercase">{job.experienceLevel}</div>
                </div>
              </div>
            </Card>
            <Card className="p-6 border-none shadow-sm bg-orange-50/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-orange-600">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-400 uppercase">Category</div>
                  <div className="text-xl font-black text-orange-600 uppercase">{job.category}</div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 sticky top-24 self-start">
          <Card className="p-8 border-none shadow-xl bg-white ring-1 ring-gray-100">
            <div className="space-y-6">
              <div className="pb-6 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Pricing & Timeline</div>
                </div>
                
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full blur-2xl -mr-10 -mt-10 opacity-50" />
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-purple-50 rounded-full blur-2xl -ml-8 -mb-8 opacity-50" />
                  
                  <div className="flex flex-col gap-1 relative z-10">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Fixed Budget</span>
                    <span className="text-3xl font-black text-gray-900 flex items-baseline">
                      <span className="text-xl mr-1 text-gray-400 font-medium">₹</span>
                      {job.budget?.toLocaleString() || job.budget}
                    </span>
                  </div>
                  
                  <div className="h-px bg-gray-100 w-full relative z-10" />
                  
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                      <Calendar className="w-4 h-4 text-purple-500" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Project Deadline</div>
                      <div className="text-xs font-bold text-gray-800">
                        {new Date(job.deadline).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Dialog open={isApplying} onOpenChange={setIsApplying}>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full h-14 text-lg font-black uppercase tracking-widest shadow-lg shadow-indigo-200 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all active:scale-[0.98]"
                      disabled={job.status !== 'open' || new Date(job.deadline) < new Date()}
                    >
                      <Send className="mr-3 h-5 w-5" />
                      {job.status !== 'open' ? 'Job Closed' : new Date(job.deadline) < new Date() ? 'Deadline Passed' : 'Apply Now'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl bg-white border-none shadow-2xl p-0 overflow-hidden">
                    <div className="bg-indigo-600 p-8 text-white relative">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-black uppercase tracking-tight">Submit Proposal</DialogTitle>
                        <p className="text-indigo-100 text-sm font-medium mt-1">Submit your bid for: {job.jobTitle}</p>
                      </DialogHeader>
                      <div className="absolute -right-8 -bottom-8 opacity-10">
                        <Zap className="w-48 h-48" />
                      </div>
                    </div>
                    <form onSubmit={handleApply} className="p-8 space-y-6">
                      <div className="space-y-3">
                        <Label htmlFor="coverLetter" className="text-sm font-black uppercase text-gray-400">Why are you a good fit?</Label>
                        <Textarea
                          id="coverLetter"
                          placeholder="Introduce yourself and explain why you're perfect for this role..."
                          rows={6}
                          required
                          className="focus-visible:ring-indigo-500 border-2 border-gray-100 min-h-[150px] resize-none"
                          value={coverLetter}
                          onChange={(e) => setCoverLetter(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="rate" className="text-sm font-black uppercase text-gray-400">Bid Amount (₹)</Label>
                          <div className="relative">
                            <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-500" />
                            <Input
                              id="rate"
                              type="number"
                              required
                              className="pl-11 h-12 border-2 border-gray-100 focus-visible:ring-indigo-500 font-bold"
                              placeholder={job.budget.toString()}
                              value={bidAmount}
                              onChange={(e) => setBidAmount(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="delivery" className="text-sm font-black uppercase text-gray-400">Timeline (Days)</Label>
                          <div className="relative">
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-500" />
                            <Input
                              id="delivery"
                              type="number"
                              required
                              className="pl-11 h-12 border-2 border-gray-100 focus-visible:ring-indigo-500 font-bold"
                              placeholder="e.g. 5"
                              value={deliveryTime}
                              onChange={(e) => setDeliveryTime(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Resume Upload */}
                      <div className="space-y-3">
                        <Label htmlFor="resume" className="text-sm font-black uppercase text-gray-400">Upload Resume (PDF)</Label>
                        <div className="flex items-center gap-4 p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-indigo-400 transition-colors group relative">
                          <Input
                            id="resume"
                            type="file"
                            accept=".pdf"
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            onChange={(e) => setResume(e.target.files[0])}
                          />
                          <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-gray-700">
                              {resume ? resume.name : 'Choose a file or drag & drop'}
                            </div>
                            <div className="text-xs text-gray-400 font-medium font-mono uppercase tracking-tight">PDF, max 5MB</div>
                          </div>
                          {resume && (
                            <Badge className="ml-auto bg-green-50 text-green-700 border-green-100 uppercase text-[10px] font-black">Ready</Badge>
                          )}
                        </div>
                      </div>

                      <div className="pt-4 flex gap-4">
                        <Button type="button" variant="outline" className="flex-1 h-12 font-bold uppercase" onClick={() => setIsApplying(false)}>Cancel</Button>
                        <Button
                          type="submit"
                          disabled={applying}
                          className="flex-[2] h-12 bg-indigo-600 hover:bg-indigo-700 font-black uppercase tracking-widest shadow-lg shadow-indigo-100"
                        >
                          {applying ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
                          ) : 'Send Proposal'}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" className="w-full h-14 font-bold border-2 hover:bg-gray-50 uppercase tracking-widest text-gray-600">
                  Save for Later
                </Button>
              </div>

              <div className="space-y-4 pt-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Posted On</span>
                  <span className="text-gray-700 font-bold">{new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Proposals</span>
                  <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 font-black border-none">
                    {job.applicantCount || 0}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Client Info Card */}
          <Card className="p-8 border-none shadow-sm bg-white ring-1 ring-gray-100">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 border-b pb-4">Client Information</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-xl shadow-inner uppercase">
                  {job.clientId?.companyLogo ? (
                    <img src={job.clientId.companyLogo} alt="" className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    job.clientId?.fullName?.[0] || 'C'
                  )}
                </div>
                <div>
                  <div className="font-extrabold text-gray-900 text-lg leading-tight">{job.clientId?.fullName || 'Anonymous Client'}</div>
                  {job.clientId?.companyName && (
                    <div className="text-xs font-bold text-indigo-500 uppercase tracking-wider mt-0.5">{job.clientId.companyName}</div>
                  )}
                  {job.clientId?.industry && (
                    <div className="text-xs font-medium text-gray-400 mt-0.5">{job.clientId.industry}</div>
                  )}
                </div>
              </div>

              {/* Verification Status */}
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-black uppercase tracking-wide ${
                  job.clientId?.isAccountVerified
                    ? 'bg-green-50 border-green-100 text-green-700'
                    : 'bg-gray-50 border-gray-100 text-gray-500'
                }`}>
                  <Shield className={`w-3.5 h-3.5 ${job.clientId?.isAccountVerified ? 'text-green-600' : 'text-gray-400'}`} />
                  {job.clientId?.isAccountVerified ? 'Verified' : 'Unverified'}
                </div>
              </div>

              {/* Description */}
              <div className="text-sm text-gray-500 font-medium leading-relaxed italic border-l-4 border-indigo-100 pl-4 py-1">
                "{job.clientId?.companyDescription || 'No company description provided.'}"
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
