import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY!)

const FROM = process.env.RESEND_FROM_EMAIL || 'orders@vaapi.com'
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Vaapi Comfort'

export async function sendOrderConfirmationEmail({
  to,
  orderNumber,
  items,
  total,
  paymentMethod,
}: {
  to: string
  orderNumber: string
  items: { title: string; quantity: number; price: number }[]
  total: number
  paymentMethod: string
}) {
  const itemsHtml = items
    .map(
      (item) =>
        `<tr><td>${item.title}</td><td>${item.quantity}</td><td>₹${item.price}</td></tr>`
    )
    .join('')

  await resend.emails.send({
    from: `${APP_NAME} <${FROM}>`,
    to,
    subject: `Order Confirmed — #${orderNumber}`,
    html: `
      <h2>Thank you for your order! 🎉</h2>
      <p>Your order <strong>#${orderNumber}</strong> has been confirmed.</p>
      <table border="1" cellpadding="8">
        <thead><tr><th>Item</th><th>Qty</th><th>Price</th></tr></thead>
        <tbody>${itemsHtml}</tbody>
      </table>
      <p><strong>Total: ₹${total}</strong></p>
      <p>Payment Method: ${paymentMethod}</p>
      <p>We'll send you a shipping update soon.</p>
    `,
  })
}

export async function sendShippingUpdateEmail({
  to,
  orderNumber,
  trackingUrl,
  status,
}: {
  to: string
  orderNumber: string
  trackingUrl?: string
  status: string
}) {
  await resend.emails.send({
    from: `${APP_NAME} <${FROM}>`,
    to,
    subject: `Order Update — #${orderNumber}: ${status}`,
    html: `
      <h2>Order Update</h2>
      <p>Your order <strong>#${orderNumber}</strong> status: <strong>${status}</strong></p>
      ${trackingUrl ? `<p><a href="${trackingUrl}">Track your order</a></p>` : ''}
    `,
  })
}

export async function sendPasswordResetEmail({
  to,
  resetUrl,
}: {
  to: string
  resetUrl: string
}) {
  await resend.emails.send({
    from: `${APP_NAME} <${FROM}>`,
    to,
    subject: 'Reset Your Password',
    html: `
      <h2>Password Reset</h2>
      <p>Click the link below to reset your password. This link expires in 1 hour.</p>
      <p><a href="${resetUrl}">Reset Password</a></p>
      <p>If you didn't request this, ignore this email.</p>
    `,
  })
}
