# Admin portfolio lookup — manual test checklist

Prereq: run `supabase/migrations/20260929_admin_portfolio_lookup.sql`, then:

```sql
INSERT INTO public.admins (user_id) VALUES ('<your-auth-user-uuid>');
```

Wire route (one-time edit to `routes/AppRoutes.tsx` — see `routes/adminRoutes.tsx`).

## Security / RPC

1. **Non-admin authenticated user** calls `admin_get_user_portfolio` → error `Admin access required`. UI `/admin/portfolio` redirects to `/panel`.
2. **Admin without MFA** while `require_aal2 := true` in `admin_assert_caller` + `admin_is_admin` → error `MFA required (aal2)`. (Default flag is `false` until TOTP is enabled in Dashboard.)
3. **Invalid UUID** (e.g. `abc`, truncated id) → client rejects before RPC; PostgREST also rejects bad uuid param.
4. **Every successful authZ’d lookup** inserts into `admin_audit_log` with `action = 'admin_get_user_portfolio'` and `target_user_id`.
5. **Trial stats** inserts `action = 'admin_trial_activation_stats'`, `target_user_id` null.
6. **Rate limit**: >30 audited admin actions/minute → `Admin rate limit exceeded`.
7. **No PII**: response has no email, IP, payment tokens; only nickname, plan, dates, holdings market values.
8. **Direct table access**: `select * from admins` / `admin_audit_log` as authenticated → denied (RLS, no policies).
9. **Share portfolio untouched**: `/p/:token` and existing RPCs still behave as before.

## Product

10. Existing user with holdings → summary + items list + first/last skin dates.
11. Unknown but valid UUID with no profile → `{ found: false }`.
12. Trial stats with empty `revenuecat_entitlements` → `available: false` + hint.
