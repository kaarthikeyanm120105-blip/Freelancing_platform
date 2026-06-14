import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, Download, Plus, Clock, IndianRupee } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import paymentService from '../../services/paymentService';
import { toast } from 'sonner';
import { Progress } from '../../components/ui/progress';

export default function FreelancerWallet() {
  const { user } = useAuth();
  const [earnings, setEarnings] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [walletStats, setWalletStats] = useState({ chartData: [], performance: { successRate: 0, onTimeRate: 0 } });
  const [loading, setLoading] = useState(true);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [processing, setProcessing] = useState(false);

  const fetchData = async () => {
    try {
      const [earningsRes, withdrawalsRes, statsRes] = await Promise.all([
        paymentService.getEarnings(),
        paymentService.getWithdrawals(),
        paymentService.getWalletStats()
      ]);
      if (earningsRes.success) setEarnings(earningsRes.earnings);
      if (withdrawalsRes.success) setWithdrawals(withdrawalsRes.withdrawals);
      if (statsRes.success) setWalletStats(statsRes);
    } catch (error) {
      toast.error('Failed to fetch wallet data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const releasedEarnings = earnings.filter(e => e.status === 'released');
  const escrowEarnings = earnings.filter(e => e.status === 'paid');

  const totalEarnedTotal = releasedEarnings.reduce((acc, curr) => acc + curr.amount, 0);
  const totalWithdrawnTotal = withdrawals
    .filter(w => w.status === 'completed')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalAvailable = totalEarnedTotal - totalWithdrawnTotal;
  const totalEscrow = escrowEarnings.reduce((acc, curr) => acc + curr.amount, 0);
  const grandTotal = totalEarnedTotal + totalEscrow;

  const handleWithdraw = async (e) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) return toast.error("Enter a valid amount");
    if (amount > totalAvailable) return toast.error("Insufficient balance");

    setProcessing(true);
    try {
      const res = await paymentService.requestWithdrawal(amount);
      if (res.success) {
        toast.success(`₹${amount} withdrawn successfully!`);
        setWithdrawModalOpen(false);
        setWithdrawAmount('');
        fetchData();
      }
    } catch (error) {
      toast.error(error.message || "Withdrawal failed");
    } finally {
      setProcessing(false);
    }
  };

  if (!user || loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
    </div>
  );

  const monthlyData = walletStats.chartData;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2 uppercase tracking-tight">Wallet & Payouts</h2>
          <p className="text-gray-600">Track your earnings and manage your available balance</p>
        </div>
        <Button
          onClick={() => setWithdrawModalOpen(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md"
        >
          <Download className="mr-2 h-4 w-4" />
          Withdraw Funds
        </Button>
      </div>

      {/* Balance Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-xl border-none">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <IndianRupee className="w-6 h-6" />
            </div>
            <Badge className="bg-white/20 text-white border-none font-bold">AVAILABLE</Badge>
          </div>
          <div className="text-3xl font-black mb-1">₹{totalAvailable.toLocaleString()}</div>
          <div className="text-indigo-100 text-xs font-medium uppercase tracking-wider">Ready to Withdraw</div>
        </Card>

        <Card className="p-6 border-2 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <Badge className="bg-yellow-100 text-yellow-700 border-none font-bold">ESCROW</Badge>
          </div>
          <div className="text-3xl font-black text-gray-900 mb-1">₹{totalEscrow.toLocaleString()}</div>
          <div className="text-gray-500 text-xs font-medium uppercase tracking-wider">Locked in Projects</div>
        </Card>

        <Card className="p-6 border-2 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <Badge className="bg-green-100 text-green-700 border-none font-bold">LIFETIME</Badge>
          </div>
          <div className="text-3xl font-black text-gray-900 mb-1">₹{grandTotal.toLocaleString()}</div>
          <div className="text-gray-500 text-xs font-medium uppercase tracking-wider">Total Earnings</div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Earnings Chart */}
        <Card className="p-6 lg:col-span-2 border-2 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tighter">Earnings Trend</h3>
            <Badge variant="outline" className="text-[10px] font-black">LAST 6 MONTHS</Badge>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} />
              <Tooltip
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="earned" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Withdrawal Modal (Inlined for simplicity) */}
        {withdrawModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md p-8 animate-in zoom-in-95 duration-200">
              <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase italic">Withdraw Funds</h3>
              <p className="text-sm text-gray-500 mb-6">Enter the amount you wish to withdraw to your linked account.</p>

              <form onSubmit={handleWithdraw} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase">Amount to Withdraw (INR)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-xl font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <p className="text-xs text-indigo-600 font-bold">Max: ₹{totalAvailable.toLocaleString()}</p>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 py-6 rounded-2xl font-bold"
                    onClick={() => setWithdrawModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 py-6 rounded-2xl font-bold bg-indigo-600 hover:bg-indigo-700"
                    disabled={processing || !withdrawAmount || parseFloat(withdrawAmount) > totalAvailable}
                  >
                    {processing ? "Processing..." : "Confirm Withdrawal"}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Quick Stats Sidebar */}
        <div className="space-y-6">
          <Card className="p-6 border-2 bg-slate-900 text-white shadow-lg">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Performance</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Success Rate</span>
                <span className="text-sm font-bold">{walletStats.performance?.successRate ?? 0}%</span>
              </div>
              <Progress value={walletStats.performance?.successRate ?? 0} className="h-1.5 bg-slate-800" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">On-time Delivery</span>
                <span className="text-sm font-bold">{walletStats.performance?.onTimeRate ?? 0}%</span>
              </div>
              <Progress value={walletStats.performance?.onTimeRate ?? 0} className="h-1.5 bg-slate-800" />
              <div className="mt-3 pt-3 border-t border-slate-700 grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-lg font-black">{walletStats.performance?.totalProposals ?? 0}</div>
                  <div className="text-[10px] text-slate-500 uppercase">Applied</div>
                </div>
                <div>
                  <div className="text-lg font-black text-indigo-400">{walletStats.performance?.acceptedProposals ?? 0}</div>
                  <div className="text-[10px] text-slate-500 uppercase">Accepted</div>
                </div>
                <div>
                  <div className="text-lg font-black text-green-400">{walletStats.performance?.completedProposals ?? 0}</div>
                  <div className="text-[10px] text-slate-500 uppercase">Done</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Transactions */}
      <Card className="overflow-hidden border-2 shadow-sm">
        <Tabs defaultValue="all">
          <div className="p-6 border-b bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="font-bold text-gray-900 uppercase">Transaction History</h3>
            <TabsList className="bg-white border">
              <TabsTrigger value="all" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white uppercase text-[10px] font-black">All</TabsTrigger>
              <TabsTrigger value="earnings" className="data-[state=active]:bg-green-600 data-[state=active]:text-white uppercase text-[10px] font-black">Earnings</TabsTrigger>
              <TabsTrigger value="withdrawals" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white uppercase text-[10px] font-black">Withdrawals</TabsTrigger>
            </TabsList>
          </div>

          <div className="divide-y">
            <TabsContent value="all" className="m-0">
              {[...earnings, ...withdrawals.map(w => ({ ...w, type: 'withdrawal' }))].length === 0 ? (
                <div className="p-12 text-center text-gray-400">No activity yet.</div>
              ) : (
                [...earnings, ...withdrawals.map(w => ({ ...w, type: 'withdrawal' }))]
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((item) => (
                    <div key={item._id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.type === 'withdrawal' ? 'bg-orange-100 text-orange-600' :
                          item.status === 'released' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                          }`}>
                          {item.type === 'withdrawal' ? <ArrowUpRight className="w-6 h-6" /> :
                            item.status === 'released' ? <ArrowDownRight className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 uppercase tracking-tight">
                            {item.type === 'withdrawal' ? 'Funds Withdrawal' : (item.jobId?.jobTitle || 'Project Payment')}
                          </div>
                          <div className="text-xs text-gray-500 font-medium">
                            {new Date(item.createdAt).toLocaleDateString()} • {item.type === 'withdrawal' ? 'To Bank' : 'Deposit'}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-black ${item.type === 'withdrawal' ? 'text-orange-600' :
                          item.status === 'released' ? 'text-green-600' : 'text-yellow-600'
                          }`}>
                          {item.type === 'withdrawal' ? '-' : '+'}₹{item.amount.toLocaleString()}
                        </div>
                        <Badge className={`text-[10px] font-black border-none ${item.type === 'withdrawal' ? 'bg-orange-50 text-orange-700' :
                          item.status === 'released' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                          }`}>
                          {item.type === 'withdrawal' ? 'COMPLETED' : item.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  ))
              )}
            </TabsContent>

            <TabsContent value="earnings" className="m-0">
              {earnings.length === 0 ? (
                <div className="p-12 text-center text-gray-400">No earnings recorded.</div>
              ) : (
                earnings.map((payment) => (
                  <div key={payment._id} className="p-6 flex items-center justify-between border-b last:border-0">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${payment.status === 'released' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                        {payment.status === 'released' ? <ArrowDownRight className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 uppercase">{payment.jobId?.jobTitle}</div>
                        <div className="text-xs text-gray-500">{new Date(payment.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-black ${payment.status === 'released' ? 'text-green-600' : 'text-yellow-600'}`}>
                        +₹{payment.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="withdrawals" className="m-0">
              {withdrawals.length === 0 ? (
                <div className="p-12 text-center text-gray-400">No withdrawals made yet.</div>
              ) : (
                withdrawals.map((item) => (
                  <div key={item._id} className="p-6 flex items-center justify-between border-b last:border-0">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                        <ArrowUpRight className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 uppercase">Bank Withdrawal</div>
                        <div className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black text-orange-600">-₹{item.amount.toLocaleString()}</div>
                      <Badge className="bg-orange-50 text-orange-700 border-none font-black text-[10px]">COMPLETED</Badge>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  );
}




