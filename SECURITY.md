# Security policy

## Supported version

Security fixes are applied to the current `main` branch.

## Reporting a vulnerability

Do not open a public issue for a suspected vulnerability. Contact the repository owner privately with:

- a clear description of the issue;
- affected route, component, or dependency;
- reproduction steps or a minimal proof of concept;
- potential impact; and
- any suggested mitigation.

Do not include real credentials, customer data, or payment information in the report. The owner should acknowledge the report, investigate it privately, and coordinate disclosure after a fix is available.

## Deployment notes

This project includes a mock payment provider and example environment values. Replace all placeholders, demo credentials, and local-only configuration before deployment. Use provider-side server verification for every real payment callback and keep runtime secrets outside the repository.
