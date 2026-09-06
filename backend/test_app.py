import json
import threading
import unittest
from http.client import HTTPConnection
from http.server import ThreadingHTTPServer

from .app import ProductStore, create_app


class ApiTests(unittest.TestCase):
    def setUp(self):
        self.server = ThreadingHTTPServer(("127.0.0.1", 0), create_app(ProductStore()))
        threading.Thread(target=self.server.serve_forever, daemon=True).start()
        self.connection = HTTPConnection(*self.server.server_address)

    def tearDown(self):
        self.connection.close()
        self.server.shutdown()

    def request(self, method, path, body=None):
        payload = json.dumps(body).encode() if body is not None else None
        self.connection.request(method, path, payload, {"Content-Type": "application/json"} if payload else {})
        response = self.connection.getresponse()
        return response.status, json.loads(response.read())

    def test_create_and_get_product(self):
        status, product = self.request("POST", "/api/products", {"id": "p-1", "name": "Widget"})
        self.assertEqual(status, 201)
        self.assertEqual(product["name"], "Widget")
        status, found = self.request("GET", "/api/products/p-1")
        self.assertEqual(status, 200)
        self.assertEqual(found, product)

    def test_validation_duplicate_and_missing_product(self):
        self.assertEqual(self.request("POST", "/api/products", {})[0], 400)
        self.request("POST", "/api/products", {"id": "p-1", "name": "Widget"})
        self.assertEqual(self.request("POST", "/api/products", {"id": "p-1", "name": "Other"})[0], 409)
        self.assertEqual(self.request("GET", "/api/products/missing")[0], 404)


if __name__ == "__main__":
    unittest.main()
