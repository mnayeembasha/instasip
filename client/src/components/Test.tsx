export default function Test({
 user= { name: "Nayeem" },
  order= {
    razorpayPaymentId: "rzp123",
    razorpayOrderId: "rzp456",
    orderDate: "12-10-2025",
    totalAmount: 200,
    shippingAddress: {
      street: "medikondur",
      city: "guntur",
      state: "andhra pradesh",
      zipCode: "522438",
      country: "India"
    },
    items: [{ product: { name: "Pomegranate Flavoured green Tea",image:"https://res.cloudinary.com/drzq4285d/image/upload/v1760536304/instasip/fjdz2k2irdp2jgvw4uco.jpg" }, quantity: 10, price: 20 },{ product: { name: "Pomegranate Flavoured green Tea",image:"https://res.cloudinary.com/drzq4285d/image/upload/v1760536304/instasip/fjdz2k2irdp2jgvw4uco.jpg" }, quantity: 10, price: 20 }]
  }
}) {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; border-radius: 12px; overflow: hidden; background-color: #1d0f06; color: #fcf7f4;">
    <div style="background: linear-gradient(135deg, #c36a2d 0%, #c97842 100%);; padding: 25px 15px; text-align: center; border-radius: 12px 12px 0 0; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
        <img
          src="https://www.instasip.in/logo.jpg"
          alt="InstaSip Logo"
          style="width: 90px; height: auto; border-radius: 50%; margin-bottom: 10px; display: inline-block; background-color: #fff; box-shadow: 0 0 6px rgba(0,0,0,0.15);"
        />
        <h2 style="color: #fffaf5; font-size: 20px; font-weight: 700; letter-spacing: 1px; margin: 10px 0 0 0; font-family: 'Segoe UI', Arial, sans-serif;">
          InstaSip - Food and Beverages
        </h2>
        <h5 style="color: #fcf7f4; font-size: 15px; margin: 5px 0 0 0; font-family: 'Segoe UI', Arial, sans-serif; opacity: 0.9;">
          Refreshing Moments, One Sip at a Time
        </h5>
      </div>

    <div style="padding: 25px;">
      <p>Hi <strong>${user.name}</strong>,</p>
      <p>We’ve received your order and it’s now being processed. Below are your order details:</p>

      <div style="background-color: #2a1b10; padding: 20px; border-radius: 10px; margin-top: 15px;">
        <p style="margin: 0 0 10px 0;"> <strong>Payment ID:</strong> ${order.razorpayPaymentId}</p>
        <p style="margin: 0 0 10px 0;"><strong>Order ID:</strong> ${order.razorpayOrderId}</p>
        <p style="margin: 0;"><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleDateString()}</p>
      </div>

      <h3 style="color: #e2c275; margin-top: 25px;"> Ordered Items</h3>
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <thead>
          <tr style="background-color: #c36a2d; color: #fcf7f4;">
            <th style="padding: 10px; text-align: left;">Product</th>
            <th style="padding: 10px; text-align: center;">Quantity</th>
            <th style="padding: 10px; text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map(item => `
            <tr style="border-bottom: 1px solid #3a2815;">
               <td style="padding: 10px;display:flex;gap:0 10px;align-items:center;"><img src="${item.product.image}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px; border: 1px solid #c36a2d;" /> ${item.product.name}</td>
              <td style="padding: 10px; text-align: center;">${item.quantity}</td>
              <td style="padding: 10px; text-align: right;">₹${item.price}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="text-align: right; margin-top: 20px;">
        <p style="font-size: 18px; color: #eadca6;"><strong>Total:</strong> ₹${order.totalAmount}</p>
      </div>

      <h3 style="color: #e2c275; margin-top: 25px;">Address</h3>
      <p>${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.zipCode}, ${order.shippingAddress.country}</p>

      <p style="margin-top: 30px;display:flex;justify-content:center;"><a href="https://instasip.in/profile"><button style="background-color:#c36a2d;padding:10px 20px;border-radius:10px;cursor:pointer;font-weight:bold;">Track Order Status</button></a></p>

      <p style="font-size: 14px; color: #eadca6; margin-top: 25px;text-align:center;">Thank you for choosing InstaSip!</p>
    </div>

    <div style="background-color: #c36a2d; text-align: center; padding: 10px;">
      <p style="margin: 0; font-size: 12px; color: #1d0f06;">© 2025 InstaSip Food & Beverages. All rights reserved.</p>
    </div>
  </div>
  `;

  return (
    <div className="pt-20">
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
}
