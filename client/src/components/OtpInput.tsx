import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface OtpInputProps {
  length: number;
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
}

export const OtpInput = ({ length, value, onChange, isLoading }: OtpInputProps) => {
  return (
    <div className="flex justify-center">
      <InputOTP
        maxLength={length}
        value={value}
        onChange={onChange}
        disabled={isLoading}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && value.length === length) {
            const form = e.currentTarget.closest('form');
            if (form) {
              form.requestSubmit();
            } else {
              // Trigger click on verify button if not in a form
              const button = document.querySelector('button[type="submit"]') as HTMLButtonElement;
              if (button) button.click();
            }
          }
        }}
      >
        <InputOTPGroup className="gap-2">
          {Array.from({ length }, (_, i) => (
            <InputOTPSlot
              key={i}
              index={i}
              className="w-12 h-12 text-lg font-semibold border-2 border-gray-300 rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
          ))}
        </InputOTPGroup>
      </InputOTP>
    </div>
  );
};