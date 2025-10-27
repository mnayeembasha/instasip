import { useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAdminOrders, updateOrderStatus } from '@/store/features/orderSlice';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { IconPackage, IconTruck, IconCircleCheck, IconX, IconClock, IconInfoCircle, IconRefresh, IconDownload, IconEye } from '@tabler/icons-react';
import { Loader2 } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import OrderDetailsModal from '@/components/OrderDetailsModal';
import InvoiceModal from '@/components/InvoiceModal';
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
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusDialog, setStatusDialog] = useState<StatusUpdate>({
    open: false,
    orderId: null,
    newStatus: null,
    currentStatus: null
  });
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const fetchOrders = useCallback(() => {
    const params: Record<string, string> = {};
    if (statusFilter !== 'all') params.status = statusFilter;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (searchTerm) params.search = searchTerm;

    dispatch(fetchAdminOrders(params));
  }, [dispatch, statusFilter, startDate, endDate, searchTerm]);

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/');
    } else {
      fetchOrders();
    }
  }, [user?.isAdmin, navigate, fetchOrders]);

  const handleRefresh = () => {
    fetchOrders();
  };

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
        fetchOrders();
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

  const handleViewInvoice = (order: OrderType) => {
    setSelectedOrder(order);
    setInvoiceModalOpen(true);
  };

  const handleDownloadInvoice = (order: OrderType) => {
    import('@/utils/invoiceUtils').then(({ generateInvoicePDF }) => {
      generateInvoicePDF(order);
    });
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

  const filteredOrders = adminOrders.filter(order => {
    const userName = (order.user as UserType)?.name?.toLowerCase() || '';
    const userPhone = (order.user as UserType)?.phone || '';
    const search = searchTerm.toLowerCase();

    return userName.includes(search) || userPhone.includes(search);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Filter Section */}
        <Card className="mb-8 p-6 border-0 bg-white shadow-md">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Search</label>
              <Input
                placeholder="Search by name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10"
              />
            </div>

            <div className="w-full lg:w-48">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-10 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
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

            <div className="w-full lg:w-48">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Start Date</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-10"
              />
            </div>

            <div className="w-full lg:w-48">
              <label className="text-sm font-medium text-gray-700 mb-2 block">End Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-10"
              />
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="h-10 px-4"
              >
                <IconRefresh className="w-4 h-4 mr-2" />
                Refresh
              </Button>
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
          ) : filteredOrders.length === 0 ? (
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
                    <TableHead className="font-bold text-gray-700">Invoice</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map(order => (
                    <TableRow
                      key={order._id}
                      className="hover:bg-blue-50/50 transition-colors border-b"
                    >
                      <TableCell className="font-medium text-gray-900 py-4">
                        <span className="font-mono text-sm">{order._id.slice(-8)}</span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">
                            {(order.user as UserType).name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(order.user as UserType).phone}
                          </p>
                        </div>
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
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewInvoice(order)}
                            className="hover:bg-blue-50"
                            title="View Invoice"
                          >
                            <IconEye className="w-5 h-5 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadInvoice(order)}
                            className="hover:bg-blue-50"
                            title="Download Invoice"
                          >
                            <IconDownload className="w-5 h-5 text-blue-600" />
                          </Button>
                        </div>
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

        {/* Invoice Modal */}
        <InvoiceModal
          open={invoiceModalOpen}
          onOpenChange={setInvoiceModalOpen}
          order={selectedOrder}
        />
      </div>
    </div>
  );
};

export default AdminOrders;