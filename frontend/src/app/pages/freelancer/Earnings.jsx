import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { IndianRupee, Clock, CheckCircle, TrendingUp, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import paymentService from '../../services/paymentService';

export default function Earnings() {
    const [earnings, setEarnings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEarnings();
    }, []);

    const fetchEarnings = async () => {
        try {
            const response = await paymentService.getEarnings();
            if (response.success) {
                setEarnings(response.earnings);
            }
        } catch (error) {
            toast.error('Failed to fetch earnings history');
        } finally {
            setLoading(false);
        }
    };

    const totalEarned = earnings
        .filter(e => e.status === 'released')
        .reduce((acc, curr) => acc + curr.amount, 0);

    const pendingEscrow = earnings
        .filter(e => e.status === 'paid')
        .reduce((acc, curr) => acc + curr.amount, 0);

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
                <h1 className="text-2xl font-bold text-gray-900">Your Earnings</h1>
                <p className="text-gray-500">Track your income and payments held in escrow</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 bg-green-50/50 border-green-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-green-600 shadow-sm">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-green-600 font-medium uppercase tracking-wider">Total Earned</p>
                            <h2 className="text-3xl font-bold text-gray-900">₹{totalEarned}</h2>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 bg-amber-50/50 border-amber-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-amber-600 shadow-sm">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-amber-600 font-medium uppercase tracking-wider">In Escrow</p>
                            <h2 className="text-3xl font-bold text-gray-900">₹{pendingEscrow}</h2>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 bg-indigo-50/50 border-indigo-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                            <Wallet className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-indigo-600 font-medium uppercase tracking-wider">Transactions</p>
                            <h2 className="text-3xl font-bold text-gray-900">{earnings.length}</h2>
                        </div>
                    </div>
                </Card>
            </div>

            <Card className="overflow-hidden border-2">
                <div className="p-6 border-b bg-gray-50/50">
                    <h3 className="font-semibold text-gray-900">Payment History</h3>
                </div>

                <div className="divide-y">
                    {earnings.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            No earnings history yet.
                        </div>
                    ) : (
                        earnings.map((payment) => (
                            <div key={payment._id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${payment.status === 'released' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                                        }`}>
                                        <IndianRupee className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 uppercase">{payment.jobId?.jobTitle || 'Deleted Job'}</h4>
                                        <p className="text-sm text-gray-500">From: {payment.clientId?.fullName}</p>
                                        <p className="text-xs text-gray-400 mt-1">{new Date(payment.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-gray-900">₹{payment.amount}</div>
                                        <Badge className={
                                            payment.status === 'released' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                        }>
                                            {payment.status === 'released' ? 'PAID' : 'HELD IN ESCROW'}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Card>
        </div>
    );
}
