import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, Mail, Loader2 } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../../components/ui/input-otp';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function OTPVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshUser } = useAuth();
  const { role, email } = location.state || { role: 'freelancer', email: 'your email' };
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Send OTP on mount
  useEffect(() => {
    const sendInitialOTP = async () => {
      try {
        await api.post('/auth/verify');
        toast.info('Verification code sent to your email');
      } catch (err) {
        toast.error('Failed to send verification code');
      }
    };
    sendInitialOTP();
  }, []);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    setIsVerifying(true);
    try {
      const { data } = await api.post('/auth/verifyEmail', { otp });
      if (data.success) {
        toast.success('Email verified successfully!');
        await refreshUser();
        navigate(`/${role}/profile-setup`, { state: { role } });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await api.post('/auth/verify');
      toast.success('New verification code sent to your email');
    } catch (err) {
      toast.error('Failed to resend code');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-2xl border-0">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Verify Your Email</h1>
          <p className="text-gray-600">
            We've sent a 6-digit verification code to
            <br />
            <span className="font-semibold text-indigo-600">{email}</span>
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button
            onClick={handleVerify}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            size="lg"
            disabled={isVerifying}
          >
            {isVerifying ? (
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            ) : (
              'Verify Email'
            )}
          </Button>

          <div className="text-center text-sm text-gray-600">
            Didn't receive the code?{' '}
            <button
              onClick={handleResend}
              disabled={isResending}
              className="text-indigo-600 font-semibold hover:underline disabled:opacity-50"
            >
              {isResending ? 'Sending...' : 'Resend Code'}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}





