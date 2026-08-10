import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/coupons/apply
 * Body: { code, subtotal }
 * Returns: { code, type, value, discount }
 */
export async function POST(req: Request) {
  try {
    const { code, subtotal } = await req.json()
    if (!code) return NextResponse.json({ error: 'Coupon code required' }, { status: 400 })

    const c = await prisma.coupon.findUnique({ where: { code: String(code).toUpperCase() } })
    if (!c || !c.isActive)
      return NextResponse.json({ error: 'Invalid or expired coupon' }, { status: 404 })
    if (c.expiresAt && c.expiresAt < new Date())
      return NextResponse.json({ error: 'Coupon expired' }, { status: 400 })
    if (c.maxUses && c.usedCount >= c.maxUses)
      return NextResponse.json({ error: 'Coupon usage limit reached' }, { status: 400 })
    if (c.minOrderValue && subtotal < c.minOrderValue)
      return NextResponse.json(
        { error: `Minimum order value ₹${c.minOrderValue} required` },
        { status: 400 }
      )

    const discount =
      c.type === 'PERCENT' ? Math.round((subtotal * c.value) / 100) : c.value
    return NextResponse.json({
      code: c.code,
      type: c.type,
      value: c.value,
      description: c.description,
      discount: Math.min(discount, subtotal),
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
