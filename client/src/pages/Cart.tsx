import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { fetchCart, updateCartItemQuantity, removeFromCart, clearCart } from '@/store/features/cartSlice';
import { createOrder } from '@/store/features/orderSlice';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import type { RazorpayResponse } from '@/types';
import toast from 'react-hot-toast';
import { axiosInstance } from '@/lib/axios';

const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'Zip Code is required'),
  country: z.string().default('India'),
});

const Cart = () => {
  const { items, isFetchingCart, isUpdatingCart, error: cartError } = useAppSelector((state) => state.cart);
  const { user: currentUser, isCheckingAuth } = useAppSelector((state) => state.auth);
  const { isCreatingOrder, error: orderError } = useAppSelector((state) => state.order);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [removingItems, setRemovingItems] = useState<{ [key: string]: boolean }>({});
  const [isFetchingZipCode, setIsFetchingZipCode] = useState(false);

  const form = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: { street: '', zipCode: '', city: '', state: '', country: 'India' },
  });

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!isCheckingAuth && !currentUser) {
      toast.error('Please login to view your cart');
      navigate('/login');
      return;
    }

    if (currentUser) {
      dispatch(fetchCart());
    }
  }, [currentUser, isCheckingAuth, navigate, dispatch]);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      toast.error('Quantity must be at least 1');
      return;
    }

    const item = items.find((i) => i.product._id === productId);
    if (item && newQuantity > item.product.stock) {
      toast.error(`Quantity cannot exceed available stock (${item.product.stock})`);
      return;
    }

    try {
      await dispatch(updateCartItemQuantity({ productId, quantity: newQuantity })).unwrap();
      toast.success('Quantity updated');
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to update quantity');
      }
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      setRemovingItems((prev) => ({ ...prev, [productId]: true }));
      await dispatch(removeFromCart(productId)).unwrap();
      toast.success('Item removed from cart');
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to remove item');
      }
    } finally {
      setRemovingItems((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const handleZipCodeChange = async (zipCode: string) => {
    if (zipCode.length === 6 && /^\d{6}$/.test(zipCode)) {
      setIsFetchingZipCode(true);
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${zipCode}`);
        const data = await response.json();
        if (data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
          const { Block, State } = data[0].PostOffice[0];
          form.setValue('city', Block);
          form.setValue('state', State);
        }
      } catch (error) {
        // Do nothing if API fails, let user fill manually
      } finally {
        setIsFetchingZipCode(false);
      }
    }
  };

  const handleProceedToCheckout = async (data: z.infer<typeof addressSchema>) => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!currentUser) {
      toast.error('Please login to continue');
      return;
    }

    setIsProcessingPayment(true);

    try {
      // Create Razorpay order
      const orderRes = await axiosInstance.post('/payment/create-order', {
        amount: total,
      });

      const { orderId, amount, currency, keyId } = orderRes.data;

      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: 'InstaSip',
        description: 'Order Payment',
        order_id: orderId,
        handler: async (response: RazorpayResponse) => {
          try {
            // Create order after successful payment
            await dispatch(createOrder({
              items: items.map((i) => ({ product: i.product._id, quantity: i.quantity })),
              shippingAddress: data,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            })).unwrap();

            await dispatch(clearCart()).unwrap();
            toast.success('Order placed successfully!');
            navigate('/profile');
          } catch (error) {
            if (error instanceof Error) {
              toast.error(error.message || 'Failed to place order');
            }
          }
        },
        prefill: {
          name: currentUser.name,
          contact: currentUser.phone,
        },
        theme: {
          color: '#3399cc',
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on('payment.failed', () => {
        toast.error('Payment failed. Please try again.');
        setIsProcessingPayment(false);
      });

      razorpay.open();
      setIsProcessingPayment(false);
    } catch (error) {
      setIsProcessingPayment(false);
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to initiate payment');
      }
    }
  };

  if (isCheckingAuth || isFetchingCart) {
    return <LoadingSpinner />;
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 pt-20 md:pt-24 min-h-screen bg-background">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center mt-6 md:mt-0">Your Cart</h1>

      {cartError && (
        <div className="mb-4">
          <ErrorMessage message={cartError} />
        </div>
      )}

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
              {items.map((item) => (
                <Card key={item.product._id} className="overflow-hidden">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center p-4 gap-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full sm:w-24 h-48 sm:h-24 object-cover rounded"
                    />
                    <div className="flex-1 w-full">
                      <CardTitle className="text-lg mb-2">{item.product.name}</CardTitle>
                      <p className="text-sm text-gray-500 mb-1">Category: {item.product.category}</p>
                      <p className="text-sm text-gray-500 mb-3">Price: &#8377;{item.product.price.toFixed(2)}</p>
                      <p className="text-sm text-gray-700 font-semibold mb-3">
                        Subtotal: &#8377;{(item.product.price * item.quantity).toFixed(2)}
                      </p>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                            disabled={isUpdatingCart || item.quantity <= 1}
                            className="w-8 h-8"
                          >
                            −
                          </Button>
                          <span className="w-12 text-center border border-gray-300 rounded-lg py-1.5">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                            disabled={isUpdatingCart || item.quantity >= item.product.stock}
                            className="w-8 h-8"
                          >
                            +
                          </Button>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveItem(item.product._id)}
                          disabled={removingItems[item.product._id] || false}
                          className="w-full sm:w-auto"
                        >
                          {removingItems[item.product._id] ? 'Removing...' : 'Remove'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-20 mb-20 md:mb-0">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Items ({items.length}):</span>
                      <span className="font-semibold">&#8377;{total.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-bold text-lg">Total:</span>
                        <span className="font-bold text-lg text-primary">&#8377;{total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-xs text-blue-800">
                      <strong>Note:</strong> We currently accept prepaid orders only for a secure shopping experience.
                      If you face any issues, please contact our support team.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleProceedToCheckout)} className="space-y-4 w-full">
                      <div className="text-sm font-semibold mb-2">Shipping Address</div>
                      <FormField
                        name="street"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Zip Code</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    handleZipCodeChange(e.target.value);
                                  }}
                                />
                                {isFetchingZipCode && (
                                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                    <LoadingSpinner />
                                  </div>
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        disabled={isCreatingOrder || isProcessingPayment || items.length === 0}
                        className="w-full bg-primary text-white hover:bg-accent"
                      >
                        {isProcessingPayment || isCreatingOrder ? <LoadingSpinner /> : 'Proceed to Checkout'}
                      </Button>
                    </form>
                  </Form>
                  {orderError && <ErrorMessage message={orderError} />}
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