import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  User,
  Wallet,
  MessageSquare,
  Settings,
  LogOut,
  GraduationCap,
  FileText,
  BookOpen,
  Plus,
  Users,
  Search,
  FileBarChart,
  DollarSign,
  Bell,
  Menu,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import proposalService from '../services/proposalService';

export default function DashboardLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const [unseenCount, setUnseenCount] = useState(0);
  const role = user?.role || 'freelancer';

  useEffect(() => {
    const fetchUnseenCount = async () => {
      try {
        if (user) {
          const res = await proposalService.getUnseenCount();
          if (res.success) setUnseenCount(res.count);
        }
      } catch (error) {
        console.error("Error fetching notification count:", error);
      }
    };

    fetchUnseenCount();
    // Refresh count on navigation
  }, [location.pathname, user]);

  const freelancerNav = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', path: '/freelancer/dashboard' },
    { icon: <User className="w-5 h-5" />, label: 'Profile', path: '/freelancer/profile' },
    { icon: <Briefcase className="w-5 h-5" />, label: 'Browse Jobs', path: '/freelancer/jobs' },
    { icon: <FileText className="w-5 h-5" />, label: 'Applications', path: '/freelancer/applications', badge: unseenCount > 0 ? unseenCount : null },
    { icon: <Wallet className="w-5 h-5" />, label: 'Wallet', path: '/freelancer/wallet' },
    { icon: <DollarSign className="w-5 h-5" />, label: 'Earnings', path: '/freelancer/earnings' },
    { icon: <BookOpen className="w-5 h-5" />, label: 'Learning', path: '/freelancer/learning' },
    { icon: <MessageSquare className="w-5 h-5" />, label: 'Messages', path: '/messages' },
    { icon: <Users className="w-5 h-5" />, label: 'Connect', path: '/connect' },
  ];

  const clientNav = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', path: '/client/dashboard' },
    { icon: <Plus className="w-5 h-5" />, label: 'Post Job', path: '/client/post-job' },
    { icon: <Briefcase className="w-5 h-5" />, label: 'Manage Jobs', path: '/client/jobs', badge: role === 'client' && unseenCount > 0 ? unseenCount : null },
    { icon: <DollarSign className="w-5 h-5" />, label: 'Payments', path: '/client/payments' },
    { icon: <MessageSquare className="w-5 h-5" />, label: 'Messages', path: '/messages' },
    { icon: <Users className="w-5 h-5" />, label: 'Connect', path: '/connect' },
    { icon: <User className="w-5 h-5" />, label: 'Company Profile', path: '/client/profile' },
  ];

  const adminNav = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', path: '/admin' },
    { icon: <Users className="w-5 h-5" />, label: 'User Management', path: '/admin/users' },
    { icon: <Briefcase className="w-5 h-5" />, label: 'Job Moderation', path: '/admin/jobs' },
    { icon: <FileText className="w-5 h-5" />, label: 'Proposal Monitoring', path: '/admin/proposals' },
    { icon: <DollarSign className="w-5 h-5" />, label: 'Payments', path: '/admin/payments' },
    { icon: <BookOpen className="w-5 h-5" />, label: 'Courses', path: '/admin/courses' },
    { icon: <FileBarChart className="w-5 h-5" />, label: 'Reports', path: '/admin/reports' },
  ];

  const getFullUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `http://localhost:3000${path}`;
  };

  const navigation = role === 'freelancer' ? freelancerNav : role === 'client' ? clientNav : adminNav;

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center transform transition-transform group-hover:scale-110">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="flex flex-col">
              <h2 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-all duration-300 flex items-center whitespace-nowrap text-sm leading-tight">
                Talent Venture Connect
              </h2>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">{role} Portal</p>
            </div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-200'
                : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
                }`}
            >
              {item.icon}
              <span className="flex-1 font-medium">{item.label}</span>
              {item.badge && (
                <Badge className="bg-red-500 text-white border-0">{item.badge}</Badge>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-3 border border-gray-100">
          {(user?.companyLogo || user?.profileImage) ? (
            <img
              src={getFullUrl(user?.companyLogo || user?.profileImage)}
              alt={user?.companyName || user?.fullName}
              className="w-10 h-10 rounded-full object-cover shadow-inner"
            />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-inner">
              {(user?.companyName?.[0] || user?.fullName?.[0] || 'U')}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate text-sm">{user?.companyName || user?.fullName || 'User'}</p>
            <p className="text-[10px] text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start text-red-600 border-red-100 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-all"
          size="sm"
          onClick={logout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-all"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100 flex flex-col z-50 transition-all duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
          }`}
      >
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="bg-white border-b sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>

            <div className="flex-1 lg:flex-none">
              <h1 className="font-semibold text-lg lg:text-xl">
                {navigation.find((item) => item.path === location.pathname)?.label || 'Dashboard'}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}





