# AssetIQ Accounts

Next.js frontend for the AssetIQ **Accounts** module — general ledger, cash & bank, AR/AP, vouchers, budgets, fixed assets, reports, and settings.

Companion API: `assetiq-be/backend/accounts` (Express + PostgreSQL).

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 4 + shadcn/ui (Radix)
- Recharts for analytics
- Feature-based UI with shared CRUD helpers (`features/crud`)

## Quick start

```bash
cd accounts
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Modules

| Area | Routes |
| --- | --- |
| Dashboard & Analytics | `/`, `/analytics` |
| Chart of Accounts | `/chart-of-accounts/*` |
| Vouchers | `/vouchers/*` |
| Transactions | `/transactions/*` |
| Cash & Bank | `/cash-bank/*` |
| Accounts Receivable | `/accounts-receivable/*` |
| Accounts Payable | `/accounts-payable/*` |
| Budget | `/budget/*` |
| General Accounting | `/general-accounting/*` |
| Fixed Assets | `/fixed-assets/*` |
| Reports | `/reports/*` |
| Approval & Audit | `/approval-audit/*` |
| Settings | `/settings/*` |

## Structure

```
accounts/
├── app/
│   └── (dashboard)/          → sidebar shell + module pages
├── components/
│   ├── layout/               → app shell, sidebar, navbar
│   └── ui/                   → shadcn primitives
├── config/
│   └── navigation.ts         → sidebar tree
├── features/
│   ├── crud/                 → shared list/form page helpers
│   ├── dashboard/
│   ├── cash-bank/
│   ├── accounts-receivable/
│   ├── accounts-payable/
│   ├── vouchers/
│   ├── transactions/
│   ├── budget/
│   ├── general-accounting/
│   ├── fixed-assets/
│   ├── reports/
│   ├── approval-audit/
│   ├── settings/
│   └── analytics/
└── lib/
    └── utils.ts
```

## Conventions

- Pages under `app/(dashboard)/...` stay thin; UI and mock data live in `features/<module>/`.
- List/form screens reuse `features/crud` with a `CrudPageConfig` from each feature’s `configs.ts`.
- Navigation is driven by `config/navigation.ts` — keep route paths in sync with `app/` folders.

## Scripts

```bash
pnpm dev      # development server
pnpm build    # production build
pnpm start    # serve production build
pnpm lint     # eslint
```

## Related

- Backend: `assetiq-be/backend/accounts`
- Main AssetIQ FE: `assetiq-fe/assetiq`
