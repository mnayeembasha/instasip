import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMyOrders } from '@/store/features/orderSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IconUser, IconPhone, IconShoppingBag, IconTruckDelivery, IconAlertCircle, IconCheck, IconClock, IconX } from '@tabler/icons-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import OrderDetailsModal from '@/components/OrderDetailsModal';
import type { OrderType } from '@/types';

const Profile = () => {
  const { user, isCheckingAuth } = useAppSelector((state) => state.auth);
  const { orders, isFetchingOrders, error } = useAppSelector((state) => state.order);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(fetchMyOrders());
    }
  }, [user, dispatch]);

  const handleViewDetails = (order: OrderType) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
      processing: 'bg-purple-100 text-purple-700 border-purple-200',
      shipped: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      delivered: 'bg-green-100 text-green-700 border-green-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, ReactNode> = {
      pending: <IconClock className="w-4 h-4" />,
      confirmed: <IconCheck className="w-4 h-4" />,
      processing: <IconClock className="w-4 h-4" />,
      shipped: <IconTruckDelivery className="w-4 h-4" />,
      delivered: <IconCheck className="w-4 h-4" />,
      cancelled: <IconX className="w-4 h-4" />
    };
    return icons[status] || <IconClock className="w-4 h-4" />;
  };

  const getTrackingSteps = (status: string) => {
    const allSteps = ['confirmed', 'processing', 'shipped', 'delivered'];
    const statusIndex = allSteps.indexOf(status);
    return allSteps.map((step, index) => ({
      step,
      completed: index <= statusIndex,
      active: index === statusIndex
    }));
  };

  const getShortOrderId = (id: string) => {
    return id.slice(-8).toUpperCase();
  };

  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4 pt-20">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <IconUser className="w-16 h-16 text-gray-400" />
            </div>
            <CardTitle className="text-2xl">You are not Logged In</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">Please log in to view your profile and orders</p>
            <Button
              onClick={() => navigate('/login?redirect=/profile')}
              className="w-full bg-primary text-white hover:bg-accent"
            >
              Login to Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 pt-20 md:pt-24 min-h-screen bg-background">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">My Profile</h1>

      {/* User Info Card */}
      <Card className="mb-6 md:mb-8">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
          <CardTitle className="flex items-center gap-2 text-xl">
            <IconUser className="w-6 h-6 text-primary" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <IconUser className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-semibold text-gray-900">{user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <IconPhone className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-semibold text-gray-900">{user.phone}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Section */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
          <CardTitle className="flex items-center gap-2 text-xl">
            <IconShoppingBag className="w-6 h-6 text-primary" />
            My Orders
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {isFetchingOrders ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <IconShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">You haven't placed any orders yet</p>
              <Button
                onClick={() => navigate('/products')}
                className="bg-primary text-white hover:bg-accent"
              >
                Start Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <Card key={order._id} className="overflow-hidden border-l-4" style={{ borderLeftColor: order.status === 'delivered' ? '#10b981' : order.status === 'cancelled' ? '#ef4444' : '#A86934' }}>
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm text-gray-500">Order ID:</span>
                          <span className="font-mono text-sm font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded">
                            #{getShortOrderId(order._id)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">Total:</span>
                          <span className="font-bold text-lg text-primary">&#8377;{order.totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">Date:</span>
                          <span className="text-sm text-gray-700">
                            {new Date(order.orderDate).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={`capitalize flex items-center gap-1.5 px-3 py-1.5 ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(order)}
                          className="hover:bg-primary hover:text-white"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>

                    {/* Order Status Display */}
                    {order.status === 'pending' && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                          <IconClock className="w-5 h-5 text-yellow-600" />
                          <span className="font-semibold text-yellow-700">Order Pending</span>
                        </div>
                        <p className="text-sm text-yellow-600 mt-1">Your order is awaiting confirmation</p>
                      </div>
                    )}

                    {order.status === 'cancelled' && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <IconAlertCircle className="w-5 h-5 text-red-600" />
                          <span className="font-semibold text-red-700">Your Order is Cancelled</span>
                        </div>
                        <p className="text-sm text-red-600 mb-3">If you have any questions, please contact us</p>
                        <a
                          href="tel:8074581961"
                          className="inline-flex items-center gap-2 text-sm font-semibold text-red-700 hover:text-red-800"
                        >
                          <IconPhone className="w-4 h-4" />
                          8074581961
                        </a>
                      </div>
                    )}

                    {/* Track Order - Only for confirmed, processing, shipped, delivered */}
                    {['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status) && (
                      <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-4 md:p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <IconTruckDelivery className="w-5 h-5 text-primary" />
                          <h4 className="font-semibold text-gray-900">Track Order</h4>
                        </div>

                        {/* Desktop View */}
                        <div className="hidden md:block">
                          <div className="flex items-center justify-between relative">
                            {/* Progress Line */}
                            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200">
                              <div
                                className="h-full bg-primary transition-all duration-500"
                                style={{
                                  width: `${(getTrackingSteps(order.status).filter(s => s.completed).length - 1) * 33.33}%`
                                }}
                              />
                            </div>

                            {getTrackingSteps(order.status).map((step) => (
                              <div key={step.step} className="flex flex-col items-center relative z-10 flex-1">
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                                    step.completed
                                      ? 'bg-primary border-primary text-white'
                                      : 'bg-white border-gray-300 text-gray-400'
                                  }`}
                                >
                                  {step.completed ? <IconCheck className="w-5 h-5" /> : <IconClock className="w-5 h-5" />}
                                </div>
                                <span className={`mt-2 text-xs font-medium text-center capitalize ${
                                  step.completed ? 'text-primary' : 'text-gray-400'
                                }`}>
                                  {step.step}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Mobile View */}
                        <div className="md:hidden space-y-3">
                          {getTrackingSteps(order.status).map((step) => (
                            <div key={step.step} className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${
                                  step.completed
                                    ? 'bg-primary border-primary text-white'
                                    : 'bg-white border-gray-300 text-gray-400'
                                }`}
                              >
                                {step.completed ? <IconCheck className="w-4 h-4" /> : <IconClock className="w-4 h-4" />}
                              </div>
                              <span className={`text-sm font-medium capitalize ${
                                step.completed ? 'text-primary' : 'text-gray-400'
                              }`}>
                                {step.step}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <OrderDetailsModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        order={selectedOrder}
      />
    </div>
  );
};

export default Profile;