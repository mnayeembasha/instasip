import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMyOrders, cancelOrder } from '@/store/features/orderSlice';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

const MyOrders = () => {
  const { orders, isFetchingOrders, error } = useAppSelector((state) => state.order);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/login?redirect=/orders');
    else dispatch(fetchMyOrders());
  }, [user, dispatch, navigate]);

  const handleCancel = (id: string) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      dispatch(cancelOrder(id));
    }
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
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map(order => (
              <TableRow key={order._id} className="hover:bg-gray-50">
                <TableCell>{order._id}</TableCell>
                <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                <TableCell className="capitalize">{order.status}</TableCell>
                <TableCell>
                  {(order.status === 'pending' || order.status === 'confirmed') && (
                    <Button variant="destructive" size="sm" onClick={() => handleCancel(order._id)}>Cancel</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default MyOrders;