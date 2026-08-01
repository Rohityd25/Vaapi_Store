"""
Backend tests for Vaapi Store (Next.js e-commerce app)
Tests API contract, checkout flow (COD + Razorpay mock), coupons, auth, middleware.
"""
import os
import re
import time
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://vaapi-preview.preview.emergentagent.com").rstrip("/")


@pytest.fixture(scope="session")
def s():
    sess = requests.Session()
    sess.headers.update({"User-Agent": "vaapi-test/1.0"})
    return sess


@pytest.fixture(scope="session")
def products(s):
    r = s.get(f"{BASE_URL}/api/products", timeout=30)
    assert r.status_code == 200, r.text
    data = r.json()
    # Expect list or object with items
    items = data if isinstance(data, list) else data.get("products") or data.get("items") or data.get("data") or []
    assert len(items) > 0, f"No products: {data}"
    return items


# ---------------- Products ----------------
class TestProducts:
    def test_get_products(self, products):
        assert len(products) >= 1
        p = products[0]
        assert "id" in p or "slug" in p

    def test_products_have_variants(self, products):
        # Verify at least one product has variants+images
        found_variant = False
        for p in products:
            variants = p.get("variants") or []
            if variants:
                found_variant = True
                break
        assert found_variant, "No product with variants found"

    def test_filter_bestseller(self, s):
        r = s.get(f"{BASE_URL}/api/products?featured=bestseller", timeout=30)
        assert r.status_code == 200
        data = r.json()
        items = data if isinstance(data, list) else data.get("products") or data.get("items") or data.get("data") or []
        # Just check response shape ok
        assert isinstance(items, list)

    def test_filter_category(self, s):
        r = s.get(f"{BASE_URL}/api/products?category=men-tshirts", timeout=30)
        assert r.status_code == 200


# ---------------- Coupons ----------------
class TestCoupons:
    def test_welcome10_valid(self, s):
        r = s.post(f"{BASE_URL}/api/coupons/apply", json={"code": "WELCOME10", "subtotal": 1000}, timeout=30)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data.get("discount") == 100 or data.get("discountAmount") == 100, data

    def test_invalid_code(self, s):
        r = s.post(f"{BASE_URL}/api/coupons/apply", json={"code": "INVALID", "subtotal": 1000}, timeout=30)
        assert r.status_code == 404, f"Expected 404 for invalid code, got {r.status_code}: {r.text}"

    def test_min_order_not_met(self, s):
        r = s.post(f"{BASE_URL}/api/coupons/apply", json={"code": "VAAPI500", "subtotal": 1000}, timeout=30)
        assert r.status_code >= 400, f"Expected error for min-order not met, got {r.status_code}: {r.text}"


# ---------------- Auth ----------------
class TestAuth:
    def test_register_new_user(self, s):
        email = f"test_{uuid.uuid4().hex[:8]}@example.com"
        r = s.post(f"{BASE_URL}/api/auth/register", json={
            "email": email, "password": "Testpass123!", "name": "Test User"
        }, timeout=30)
        assert r.status_code in (200, 201), f"register failed: {r.status_code} {r.text}"

    def test_register_duplicate(self, s):
        r = s.post(f"{BASE_URL}/api/auth/register", json={
            "email": "admin@vaapi.com", "password": "admin123", "name": "dup"
        }, timeout=30)
        assert r.status_code >= 400

    def test_nextauth_csrf(self, s):
        r = s.get(f"{BASE_URL}/api/auth/csrf", timeout=30)
        assert r.status_code == 200
        assert "csrfToken" in r.json()

    def test_credentials_login(self):
        sess = requests.Session()
        csrf_r = sess.get(f"{BASE_URL}/api/auth/csrf", timeout=30)
        csrf = csrf_r.json()["csrfToken"]
        r = sess.post(
            f"{BASE_URL}/api/auth/callback/credentials",
            data={
                "csrfToken": csrf,
                "email": "admin@vaapi.com",
                "password": "admin123",
                "callbackUrl": f"{BASE_URL}/admin",
                "json": "true",
            },
            allow_redirects=False,
            timeout=30,
        )
        # NextAuth returns 200 with url on success (no ?error=)
        assert r.status_code in (200, 302), f"login failed: {r.status_code} {r.text}"
        # Verify a session-token cookie was set (raw header check due to requests
        # lib multi-cookie parsing quirks with Expires containing commas)
        set_cookie = r.headers.get("Set-Cookie", "")
        assert "next-auth.session-token=" in set_cookie, f"No session cookie set: {set_cookie[:200]}"
        # And response body shouldn't contain error
        body = r.text
        assert "error" not in body.lower() or '"url"' in body, f"login error: {body}"


