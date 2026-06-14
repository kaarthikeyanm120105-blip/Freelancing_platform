import { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { toast } from 'sonner';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Users, Briefcase, DollarSign, TrendingUp, Globe, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminService.getStats();
        if (response.success) {
          setStats(response.stats);
        }
      } catch (error) {
        toast.error('Failed to fetch dashboard statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const userGrowth = [
    { month: 'Oct', students: 120, clients: 45 },
    { month: 'Nov', students: 150, clients: 52 },
    { month: 'Dec', students: 180, clients: 60 },
    { month: 'Jan', students: 210, clients: 72 },
    { month: 'Feb', students: 250, clients: 85 },
    { month: 'Mar', students: 310, clients: 98 },
  ];

  const categoryData = [
    { name: 'Web Dev', value: 400 },
    { name: 'Mobile App', value: 300 },
    { name: 'UI/UX Design', value: 300 },
    { name: 'Data Science', value: 200 },
    { name: 'Marketing', value: 150 },
  ];

  const mockAdminStats = {
    sdgImpact: {
      studentsEmployed: stats?.totalFreelancers || 0,
      totalEarnings: (stats?.totalPayments || 0) * 0.9, // Estimate
      skillsDeveloped: (stats?.totalJobs || 0) * 2
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
    </div>
  );

  const statsData = [
    { label: 'Total Users', value: stats?.totalUsers || 0, sub: `${stats?.totalFreelancers || 0} Freelancers • ${stats?.totalClients || 0} Clients`, icon: <Users className="w-6 h-6 text-indigo-600" />, color: 'bg-indigo-100' },
    { label: 'Total Jobs', value: stats?.totalJobs || 0, sub: 'All platform jobs', icon: <Briefcase className="w-6 h-6 text-purple-600" />, color: 'bg-purple-100' },
    { label: 'Total Payments', value: `₹${(stats?.totalPayments || 0).toLocaleString()}`, sub: `${stats?.counts?.payments || 0} transactions`, icon: <DollarSign className="w-6 h-6 text-green-600" />, color: 'bg-green-100' },
    { label: 'Total Withdrawals', value: `₹${(stats?.totalWithdrawals || 0).toLocaleString()}`, sub: `${stats?.counts?.withdrawals || 0} processed`, icon: <ArrowUpRight className="w-6 h-6 text-orange-600" />, color: 'bg-orange-100' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Platform Overview</h2>
        <p className="text-indigo-100">Monitor and manage the Student Freelance Connect Platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((item, idx) => (
          <Card key={idx} className="p-6 border-2 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center shadow-inner`}>
                {item.icon}
              </div>
              <Badge variant="secondary" className="font-bold">LIVE</Badge>
            </div>
            <div className="text-3xl font-black mb-1">{item.value}</div>
            <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">{item.label}</div>
            <div className="text-xs text-gray-400 mt-2 font-medium">
              {item.sub}
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">User Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="students" stroke="#6366f1" strokeWidth={2} name="Students" />
              <Line type="monotone" dataKey="clients" stroke="#8b5cf6" strokeWidth={2} name="Clients" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Jobs by Category */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Jobs by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* SDG Impact */}
      <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-green-700" />
          </div>
          <h3 className="text-lg font-semibold text-green-900">SDG 8 Impact Dashboard</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-3xl font-bold text-green-700 mb-1">
              {mockAdminStats.sdgImpact.studentsEmployed}
            </div>
            <div className="text-sm text-green-800">Students Employed</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-3xl font-bold text-green-700 mb-1">
              ${(mockAdminStats.sdgImpact.totalEarnings / 1000).toFixed(0)}K
            </div>
            <div className="text-sm text-green-800">Student Earnings</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-3xl font-bold text-green-700 mb-1">
              {mockAdminStats.sdgImpact.skillsDeveloped}
            </div>
            <div className="text-sm text-green-800">Skills Developed</div>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Platform Activity</h3>
        <div className="space-y-3">
          {[
            { action: 'New user registered', user: 'John Doe (Student)', time: '5 min ago' },
            { action: 'Job posted', user: 'TechCorp (Client)', time: '12 min ago' },
            { action: 'Application submitted', user: 'Sarah Smith (Student)', time: '1 hour ago' },
            { action: 'Payment processed', user: 'DataViz Inc. (Client)', time: '2 hours ago' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-semibold text-sm">{activity.action}</div>
                <div className="text-xs text-gray-600">{activity.user}</div>
              </div>
              <div className="text-xs text-gray-500">{activity.time}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}





