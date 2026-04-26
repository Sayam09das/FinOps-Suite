# Fix Case-Sensitive Import Paths

## Root Cause
macOS case-insensitive filesystem allows `budgeting` and `Budgeting` to resolve to the same directory. Vercel/Linux (case-sensitive) treats them as different paths, causing "Module not found" errors.

## Phase 1: Budgeting (Current Build Errors - 15 errors)
- [ ] `client/app/dashboard/budgeting/vs-actual/page.tsx` — `../../budgeting/` → `../../Budgeting/`
- [ ] `client/app/dashboard/budgeting/create/page.tsx` — `../../budgeting/` → `../../Budgeting/`
- [ ] `client/app/dashboard/budgeting/monthly/page.tsx` — `../../budgeting/` → `../../Budgeting/`

## Phase 2: Accounts (Future Build Failures)
- [ ] `client/app/dashboard/accounts/credit-cards/page.tsx` — `../../accounts/CreditCardsPage/` → `../../Accounts/CreditCardsPage/`
- [ ] `client/app/dashboard/accounts/transfers/page.tsx` — `../../accounts/TransfersPage/` → `../../Accounts/TransfersPage/`

## Phase 3: Transactions (Future Build Failures)
- [ ] `client/app/dashboard/transactions/add/page.tsx` — `../addTransaction/` → `../AddTransaction/`
- [ ] `client/app/dashboard/transactions/recurring/page.tsx` — `../recurring/` → `../Recurring/`
- [ ] `client/app/dashboard/transactions/recurring/AddRecurringForm.tsx` — `../addTransaction/` → `../AddTransaction/`
- [ ] `client/app/dashboard/transactions/categories/page.tsx` — `../categories/` → `../Categories/`

## Follow-up
- [ ] Run `npm run build` locally to verify
- [ ] Commit and push to trigger Vercel deployment

