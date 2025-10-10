import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { IconUser, IconMapPin, IconPackage, IconCalendar, IconCreditCard, IconPhone, IconBuildingEstate, IconRoad, IconWorldPin, IconMailCode, IconX } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import type { OrderType, UserType } from '@/types';

interface OrderDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: OrderType | null;
}

const OrderDetailsModal = ({ open, onOpenChange, order }: OrderDetailsModalProps) => {
  if (!order) return null;

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

  const getShortOrderId = (id: string) => {
    return id.slice(-8).toUpperCase();
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
              <IconPackage className="w-6 h-6 text-blue-600" />
              <span>Order Details</span>
            </div>
            <Badge className={`capitalize ${getStatusColor(order.status)}`}>
              {order.status}
            </Badge>
          </DialogTitle>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-gray-500">Order ID:</span>
            <span className="font-mono text-sm font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded">
              #{getShortOrderId(order._id)}
            </span>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-5">
          {/* Customer Information */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <IconUser className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-base">Customer</h3>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-3">
                <IconUser className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="font-medium text-gray-900">{(order.user as UserType).name}</span>
              </div>
              <div className="flex items-center gap-3">
                <IconPhone className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="text-gray-700">{(order.user as UserType).phone}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <IconMapPin className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-base">Shipping Address</h3>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 space-y-2.5">
              <div className="flex items-start gap-3">
                <IconRoad className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 leading-relaxed">{order.shippingAddress.street}</span>
              </div>
              <div className="flex items-center gap-3">
                <IconBuildingEstate className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">
                  {order.shippingAddress.city}, {order.shippingAddress.state}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <IconMailCode className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">{order.shippingAddress.zipCode}</span>
              </div>
              <div className="flex items-center gap-3">
                <IconWorldPin className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">{order.shippingAddress.country}</span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <IconPackage className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-base">Order Items</h3>
            </div>
            <div className="space-y-2.5">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-500 hover:shadow-sm transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 mb-1.5 truncate">{item.product.name}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                        <span className="flex items-center gap-1.5">
                          <span className="font-medium">Qty:</span>
                          <span className="font-semibold text-purple-700">{item.quantity}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="font-medium">Price:</span>
                          <span className="font-semibold text-purple-700">&#8377;{item.price.toFixed(2)}</span>
                        </span>
                      </div>
                    </div>
                    <div className="sm:text-right flex-shrink-0">
                      <p className="text-xs text-gray-500 mb-1">Subtotal</p>
                      <p className="font-bold text-purple-700">
                        &#8377;{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-4" />

          {/* Order Summary */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <IconCreditCard className="w-5 h-5 text-amber-600" />
              <h3 className="font-semibold text-base">Payment Summary</h3>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border-2 border-amber-200">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Total Amount</span>
                <span className="font-bold text-2xl text-amber-700">&#8377;{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <IconCreditCard className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-base">Payment Status</h3>
            </div>
            <div className={`rounded-lg p-4 ${
              order.paymentStatus === 'paid' ? 'bg-green-100' :
              order.paymentStatus === 'refunded' ? 'bg-blue-100' :
              order.paymentStatus === 'failed' ? 'bg-red-100' : 'bg-yellow-100'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Status</span>
                <Badge className={`capitalize ${
                  order.paymentStatus === 'paid' ? 'bg-green-600 text-white' :
                  order.paymentStatus === 'refunded' ? 'bg-blue-600 text-white' :
                  order.paymentStatus === 'failed' ? 'bg-red-600 text-white' : 'bg-yellow-600 text-white'
                }`}>
                  {order.paymentStatus}
                </Badge>
              </div>
              <p className="text-xs text-gray-600 mt-2">Payment ID: {order.razorpayPaymentId}</p>
            </div>
          </div>

          {/* Order Date */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <IconCalendar className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-base">Order Date</h3>
            </div>
            <div className="bg-gray-100 rounded-lg p-4">
              <p className="text-gray-700 font-medium">
                {new Date(order.orderDate).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;