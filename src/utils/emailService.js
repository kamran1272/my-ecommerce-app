// src/utils/emailService.js
// Simulated email notification service for order confirmation and shipping updates

export function sendOrderConfirmation(email, order) {
  // In a real app, integrate with an email API (e.g., SendGrid, Mailgun, SMTP)
  console.log(`Email sent to ${email}: Your order #${order.id} is confirmed!`);
  localStorage.setItem(
    `email_log_${email}`,
    JSON.stringify({
      type: 'order_confirmation',
      orderId: order.id,
      date: new Date().toISOString(),
      message: `Order confirmed for $${order.total}`,
    })
  );
}

export function sendShippingUpdate(email, order, status) {
  // In a real app, integrate with an email API
  console.log(`Email sent to ${email}: Your order #${order.id} status: ${status}`);
  localStorage.setItem(
    `email_log_${email}_shipping_${order.id}`,
    JSON.stringify({
      type: 'shipping_update',
      orderId: order.id,
      date: new Date().toISOString(),
      status,
      message: `Order #${order.id} shipping status: ${status}`,
    })
  );
}
