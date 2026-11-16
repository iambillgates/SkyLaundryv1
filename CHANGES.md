# SkyLaundryv1 — Phase-1 SECURITY cleanup

Repo: `iambillgates/SkyLaundryv1` (PUBLIC, default branch `main`).
Scope: backend only (`backend-laundry/`). No files were pushed; these are
drop-in replacements for the paths below, mirroring repo-relative paths.

## What changed (per file)

### 1. `backend-laundry/src/auth/auth.module.ts` — JWT secret moved to env
- **Before:** `JwtModule.register({ secret: '<hardcoded-secret>' })` — the
  same secret for every deployment, committed to a public repo.
- **After:** `JwtModule.registerAsync()` reads `process.env.JWT_SECRET` and
  **throws a clear error at boot if it is unset** (telling the user to copy
  `.env.example` to `.env`). No dev default, no fallback secret — the app
  must never run silently with a built-in secret again.
- `PassportModule` imported and `JwtStrategy` registered as a provider.
- No new dependency added: `@nestjs/passport` and `passport-jwt` were
  already in `package.json` (but unused).

### 2. `backend-laundry/src/auth/jwt.strategy.ts` — NEW
- `PassportStrategy(Strategy)` (passport-jwt): token diambil dari header
  `Authorization: Bearer <token>`, secret dari `process.env.JWT_SECRET`,
  `ignoreExpiration: false`.
- `validate()` returns `{ userId: payload.sub, email: payload.email }`
  (payload dibuat di `AuthService.login()` sebagai `{ email, sub }`).

### 3. `backend-laundry/src/auth/jwt-auth.guard.ts` — NEW
- `JwtAuthGuard extends AuthGuard('jwt')` — guard standar NestJS/Passport.

### 4. `backend-laundry/src/orders/orders.controller.ts` — all routes guarded except tracking
- **Before:** no `@UseGuards()` anywhere — anyone could `POST` / `PATCH` /
  `DELETE /orders` without a token (login was theatre).
- **After:** `@UseGuards(JwtAuthGuard)` on every route **except**
  `GET /orders/track/:orderId`, which stays public on purpose (customer
  tracking by receipt number, no login by design):
  - Protected: `POST /orders`, `GET /orders`, `GET /orders/activity/logs`,
    `GET /orders/stats/financial`, `GET /orders/:id`, `PATCH /orders/:id`,
    `DELETE /orders/:id`.
  - Public: `GET /orders/track/:orderId` only.
- The frontend already sends `Authorization: Bearer <token>` on every call,
  so the dashboard keeps working once `JWT_SECRET` is set (see "Needs akbar"
  — all previously issued tokens stop validating after the secret changes).

### 5. `backend-laundry/src/main.ts` — CORS restricted + env port + boot check
- **Before:** `app.enableCors()` with no origin (any website could call the
  API from a browser) and a hardcoded port 4000.
- **After:** CORS only allows `process.env.FRONTEND_URL` (default
  `http://localhost:3000`), `credentials: true`; port from `process.env.PORT`
  (default 4000); explicit `JWT_SECRET` check at the top of `bootstrap()` so
  the app fails fast with a readable message instead of starting unprotected.

### 6. `backend-laundry/.env.example` — NEW
- Placeholder-only values + comments for `DATABASE_URL`, `JWT_SECRET`
  (with a command to generate a random one), `PORT=4000`, `FRONTEND_URL`.
  No real values anywhere in it.

## Verification done locally
- Full backend source downloaded from the repo; fixed files overlaid.
- `npx tsc --noEmit`: **0 errors** (with a local-only `@prisma/client`
  type stub — `prisma generate` cannot download engines in this VM because
  Node fetch gets ECONNRESET from binaries.prisma.sh; on a normal machine
  `npx prisma generate` works. The stub lived only in /tmp, not in the
  deliverable).
- `npm run build` (`nest build`): passes.
- Runtime smoke test (built app, stubbed Prisma client, no real DB):
  - Without `JWT_SECRET` → app exits at boot with the clear
    "JWT_SECRET belum diset..." error.
  - With `JWT_SECRET` → app boots (PassportModule, JwtModule, AuthModule,
    OrdersModule all initialise).
  - `GET /orders`, `POST /orders`, `GET /orders/stats/financial` without a
    token → **401** (guard works).
  - `GET /orders/track/SKY-TEST` without a token → reaches the handler
    (500 only because the local stub has no real DB — proves the route is
    public as intended).
  - `POST /auth/login` → not blocked by the guard (500 only from the stub
    DB in `validateUser`, as expected without a database).

## Needs akbar
1. **Set env vars in deployment:** copy `backend-laundry/.env.example` to
   `.env` and fill in `DATABASE_URL` and a NEW `JWT_SECRET` (generate with
   the command in the file). All staff must log in again after the secret
   changes — old tokens stop working.
2. **Rotate / treat the old JWT secret as compromised.** It is in git
   history. Changing the secret in code is not enough on its own — the old
   value can still be used to forge tokens until the secret is replaced
   everywhere the backend runs.
3. **`laundry_db.sql` (repo root) — delete or replace, then purge history.**
   It contains real-looking customer names and phone numbers (11 orders +
   21 activity-log rows). Deleting the file in a new commit does NOT remove
   it from history — it needs `git filter-repo` (or equivalent) + force-push
   from a local clone, which the GitHub connector cannot do. Until then, do
   not assume the data is private. Recommended: replace it with obviously
   fake seed data (e.g. `081200000001`, "Test Customer") or delete it and
   rely on `prisma migrate deploy` + `prisma db seed`.
4. **Not fixed in this phase (out of scope, noted for later phases):**
   - `yesterdayRevenue` bug in `orders.service.ts` (`setHours` mutates the
     date passed as `startDate`, so yesterday's revenue is ~always 0).
   - Price mismatch: landing page shows Kiloan Rp 8.000 / Satuan Rp 25.000,
     backend charges KILOAN 7000 / SATUAN 10000 × weight.
   - DTO decorator contradictions + missing global `ValidationPipe`.
   - JWT leaked in a URL (`dashboard/page.tsx` "Bot WA" button opens
     `http://localhost:3005/admin/auth-token?token=...`).
   - Hardcoded `http://localhost:4000` still in `app/page.tsx:59` (tracking)
     and `app/staff-login/page.tsx:96` (login) — use `NEXT_PUBLIC_API_URL`.
   - `@prisma/client` + `prisma` are in `devDependencies` but imported at
     runtime; `saff-login.dto.ts` typo; broken unit-test scaffolds.
