import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card } from '../../components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Mail, Lock, User } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';

export default function Signup() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [role, setRole] = useState('freelancer'); // Default role
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSignup = async (e) => {
    e.preventDefault();

    const success = await register({
      fullName: formData.name, // Backend expects fullName
      email: formData.email,
      password: formData.password,
      role
    });

    if (success) {
      // Navigate to OTP verification on success
      navigate('/otp-verify', { state: { email: formData.email, role } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-2xl border-0">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-gray-600">Start your freelance journey today</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div
              onClick={() => setRole('freelancer')}
              className={`cursor-pointer p-4 rounded-xl border-2 transition-all text-center ${role === 'freelancer'
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 hover:border-indigo-200'
                }`}
            >
              <div className="font-semibold">Freelancer</div>
              <div className="text-xs text-gray-500 mt-1">I want to work</div>
            </div>
            <div
              onClick={() => setRole('client')}
              className={`cursor-pointer p-4 rounded-xl border-2 transition-all text-center ${role === 'client'
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 hover:border-indigo-200'
                }`}
            >
              <div className="font-semibold">Client</div>
              <div className="text-xs text-gray-500 mt-1">I want to hire</div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                className="pl-10"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="you@university.edu"
                className="pl-10"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                className="pl-10"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex items-start gap-2 text-sm">
            <input type="checkbox" className="mt-1 rounded" required />
            <span className="text-gray-600">
              I agree to the{' '}
              <a href="#" className="text-indigo-600 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-indigo-600 hover:underline">
                Privacy Policy
              </a>
            </span>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            size="lg"
          >
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
}






