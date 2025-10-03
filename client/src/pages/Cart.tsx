import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateQuantity, removeFromCart, clearCart } from '@/store/features/cartSlice';
import { createOrder } from '@/store/features/orderSlice';
import { getMe } from '@/store/features/authSlice';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import type {  ShippingAddressType } from '@/types';

const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'Zip Code is required'),
  country: z.string().default('India'),
});

const Cart = () => {
  const { items } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);
  const { isCreatingOrder, error } = useAppSelector((state) => state.order);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: { street: '', city: '', state: '', zipCode: '', country: 'India' },
  });

  useEffect(() => {
    if (!user) {
      dispatch(getMe()).catch(() => navigate('/login?redirect=/cart'));
    }
  }, [user, dispatch, navigate]);

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const onSubmit = (data: unknown) => {
    if (items.length === 0) return;
    dispatch(createOrder({
      items: items.map(i => ({ product: i.product._id, quantity: i.quantity })),
      shippingAddress: data as ShippingAddressType,
    })).then(() => {
      dispatch(clearCart());
      navigate('/orders');
    });
  };

  if (!user) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto p-4 pt-30 min-h-screen bg-background">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>
      {items.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty. Start shopping!</p>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {items.map(item => (
                <Card key={item.product._id} className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <img src={item.product.image} alt={item.product.name} className="w-24 h-24 object-cover rounded" />
                  <div className="flex-1">
                    <CardTitle>{item.product.name}</CardTitle>
                    <p className="text-sm text-gray-500">Price: &#8377;{item.product.price.toFixed(2)}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Input type="number" min={1} max={item.product.stock} value={item.quantity} onChange={(e) => dispatch(updateQuantity({ id: item.product._id, quantity: parseInt(e.target.value) }))} className="w-20" />
                      <Button variant="destructive" size="sm" onClick={() => dispatch(removeFromCart(item.product._id))}>Remove</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-bold text-lg">Total: &#8377;{total?total.toFixed(2):0}</p>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
                      <FormField name="street" render={({ field }) => <FormItem><FormLabel>Street</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                      <FormField name="city" render={({ field }) => <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                      <FormField name="state" render={({ field }) => <FormItem><FormLabel>State</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                      <FormField name="zipCode" render={({ field }) => <FormItem><FormLabel>Zip Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                      <Button type="submit" disabled={isCreatingOrder} className="w-full bg-primary text-white">
                        {isCreatingOrder ? <LoadingSpinner /> : 'Place Order'}
                      </Button>
                    </form>
                  </Form>
                  {error && <ErrorMessage message={error} />}
                </CardFooter>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;