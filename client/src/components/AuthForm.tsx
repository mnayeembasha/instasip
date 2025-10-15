import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login, register } from '@/store/features/authSlice';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

interface AuthFormProps {
  type: 'login' | 'signup';
}

const loginSchema = z.object({
  phone: z.string().length(10, 'Phone number should be 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = loginSchema.extend({
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

interface SignupFormData {
  name: string;
  phone: string;
  password: string;
}

interface LoginFormData {
  phone: string;
  password: string;
}

type AuthFormData = SignupFormData | LoginFormData;

const AuthForm = ({ type }: AuthFormProps) => {
  const dispatch = useAppDispatch();
  const { isLoading, user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect') || '/';

  const form = useForm<AuthFormData>({
    resolver: zodResolver(type === 'login' ? loginSchema : signupSchema),
    defaultValues: type === 'login' ? { phone: '', password: '' } : { name: '', phone: '', password: '' },
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [user, navigate, redirect]);

  const onSubmit = async (data: AuthFormData) => {
    const action = type === 'login' ? login(data) : register(data as SignupFormData);
    const result = await dispatch(action);

    // Check if the action was successful
    if (type === 'login' && login.fulfilled.match(result)) {
      navigate(redirect);
    } else if (type === 'signup' && register.fulfilled.match(result)) {
      navigate(redirect);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 animate-fade-in">
        {/* Header Section */}
        <div className="text-center mb-6">

        <div className="md:hidden flex justify-center my-8"><img src="/logo.jpg" alt='InstaSip' className='rounded-full md:w-50 md:h-50'/></div>
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
        {type === 'signup' && (
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full bg-accent text-white hover:bg-primary">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {type === 'login' ? 'Login' : 'Signup'}
        </Button>

        <p className="text-center">
          {type === "signup" ? (
            <>
              Already have an account?{" "}
              <Link to={`/login${redirect !== '/' ? `?redirect=${redirect}` : ''}`} className="text-accent hover:underline">
                Login
              </Link>
            </>
          ) : (
            <>
              Don&apos;t have an account?{" "}
              <Link to={`/signup${redirect !== '/' ? `?redirect=${redirect}` : ''}`} className="text-accent hover:underline">
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