import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { mockTransactions } from '../../data/mockData';

export default function PaymentMonitoring() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Payment Monitoring</h2>
        <p className="text-gray-600">Monitor all platform transactions and payments</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-3xl font-bold mb-1">$458K</div>
          <div className="text-sm text-gray-600">Total Volume</div>
        </Card>
        <Card className="p-6">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-3xl font-bold mb-1">1,254</div>
          <div className="text-sm text-gray-600">Transactions</div>
        </Card>
        <Card className="p-6">
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="text-3xl font-bold mb-1">$45K</div>
          <div className="text-sm text-gray-600">In Escrow</div>
        </Card>
        <Card className="p-6">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-3xl font-bold mb-1">$23K</div>
          <div className="text-sm text-gray-600">Platform Fee</div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">Recent Transactions</h3>
        <div className="space-y-3">
          {mockTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <DollarSign className={`w-5 h-5 ${
                    transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`} />
                </div>
                <div>
                  <div className="font-semibold">{transaction.description}</div>
                  <div className="text-sm text-gray-600">
                    {new Date(transaction.date).toLocaleDateString()} • ID: {transaction.id}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-semibold ${
                  transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'credit' ? '+' : '-'}${transaction.amount}
                </div>
                <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                  {transaction.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}





