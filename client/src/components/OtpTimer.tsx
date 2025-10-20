import { useState, useEffect } from 'react';
import { IconClock } from '@tabler/icons-react';

interface OtpTimerProps {
  expiresAt: Date | null;
  onResendClick: () => void;
  isResending?: boolean;
}

export const OtpTimer = ({
  expiresAt,
  onResendClick,
  isResending = false,
}: OtpTimerProps) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!expiresAt) {
      setCanResend(true);
      console.log(canResend);
      return;
    }

    // Calculate initial seconds left
    const calculateSecondsLeft = () => {
      const now = new Date().getTime();
      const expiry = new Date(expiresAt).getTime();
      const diff = Math.max(0, Math.floor((expiry - now) / 1000));
      return diff;
    };

    setSecondsLeft(calculateSecondsLeft());
    setCanResend(false);

    // Update countdown every second
    const interval = setInterval(() => {
      const remaining = calculateSecondsLeft();
      setSecondsLeft(remaining);

      if (remaining === 0) {
        setCanResend(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate resend availability (60 seconds from OTP sent time)
  const resendSecondsLeft = Math.max(0, 60 - (600 - secondsLeft)); // 600 = 10 minutes total
  const canResendNow = resendSecondsLeft === 0;

  return (
    <div className="text-center space-y-2">
      {secondsLeft > 0 && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <IconClock size={16} className="text-accent" />
          <span>
            OTP expires in <span className="font-bold text-accent">{formatTime(secondsLeft)}</span>
          </span>
        </div>
      )}
      
      {!canResendNow && resendSecondsLeft > 0 ? (
        <p className="text-sm text-muted-foreground">
          Resend available in <span className="font-bold text-accent">{resendSecondsLeft}s</span>
        </p>
      ) : (
        <button
          onClick={onResendClick}
          disabled={isResending}
          className="text-sm font-semibold text-accent hover:underline transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isResending ? 'Sending...' : 'Resend OTP'}
        </button>
      )}
    </div>
  );
};