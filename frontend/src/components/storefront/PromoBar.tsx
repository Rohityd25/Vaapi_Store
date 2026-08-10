'use client'

import { useEffect, useState } from 'react'

const PROMO_MESSAGES = [
  '🚚 FREE SHIPPING on orders above ₹999 — Use code FREESHIP',
  '🎉 NEW ARRIVALS EVERY WEEK — Shop the latest drops',
  '💳 Pay Later with 0% interest — EMI available on all orders',
  '🔁 EASY RETURNS within 7 days — No questions asked',
  '⭐ Over 10,000 Happy Customers — Rated 4.8★',
]

export function PromoBar() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % PROMO_MESSAGES.length)
        setVisible(true)
      }, 300)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      style={{
        background: 'var(--color-brand-primary)',
        color: 'white',
        height: 'var(--promo-bar-height)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '0.8125rem',
          fontWeight: 600,
          letterSpacing: '0.03em',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(-4px)',
          textAlign: 'center',
          padding: '0 1rem',
        }}
      >
        {PROMO_MESSAGES[currentIndex]}
      </p>
    </div>
  )
}
