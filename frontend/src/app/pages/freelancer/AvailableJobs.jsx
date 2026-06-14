import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { toast } from 'sonner';
import {
    Search,
    Filter,
    MapPin,
    Clock,
    Briefcase,
    IndianRupee,
    Star,
    Zap,
    Bookmark
} from 'lucide-react';
import jobService from '../../services/jobService';

export default function AvailableJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await jobService.getAllJobs();
            if (response.success) {
                setJobs(response.jobs);
            }
        } catch (error) {
            toast.error('Failed to fetch available jobs');
        } finally {
            setLoading(false);
        }
    };

    const filteredJobs = jobs.filter(job => {
        if (!job) return false;
        return (job.jobTitle?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (job.jobDescription?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (job.category?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Explore Opportunities</h1>
                    <p className="text-gray-500">Find the perfect freelance job that matches your skills</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <Input
                            placeholder="Search jobs by title, skills..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-full md:w-80 h-11 border-2 focus-visible:ring-indigo-500"
                        />
                    </div>
                    <Button variant="outline" className="h-11 border-2">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [...Array(6)].map((_, i) => (
                        <Card key={i} className="p-6 h-64 animate-pulse bg-gray-50 border-2" />
                    ))
                ) : filteredJobs.length === 0 ? (
                    <div className="col-span-full py-20 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <Search className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">No jobs found</h3>
                        <p className="text-gray-500">Try adjusting your search or filters to find more opportunities.</p>
                    </div>
                ) : (
                    filteredJobs.map((job) => (
                        <Card key={job._id} className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 flex flex-col h-full">
                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="p-6 flex-1 space-y-4">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0 font-bold overflow-hidden border">
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
                                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-indigo-600 hover:bg-indigo-50">
                                        <Bookmark className="w-5 h-5" />
                                    </Button>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors line-clamp-1">{job.jobTitle}</h3>
                                    <p className="text-sm text-indigo-600 font-medium">{job.clientId?.companyName || job.clientId?.fullName}</p>
                                </div>

                                <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                                    {job.jobDescription}
                                </p>

                                <div className="flex flex-wrap gap-2 pt-2">
                                    {job.skillsRequired?.slice(0, 3).map((skill, i) => (
                                        <Badge key={i} variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                                            {skill}
                                        </Badge>
                                    ))}
                                    {job.skillsRequired?.length > 3 && (
                                        <Badge variant="secondary" className="bg-gray-100 text-gray-700 italic">
                                            +{job.skillsRequired.length - 3} more
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            <div className="p-6 border-t bg-gray-50/50 space-y-4">
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <div className="flex items-center gap-1.5 font-bold text-gray-900">
                                        <IndianRupee className="w-4 h-4 text-indigo-600" />
                                        ₹{job.budget}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-4 h-4" />
                                        {new Date(job.deadline).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                        {job.experienceLevel}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md shadow-indigo-100">
                                        <Zap className="w-4 h-4 mr-2" />
                                        Quick Apply
                                    </Button>
                                    <Button variant="outline" className="px-3 border-2 hover:bg-gray-100">
                                        View
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
