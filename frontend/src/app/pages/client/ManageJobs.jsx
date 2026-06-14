import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';
import {
  Briefcase,
  Plus,
  Trash2,
  Edit3,
  Eye,
  Users,
  Search,
  Filter,
  Clock,
  IndianRupee,
  PauseCircle,
  PlayCircle,
  XCircle,
  ChevronRight
} from 'lucide-react';
import jobService from '../../services/jobService';
import proposalService from '../../services/proposalService';

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
    // Mark notifications as seen
    const markRead = async () => {
      try {
        await proposalService.markAsSeen();
      } catch (err) {
        console.error("Failed to mark notifications as seen", err);
      }
    };
    markRead();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await jobService.getClientJobs();
      if (response.success) {
        setJobs(response.jobs);
      }
    } catch (error) {
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      const response = await jobService.deleteJob(id);
      if (response.success) {
        toast.success('Job deleted successfully');
        setJobs(jobs.filter(job => job._id !== id));
      }
    } catch (error) {
      toast.error('Failed to delete job');
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await jobService.updateJob(id, { status: newStatus });
      if (response.success) {
        toast.success(`Job ${newStatus} successfully`);
        setJobs(jobs.map(job => job._id === id ? { ...job, status: newStatus } : job));
      }
    } catch (error) {
      toast.error(`Failed to update job status to ${newStatus}`);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Your Jobs</h1>
          <p className="text-gray-500">Track and manage your posted freelance opportunities</p>
        </div>
        <Link to="/client/post-job">
          <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Post New Job
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-indigo-50/50 border-indigo-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-indigo-600 font-medium uppercase tracking-wider">Total Jobs</p>
              <h2 className="text-2xl font-bold text-gray-900">{jobs.length}</h2>
            </div>
          </div>
        </Card>
        <Card className="p-6 bg-green-50/50 border-green-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-green-600 shadow-sm">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium uppercase tracking-wider">Active Jobs</p>
              <h2 className="text-2xl font-bold text-gray-900">{jobs.filter(j => j.status === 'open').length}</h2>
            </div>
          </div>
        </Card>
        <Card className="p-6 bg-purple-50/50 border-purple-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-purple-600 shadow-sm">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-purple-600 font-medium uppercase tracking-wider">Total Applicants</p>
              <h2 className="text-2xl font-bold text-gray-900">
                {jobs.reduce((acc, job) => acc + (job.applicantCount || 0), 0)}
              </h2>
            </div>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden border-2">
        <div className="p-6 border-b bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-500" />
            Listing Jobs
          </h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Search jobs..."
                className="pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <div className="divide-y">
          {loading ? (
            <div className="p-12 text-center text-gray-500">
              <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
              Loading your jobs...
            </div>
          ) : jobs.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <Briefcase className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">No jobs posted yet</h4>
              <p className="text-gray-500 mb-6">Start by posting your first job to find talent.</p>
              <Link to="/client/post-job">
                <Button>Post First Job</Button>
              </Link>
            </div>
          ) : (
            jobs.map((job) => (
              <div key={job._id} className="p-6 hover:bg-gray-50 transition-colors group">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h4 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors uppercase">{job.jobTitle}</h4>
                      <Badge
                        variant={job.status === 'open' ? 'success' : 'secondary'}
                        className={
                          job.status === 'open' ? 'bg-green-100 text-green-700' :
                            job.status === 'in-progress' ? 'bg-indigo-100 text-indigo-700' :
                              job.status === 'frozen' ? 'bg-blue-100 text-blue-700' :
                                'bg-red-100 text-red-700'
                        }
                      >
                        {job.status.toUpperCase()}
                      </Badge>
                      {new Date(job.deadline) < new Date() && job.status === 'open' && (
                        <Badge className="bg-orange-100 text-orange-700">DEADLINE PASSED</Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <IndianRupee className="w-4 h-4 text-indigo-500" />
                        <span className="font-semibold text-gray-900">₹{job.budget}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-indigo-500" />
                        Posted on {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-indigo-500" />
                        {job.applicantCount || 0} Applicants
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {job.skillsRequired?.map((skill, idx) => (
                        <Badge key={idx} variant="secondary" className="text-[10px] py-0 px-2">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link to={`/client/job-applications/${job._id}`}>
                      <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:text-blue-600 border-gray-200">
                        <Eye className="w-4 h-4 mr-2" />
                        View Proposals
                      </Button>
                    </Link>
                    <Link to={`/client/edit-job/${job._id}`}>
                      <Button variant="outline" size="sm" className="hover:bg-indigo-50 hover:text-indigo-600 border-gray-200">
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </Link>

                    {job.status === 'open' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-blue-50 hover:text-blue-600 border-gray-200"
                        onClick={() => handleStatusUpdate(job._id, 'frozen')}
                      >
                        <PauseCircle className="w-4 h-4 mr-2" />
                        Freeze
                      </Button>
                    ) : job.status === 'frozen' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-green-50 hover:text-green-600 border-gray-200"
                        onClick={() => handleStatusUpdate(job._id, 'open')}
                      >
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Active
                      </Button>
                    ) : null}

                    {job.status !== 'closed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-orange-50 hover:text-orange-600 border-gray-200"
                        onClick={() => handleStatusUpdate(job._id, 'closed')}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Close
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-red-50 hover:text-red-600 border-gray-200"
                      onClick={() => handleDelete(job._id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
