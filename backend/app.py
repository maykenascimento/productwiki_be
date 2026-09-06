"""Small dependency-free ProductWiki HTTP API prototype."""

from __future__ import annotations

import json
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from threading import Lock
from urllib.parse import parse_qs, urlparse


class ProductStore:
    """In-memory store used by the prototype and its tests."""

    def __init__(self) -> None:
        self._products: dict[str, dict] = {}
        self._lock = Lock()

    def list(self, query: str = "") -> list[dict]:
        needle = query.strip().lower()
        with self._lock:
            products = list(self._products.values())
        if needle:
            products = [p for p in products if needle in p["name"].lower() or needle in p.get("description", "").lower()]
        return products

    def get(self, product_id: str) -> dict | None:
        with self._lock:
            return self._products.get(product_id)

    def create(self, product: dict) -> dict:
        product_id = str(product.get("id", "")).strip()
        name = str(product.get("name", "")).strip()
        if not product_id or not name:
            raise ValueError("id and name are required")
        result = {
            "id": product_id,
            "name": name,
            "description": str(product.get("description", "")),
            "published": bool(product.get("published", False)),
        }
        with self._lock:
            if product_id in self._products:
                raise KeyError(product_id)
            self._products[product_id] = result
        return result


class ProductWikiHandler(BaseHTTPRequestHandler):
    store = ProductStore()

    def _send(self, status: HTTPStatus, body: dict | list) -> None:
        data = json.dumps(body).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self) -> None:  # noqa: N802
        parsed = urlparse(self.path)
        if parsed.path == "/health":
            return self._send(HTTPStatus.OK, {"status": "ok"})
        if parsed.path == "/api/products":
            query = parse_qs(parsed.query).get("q", [""])[0]
            return self._send(HTTPStatus.OK, self.store.list(query))
        if parsed.path.startswith("/api/products/"):
            product = self.store.get(parsed.path.rsplit("/", 1)[-1])
            if product is None:
                return self._send(HTTPStatus.NOT_FOUND, {"error": "product not found"})
            return self._send(HTTPStatus.OK, product)
        self._send(HTTPStatus.NOT_FOUND, {"error": "not found"})

    def do_POST(self) -> None:  # noqa: N802
        if self.path != "/api/products":
            return self._send(HTTPStatus.NOT_FOUND, {"error": "not found"})
        try:
            length = int(self.headers.get("Content-Length", "0"))
            product = json.loads(self.rfile.read(length))
            result = self.store.create(product)
        except (ValueError, TypeError, json.JSONDecodeError):
            return self._send(HTTPStatus.BAD_REQUEST, {"error": "valid JSON with id and name is required"})
        except KeyError:
            return self._send(HTTPStatus.CONFLICT, {"error": "product already exists"})
        self._send(HTTPStatus.CREATED, result)

    def log_message(self, *_args) -> None:
        return


def create_app(store: ProductStore | None = None) -> type[ProductWikiHandler]:
    """Return a request handler configured with an isolated product store."""
    handler = type("ConfiguredProductWikiHandler", (ProductWikiHandler,), {})
    handler.store = store or ProductStore()
    return handler


def serve(host: str = "127.0.0.1", port: int = 8000) -> None:
    server = ThreadingHTTPServer((host, port), create_app())
    print(f"ProductWiki API listening on http://{host}:{port}")
    server.serve_forever()
