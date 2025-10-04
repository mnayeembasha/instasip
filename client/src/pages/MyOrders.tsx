import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMyOrders } from '@/store/features/orderSlice';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { IconInfoCircle } from '@tabler/icons-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import OrderDetailsModal from '@/components/OrderDetailsModal';
import type { OrderType } from '@/types';

const MyOrders = () => {
  const { orders, isFetchingOrders, error } = useAppSelector((state) => state.order);
  const { user, isCheckingAuth } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
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

  const getShortOrderId = (id: string) => {
    return id.slice(-8).toUpperCase();
  };

  // Show loading spinner while checking auth
  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto p-4 pt-20 md:pt-24 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">My Orders</h1>
      {isFetchingOrders ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-600">You have no orders yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map(order => (
                <TableRow key={order._id} className="hover:bg-gray-50">
                  <TableCell className="font-mono text-sm">#{getShortOrderId(order._id)}</TableCell>
                  <TableCell className="font-semibold">&#8377;{order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell className="capitalize">{order.status}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(order)}
                      className="hover:bg-blue-50"
                    >
                      <IconInfoCircle className="w-5 h-5 text-blue-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <OrderDetailsModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        order={selectedOrder}
      />
    </div>
  );
};

export default MyOrders;