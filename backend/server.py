"""
Thin FastAPI reverse-proxy that forwards every /api/* request to the Next.js
server running on http://127.0.0.1:3000. Required because the platform ingress
routes /api/* to :8001 (this file) while the Next.js app owns those routes.
"""
from fastapi import FastAPI, Request, Response
from fastapi.responses import StreamingResponse
import httpx

app = FastAPI(title="Vaapi Store API Proxy")

NEXT_ORIGIN = "http://127.0.0.1:3000"
client = httpx.AsyncClient(base_url=NEXT_ORIGIN, timeout=60.0, follow_redirects=False)


@app.get("/healthz")
async def health():
    return {"status": "ok", "proxy": "next.js"}


@app.api_route(
    "/api/{path:path}",
    methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
)
async def proxy(request: Request, path: str):
    url = f"/api/{path}"
    if request.url.query:
        url = f"{url}?{request.url.query}"

    headers = {
        k: v
        for k, v in request.headers.items()
        if k.lower() not in {"host", "content-length"}
    }
    body = await request.body()

    upstream = await client.request(
        request.method, url, content=body, headers=headers
    )

    resp_headers = {
        k: v
        for k, v in upstream.headers.items()
        if k.lower() not in {"content-length", "transfer-encoding", "connection"}
    }
    return Response(
        content=upstream.content,
        status_code=upstream.status_code,
        headers=resp_headers,
        media_type=upstream.headers.get("content-type"),
    )
