# Contributing

Thank you for improving Mahvara. Keep changes focused, documented, and safe for a production-oriented commerce application.

## Development workflow

1. Create a branch from `main` with a descriptive name.
2. Keep secrets in `.env`; never commit credentials, local databases, or generated build output.
3. Add or update tests when changing domain, security, payment, or inventory behavior.
4. Run the full quality suite before opening a pull request:

   ```bash
   npm run lint
   npm run typecheck
   npm test
   npm run build
   ```

5. Explain the user-facing outcome, implementation approach, validation performed, and any database migration in the pull request.

## Database changes

Schema changes require a Prisma migration. Do not edit an already-applied migration. Add a new migration and verify it against a fresh local database.

## Security-sensitive work

Treat authentication, authorization, checkout, inventory, payment callbacks, and admin APIs as security-sensitive. Preserve server-side validation and authorization even when equivalent checks exist in the UI. Never log passwords, session tokens, reset tokens, payment authorities, or personal data.

## Commits

Use concise, imperative commit messages, for example:

```text
fix: release coupon usage after a failed payment
docs: clarify local database setup
```
