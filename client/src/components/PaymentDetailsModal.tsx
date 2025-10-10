import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  IconUser,
  IconCreditCard,
  IconCalendar,
  IconReceipt,
  IconX,
  IconPackage,
  IconPhone,
//   IconCurrencyRupee,
  IconAlertCircle,
  IconRefresh
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import type { PaymentType, UserType } from '@/types';

interface PaymentDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: PaymentType | null;
}

const PaymentDetailsModal = ({ open, onOpenChange, payment }: PaymentDetailsModalProps) => {
  if (!payment) return null;

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-0">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 rounded-full hover:bg-gray-100 z-20"
          onClick={() => onOpenChange(false)}
        >
          <IconX className="h-5 w-5 text-gray-500" />
        </Button>

        <DialogHeader className="px-6 pt-6 pb-4 sticky top-0 bg-white z-10 border-b">
          <DialogTitle className="text-2xl font-bold flex items-center justify-between pr-8">
            <div className="flex items-center gap-2">
              <IconCreditCard className="w-6 h-6 text-blue-600" />
              <span>Payment Details</span>
            </div>
            <Badge className={`capitalize ${getStatusColor(payment.status)}`}>
              {payment.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-5">
          {/* Customer Information */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <IconUser className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-base">Customer Information</h3>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-3">
                <IconUser className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="font-medium text-gray-900">
                  {(payment.user as UserType).name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <IconPhone className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="text-gray-700">{(payment.user as UserType).phone}</span>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <IconCreditCard className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-base">Payment Information</h3>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Amount</span>
                <span className="font-bold text-xl text-green-700">
                  &#8377;{payment.amount.toFixed(2)}
                </span>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Currency</span>
                  <span className="text-sm font-medium text-gray-900">{payment.currency}</span>
                </div>
                {payment.method && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Payment Method</span>
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {payment.method}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Transaction IDs */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <IconReceipt className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-base">Transaction Details</h3>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Razorpay Payment ID</p>
                <p className="font-mono text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded border">
                  {payment.razorpayPaymentId}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Razorpay Order ID</p>
                <p className="font-mono text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded border">
                  {payment.razorpayOrderId}
                </p>
              </div>
             {/* <div>
                <p className="text-xs text-gray-500 mb-1">Signature</p>
                <p className="font-mono text-xs font-medium text-gray-900 bg-white px-3 py-2 rounded border break-all">
                  {payment.razorpaySignature}
                </p>
              </div> */}
            </div>
          </div>

          {/* Order Information */}
          {payment.order && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <IconPackage className="w-5 h-5 text-amber-600" />
                <h3 className="font-semibold text-base">Associated Order</h3>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Order ID</p>
                    <p className="font-mono text-sm font-semibold text-gray-900">
                      #{payment.order._id.slice(-8)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <Badge variant="outline" className="capitalize">
                      {payment.order.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Refund Information */}
          {payment.status === 'refunded' && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <IconRefresh className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold text-base">Refund Information</h3>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Refund Amount</span>
                  <span className="font-bold text-orange-700">
                    &#8377;{payment.refundAmount?.toFixed(2)}
                  </span>
                </div>
                {payment.refundId && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Refund ID</p>
                    <p className="font-mono text-sm font-medium text-gray-900">
                      {payment.refundId}
                    </p>
                  </div>
                )}
                {payment.refundedAt && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Refunded At</p>
                    <p className="text-sm text-gray-700">
                      {new Date(payment.refundedAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Error Information */}
          {payment.status === 'failed' && (payment.errorCode || payment.errorDescription) && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <IconAlertCircle className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold text-base">Error Details</h3>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-4 space-y-2">
                {payment.errorCode && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Error Code</p>
                    <p className="font-mono text-sm font-medium text-red-700">
                      {payment.errorCode}
                    </p>
                  </div>
                )}
                {payment.errorDescription && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Description</p>
                    <p className="text-sm text-gray-700">{payment.errorDescription}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <IconCalendar className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-base">Timestamps</h3>
            </div>
            <div className="bg-gray-100 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Created At</span>
                <span className="text-sm font-medium text-gray-900">
                  {new Date(payment.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Updated</span>
                <span className="text-sm font-medium text-gray-900">
                  {new Date(payment.updatedAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDetailsModal;
