import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAdminOrders, updateOrderStatus } from '@/store/features/orderSlice';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { IconPackage, IconTruck, IconCircleCheck, IconX, IconClock, IconInfoCircle } from '@tabler/icons-react';
import { Loader2 } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import OrderDetailsModal from '@/components/OrderDetailsModal';
import { useNavigate } from 'react-router-dom';
import type { UserType, OrderType } from '@/types';

interface StatusUpdate {
  open: boolean;
  orderId: string | null;
  newStatus: string | null;
  currentStatus: string | null;
}

const AdminOrders = () => {
  const { adminOrders, isFetchingAdminOrders, error } = useAppSelector((state) => state.order);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState('all');
  const [statusDialog, setStatusDialog] = useState<StatusUpdate>({
    open: false,
    orderId: null,
    newStatus: null,
    currentStatus: null
  });
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.isAdmin) navigate('/');
    else dispatch(fetchAdminOrders({ status: statusFilter !== 'all' ? statusFilter : undefined }));
  }, [statusFilter, user, dispatch, navigate]);

  const handleStatusChange = (orderId: string, currentStatus: string, newStatus: string) => {
    if (newStatus === currentStatus) return;
    setStatusDialog({
      open: true,
      orderId,
      newStatus,
      currentStatus
    });
  };

  const handleStatusConfirm = () => {
    if (statusDialog.orderId && statusDialog.newStatus) {
      setUpdatingOrderId(statusDialog.orderId);
      dispatch(updateOrderStatus({
        id: statusDialog.orderId,
        status: statusDialog.newStatus
      })).then(() => {
        dispatch(fetchAdminOrders({ status: statusFilter !== 'all' ? statusFilter : undefined }));
        setUpdatingOrderId(null);
        setStatusDialog({ open: false, orderId: null, newStatus: null, currentStatus: null });
      }).catch(() => {
        setUpdatingOrderId(null);
        setStatusDialog({ open: false, orderId: null, newStatus: null, currentStatus: null });
      });
    }
  };

  const handleViewDetails = (order: OrderType) => {
    setSelectedOrder(order);
    setDetailsModalOpen(true);
  };

  const getPaymentStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    paid: 'bg-green-100 text-green-700 border-green-200',
    failed: 'bg-red-100 text-red-700 border-red-200',
    refunded: 'bg-blue-100 text-blue-700 border-blue-200'
  };
  return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
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
    switch (status) {
      case 'pending':
        return <IconClock className="w-5 h-5 text-yellow-600" />;
      case 'confirmed':
        return <IconCircleCheck className="w-5 h-5 text-blue-600" />;
      case 'processing':
        return <IconPackage className="w-5 h-5 text-purple-600" />;
      case 'shipped':
        return <IconTruck className="w-5 h-5 text-indigo-600" />;
      case 'delivered':
        return <IconCircleCheck className="w-5 h-5 text-green-600" />;
      case 'cancelled':
        return <IconX className="w-5 h-5 text-red-600" />;
      default:
        return <IconPackage className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Header Section */}
        {/* <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3 tracking-tight">
                <IconTruck className="w-8 h-8 text-primary" />
                Order Management
              </h1>
              <p className="text-gray-600">Track and manage customer orders</p>
            </div>
          </div>
        </div> */}

        {/* Filter Section */}
        <Card className="mb-8 p-6 border-0 bg-white">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
            <div className="relative flex-1 max-w-xs">
              <IconCircleCheck className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-12 pl-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-gray-50 hover:bg-white transition-all">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all" className="rounded-lg cursor-pointer">All Orders</SelectItem>
                  <SelectItem value="pending" className="rounded-lg cursor-pointer">Pending</SelectItem>
                  <SelectItem value="confirmed" className="rounded-lg cursor-pointer">Confirmed</SelectItem>
                  <SelectItem value="processing" className="rounded-lg cursor-pointer">Processing</SelectItem>
                  <SelectItem value="shipped" className="rounded-lg cursor-pointer">Shipped</SelectItem>
                  <SelectItem value="delivered" className="rounded-lg cursor-pointer">Delivered</SelectItem>
                  <SelectItem value="cancelled" className="rounded-lg cursor-pointer">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Orders Table */}
        <Card className="shadow-md border-0 overflow-hidden bg-white">
          {isFetchingAdminOrders ? (
            <div className="p-12">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="p-8">
              <ErrorMessage message={error} />
            </div>
          ) : adminOrders.length === 0 ? (
            <div className="p-12 text-center">
              <IconPackage className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 text-lg font-medium">No orders found</p>
              <p className="text-gray-400 text-sm mt-1">
                Orders will appear here when customers place them
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50 border-b-2">
                    <TableHead className="font-bold text-gray-700 py-4">Order ID</TableHead>
                    <TableHead className="font-bold text-gray-700">Customer</TableHead>
                    <TableHead className="font-bold text-gray-700">Total Amount</TableHead>
                    <TableHead className="font-bold text-gray-700">Status</TableHead>
                    <TableHead className="font-bold text-gray-700">Update Status</TableHead>
                    <TableHead className="font-bold text-gray-700">Payment Status</TableHead>
                    <TableHead className="font-bold text-gray-700">Info</TableHead>

                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminOrders.map(order => (
                    <TableRow
                      key={order._id}
                      className="hover:bg-blue-50/50 transition-colors border-b"
                    >
                      <TableCell className="font-medium text-gray-900 py-4">
                        <span className="font-mono text-sm">{order._id.slice(-8)}</span>
                      </TableCell>
                      <TableCell className="font-medium text-gray-700">
                        {(order.user as UserType).name}
                      </TableCell>
                      <TableCell className="font-semibold text-gray-900">
                        &#8377;{order.totalAmount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge className={`capitalize font-normal ${getStatusColor(order.status)}`}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {updatingOrderId === order._id ? (
                          <div className="flex items-center gap-2 w-[160px] h-10 px-3 rounded-lg border border-gray-200 bg-gray-50">
                            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                            <span className="text-sm text-gray-600">Updating...</span>
                          </div>
                        ) : (
                          <Select
                            value={order.status}
                            onValueChange={(newStatus) => handleStatusChange(order._id, order.status, newStatus)}
                          >
                            <SelectTrigger className="w-[160px] h-10 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              <SelectItem value="pending" className="rounded-lg cursor-pointer">
                                Pending
                              </SelectItem>
                              <SelectItem value="confirmed" className="rounded-lg cursor-pointer">
                                Confirmed
                              </SelectItem>
                              <SelectItem value="processing" className="rounded-lg cursor-pointer">
                                Processing
                              </SelectItem>
                              <SelectItem value="shipped" className="rounded-lg cursor-pointer">
                                Shipped
                              </SelectItem>
                              <SelectItem value="delivered" className="rounded-lg cursor-pointer">
                                Delivered
                              </SelectItem>
                              <SelectItem value="cancelled" className="rounded-lg cursor-pointer">
                                Cancelled
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </TableCell>
                      <TableCell>
  <Badge className={`capitalize ${getPaymentStatusColor(order.paymentStatus)}`}>
    {order.paymentStatus}
  </Badge>
</TableCell>

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
            </div>
          )}
        </Card>

        {/* Status Update Confirmation Dialog */}
        <AlertDialog
          open={statusDialog.open}
          onOpenChange={(open) => {
            if (!updatingOrderId) {
              setStatusDialog({ open, orderId: null, newStatus: null, currentStatus: null });
            }
          }}
        >
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-bold flex items-center gap-2">
                {statusDialog.newStatus && getStatusIcon(statusDialog.newStatus)}
                Update Order Status
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base pt-2">
                Are you sure you want to update the order status from{' '}
                <span className="font-semibold capitalize">{statusDialog.currentStatus}</span> to{' '}
                <span className="font-semibold capitalize">{statusDialog.newStatus}</span>?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2 sm:gap-2">
              <AlertDialogCancel className="mt-0" disabled={updatingOrderId !== null}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleStatusConfirm}
                disabled={updatingOrderId !== null}
                className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updatingOrderId ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating...</span>
                  </div>
                ) : (
                  'Update Status'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Order Details Modal */}
        <OrderDetailsModal
          open={detailsModalOpen}
          onOpenChange={setDetailsModalOpen}
          order={selectedOrder}
        />
      </div>
    </div>
  );
};

export default AdminOrders;