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
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import type { ShippingAddressType } from '@/types';

const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'Zip Code is required'),
  country: z.string().default('India'),
});

const Cart = () => {
  const { items } = useAppSelector((state) => state.cart);
  const { isCheckingAuth } = useAppSelector((state) => state.auth);
  const { isCreatingOrder, error } = useAppSelector((state) => state.order);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: { street: '', city: '', state: '', zipCode: '', country: 'India' },
  });

  useEffect(() => {
    // Only scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const onSubmit = async (data: unknown) => {
    if (items.length === 0) return;
    const result = await dispatch(createOrder({
      items: items.map(i => ({ product: i.product._id, quantity: i.quantity })),
      shippingAddress: data as ShippingAddressType,
    }));
    if (createOrder.fulfilled.match(result)) {
      dispatch(clearCart());
      navigate('/orders');
    }
  };

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto p-4 pt-20 md:pt-24 min-h-screen bg-background">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Your Cart</h1>
      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Your cart is empty. Start shopping!</p>
          <Button onClick={() => navigate('/products')} className="bg-primary text-white hover:bg-accent">
            Browse Products
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              {items.map(item => (
                <Card key={item.product._id} className="overflow-hidden">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center p-4 gap-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full sm:w-24 h-48 sm:h-24 object-cover rounded"
                    />
                    <div className="flex-1 w-full">
                      <CardTitle className="text-lg mb-2">{item.product.name}</CardTitle>
                      <p className="text-sm text-gray-500 mb-3">Price: &#8377;{item.product.price.toFixed(2)}</p>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <Input
                          type="number"
                          min={1}
                          max={item.product.stock}
                          value={item.quantity}
                          onChange={(e) => dispatch(updateQuantity({ id: item.product._id, quantity: parseInt(e.target.value) || 1 }))}
                          className="w-full sm:w-20"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => dispatch(removeFromCart(item.product._id))}
                          className="w-full sm:w-auto"
                        >
                          Remove
                        </Button>
                      </div>
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
                  <p className="font-bold text-lg md:text-xl">Total: &#8377;{total ? total.toFixed(2) : 0}</p>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
                      <FormField name="street" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField name="city" render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField name="state" render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField name="zipCode" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zip Code</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <Button type="submit" disabled={isCreatingOrder} className="w-full bg-primary text-white hover:bg-accent">
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