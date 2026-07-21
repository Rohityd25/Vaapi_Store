// Shiprocket API integration
// Docs: https://apidocs.shiprocket.in/

const BASE_URL = 'https://apiv2.shiprocket.in/v1/external'

let cachedToken: { token: string; expiresAt: number } | null = null

async function getShiprocketToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token
  }

  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to authenticate with Shiprocket')
  }

  const data = await response.json()
  cachedToken = {
    token: data.token,
    expiresAt: Date.now() + 9 * 24 * 60 * 60 * 1000, // 9 days (token valid for 10)
  }
  return cachedToken.token
}

export interface ShiprocketOrderItem {
  name: string
  sku: string
  units: number
  selling_price: number
}

export interface CreateShiprocketOrderParams {
  orderId: string
  orderDate: string
  pickupLocation: string
  billingName: string
  billingAddress: string
  billingCity: string
  billingState: string
  billingPincode: string
  billingPhone: string
  billingEmail: string
  shippingName: string
  shippingAddress: string
  shippingCity: string
  shippingState: string
  shippingPincode: string
  shippingPhone: string
  items: ShiprocketOrderItem[]
  paymentMethod: 'Prepaid' | 'COD'
  subTotal: number
  length: number
  breadth: number
  height: number
  weight: number
}

export async function createShiprocketOrder(params: CreateShiprocketOrderParams) {
  const token = await getShiprocketToken()

  const response = await fetch(`${BASE_URL}/orders/create/adhoc`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      order_id: params.orderId,
      order_date: params.orderDate,
      pickup_location: params.pickupLocation,
      billing_customer_name: params.billingName,
      billing_address: params.billingAddress,
      billing_city: params.billingCity,
      billing_state: params.billingState,
      billing_pincode: params.billingPincode,
      billing_country: 'India',
      billing_phone: params.billingPhone,
      billing_email: params.billingEmail,
      shipping_is_billing: false,
      shipping_customer_name: params.shippingName,
      shipping_address: params.shippingAddress,
      shipping_city: params.shippingCity,
      shipping_state: params.shippingState,
      shipping_pincode: params.shippingPincode,
      shipping_country: 'India',
      shipping_phone: params.shippingPhone,
      order_items: params.items,
      payment_method: params.paymentMethod,
      sub_total: params.subTotal,
      length: params.length,
      breadth: params.breadth,
      height: params.height,
      weight: params.weight,
    }),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create Shiprocket order')
  }
  return data
}

export async function getShiprocketTracking(shipmentId: string) {
  const token = await getShiprocketToken()

  const response = await fetch(`${BASE_URL}/courier/track/shipment/${shipmentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const data = await response.json()
  return data
}

export async function cancelShiprocketOrder(orderId: string) {
  const token = await getShiprocketToken()

  const response = await fetch(`${BASE_URL}/orders/cancel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ids: [orderId] }),
  })

  const data = await response.json()
  return data
}
