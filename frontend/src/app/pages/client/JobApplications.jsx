import { useState, useEffect, useCallback } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Target,
  Briefcase,
  ExternalLink,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  IndianRupee,
  ChevronLeft,
  Loader2,
  Mail,
  Award,
  FileText
} from 'lucide-react';
import { Progress } from '../../components/ui/progress';
import { toast } from 'sonner';
import jobService from '../../services/jobService';
import proposalService from '../../services/proposalService';
import chatService from '../../services/chatService';
import paymentService from '../../services/paymentService';
import StripePaymentModal from '../../components/payment/StripePaymentModal';
import submissionService from '../../services/submissionService';
import { useAuth } from '../../context/AuthContext';

export default function JobApplications() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [subLoading, setSubLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchData = useCallback(async () => {
    try {
      const [jobRes, propRes] = await Promise.all([
        jobService.getJobById(jobId),
        proposalService.getJobProposals(jobId)
      ]);

      if (jobRes.success) setJob(jobRes.job);
      if (propRes.success) {
        setProposals(propRes.proposals);
        // If there's an accepted proposal, fetch submissions
        if (propRes.proposals.some(p => p.status === 'accepted')) {
          fetchSubmissions();
        }
      }
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  const fetchSubmissions = async () => {
    try {
      setSubLoading(true);
      const res = await submissionService.getJobSubmissions(jobId);
      if (res.success) setSubmissions(res.submissions);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setSubLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusUpdate = async (proposalId, status, freelancerName) => {
    setProcessingId(proposalId);
    try {
      const response = await proposalService.updateProposalStatus(proposalId, status);
      if (response.success) {
        toast.success(`Proposal ${status} for ${freelancerName}`);
        setProposals(proposals.map(prop =>
          prop._id === proposalId ? { ...prop, status } : prop
        ));
        // Refresh job data if accepted
        if (status === 'accepted') {
          const jobRes = await jobService.getJobById(jobId);
          if (jobRes.success) setJob(jobRes.job);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setProcessingId(null);
    }
  };

  const handleMessage = async (freelancerId) => {
    try {
      const conversation = await chatService.createConversation(jobId, user?._id, freelancerId);
      navigate(`/messages/${conversation._id}`);
    } catch (error) {
      toast.error("Could not start message");
    }
  };

  const handlePaymentTrigger = (proposal) => {
    setSelectedProposal(proposal);
    setShowPaymentModal(true);
  };

  const handleRelease = async () => {
    try {
      const response = await paymentService.releasePayment(jobId);
      if (response.success) {
        toast.success("Payment released to freelancer!");
        fetchData();
      }
    } catch (error) {
      toast.error(error.message || "Failed to release payment");
    }
  };

  const handleApproveSubmission = async (submissionId) => {
    try {
      setProcessingId(submissionId);
      const res = await submissionService.updateSubmissionStatus(submissionId, { status: 'accepted' });
      if (res.success) {
        toast.success("Submission approved! Project marked as completed.");
        fetchData(); // Refresh everything
      }
    } catch (error) {
      toast.error(error.message || "Failed to approve submission");
    } finally {
      setProcessingId(null);
    }
  };

  const handleRequestRevision = async (submissionId) => {
    const feedback = prompt("Please provide feedback for the revision:");
    if (!feedback) return;

    try {
      setProcessingId(submissionId);
      const res = await submissionService.updateSubmissionStatus(submissionId, { 
        status: 'revision_requested',
        clientFeedback: feedback 
      });
      if (res.success) {
        toast.success("Revision requested.");
        fetchSubmissions();
      }
    } catch (error) {
      toast.error(error.message || "Failed to request revision");
    } finally {
      setProcessingId(null);
    }
  };

  const getFullUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `https://freelancing-platform-backend-yqyp.onrender.com${path}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-500">Loading proposals...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/client/jobs">
        <Button variant="ghost" size="sm">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to My Jobs
        </Button>
      </Link>

      {job && (
        <>
          <Card className="p-8 border-2 shadow-sm bg-gradient-to-r from-indigo-50/50 to-purple-50/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2 uppercase">{job.jobTitle}</h2>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border shadow-sm text-indigo-600 font-semibold">
                    <Briefcase className="w-4 h-4" />
                    {job.category}
                  </span>
                  <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border shadow-sm text-green-600 font-semibold">
                    <IndianRupee className="w-4 h-4" />
                    ₹{job.budget}
                  </span>
                  <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border shadow-sm text-purple-600 font-semibold text-xs tracking-wider">
                    <Clock className="w-4 h-4 uppercase" />
                    STATUS: {job.status.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="text-center md:text-right">
                <div className="text-4xl font-extrabold text-indigo-600">{proposals.length}</div>
                <div className="text-sm font-bold text-gray-500 uppercase tracking-tighter">Total Proposals</div>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            {/* 📁 Work Submissions Section - Show if there's been an acceptance */}
            {proposals.some(p => p.status === 'accepted' || p.status === 'completed') && (
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-4 px-1">
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Work Submissions</h3>
                  <Badge variant="outline" className="ml-2 border-indigo-200 text-indigo-600 font-bold">
                    REVIEW PHASE
                  </Badge>
                </div>

                {subLoading ? (
                  <div className="p-8 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-100 flex flex-col items-center gap-3">
                    <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
                    <p className="text-sm font-medium text-gray-500 italic">Processing deliverables...</p>
                  </div>
                ) : submissions.length === 0 ? (
                  <div className="p-12 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-100">
                    <p className="text-gray-500 font-medium italic">No work has been submitted yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {submissions.map((sub) => (
                      <Card key={sub._id} className="p-6 border-2 border-indigo-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                        {sub.status === 'accepted' && (
                          <div className="absolute top-0 right-0 p-2 transform rotate-12 translate-x-4 -translate-y-4 bg-green-500 text-white text-[10px] font-black uppercase tracking-widest px-8">
                            APPROVED
                          </div>
                        )}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge className={
                                sub.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                sub.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                'bg-orange-100 text-orange-700'
                              }>
                                Submission {sub.status.toUpperCase()}
                              </Badge>
                              <span className="text-xs text-gray-400 font-medium">
                                {new Date(sub.createdAt).toLocaleDateString()} at {new Date(sub.createdAt).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-gray-700 text-sm font-medium mb-4 italic">"{sub.message}"</p>
                            
                            <div className="flex flex-wrap gap-3">
                              {sub.files.map((file, idx) => (
                                <a 
                                  key={idx} 
                                  href={getFullUrl(file.fileUrl)} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold px-4 py-2 rounded-lg border border-indigo-200 transition-all"
                                >
                                  <FileText className="w-3 h-3" />
                                  {file.fileName}
                                </a>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {sub.status === 'pending' && (
                              <>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="border-orange-200 text-orange-600 hover:bg-orange-50 font-bold"
                                  disabled={processingId === sub._id}
                                  onClick={() => handleRequestRevision(sub._id)}
                                >
                                  Request Revision
                                </Button>
                                <Button 
                                  size="sm" 
                                  className="bg-green-600 hover:bg-green-700 font-bold"
                                  disabled={processingId === sub._id}
                                  onClick={() => handleApproveSubmission(sub._id)}
                                >
                                  {processingId === sub._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-1.5" />}
                                  Approve & Complete
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            <h3 className="text-xl font-bold text-gray-900 px-1">Submitted Proposals</h3>
            {proposals.length === 0 ? (
              <Card className="p-12 text-center border-dashed border-2">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <Target className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">No proposals yet</h4>
                <p className="text-gray-500">Wait for freelancers to apply to your job.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {proposals.map((proposal) => (
                  <Card key={proposal._id} className="p-6 border-2 hover:border-indigo-300 transition-all shadow-sm">
                    <div className="flex flex-col lg:flex-row items-start gap-8">
                      {/* Freelancer Profile Image/Avatar */}
                      <div className="relative flex-shrink-0">
                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg overflow-hidden border-4 border-white">
                          {proposal.freelancerId?.profileImage ? (
                            <img
                              src={getFullUrl(proposal.freelancerId.profileImage)}
                              alt={proposal.freelancerId.fullName}
                              className="w-full h-full object-cover"
                            />
                          ) : proposal.freelancerId?.fullName?.[0]}
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white" />
                      </div>

                      {/* Details Area */}
                      <div className="flex-1 space-y-6">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="text-xl font-bold text-gray-900 uppercase tracking-tight">{proposal.freelancerId?.fullName}</h4>
                              <div className="flex flex-wrap gap-2">
                                <Badge className="bg-indigo-50 text-indigo-600 border-indigo-100 uppercase text-[10px] font-black tracking-wider px-2">
                                  {proposal.freelancerId?.title || 'Freelancer'}
                                </Badge>
                                <Badge className="bg-purple-50 text-purple-600 border-purple-100 uppercase text-[10px] font-black tracking-wider px-2">
                                  {proposal.freelancerId?.experienceLevel || 'Beginner'}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                              <span className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                                {proposal.freelancerId?.rating || '0'} ({proposal.freelancerId?.totalReviews || '0'} Reviews)
                              </span>
                              {(proposal.resume || proposal.freelancerId?.resume) && (
                                <a
                                  href={getFullUrl(proposal.resume || proposal.freelancerId.resume)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-indigo-600 hover:underline font-bold"
                                >
                                  <FileText className="w-4 h-4" />
                                  {proposal.resume ? 'View Proposal Resume' : 'View Profile Resume'}
                                </a>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-6 items-center">
                            <div className="text-right">
                              <div className="text-xs font-bold text-gray-400 uppercase">Bid Amount</div>
                              <div className="text-2xl font-black text-indigo-600">₹{proposal.bidAmount}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs font-bold text-gray-400 uppercase">Delivery</div>
                              <div className="text-lg font-bold text-gray-700">{proposal.deliveryTime} Days</div>
                            </div>
                          </div>
                        </div>

                        {/* Proposal Content */}
                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 relative">
                          <div className="absolute -top-3 left-4 bg-white px-3 py-1 text-[10px] font-black uppercase text-gray-400 border rounded-lg">Cover Letter</div>
                          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap italic">
                            "{proposal.coverLetter}"
                          </p>
                          {proposal.freelancerId?.bio && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                              <div className="text-[10px] font-black uppercase text-gray-400 mb-1">About Freelancer</div>
                              <p className="text-xs text-gray-500 line-clamp-3">{proposal.freelancerId.bio}</p>
                            </div>
                          )}
                        </div>

                        {/* Candidate Skills */}
                        <div className="flex flex-wrap gap-2">
                          <span className="text-xs font-bold text-gray-400 uppercase mr-2 self-center">Skills:</span>
                          {proposal.freelancerId?.skills?.length > 0 ? (
                            proposal.freelancerId.skills.slice(0, 5).map(skill => (
                              <Badge key={skill} variant="secondary" className="bg-white border text-[10px] py-0.5 px-3">{skill}</Badge>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400">No skills listed</span>
                          )}
                        </div>

                        {/* Footer Actions */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-dashed">
                          <div className="text-xs text-gray-400 font-medium tracking-wide">
                            SUBMITTED ON: {new Date(proposal.createdAt).toLocaleDateString()}
                          </div>

                          <div className="flex items-center gap-3">
                            {proposal.status === 'pending' ? (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 border-red-200 hover:bg-red-50"
                                  disabled={processingId === proposal._id}
                                  onClick={() => handleStatusUpdate(proposal._id, 'rejected', proposal.freelancerId?.fullName)}
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Reject
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-indigo-600 hover:bg-indigo-700"
                                  disabled={processingId === proposal._id}
                                  onClick={() => handleStatusUpdate(proposal._id, 'accepted', proposal.freelancerId?.fullName)}
                                >
                                  {processingId === proposal._id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                  )}
                                  Accept & Hire
                                </Button>
                              </>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Badge className={
                                  proposal.status === 'accepted' ? 'bg-green-100 text-green-700 py-1 px-4' :
                                    proposal.status === 'rejected' ? 'bg-red-100 text-red-700 py-1 px-4' :
                                      proposal.status === 'completed' ? 'bg-indigo-100 text-indigo-700 py-1 px-4' :
                                        'bg-gray-100 text-gray-700 py-1 px-4'
                                }>
                                  {proposal.status.toUpperCase()}
                                </Badge>

                                {proposal.status === 'accepted' && (job.status === 'open' || job.status === 'in-progress') && (
                                  <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => handlePaymentTrigger(proposal)}
                                    disabled={processingId === proposal._id}
                                  >
                                    <IndianRupee className="w-4 h-4 mr-2" />
                                    Pay Now
                                  </Button>
                                )}

                                {proposal.status === 'accepted' && job.status === 'frozen' && (
                                  <Button
                                    size="sm"
                                    className="bg-indigo-600 hover:bg-indigo-700"
                                    onClick={handleRelease}
                                  >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Release Payment
                                  </Button>
                                )}
                              </div>
                            )}
                            <Button
                              variant="outline"
                              size="icon"
                              className="rounded-full w-10 h-10 border-indigo-100 text-indigo-600 hover:bg-indigo-50"
                              onClick={() => handleMessage(proposal.freelancerId?._id)}
                            >
                              <MessageSquare className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {selectedProposal && (
        <StripePaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedProposal(null);
          }}
          jobId={jobId}
          amount={selectedProposal.bidAmount}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}