# ---------------- Middleware ----------------
class TestMiddleware:
    def test_admin_redirects_to_login(self):
        r = requests.get(f"{BASE_URL}/admin", allow_redirects=False, timeout=30)
        assert r.status_code in (302, 307, 308), f"Expected redirect, got {r.status_code}"
        loc = r.headers.get("location", "")
        assert "/login" in loc, f"Expected /login redirect, got {loc}"
        assert "callbackUrl" in loc or "callback" in loc.lower()

    def test_account_redirects_to_login(self):
        r = requests.get(f"{BASE_URL}/account", allow_redirects=False, timeout=30)
        assert r.status_code in (302, 307, 308)
        loc = r.headers.get("location", "")
        assert "/login" in loc


# ---------------- Checkout ----------------
def _first_variant(products):
    for p in products:
        for v in (p.get("variants") or []):
            if (v.get("stock") or v.get("inventory") or 0) > 0:
                return p, v
    return products[0], (products[0].get("variants") or [{}])[0]


class TestCheckout:
    def test_checkout_cod(self, s, products):
        product, variant = _first_variant(products)
        variant_id = variant.get("id")
        price = variant.get("price") or product.get("price") or 999
        payload = {
            "items": [{"variantId": variant_id, "quantity": 1, "price": price}],
            "address": {
                "fullName": "Test User", "phone": "9999999999",
                "line1": "123 Test St", "city": "Mumbai", "state": "MH",
                "pincode": "400001", "country": "IN",
            },
            "paymentMethod": "COD",
            "guestEmail": f"cod_{uuid.uuid4().hex[:6]}@test.com",
            "subtotal": price, "total": price,
        }
        r = s.post(f"{BASE_URL}/api/checkout", json=payload, timeout=60)
        assert r.status_code in (200, 201), f"COD checkout failed: {r.status_code} {r.text}"
        data = r.json()
        order_number = data.get("orderNumber") or (data.get("order") or {}).get("orderNumber")
        assert order_number, f"No orderNumber in response: {data}"
        # Verify GET
        gr = s.get(f"{BASE_URL}/api/orders?orderNumber={order_number}", timeout=30)
        assert gr.status_code == 200, gr.text

    def test_checkout_razorpay_mock(self, s, products):
        product, variant = _first_variant(products)
        variant_id = variant.get("id")
        price = variant.get("price") or product.get("price") or 999
        email = f"rzp_{uuid.uuid4().hex[:6]}@test.com"
        payload = {
            "items": [{"variantId": variant_id, "quantity": 1, "price": price}],
            "address": {
                "fullName": "Test User", "phone": "9999999999",
                "line1": "123 Test St", "city": "Mumbai", "state": "MH",
                "pincode": "400001", "country": "IN",
            },
            "paymentMethod": "RAZORPAY",
            "guestEmail": email,
            "subtotal": price, "total": price,
        }
        r = s.post(f"{BASE_URL}/api/checkout", json=payload, timeout=60)
        assert r.status_code in (200, 201), f"Razorpay checkout failed: {r.status_code} {r.text}"
        data = r.json()
        order_number = data.get("orderNumber") or (data.get("order") or {}).get("orderNumber")
        rzp_order_id = data.get("razorpayOrderId")
        order_id = data.get("orderId")
        assert order_number, f"No orderNumber: {data}"
        assert rzp_order_id, f"No razorpay order id: {data}"
        assert str(rzp_order_id).startswith("order_MOCK_"), f"Expected mock prefix: {rzp_order_id}"

        # Verify (endpoint expects camelCase)
        vr = s.post(f"{BASE_URL}/api/payments/razorpay/verify", json={
            "orderId": order_id,
            "razorpayOrderId": rzp_order_id,
            "razorpayPaymentId": f"pay_MOCK_{uuid.uuid4().hex[:10]}",
            "razorpaySignature": "mock_sig",
        }, timeout=30)
        assert vr.status_code == 200, f"verify failed: {vr.status_code} {vr.text}"

    def test_checkout_invalid_variant(self, s):
        payload = {
            "items": [{"variantId": "nonexistent_variant_xyz", "quantity": 1, "price": 100}],
            "address": {"fullName": "X", "phone": "9999999999", "line1": "x", "city": "x", "state": "x", "pincode": "400001", "country": "IN"},
            "paymentMethod": "COD",
            "guestEmail": "bad@test.com",
            "subtotal": 100, "total": 100,
        }
        r = s.post(f"{BASE_URL}/api/checkout", json=payload, timeout=30)
        assert r.status_code == 400, f"Expected 400 for invalid variant, got {r.status_code}: {r.text}"

    def test_checkout_stock_exceeded(self, s, products):
        product, variant = _first_variant(products)
        variant_id = variant.get("id")
        price = variant.get("price") or product.get("price") or 999
        payload = {
            "items": [{"variantId": variant_id, "quantity": 999999, "price": price}],
            "address": {"fullName": "X", "phone": "9999999999", "line1": "x", "city": "x", "state": "x", "pincode": "400001", "country": "IN"},
            "paymentMethod": "COD",
            "guestEmail": "stock@test.com",
            "subtotal": price, "total": price,
        }
        r = s.post(f"{BASE_URL}/api/checkout", json=payload, timeout=30)
        assert r.status_code == 400, f"Expected 400 for stock exceeded, got {r.status_code}: {r.text}"

    def test_checkout_stock_decrements(self, s, products):
        product, variant = _first_variant(products)
        variant_id = variant.get("id")
        # Get current stock
        pre = s.get(f"{BASE_URL}/api/products", timeout=30).json()
        pre_items = pre if isinstance(pre, list) else pre.get("products") or pre.get("items") or pre.get("data") or []
        pre_stock = None
        for p in pre_items:
            for v in p.get("variants") or []:
                if v.get("id") == variant_id:
                    pre_stock = v.get("stock") or v.get("inventory")
        if pre_stock is None:
            pytest.skip("Cannot read stock")
        price = variant.get("price") or product.get("price") or 999
        payload = {
            "items": [{"variantId": variant_id, "quantity": 1, "price": price}],
            "address": {"fullName": "Test", "phone": "9999999999", "line1": "x", "city": "Mumbai", "state": "MH", "pincode": "400001", "country": "IN"},
            "paymentMethod": "COD",
            "guestEmail": f"stkdec_{uuid.uuid4().hex[:6]}@test.com",
            "subtotal": price, "total": price,
        }
        r = s.post(f"{BASE_URL}/api/checkout", json=payload, timeout=30)
        assert r.status_code in (200, 201), r.text
        time.sleep(1)
        post = s.get(f"{BASE_URL}/api/products", timeout=30).json()
        post_items = post if isinstance(post, list) else post.get("products") or post.get("items") or post.get("data") or []
        post_stock = None
        for p in post_items:
            for v in p.get("variants") or []:
                if v.get("id") == variant_id:
                    post_stock = v.get("stock") or v.get("inventory")
        assert post_stock == pre_stock - 1, f"stock did not decrement: pre={pre_stock} post={post_stock}"
