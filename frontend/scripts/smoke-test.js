/**
 * Production Smoke Test Script
 * Verifies core HTTP routes and API endpoints for baseline health.
 * Usage: node scripts/smoke-test.js [BASE_URL]
 */

const BASE_URL = process.argv[2] || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

const routes = [
  '/',
  '/collections/all',
  '/privacy',
  '/terms',
  '/refund-policy',
  '/api/products',
  '/robots.txt',
  '/sitemap.xml',
]

async function runSmokeTests() {
  console.log(`🚀 Starting smoke tests against: ${BASE_URL}\n`)
  let passed = 0
  let failed = 0

  for (const path of routes) {
    const url = `${BASE_URL}${path}`
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Attus-SmokeTest/1.0' } })
      if (res.status >= 200 && res.status < 400) {
        console.log(`✅ [${res.status}] ${path}`)
        passed++
      } else {
        console.error(`❌ [${res.status}] ${path}`)
        failed++
      }
    } catch (err) {
      console.error(`💥 [ERROR] ${path}: ${err.message}`)
      failed++
    }
  }

  console.log(`\n📊 Smoke Test Summary: ${passed} passed, ${failed} failed out of ${routes.length} routes.`)
  if (failed > 0) {
    process.exit(1)
  }
}

runSmokeTests()
