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

interface SignupFormData{
    name:string;
    phone:string;
    password:string;
}
interface LoginFormData{
    phone:string;
    password:string;
}
type AuthFormData = SignupFormData | LoginFormData;

const AuthForm = ({ type }: AuthFormProps) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect') || '/';

  const form = useForm<AuthFormData>({
    resolver: zodResolver(type === 'login' ? loginSchema : signupSchema),
    defaultValues: type === 'login' ? { phone: '', password: '' } : { name: '', phone: '', password: '' },
  });

  const onSubmit = (data: AuthFormData) => {
    const action = type === 'login' ? login(data) : register(data as SignupFormData);
    dispatch(action).then(() => navigate(redirect));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 animate-fade-in">
        {/* Header Section */}
        <div className="text-center mb-6">
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
        <Button type="submit" disabled={isLoading} className="w-full bg-accent text-white">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {type === 'login' ? 'Login' : 'Signup'}
        </Button>

      <p className="text-center">
        {type === "signup" ? (
          <>
            Already have an account?{" "}
            <Link to="/login" className="text-accent">
              Login
            </Link>
          </>
        ) : (
          <>
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-accent">
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