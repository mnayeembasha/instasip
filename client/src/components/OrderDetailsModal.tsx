import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { IconUser, IconMapPin, IconPackage, IconCalendar, IconCreditCard } from '@tabler/icons-react';
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <IconPackage className="w-6 h-6 text-primary" />
            Order Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Order ID and Status */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-mono text-sm font-medium">{order._id}</p>
            </div>
            <Badge className={`capitalize ${getStatusColor(order.status)}`}>
              {order.status}
            </Badge>
          </div>

          <Separator />

          {/* Customer Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <IconUser className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-lg">Customer Information</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{(order.user as UserType).name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{(order.user as UserType).phone}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Shipping Address */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <IconMapPin className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-lg">Shipping Address</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">{order.shippingAddress.street}</p>
              <p className="text-gray-700">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
              <p className="text-gray-700">{order.shippingAddress.country}</p>
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <IconPackage className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-lg">Order Items</h3>
            </div>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium">Product ID: {item.product._id}</p>
                    <p className="font-medium">Product Name: {item.product.name} </p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">&#8377;{item.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Order Summary */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <IconCreditCard className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-lg">Order Summary</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount</span>
                <span className="font-bold text-lg">&#8377;{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Order Date */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <IconCalendar className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-lg">Order Date</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">
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
