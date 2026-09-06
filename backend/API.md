# ProductWiki API prototype

The prototype is a dependency-free HTTP service intended to clarify the initial API flow. Start it with:

```bash
python -m backend
```

It listens on `127.0.0.1:8000` by default.

## Endpoints

### `GET /health`

Returns `{ "status": "ok" }`.

### `GET /api/products`

Returns all products. An optional `q` query parameter performs a case-insensitive search in the name and description.

### `GET /api/products/{id}`

Returns one product, or `404` when it does not exist.

### `POST /api/products`

Accepts JSON with required string fields `id` and `name`. Optional fields are `description` and boolean `published` (default `false`). New products return `201`; malformed input returns `400`; duplicate IDs return `409`.

Example:

```bash
curl -X POST http://127.0.0.1:8000/api/products \
  -H 'Content-Type: application/json' \
  -d '{"id":"p-1","name":"Widget","description":"Example"}'
```

Data is held in memory and is lost when the process stops. Authentication, persistence, moderation, and production deployment are intentionally outside this prototype.
