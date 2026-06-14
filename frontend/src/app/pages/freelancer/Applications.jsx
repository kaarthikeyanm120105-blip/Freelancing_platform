import { useState, useEffect, useCallback } from 'react';
import { Card } from '../../components/ui/card.jsx';
import { Badge } from '../../components/ui/badge.jsx';
import { Button } from '../../components/ui/button.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs.jsx';
import { useNavigate, Link } from 'react-router-dom';
import { Clock, IndianRupee, ExternalLink, Target, Loader2, IndianRupee as RupeeIcon, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import proposalService from '../../services/proposalService';
import chatService from '../../services/chatService';
import { useAuth } from '../../context/AuthContext';

export default function Applications() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchProposals = useCallback(async () => {
    try {
      const response = await proposalService.getMyProposals();
      if (response.success) {
        setProposals(response.proposals);
      }
    } catch (error) {
      toast.error('Failed to fetch your applications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProposals();
    // Mark notifications as seen
    const markRead = async () => {
      try {
        await proposalService.markAsSeen();
      } catch (err) {
        console.error("Failed to mark notifications as seen", err);
      }
    };
    markRead();
  }, [fetchProposals]);

  const pendingApps = proposals.filter(app => app.status === 'pending');
  const acceptedApps = proposals.filter(app => app.status === 'accepted');
  const rejectedApps = proposals.filter(app => app.status === 'rejected');

  const ApplicationCard = ({ app }) => {
    const job = app.jobId;
    const client = job?.clientId;

    return (
      <Card className="p-6 border-2 hover:border-indigo-200 transition-all">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <Link to={`/freelancer/jobs/${job?._id}`}>
                  <h3 className="text-xl font-bold hover:text-indigo-600 cursor-pointer mb-1 uppercase tracking-tight">
                    {job?.jobTitle || 'Deleted Job'}
                  </h3>
                </Link>
                <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-indigo-500" />
                    Applied {new Date(app.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1.5 font-bold text-gray-700">
                    <IndianRupee className="w-4 h-4 text-green-600" />
                    ₹{app.bidAmount}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-purple-500" />
                    {app.deliveryTime} Days Delivery
                  </span>
                </div>
              </div>
              <Badge
                className={
                  app.status === 'accepted'
                    ? 'bg-green-100 text-green-700 border-green-200 py-1 px-4'
                    : app.status === 'rejected'
                      ? 'bg-red-100 text-red-700 border-red-200 py-1 px-4'
                      : 'bg-yellow-100 text-yellow-700 border-yellow-200 py-1 px-4'
                }
              >
                {app.status.toUpperCase()}
              </Badge>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-gray-400 uppercase">Client:</span>
              <span className="text-sm font-semibold text-gray-700">{client?.companyName || client?.fullName || 'N/A'}</span>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2 italic">"{app.coverLetter}"</p>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-[10px] uppercase font-bold text-indigo-600 border-indigo-100">
                {job?.category}
              </Badge>
            </div>
          </div>

          <div className="flex lg:flex-col gap-2 min-w-[140px]">
            <Link to={`/freelancer/jobs/${job?._id}`} className="flex-1 lg:flex-none">
              <Button variant="outline" size="sm" className="w-full font-bold border-gray-200 hover:bg-indigo-50 hover:text-indigo-600">
                <ExternalLink className="mr-2 h-4 w-4" />
                Details
              </Button>
            </Link>
            {app.status === 'accepted' && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full font-bold border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                onClick={() => handleMessage(job?._id, client?._id)}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Message Client
              </Button>
            )}
            {app.status === 'pending' && (
              <Button variant="ghost" size="sm" className="flex-1 lg:flex-none text-red-500 hover:text-red-600 hover:bg-red-50 font-bold">
                Withdraw
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  };

  const handleMessage = async (jobId, clientId) => {
    try {
      const conversation = await chatService.createConversation(jobId, clientId, user?._id);
      navigate(`/messages/${conversation._id}`);
    } catch (error) {
      toast.error("Could not start message");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Fetching your applications...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">My Proposals</h2>
        <p className="text-gray-500 font-medium">Track your job applications and project status</p>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-gray-100/50 p-1 border">
          <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 font-bold uppercase text-[11px] tracking-widest">
            All <Badge className="ml-2 bg-gray-200 text-gray-700 border-none">{proposals.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="pending" className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 font-bold uppercase text-[11px] tracking-widest">
            Pending <Badge className="ml-2 bg-yellow-100 text-yellow-700 border-none">{pendingApps.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="accepted" className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 font-bold uppercase text-[11px] tracking-widest">
            Accepted <Badge className="ml-2 bg-green-100 text-green-700 border-none">{acceptedApps.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 font-bold uppercase text-[11px] tracking-widest">
            Rejected <Badge className="ml-2 bg-red-100 text-red-700 border-none">{rejectedApps.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6 outline-none">
          {proposals.length > 0 ? (
            proposals.map((app) => <ApplicationCard key={app._id} app={app} />)
          ) : (
            <Card className="p-16 text-center border-dashed border-2">
              <p className="text-gray-500 font-medium">No applications found</p>
              <Link to="/freelancer/jobs" className="mt-4 inline-block">
                <Button>Browse Jobs</Button>
              </Link>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-6 outline-none">
          {pendingApps.length > 0 ? (
            pendingApps.map((app) => <ApplicationCard key={app._id} app={app} />)
          ) : (
            <Card className="p-16 text-center border-dashed border-2">
              <p className="text-gray-500 font-medium">No pending proposals</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="accepted" className="space-y-6 outline-none">
          {acceptedApps.length > 0 ? (
            acceptedApps.map((app) => <ApplicationCard key={app._id} app={app} />)
          ) : (
            <Card className="p-16 text-center border-dashed border-2">
              <p className="text-gray-500 font-medium">No accepted projects yet</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-6 outline-none">
          {rejectedApps.length > 0 ? (
            rejectedApps.map((app) => <ApplicationCard key={app._id} app={app} />)
          ) : (
            <Card className="p-16 text-center border-dashed border-2">
              <p className="text-gray-500 font-medium">No rejected proposals</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}






