import { jsPDF } from 'jspdf';
import type { OrderType, UserType } from '@/types';

export const getShortOrderId = (id: string) => {
  return id.slice(-8).toUpperCase();
};

export const generateInvoicePDF = (order: OrderType) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const logoUrl = 'https://www.instasip.in/logo.jpg';
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.src = logoUrl;

  const renderPDF = (withLogo: boolean) => {
    if (withLogo) {
      doc.addImage(img, 'JPEG', 10, 10, 20, 20);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('InstaSip', 35, 20);
    } else {
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('InstaSip', 10, 20);
    }

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('No 18/1, 13th cross Sahara building,', 120, 15);
    doc.text('Hongasandra Begur Main Road,', 120, 20);
    doc.text('Opp Emerald School, Bangalore, 560068', 120, 25);
    doc.text('Phone: +91 8074581961', 120, 35);
    doc.text('Email: instasipfoodbeverages@gmail.com', 120, 40);

    doc.setLineWidth(0.5);
    doc.line(10, 50, 200, 50);

    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', 10, 60);

    doc.setFontSize(12);
    doc.text(`Order ID: #${getShortOrderId(order._id)}`, 10, 70);
    doc.text(
      `Order Date: ${new Date(order.orderDate).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}`,
      10, 76
    );

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Customer Details', 10, 88);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${(order.user as UserType).name}`, 10, 96);
    doc.text(`Phone: ${(order.user as UserType).phone}`, 10, 102);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Shipping Address', 10, 114);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(order.shippingAddress.street, 10, 122);
    doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state}`, 10, 128);
    doc.text(`Zip: ${order.shippingAddress.zipCode}`, 10, 134);
    doc.text(`Country: ${order.shippingAddress.country}`, 10, 140);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Order Items', 10, 152);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    let y = 160;
    doc.setFillColor(200, 200, 200);
    doc.rect(10, y, 190, 6, 'F');
    doc.text('Item', 12, y + 4);
    doc.text('Qty', 100, y + 4);
    doc.text('Price', 130, y + 4);
    doc.text('Subtotal', 170, y + 4);
    y += 8;

    order.items.forEach((item) => {
      doc.text(item.product.name, 12, y + 4, { maxWidth: 80 });
      doc.text(item.quantity.toString(), 100, y + 4);
      doc.text(`Rs.${item.price.toFixed(2)}`, 130, y + 4);
      doc.text(`Rs.${(item.price * item.quantity).toFixed(2)}`, 170, y + 4);
      y += 8;
    });

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Summary', 10, y + 10);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    y += 18;
    doc.text(`Subtotal: Rs.${subtotal.toFixed(2)}`, 10, y);
    y += 6;
    if (order.gstPercentage !== undefined && order.gstAmount !== undefined) {
      doc.text(`GST (${order.gstPercentage}%): Rs.${order.gstAmount.toFixed(2)}`, 10, y);
      y += 6;
    }
    if (order.deliveryCharge !== undefined) {
      doc.text(
        `Delivery Charge: ${order.deliveryCharge === 0 ? 'FREE' : `Rs.${order.deliveryCharge.toFixed(2)}`}`,
        10, y
      );
      y += 6;
    }
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Amount: Rs.${order.totalAmount.toFixed(2)}`, 10, y);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Status', 10, y + 12);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Status: ${order.paymentStatus.toUpperCase()}`, 10, y + 20);
    doc.text(`Payment ID: ${order.razorpayPaymentId}`, 10, y + 26);

    doc.save(`InstaSip_Invoice_${getShortOrderId(order._id)}.pdf`);
  };

  img.onload = () => renderPDF(true);
  img.onerror = () => renderPDF(false);
};