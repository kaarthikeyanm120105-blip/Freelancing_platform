import { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { toast } from 'sonner';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Eye, Trash2, ShieldAlert, Briefcase } from 'lucide-react';

export default function JobModeration() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const response = await adminService.getJobs();
      if (response.success) {
        setJobs(response.jobs);
      }
    } catch (error) {
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDeleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job? This will also remove all proposals for this job.")) return;
    try {
      const response = await adminService.deleteJob(id);
      if (response.success) {
        toast.success("Job deleted successfully");
        fetchJobs();
      }
    } catch (error) {
      toast.error(error.message || 'Action failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-6 rounded-xl border-2 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-1 tracking-tight">Job Moderation 🛡️</h2>
          <p className="text-gray-500 font-medium italic">Review and manage platform job postings</p>
        </div>
        <div className="bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-100 italic font-bold text-indigo-700">
          Total Jobs: {jobs.length}
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-gray-400">
          <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="font-bold uppercase tracking-widest text-xs">Loading Job List...</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {jobs.length === 0 ? (
            <div className="p-20 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400 font-black uppercase text-sm tracking-tighter">No jobs found on platform</p>
            </div>
          ) : (
            jobs.map((job) => (
              <Card key={job._id} className="p-6 border-2 hover:border-indigo-100 transition-all group">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{job.jobTitle}</h3>
                      <Badge variant="outline" className="text-[10px] font-black tracking-widest bg-gray-50 border-gray-200 text-gray-400 uppercase">{job.category}</Badge>
                    </div>

                    <p className="text-sm text-gray-500 font-medium line-clamp-2 italic leading-relaxed">
                      {job.jobDescription}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      <div className="flex items-center gap-2 bg-indigo-50/50 px-3 py-1 rounded-full border border-indigo-50">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
                        <span className="text-xs font-black text-indigo-700 uppercase tracking-wider">{job.clientId?.fullName || 'Unknown Client'}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                        <span className="text-xs font-black text-green-700 tracking-wider">₹{job.budget?.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                        <span className="text-xs font-black text-blue-700 tracking-wider uppercase">{job.experienceLevel}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="font-black uppercase tracking-tighter shadow-sm"
                      onClick={() => handleDeleteJob(job._id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Job
                    </Button>
                    <Button variant="outline" size="sm" className="font-bold text-gray-400 hover:text-indigo-600 transition-colors">
                      <Eye className="w-4 h-4 mr-2" />
                      Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}





