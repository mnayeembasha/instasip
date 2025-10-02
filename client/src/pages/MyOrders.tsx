import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMyOrders } from '@/store/features/orderSlice';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { IconInfoCircle } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import OrderDetailsModal from '@/components/OrderDetailsModal';
import type { OrderType } from '@/types';

const MyOrders = () => {
  const { orders, isFetchingOrders, error } = useAppSelector((state) => state.order);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!user) navigate('/login?redirect=/orders');
    else dispatch(fetchMyOrders());
  }, [user, dispatch, navigate]);

  const handleViewDetails = (order: OrderType) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  if (!user) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto p-4 pt-20 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      {isFetchingOrders ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-600">You have no orders yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Info</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map(order => (
              <TableRow key={order._id} className="hover:bg-gray-50">
                <TableCell>{order._id}</TableCell>
                <TableCell>&#8377;{order.totalAmount.toFixed(2)}</TableCell>
                <TableCell className="capitalize">{order.status}</TableCell>
                <TableCell>
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

// const handleCancel = (id: string) => {
  //   if (window.confirm('Are you sure you want to cancel this order?')) {
  //     dispatch(cancelOrder(id));
  //   }
  // };

  {/* <TableCell>
                  {(order.status === 'pending' || order.status === 'confirmed') && (
                    <Button variant="destructive" size="sm" onClick={() => handleCancel(order._id)}>Cancel</Button>
                  )}
    </TableCell> */}