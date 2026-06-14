import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Link } from 'react-router-dom';
import { Plus, Briefcase, Users, DollarSign, Clock, Star, TrendingUp, ArrowRight, IndianRupee } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import jobService from '../../services/jobService';
import { toast } from 'sonner';

export default function ClientDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await jobService.getClientJobs();
        if (response.success) {
          setJobs(response.jobs);
        }
      } catch (error) {
        console.error('Failed to fetch client dashboard jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchClientData();
  }, []);

  if (!user) return null;

  const stats = [
    { label: 'Active Jobs', value: (jobs || []).filter(j => j?.status === 'open').length, icon: <Briefcase className="w-6 h-6 text-indigo-600" />, change: '0' },
    { label: 'Total Applications', value: (jobs || []).reduce((acc, j) => acc + (j.applicantCount || 0), 0), icon: <Users className="w-6 h-6 text-purple-600" />, change: '0' },
    { label: 'Total Spent', value: `₹${(user.totalSpent || 0).toLocaleString()}`, icon: <DollarSign className="w-6 h-6 text-green-600" />, change: '₹0' },
    { label: 'Avg Rating', value: user.rating || 0, icon: <Star className="w-6 h-6 text-yellow-600" />, change: '0' },
  ];

  const activeJobs = jobs.slice(0, 3);

  const spendingData = [
    { month: 'Aug', amount: 1200 },
    { month: 'Sep', amount: 1800 },
    { month: 'Oct', amount: 1500 },
    { month: 'Nov', amount: 2200 },
    { month: 'Dec', amount: 1900 },
    { month: 'Jan', amount: 2400 },
    { month: 'Feb', amount: 2800 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <Link to="/client/dashboard">
            <h2 className="text-2xl font-bold mb-2 text-white hover:text-indigo-100 transition-colors">
              Welcome Back, {user.fullName?.split(' ')[0] || 'User'}! 🎯
            </h2>
          </Link>
          <Link to="/client/post-job">
            <Button className="bg-white text-indigo-600 hover:bg-indigo-50">
              <Plus className="mr-2 h-4 w-4" />
              Post New Job
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                {stat.icon}
              </div>
              <Badge className="bg-green-100 text-green-700">{stat.change}</Badge>
            </div>
            <div className="text-3xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active Jobs */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Active Jobs</h3>
              <Link to="/client/jobs">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-10 text-gray-500">Loading jobs...</div>
              ) : activeJobs.length === 0 ? (
                <div className="text-center py-10 text-gray-500">No active jobs found</div>
              ) : (
                activeJobs.map((job) => (
                  <div key={job._id} className="p-4 border rounded-lg hover:border-indigo-600 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold mb-1">{job.jobTitle}</h4>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {job.applicantCount || 0} applicants
                          </span>
                          <span className="flex items-center gap-1">
                            <IndianRupee className="w-4 h-4" />
                            ₹{job.budget}
                          </span>
                        </div>
                      </div>
                      <Badge variant={job.status === 'open' ? 'default' : 'secondary'} className={job.status === 'open' ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}>
                        {job.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Spending Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Monthly Spending</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={spendingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link to="/client/post-job">
                <Button className="w-full justify-start bg-gradient-to-r from-indigo-600 to-purple-600">
                  <Plus className="mr-2 h-4 w-4" />
                  Post a Job
                </Button>
              </Link>
              <Link to="/client/jobs">
                <Button variant="outline" className="w-full justify-start">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Manage Jobs
                </Button>
              </Link>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Ready to hire?</p>
                  <p className="text-xs text-gray-500">Post a job to see applicants</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
