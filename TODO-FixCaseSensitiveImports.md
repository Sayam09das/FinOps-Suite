# Fix Case-Sensitive Import Paths

## Root Cause
macOS case-insensitive filesystem allows `budgeting` and `Budgeting` to resolve to the same directory. Vercel/Linux (case-sensitive) treats them as different paths, causing "Module not found" errors.

## Phase 1: Budgeting (Current Build Errors - 15 errors)
- [x] `client/app/dashboard/budgeting/vs-actual/page.tsx` — `../../budgeting/` → `../../Budgeting/`
- [x] `client/app/dashboard/budgeting/create/page.tsx` — `../../budgeting/` → `../../Budgeting/`
- [x] `client/app/dashboard/budgeting/monthly/page.tsx` — `../../budgeting/` → `../../Budgeting/`

## Phase 2: Accounts (Future Build Failures)
- [x] `client/app/dashboard/accounts/credit-cards/page.tsx` — `../../accounts/CreditCardsPage/` → `../../Accounts/CreditCardsPage/`
- [x] `client/app/dashboard/accounts/transfers/page.tsx` — `../../accounts/TransfersPage/` → `../../Accounts/TransfersPage/`

## Phase 3: Transactions (Future Build Failures)
- [x] `client/app/dashboard/transactions/add/page.tsx` — `../addTransaction/` → `../AddTransaction/`
- [x] `client/app/dashboard/transactions/recurring/page.tsx` — `./RecurringList` → `../Recurring/RecurringList`, `./UpcomingTimeline` → `../Recurring/UpcomingTimeline`, `./AddRecurringForm` → `../Recurring/AddRecurringForm`
- [x] `client/app/dashboard/transactions/recurring/AddRecurringForm.tsx` — `../addTransaction/` → `../AddTransaction/`
- [x] `client/app/dashboard/transactions/categories/page.tsx` — `../categories/` → `../Categories/`

## Follow-up
- [x] Run `npm run build` locally to verify
- [ ] Commit and push to trigger Vercel deployment

