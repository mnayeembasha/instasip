import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login, sendRegistrationOtp } from '@/store/features/authSlice';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { VerifyEmailForm } from './VerifyEmailForm';

interface AuthFormProps {
  type: 'login' | 'signup';
}

const loginSchema = z.object({
  phone: z.string().length(10, 'Phone number should be 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().length(10, 'Phone number should be 10 digits'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

interface SignupFormData {
  name: string;
  phone: string;
  email: string;
  password: string;
}

interface LoginFormData {
  phone: string;
  password: string;
}

type AuthFormData = SignupFormData | LoginFormData;

const AuthForm = ({ type }: AuthFormProps) => {
  const dispatch = useAppDispatch();
  const { isLoading, user, isEmailVerificationPending, userEmail } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect') || '/';
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<AuthFormData>({
    resolver: zodResolver(type === 'login' ? loginSchema : signupSchema),
    defaultValues: type === 'login' 
      ? { phone: '', password: '' } 
      : { name: '', phone: '', email: '', password: '' },
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [user, navigate, redirect]);

  const onSubmit = async (data: AuthFormData) => {
    if (type === 'login') {
      const result = await dispatch(login(data));
      if (login.fulfilled.match(result)) {
        navigate(redirect);
      }
      // If login fails due to unverified email, the email verification form will show
    } else {
      // For signup, send OTP first
      await dispatch(sendRegistrationOtp(data as SignupFormData));
      // The verification form will show automatically via state change
    }
  };

  // Show email verification form when pending
  if (isEmailVerificationPending && userEmail) {
    return <VerifyEmailForm />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 animate-fade-in">
        {/* Header Section */}
        <div className="text-center mb-6">
          <div className="md:hidden flex justify-center my-8">
            <img src="/logo.jpg" alt='InstaSip' className='rounded-full w-24 h-24'/>
          </div>
          
          {type === 'signup' ? (
            <>
              <h2 className="text-2xl font-bold text-accent">Create Account</h2>
              <p className="text-sm text-muted-foreground">
                Join us today and start your journey with ease
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-accent">Welcome Back</h2>
              <p className="text-sm text-muted-foreground">
                Login to continue exploring your favorite products
              </p>
            </>
          )}
        </div>

        {/* Name Field - Signup Only */}
        {type === 'signup' && (
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter your name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Email Field - Signup Only */}
        {type === 'signup' && (
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} placeholder="Enter your email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Phone Field - Both Login and Signup */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter 10-digit phone number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field - Both Login and Signup */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    {...field} 
                    placeholder="Enter your password" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button 
          type="submit" 
          disabled={isLoading} 
          className="w-full bg-accent text-white hover:bg-primary"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {type === 'login' ? 'Logging in...' : 'Sending OTP...'}
            </>
          ) : (
            type === 'login' ? 'Login' : 'Continue'
          )}
        </Button>

        {/* Toggle Between Login and Signup */}
        <p className="text-center text-sm">
          {type === 'signup' ? (
            <>
              Already have an account?{' '}
              <Link 
                to={`/login${redirect !== '/' ? `?redirect=${redirect}` : ''}`} 
                className="text-accent font-semibold hover:underline"
              >
                Login
              </Link>
            </>
          ) : (
            <>
              Don&apos;t have an account?{' '}
              <Link 
                to={`/signup${redirect !== '/' ? `?redirect=${redirect}` : ''}`} 
                className="text-accent font-semibold hover:underline"
              >
                Signup
              </Link>
            </>
          )}
        </p>
      </form>
    </Form>
  );
};

export default AuthForm;
