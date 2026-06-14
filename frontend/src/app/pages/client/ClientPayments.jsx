import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { IndianRupee, Clock, CheckCircle, TrendingUp, CreditCard } from 'lucide-react';
import paymentService from '../../services/paymentService';
import { toast } from 'sonner';

export default function ClientPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await paymentService.getClientHistory();
      if (response.success) {
        setPayments(response.payments);
      }
    } catch (error) {
      toast.error('Failed to load payment history');
    } finally {
      setLoading(false);
    }
  };

  const totalSpent = payments
    .filter(p => p.status === 'released')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalEscrow = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, t) => sum + t.amount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Payments & Billing</h2>
        <p className="text-gray-600">Track your spending and manage escrowed funds</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 bg-indigo-50/50 border-indigo-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
              <IndianRupee className="w-6 h-6" />
            </div>
            <Badge className="bg-green-100 text-green-700">Spent</Badge>
          </div>
          <div className="text-3xl font-bold mb-1 text-gray-900">₹{totalSpent.toLocaleString()}</div>
          <div className="text-sm text-gray-500 font-medium uppercase tracking-tight">Total Spent</div>
        </Card>

        <Card className="p-6 bg-yellow-50/50 border-yellow-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-yellow-600 shadow-sm">
              <Clock className="w-6 h-6" />
            </div>
            <Badge className="bg-yellow-100 text-yellow-700">Held</Badge>
          </div>
          <div className="text-3xl font-bold mb-1 text-gray-900">₹{totalEscrow.toLocaleString()}</div>
          <div className="text-sm text-gray-500 font-medium uppercase tracking-tight">In Escrow</div>
        </Card>

        <Card className="p-6 bg-green-50/50 border-green-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-green-600 shadow-sm">
              <CheckCircle className="w-6 h-6" />
            </div>
            <Badge className="bg-green-100 text-green-700">Live</Badge>
          </div>
          <div className="text-3xl font-bold mb-1 text-gray-900">{payments.length}</div>
          <div className="text-sm text-gray-500 font-medium uppercase tracking-tight">Total Transactions</div>
        </Card>
      </div>

      <Card className="overflow-hidden border-2">
        <div className="p-6 border-b bg-gray-50/50">
          <h3 className="font-bold text-gray-900">Transaction History</h3>
        </div>
        <div className="divide-y">
          {payments.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <CreditCard className="w-8 h-8" />
              </div>
              <p className="text-gray-500">No payment records found.</p>
            </div>
          ) : (
            payments.map((payment) => (
              <div key={payment._id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${payment.status === 'released' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 uppercase">{payment.jobId?.jobTitle || 'Deleted Job'}</h4>
                    <p className="text-sm text-gray-500">Paid to: {payment.freelancerId?.fullName}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(payment.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">₹{payment.amount.toLocaleString()}</div>
                  <Badge className={
                    payment.status === 'released' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }>
                    {payment.status === 'released' ? 'COMPLETED' : 'ESCROWED'}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}





