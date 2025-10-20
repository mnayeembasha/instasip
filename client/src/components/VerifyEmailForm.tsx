import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { verifyAndRegister, resendOtp, clearEmailVerificationPending } from '@/store/features/authSlice';
import { OtpInput } from '@/components/OtpInput';
import { OtpTimer } from '@/components/OtpTimer';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { IconArrowLeft as TablerArrowLeft, IconMail } from '@tabler/icons-react';

export const VerifyEmailForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect') || '/';
  
  const { isLoading, userEmail, otpExpiresAt, isResendingOtp } = useAppSelector((state) => state.auth);
  const [otp, setOtp] = useState('');

  const handleVerify = async () => {
    if (otp.length !== 6 || !userEmail) {
      return;
    }
    const result = await dispatch(verifyAndRegister({ email: userEmail, otp }));
    if (verifyAndRegister.fulfilled.match(result)) {
      navigate(redirect);
    }
  };

  const handleResend = async () => {
    if (!userEmail) return;
    await dispatch(resendOtp({ email: userEmail }));
    setOtp(''); // Clear OTP input after resend
  };

  const handleBack = () => {
    dispatch(clearEmailVerificationPending());
  };

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="md:hidden flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition mb-6"
      >
        <TablerArrowLeft size={18} />
        <span>Back</span>
      </button>

      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="md:hidden flex justify-center mb-6">
            <img src="/logo.jpg" alt='InstaSip' className='rounded-full w-24 h-24'/>
          </div>
          
          <div className="hidden md:flex justify-center mb-4">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
              <IconMail size={32} className="text-accent" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-accent mb-2">Verify Your Email</h2>
          <p className="text-sm text-muted-foreground mb-1">
            We've sent a 6-digit code to your email.
          </p>
          {/*<p className="text-sm font-semibold text-gray-800">{userEmail}</p>*/}
        </div>

        {/* Security Notice */}
        <div className="text-[var(--color-primary)]/20 border border-primary rounded-lg p-3 flex items-start gap-3">
          {/*<IconShieldCheck size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />*/}
          <p className="text-xs text-[var(--color-primary)]/50 md:text-[var(--color-primary)]/80">
            For your security, this code will expire in 10 minutes. Please verify your email to complete registration.
          </p>
        </div>

        {/* OTP Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
            Enter Verification Code
          </label>
          <OtpInput
            length={6}
            value={otp}
            onChange={setOtp}
            isLoading={isLoading}
          />
        </div>

        {/* Verify Button */}
        <Button
          onClick={handleVerify}
          type="submit"
          disabled={isLoading || otp.length !== 6}
          className="w-full bg-accent text-white hover:bg-accent/90"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              {/*<IconShieldCheck size={18} className="mr-2" />*/}
              Verify Email
            </>
          )}
        </Button>

        {/* Timer and Resend */}
        <OtpTimer
          expiresAt={otpExpiresAt}
          onResendClick={handleResend}
          isResending={isResendingOtp}
        />

        {/* Help Text */}
        <div className="text-center pt-4 border-t">
          <p className="text-xs text-gray-500">
            Didn't receive the code? Check your spam folder or click resend.
          </p>
        </div>
      </div>
    </div>
  );
};