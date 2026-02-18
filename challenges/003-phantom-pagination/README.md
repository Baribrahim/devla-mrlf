# The Phantom Pagination — Missing & Duplicate Products

## Background

You're an engineer at **ShopStack**, a small e-commerce platform. The product catalog API powers the storefront, admin dashboard, and mobile app. It's been running fine in production for months.

Last sprint, a colleague added a "featured products" feature — the top-rated products now appear first on page 1 of the catalog, regardless of when they were added. Marketing loved it.

This week, the QA team filed this bug:

> **BUG-1247:** When paginating through the product catalog, some products appear on multiple pages and others are completely missing. The product count over all pages doesn't match the total. Discovered while doing a content audit before the marketing launch.

You checked — the database has exactly 25 products. But when paginating 5 per page across all 5 pages, only 23 unique products appear. Two show up twice, and two are completely missing.

## Your Task

Find and fix the pagination bug.

The API should:
- Return all 25 products across 5 pages (5 per page), with no duplicates and no missing items
- Support filtering by `category` and `inStock` status
- Support search by product name
- Return correct pagination metadata (`page`, `limit`, `total`, `totalPages`)

## What "Done" Looks Like

- `npm test` passes all visible tests
- Paginating through all pages returns exactly 25 unique products
- No product appears on more than one page
- Category/stock filters work correctly with pagination
- The "featured products" feature still works — top-rated items appear first on page 1

## Constraints

**You must not:**
- Remove the featured products feature (marketing approved it)
- Change the database schema or seed data
- Modify any test files
- Change the pagination utility (`src/utils/pagination.js`)

**You must:**
- Fix root causes, not symptoms
- Keep the existing API response format

## Running the Project

```bash
npm install
npm test
```

## File Overview

```
src/
  app.js                    # Express app setup
  db/
    database.js             # SQLite schema and 25 seed products
    productsRepo.js         # Product queries (WHERE THE BUG LIVES)
  routes/products.js        # API route handlers
  utils/pagination.js       # Pagination parameter parsing and link building

tests/
  pagination.visible.test.js  # Visible test suite
  helpers.js                  # Test utilities
```

## Notes

- The seed data has 25 products across 5 categories with different ratings and dates
- The highest-rated products were added early (oldest dates), while newest products have lower ratings
- The "featured products" logic was added recently to highlight top-rated items on page 1
- The bug involves how featured products interact with the standard offset-based pagination
- Look at how page 1 is built differently from other pages
