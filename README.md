# ProductWiki

> An open, standardized and universal product information platform.

ProductWiki is an open-source initiative designed to create a centralized and standardized source of product information that can be freely consumed by applications, websites, retailers, marketplaces, developers and other digital services.

The goal is simple:

**A product should have one structured, authoritative and reusable representation that can be accessed anywhere.**

Instead of every retailer, marketplace or application maintaining its own incomplete version of the same product information, ProductWiki aims to provide a common platform where manufacturers and trusted contributors can publish and maintain structured product data.

This repository contains the backend/API prototype for ProductWiki.

## Vision

Product information is currently fragmented across manufacturer websites, distributors, retailers, marketplaces, spreadsheets, proprietary databases and third-party services.

The same product may appear hundreds or thousands of times across the internet with:

- Different names
- Missing specifications
- Incorrect dimensions
- Incomplete descriptions
- Low-quality or outdated images
- Different category structures
- Missing identifiers
- Inconsistent technical characteristics

ProductWiki aims to solve this by building an open product knowledge layer for the internet.

Conceptually:

```text
Manufacturers
     |
     v
+-------------------+
|    ProductWiki    |
| Universal Product |
|     Database      |
+-------------------+
     |
     +------> E-commerce
     +------> Marketplaces
     +------> Mobile Apps
     +------> Comparison Sites
     +------> AI Systems
     +------> Retailers
     +------> Developers
     +------> Internal Systems
```

## Core Principles

### Open access

Basic product information should be available through a free and predictable API whenever possible.

### Standardized data

Products should follow common schemas instead of every integration requiring a completely different data structure.

### Manufacturer-controlled information

Manufacturers should be able to claim their brands and maintain authoritative information about their own products.

### Community contribution

Where manufacturer information is unavailable, contributors should be able to improve the database while maintaining provenance and moderation.

### Global identification

Products should support existing identifiers such as:

- GTIN
- EAN
- UPC
- ISBN
- MPN
- SKU
- Manufacturer identifiers

ProductWiki should complement existing identification standards rather than inventing unnecessary replacements.

### Rich product information

A product is more than a name and identifier. The platform should eventually support structured information including specifications, variations, media, documentation, compatibility and relationships.

### API first

ProductWiki should be usable independently of its own user interface. The database and API are the core platform.

---

## What ProductWiki Could Contain

A complete product record could eventually include:

```json
{
  "id": "productwiki-id",
  "name": "Example Product",
  "brand": {
    "id": "brand-id",
    "name": "Example Manufacturer"
  },
  "identifiers": {
    "gtin": "0123456789012",
    "ean": "0123456789012",
    "mpn": "ABC-123"
  },
  "category": {
    "id": "category-id",
    "name": "Example Category"
  },
  "description": "Product description",
  "specifications": {
    "weight": {
      "value": 1.2,
      "unit": "kg"
    },
    "color": "Black"
  },
  "images": [],
  "documents": [],
  "variants": [],
  "related_products": [],
  "manufacturer": {},
  "status": "published"
}
```

This is an example of the intended direction and is not the schema currently implemented by this repository.

## Product Relationships

One important objective is to represent products as structured entities rather than isolated database rows.

For example:

```text
Brand
  |
  +-- Product Family
        |
        +-- Product
              |
              +-- Variant
              |
              +-- Specifications
              |
              +-- Images
              |
              +-- Documents
              |
              +-- Accessories
              |
              +-- Compatible Products
```

This would allow ProductWiki to describe complex relationships such as:

- Product variants
- Accessories
- Replacement parts
- Compatible devices
- Product families
- Previous and successor models
- Bundles
- Regional versions

## Manufacturer Participation

A major part of the ProductWiki concept is allowing manufacturers to manage their own information.

The intended workflow is:

```text
Manufacturer registers
        |
        v
Claims or creates brand
        |
        v
Brand ownership is verified
        |
        v
Manufacturer creates or imports products
        |
        v
ProductWiki validates and normalizes data
        |
        v
Products become available through the API
```

Manufacturers could eventually maintain products manually or synchronize catalogs through APIs, feeds or bulk imports.

## Potential Data Consumers

ProductWiki is intended to become useful for many different systems:

- Online shops
- Retailers
- Marketplaces
- Price comparison websites
- Inventory systems
- ERP platforms
- POS systems
- Product discovery applications
- Mobile applications
- Search engines
- AI agents and assistants
- Product recommendation engines
- Repair and compatibility databases
- Logistics systems
- Data analytics platforms

For developers, the ideal experience should eventually be as simple as:

```http
GET /api/products/{identifier}
```

and receiving normalized product information regardless of the original manufacturer.

---

# Current Repository Status

> **Status: Early prototype / proof of concept**

This repository was created as an initial backend experiment for the ProductWiki concept.

It should not currently be considered production ready.

The existing implementation provides the foundations of a REST API but the architecture and product model need significant modernization before implementing the broader ProductWiki vision.

## Current Technology

The prototype currently uses:

- Node.js
- Express
- MongoDB
- Mongoose
- Passport
- Passport JWT
- JSON Web Tokens
- CORS

## Current API

The prototype currently exposes routes under:

```text
/api
```

Authentication-related routes include:

```text
POST /api/signup
POST /api/signin
GET  /api/signout
```

Basic authenticated product routes currently exist for:

```text
POST /api/product
GET  /api/product
```

