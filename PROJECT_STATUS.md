# Mahvara Storefront — Project Handoff

**Status:** Released and complete for the version 1.0 product scope  
**Release:** [v1.0.0](https://github.com/Alivexor/mahvara-store/releases/tag/v1.0.0)  
**Default branch:** `main`

## Completion summary

The planned storefront foundation has been implemented and published. The repository contains the source code, original visual assets, database model and migration, development configuration, automated quality workflow, documentation, and screenshots needed to review and continue the project.

### Delivered scope

- Responsive Persian/RTL storefront, catalogue, product detail pages, cart, checkout, and mock payment journey
- Server-side pricing, coupon validation, transactional inventory reservation, callback idempotency, and order settlement
- Registration, login, session management, password hashing, customer account pages, and role-based admin area
- Product, order, wishlist, newsletter, contact, blog, SEO, sitemap, robots, manifest, and feed features
- Prisma/PostgreSQL model, migration, seed data, Docker configuration, and environment template
- English README, contribution guide, security policy, GitHub Actions quality checks, Dependabot, secret scanning, and push protection

## Release verification

The release branch was checked successfully with:

```text
npm audit --omit=dev --audit-level=high  → 0 vulnerabilities
npm run lint                             → passed
npm run typecheck                        → passed
npm test                                 → 11 tests passed
npm run build                            → passed
npm run qa:browser                       → 11 routes × 2 viewports passed
```

The GitHub Actions **Quality gates** workflow is enabled for pushes and pull requests to `main`.

## Intentionally external to this release

The following require owner-controlled production accounts, contracts, or credentials and are therefore intentionally not bundled as fake integrations:

- a live payment-provider adapter and provider sandbox verification;
- transactional email or SMS delivery;
- production domain, DNS, TLS, analytics, and social profile URLs;
- managed PostgreSQL, object storage, backups, monitoring, and operational alerting;
- production security, load, accessibility, and real-device testing.

These are deployment operations, not incomplete application code. Their requirements are documented in the [README](README.md#production-checklist).

## Repository closeout

- The repository is public and the canonical source is `main`.
- The initial release is tagged `v1.0.0`.
- No credentials, `.env` files, databases, or build output are tracked.
- Future work should be opened as a new issue or release scope rather than treated as unfinished version 1.0 work.
