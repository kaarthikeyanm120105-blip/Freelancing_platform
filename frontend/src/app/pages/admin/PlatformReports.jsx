import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { FileBarChart, Download, TrendingUp, Users, Briefcase, DollarSign, Globe } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { mockAdminStats } from '../../data/mockData';

export default function PlatformReports() {
  const monthlyStats = [
    { month: 'Aug', users: 2350, jobs: 145, revenue: 58200 },
    { month: 'Sep', users: 2480, jobs: 168, revenue: 67400 },
    { month: 'Oct', users: 2620, jobs: 189, revenue: 75800 },
    { month: 'Nov', users: 2700, jobs: 202, revenue: 81200 },
    { month: 'Dec', users: 2770, jobs: 218, revenue: 87600 },
    { month: 'Jan', users: 2843, jobs: 234, revenue: 93900 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Platform Reports</h2>
          <p className="text-gray-600">Comprehensive analytics and insights</p>
        </div>
        <div className="flex gap-3">
          <Select defaultValue="monthly">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-gradient-to-r from-indigo-600 to-purple-600">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <Badge className="bg-green-100 text-green-700">+8.2%</Badge>
          </div>
          <div className="text-2xl font-bold mb-1">{mockAdminStats.totalUsers}</div>
          <div className="text-sm text-gray-600">Total Users</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-purple-600" />
            </div>
            <Badge className="bg-blue-100 text-blue-700">+12.5%</Badge>
          </div>
          <div className="text-2xl font-bold mb-1">{mockAdminStats.totalJobs}</div>
          <div className="text-sm text-gray-600">Total Jobs Posted</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <Badge className="bg-green-100 text-green-700">+15.3%</Badge>
          </div>
          <div className="text-2xl font-bold mb-1">${(mockAdminStats.totalRevenue / 1000).toFixed(0)}K</div>
          <div className="text-sm text-gray-600">Platform Revenue</div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-green-700" />
            </div>
            <Badge className="bg-green-200 text-green-800">SDG 8</Badge>
          </div>
          <div className="text-2xl font-bold mb-1 text-green-900">{mockAdminStats.sdgImpact.studentsEmployed}</div>
          <div className="text-sm text-green-800">Students Employed</div>
        </Card>
      </div>

      {/* Growth Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">User Growth Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Job Postings</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="jobs" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">Revenue Growth</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={monthlyStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} name="Revenue ($)" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* SDG Impact Report */}
      <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-green-700" />
          </div>
          <h3 className="text-lg font-semibold text-green-900">SDG 8 Impact Report</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-3xl font-bold text-green-700 mb-2">{mockAdminStats.sdgImpact.studentsEmployed}</div>
            <div className="text-sm text-green-800 font-semibold">Students Employed</div>
            <div className="text-xs text-green-600 mt-1">Decent work opportunities created</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-3xl font-bold text-green-700 mb-2">${(mockAdminStats.sdgImpact.totalEarnings / 1000).toFixed(0)}K</div>
            <div className="text-sm text-green-800 font-semibold">Student Earnings</div>
            <div className="text-xs text-green-600 mt-1">Economic growth generated</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-3xl font-bold text-green-700 mb-2">{mockAdminStats.sdgImpact.skillsDeveloped}</div>
            <div className="text-sm text-green-800 font-semibold">Skills Developed</div>
            <div className="text-xs text-green-600 mt-1">Professional capabilities enhanced</div>
          </div>
        </div>

        <div className="text-sm text-green-800">
          <strong>Impact Statement:</strong> Through Student Freelance Connect, we've empowered {mockAdminStats.sdgImpact.studentsEmployed} students with meaningful employment opportunities, contributing ${(mockAdminStats.sdgImpact.totalEarnings / 1000).toFixed(0)}K to their financial independence while developing {mockAdminStats.sdgImpact.skillsDeveloped} professional skills aligned with SDG 8: Decent Work and Economic Growth.
        </div>
      </Card>
    </div>
  );
}





