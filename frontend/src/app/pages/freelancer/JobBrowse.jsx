import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Link } from 'react-router-dom';
import { Search, Filter, Briefcase, Clock, DollarSign, Target, MapPin, Star, Zap, Loader2 } from 'lucide-react';
import { Progress } from '../../components/ui/progress';
import jobService from '../../services/jobService';
import { toast } from 'sonner';
import { jobCategories } from '../../constants/jobCategories';

export default function JobBrowse() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedExperience, setSelectedExperience] = useState('all');

  useEffect(() => {
    fetchJobs(1);
  }, []);

  const fetchJobs = async (pageNum, isLoadMore = false) => {
    try {
      if (isLoadMore) setLoadingMore(true);
      else setLoading(true);

      const response = await jobService.getAllJobs(pageNum);
      if (response.success) {
        if (isLoadMore) {
          setJobs(prev => [...prev, ...response.jobs]);
        } else {
          setJobs(response.jobs);
        }
        setHasMore(response.hasMore);
        setPage(pageNum);
      }
    } catch (error) {
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    fetchJobs(page + 1, true);
  };

  const filteredJobs = jobs.filter((job) => {
    if (!job) return false;
    const matchesSearch = (job.jobTitle?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (job.jobDescription?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || job.category === selectedCategory;
    const matchesExperience = selectedExperience === 'all' || job.experienceLevel === selectedExperience;
    return matchesSearch && matchesCategory && matchesExperience;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Browse Jobs</h2>
        <p className="text-gray-600">Find projects that match your skills and interests</p>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search jobs by title or keyword..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {jobCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedExperience} onValueChange={setSelectedExperience}>
            <SelectTrigger>
              <SelectValue placeholder="Experience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold">{filteredJobs.length}</span> jobs
        </p>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          More Filters
        </Button>
      </div>

      {/* Job Listings */}
      <div className="grid gap-6">
        {loading ? (
          <div className="text-center py-20">Loading jobs...</div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-20">No jobs found matching your criteria.</div>
        ) : (
          filteredJobs.map((job) => (
            <Card key={job._id} className="p-6 hover:shadow-lg transition-all border-2">
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                {/* Job Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-4 mb-3">
                      {/* Company Logo / Profile Pic */}
                      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold overflow-hidden border">
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
                      <div>
                        <Link to={`/freelancer/jobs/${job._id}`}>
                          <h3 className="text-lg font-bold hover:text-indigo-600 cursor-pointer mb-0.5">
                            {job.jobTitle}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {job.clientId?.companyName || job.clientId?.fullName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Deadline: {new Date(job.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">{job.jobDescription}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skillsRequired?.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <Badge variant="outline" className="border-indigo-600 text-indigo-600">
                      {job.experienceLevel}
                    </Badge>
                    <Badge variant="outline">{job.category}</Badge>
                    <span className="text-gray-500">Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="lg:w-48 space-y-3">
                  <div className="text-center lg:text-right">
                    <div className="text-2xl font-bold text-indigo-600">₹{job.budget}</div>
                    <div className="text-sm text-gray-500">Fixed Price</div>
                  </div>
                  <Link to={`/freelancer/jobs/${job._id}`} className="block">
                    <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                      <Zap className="mr-2 h-4 w-4" />
                      Apply Job
                    </Button>
                  </Link>
                  <Link to={`/freelancer/jobs/${job._id}`} className="block">
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="border-2 font-bold px-8"
          >
            {loadingMore ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...</>
            ) : (
              'Load More Jobs'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
