import { useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAllPayments, fetchPaymentStats } from '@/store/features/paymentSlice';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  IconCreditCard,
  IconRefresh,
  IconInfoCircle,
} from '@tabler/icons-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import PaymentDetailsModal from '@/components/PaymentDetailsModal';
import { useNavigate } from 'react-router-dom';
import type { PaymentType, UserType } from '@/types';

const AdminPayments = () => {
  const { payments, isFetchingPayments, error } = useAppSelector((state) => state.payment);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<PaymentType | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const fetchPayments = useCallback(() => {
    const params: Record<string, string> = {};
    if (statusFilter !== 'all') params.status = statusFilter;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    dispatch(fetchAllPayments(params));
  }, [dispatch, statusFilter, startDate, endDate]);

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/');
    } else {
      fetchPayments();
    }
  }, [user?.isAdmin, navigate, fetchPayments]);

  const handleRefresh = () => {
    fetchPayments();
    dispatch(fetchPaymentStats('30'));
  };

  const handleViewDetails = (payment: PaymentType) => {
    setSelectedPayment(payment);
    setDetailsModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      created: 'bg-blue-100 text-blue-700 border-blue-200',
      authorized: 'bg-purple-100 text-purple-700 border-purple-200',
      captured: 'bg-green-100 text-green-700 border-green-200',
      failed: 'bg-red-100 text-red-700 border-red-200',
      refunded: 'bg-orange-100 text-orange-700 border-orange-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const filteredPayments = payments.filter(payment => {
    const userName = (payment.user as UserType)?.name?.toLowerCase() || '';
    const userPhone = (payment.user as UserType)?.phone || '';
    const paymentId = payment.razorpayPaymentId?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();

    return userName.includes(search) || userPhone.includes(search) || paymentId.includes(search);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Stats Cards */}
        {/*{stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="border-0 shadow-md bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <IconCreditCard className="w-4 h-4" />
                  Total Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stats.totalPayments}</div>
                <p className="text-xs text-gray-500 mt-1">
                  &#8377;{stats.totalAmount.toFixed(2)}
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
                  <IconCircleCheck className="w-4 h-4" />
                  Successful
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-700">{stats.capturedPayments}</div>
                <p className="text-xs text-green-600 mt-1">
                  &#8377;{stats.capturedAmount.toFixed(2)}
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-gradient-to-br from-red-50 to-rose-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-red-700 flex items-center gap-2">
                  <IconX className="w-4 h-4" />
                  Failed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-700">{stats.failedPayments}</div>
                <p className="text-xs text-red-600 mt-1">Transactions</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-amber-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-orange-700 flex items-center gap-2">
                  <IconRefresh className="w-4 h-4" />
                  Refunded
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-700">{stats.refundedPayments}</div>
                <p className="text-xs text-orange-600 mt-1">
                  &#8377;{stats.refundedAmount.toFixed(2)}
                </p>
              </CardContent>
            </Card>
          </div>
        )}*/}

        {/* Filters Section */}
        <Card className="mb-8 p-6 border-0 bg-white shadow-md">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Search</label>
              <Input
                placeholder="Search by name, phone, or payment ID..."
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
                  <SelectItem value="all" className="rounded-lg cursor-pointer">All Status</SelectItem>
                  <SelectItem value="captured" className="rounded-lg cursor-pointer">Captured</SelectItem>
                  <SelectItem value="failed" className="rounded-lg cursor-pointer">Failed</SelectItem>
                  <SelectItem value="refunded" className="rounded-lg cursor-pointer">Refunded</SelectItem>
                  <SelectItem value="created" className="rounded-lg cursor-pointer">Created</SelectItem>
                  <SelectItem value="authorized" className="rounded-lg cursor-pointer">Authorized</SelectItem>
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

        {/* Payments Table */}
        <Card className="shadow-md border-0 overflow-hidden bg-white">
          {isFetchingPayments ? (
            <div className="p-12">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="p-8">
              <ErrorMessage message={error} />
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="p-12 text-center">
              <IconCreditCard className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 text-lg font-medium">No payments found</p>
              <p className="text-gray-400 text-sm mt-1">
                Payments will appear here when customers make purchases
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50 border-b-2">
                    <TableHead className="font-bold text-gray-700 py-4">Payment ID</TableHead>
                    <TableHead className="font-bold text-gray-700">Customer</TableHead>
                    <TableHead className="font-bold text-gray-700">Amount</TableHead>
                    <TableHead className="font-bold text-gray-700">Status</TableHead>
                    <TableHead className="font-bold text-gray-700">Date</TableHead>
                    <TableHead className="font-bold text-gray-700">Order</TableHead>
                    <TableHead className="font-bold text-gray-700">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map(payment => (
                    <TableRow
                      key={payment._id}
                      className="hover:bg-blue-50/50 transition-colors border-b"
                    >
                      <TableCell className="font-mono text-sm py-4">
                        {payment.razorpayPaymentId.slice(-12)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">
                            {(payment.user as UserType).name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(payment.user as UserType).phone}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-gray-900">
                        &#8377;{payment.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge className={`capitalize ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(payment.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                        <br />
                        <span className="text-xs text-gray-400">
                          {new Date(payment.createdAt).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </TableCell>
                      <TableCell>
                        {payment.order ? (
                          <Badge variant="outline" className="font-mono text-xs">
                            #{payment.order._id.slice(-8)}
                          </Badge>
                        ) : (
                          <span className="text-xs text-gray-400">No order</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(payment)}
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

        {/* Payment Details Modal */}
        <PaymentDetailsModal
          open={detailsModalOpen}
          onOpenChange={setDetailsModalOpen}
          payment={selectedPayment}
        />
      </div>
    </div>
  );
};

export default AdminPayments;