These endpoints are part of the original prototype and should be reviewed before being considered part of a future public ProductWiki API specification.

## Current Product Model

The existing prototype contains a minimal product model supporting fields such as:

```text
id
codigo
name
description
published
```

The future ProductWiki schema will need to evolve significantly to support universal product information.

---

# Proposed Architecture

A future version of ProductWiki could logically be separated into several domains:

```text
Identity & Access
├── Users
├── Organizations
├── Manufacturers
└── API clients

Product Catalog
├── Products
├── Variants
├── Product families
├── Categories
└── Identifiers

Brand Management
├── Brands
├── Brand ownership
└── Manufacturer verification

Product Data
├── Attributes
├── Specifications
├── Units
├── Descriptions
└── Localization

Media
├── Images
├── Videos
├── Manuals
├── Datasheets
└── Documents

Data Governance
├── Contributions
├── Sources
├── Revisions
├── Moderation
└── Verification

Developer Platform
├── REST API
├── API keys
├── Search
├── Webhooks
└── Bulk data access
```

## Product Provenance

ProductWiki should not only store information, but also understand **where information came from**.

A future record could distinguish between:

```text
Manufacturer verified
Community contributed
Official documentation
Retailer supplied
Imported dataset
Automatically inferred
```

This becomes especially important when multiple sources disagree.

## Versioning and History

Product information changes over time.

ProductWiki should eventually maintain revision history so consumers can understand:

- Who changed information
- When it changed
- What changed
- Where the information came from
- Whether it has been manufacturer verified

A wiki-style revision system could make the database both open and trustworthy.

---

# API Direction

The exact API specification has not yet been defined, but future resources could include:

```text
/api/v1/products
/api/v1/brands
/api/v1/categories
/api/v1/manufacturers
/api/v1/search
```

Examples of future lookup patterns might include:

```text
GET /api/v1/products/{id}
GET /api/v1/products?gtin={gtin}
GET /api/v1/products?ean={ean}
GET /api/v1/products?mpn={mpn}
GET /api/v1/search?q={query}
GET /api/v1/brands/{id}/products
```

These examples describe the intended direction and are not currently implemented endpoints.

---

# Roadmap

The project is currently suitable for re-evaluation and modernization.

### Phase 1 - Foundation

- Modernize the backend stack
- Remove credentials and secrets from source control
- Introduce environment-based configuration
- Define the ProductWiki domain model
- Define product identification rules
- Design API versioning
- Add validation and standardized errors
- Add automated tests
- Add API documentation

### Phase 2 - Product Catalog

- Products
- Brands
- Manufacturers
- Categories
- Product identifiers
- Product variants
- Product attributes
- Units and measurements
- Images and documents

### Phase 3 - Contribution Platform

- Manufacturer accounts
- Organization management
- Brand claiming
- Manufacturer verification
- Product creation and editing
- Contribution history
- Moderation
- Product revision history

### Phase 4 - Developer Platform

- Public API
- API keys
- Usage limits
- Advanced search
- Webhooks
- Bulk imports
- Bulk exports
- SDKs

### Phase 5 - Product Knowledge Network

- Product relationships
- Compatibility information
- Accessories and replacement parts
- Localization
- Duplicate detection and merging
- Data quality scoring
- External datasets
- AI-assisted normalization and enrichment

---

# Development

The existing application can be started with:

```bash
npm install
npm start
```

The server defaults to:

```text
http://localhost:3000
```

## Important Security Notice

The original prototype historically stored database credentials and authentication secrets directly in application configuration.

**Do not reuse those credentials.**

Before running or deploying the application:

1. Rotate any previously committed credentials.
2. Move database configuration to environment variables.
3. Move JWT secrets to environment variables.
4. Ensure `.env` and other secret files are excluded from Git.
5. Review authentication dependencies and implementation before exposing the API publicly.

A future configuration should follow a pattern similar to:

```env
PORT=3000
MONGODB_URI=mongodb://...
JWT_SECRET=...
```

---

# Contributing

ProductWiki is intended to be an open project and contributions are welcome.

Potential areas for contribution include:

- Product schema design
- API design
- Product taxonomy
- Product identifier normalization
- Manufacturer verification
- Search
- Data validation
- Data importers
- Developer tooling
- Documentation
- Security
- Testing

Because the project is currently at an early stage, architectural discussions and proposals are particularly valuable.

If you are interested in helping define an open standard for reusable product information, feel free to open an issue or submit a pull request.

---

# Why ProductWiki?

Imagine being able to scan a barcode or provide a manufacturer part number and retrieve a common, structured product representation:

```text
Identifier
    |
    v
ProductWiki
    |
    +-- Identity
    +-- Manufacturer
    +-- Specifications
    +-- Images
    +-- Documentation
    +-- Variants
    +-- Compatibility
    +-- Relationships
    +-- Source provenance
```

Applications should not need to repeatedly reconstruct the same product data.

Manufacturers should not need to distribute the same product information separately to hundreds of systems.

ProductWiki's long-term goal is to provide a shared product knowledge infrastructure that connects the two.

**One product. One structured identity. Available everywhere.**

---

# License

ProductWiki is released under the **GNU General Public License v3.0 (GPL-3.0)**.

See the `LICENSE` file for details.

---

## Project Status

ProductWiki is currently an experimental open-source project.

The repository represents the beginning of the idea rather than a completed implementation. The architecture, API and schemas are expected to evolve substantially as the project is revived and the universal product model is defined.
