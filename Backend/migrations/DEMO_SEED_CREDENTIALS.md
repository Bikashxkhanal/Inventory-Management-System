# Demo seed data

Run once (after migrations 001–003):

```bash
php Backend/scripts/seed_demo_data.php
```

## Login

Use **email** (or registered **phone** where supported) and **password** at `/login`. **Role** is assigned on the account, not entered at login.

**Password for all demo users:** `Password@1`

## Company 1 — Himalayan Traders Pvt Ltd

| Role | Email | Phone | Password |
|------|-------|-------|----------|
| Superadmin | suman@himalayantraders.demo | 9811000010 | Password@1 |
| Admin | anita@himalayantraders.demo | 9811000011 | Password@1 |
| Manager | bikash@himalayantraders.demo | 9811000012 | Password@1 |
| Salesperson | rita@himalayantraders.demo | 9811000013 | Password@1 |

Company contact: contact@himalayantraders.demo · 9811000001

## Company 2 — Valley Retail Co

| Role | Email | Phone | Password |
|------|-------|-------|----------|
| Superadmin | nabin@valleyretail.demo | 9812000010 | Password@1 |
| Admin | priya@valleyretail.demo | 9812000011 | Password@1 |
| Manager | kiran@valleyretail.demo | 9812000012 | Password@1 |
| Salesperson | sita@valleyretail.demo | 9812000013 | Password@1 |

Company contact: hello@valleyretail.demo · 9812000001

## Shared catalog (all companies)

- Categories: Electronics, Grocery, Stationery, Beverages
- 8 products with stock
- 3 vendors
- Sample purchases and sales per company (when tables support them)

Re-run is safe: existing emails are skipped.

See also: [README — Demo accounts](../../README.md#demo-accounts)
