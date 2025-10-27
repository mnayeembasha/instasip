import { useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { IconDownload } from '@tabler/icons-react';
import { generateInvoicePDF, getShortOrderId } from '@/utils/invoiceUtils';
import type { OrderType, UserType } from '@/types';

interface InvoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: OrderType | null;
}

const InvoiceModal = ({ open, onOpenChange, order }: InvoiceModalProps) => {
  const invoiceRef = useRef<HTMLDivElement>(null);

  if (!order) return null;

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleDownloadPDF = () => {
    generateInvoicePDF(order);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-0">
        <div ref={invoiceRef} className="p-6">
          <DialogHeader className="pb-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src="https://www.instasip.in/logo.jpg"
                  alt="InstaSip Logo"
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div>
                  <DialogTitle className="text-2xl font-bold">InstaSip</DialogTitle>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">No 18/1, 13th cross Sahara building,</p>
                <p className="text-sm text-gray-600">Hongasandra Begur Main Road,</p>
                <p className="text-sm text-gray-600">Opp Emerald School, Bangalore, 560068</p>
                <p className="text-sm text-gray-600">Phone: +91 8074581961</p>
                <p className="text-sm text-gray-600">Email: instasipfoodbeverages@gmail.com</p>
              </div>
            </div>
            <div className="mt-4 text-right">
              <hr className="my-2 border-gray-300" />
              <h2 className="text-xl font-bold">INVOICE</h2>
              <p className="text-sm text-gray-600">Order ID: #{getShortOrderId(order._id)}</p>
              <p className="text-sm text-gray-600">
                Date: {new Date(order.orderDate).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </DialogHeader>

          <div className="mt-6 space-y-6">
            <div>
              <h3 className="font-semibold text-base mb-2">Customer Details</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Name:</span> {(order.user as UserType).name}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Phone:</span> {(order.user as UserType).phone}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-base mb-2">Shipping Address</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p className="text-sm">{order.shippingAddress.street}</p>
                <p className="text-sm">
                  {order.shippingAddress.city}, {order.shippingAddress.state}
                </p>
                <p className="text-sm">Zip: {order.shippingAddress.zipCode}</p>
                <p className="text-sm">Country: {order.shippingAddress.country}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-base mb-2">Order Items</h3>
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-100 p-3 grid grid-cols-4 font-semibold text-sm">
                  <span>Item</span>
                  <span className="text-center">Quantity</span>
                  <span className="text-center">Price</span>
                  <span className="text-right">Subtotal</span>
                </div>
                {order.items.map((item, index) => (
                  <div key={index} className="p-3 grid grid-cols-4 text-sm border-t">
                    <span className="truncate">{item.product.name}</span>
                    <span className="text-center">{item.quantity}</span>
                    <span className="text-center">₹{item.price.toFixed(2)}</span>
                    <span className="text-right">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-base mb-2">Payment Summary</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p className="text-sm text-gray-600">Subtotal: ₹{subtotal.toFixed(2)}</p>
                {order.gstPercentage !== undefined && order.gstAmount !== undefined && (
                  <p className="text-sm text-gray-600">GST ({order.gstPercentage}%): ₹{order.gstAmount.toFixed(2)}</p>
                )}
                {order.deliveryCharge !== undefined && (
                  <p className="text-sm text-gray-600">
                    Delivery Charge: {order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge.toFixed(2)}`}
                  </p>
                )}
                <p className="text-base font-bold text-gray-800 border-t pt-2">Total Amount: ₹{order.totalAmount.toFixed(2)}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-base mb-2">Payment Status</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span className="capitalize font-medium">{order.paymentStatus}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Payment ID:</span>
                  <span className="font-mono text-gray-800">{order.razorpayPaymentId}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={handleDownloadPDF} className="bg-blue-600 hover:bg-blue-700 text-white">
              <IconDownload className="w-5 h-5 mr-2" />
              Download Invoice
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceModal;