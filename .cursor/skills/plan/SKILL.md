---
name: plan
description: Phase 2 Auth & Roles implementation plan. Use when implementing login API, JWT auth, user roles (admin/operator/viewer), frontend route protection, or backend permission guards in the Smart Campaign Manager monorepo.
---

# Phase 2 – Auth & Roles

Guides implementation of backend login API, JWT auth, role-based access (admin / operator / viewer), frontend route protection, and backend permission guards in the Smart Campaign Manager Turborepo (Next.js + NestJS + Prisma).

## Scope

- **Login API**: NestJS endpoint that validates credentials and returns JWT.
- **JWT auth**: Backend issues and validates JWT; frontend can send token to API or keep using NextAuth session and have backend validate via shared secret or NextAuth JWT.
- **Roles**: `ADMIN` | `OPERATOR` | `VIEWER` (align with `@smart-campaign/types` and Prisma `User.role`).
- **Frontend**: Protect routes by role; redirect or 403 when insufficient permission.
- **Backend**: Guards/decorators that restrict endpoints by role (e.g. admin-only, operator-or-admin).

## Architecture Choices

- **Option A (recommended for this stack)**: Frontend stays on NextAuth (credentials provider). Backend exposes `POST /auth/login` returning JWT. NextAuth `authorize()` calls this API; after login, frontend uses NextAuth session. For API calls from frontend to NestJS, send JWT in `Authorization: Bearer <token>` (e.g. from session or getToken()). NestJS validates JWT and attaches user/role; guards check role.
- **Option B**: Frontend uses only backend login API and stores JWT (e.g. httpOnly cookie or memory); no NextAuth. Simpler but loses NextAuth session UX and provider pattern.

Use **Option A** unless the user explicitly prefers B.

## Backend (NestJS) – File Structure

```
apps/api/src/
├── modules/
│   └── auth/
│       ├── auth.module.ts
│       ├── auth.controller.ts     # POST /auth/login, GET /auth/me (optional)
│       ├── auth.service.ts        # validate user, sign JWT
│       ├── strategies/
│       │   └── jwt.strategy.ts    # validate JWT, attach user to request
│       ├── guards/
│       │   └── roles.guard.ts     # check req.user.role in allowedRoles
│       └── decorators/
│           └── roles.decorator.ts  # @Roles('ADMIN','OPERATOR')
├── common/
│   └── (existing or add)
└── prisma/
```

## Backend – Implementation Steps

1. **Dependencies**  
   In `apps/api`: `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`, `bcrypt` (or `argon2`). Dev: `@types/passport-jwt`, `@types/bcrypt` if needed.

2. **Env**  
   Add to `.env.example` and use in `ConfigModule`: `JWT_SECRET`, `JWT_EXPIRES_IN` (e.g. `7d`).

3. **AuthModule**  
   - Import `JwtModule.registerAsync` (use `ConfigService` for secret and expires).  
   - Import `PassportModule`.  
   - Register `JwtStrategy` (validate JWT, load user from DB by id, attach to request).  
   - Provide `AuthService` (login: find user by email, compare password with hash, return `{ access_token }`).  
   - Controller: `POST /auth/login` body `{ email, password }`, return JWT; optionally `GET /auth/me` returning current user (for frontend to sync).

4. **User model & AuthService**  
   - Use existing Prisma `User` (email, passwordHash, role).  
   - On login: `prisma.user.findUnique({ where: { email } })`, then compare password (bcrypt/argon2).  
   - Sign JWT payload: `{ sub: user.id, email: user.email, role: user.role }`.

5. **Guards & decorators**  
   - `@Roles('ADMIN', 'OPERATOR')` decorator (set metadata).  
   - `RolesGuard` that reads metadata and checks `request.user.role`; if not in list, throw `ForbiddenException`.  
   - Apply `JwtAuthGuard` (from Passport) on protected routes; add `@UseGuards(JwtAuthGuard, RolesGuard)` and `@Roles(...)` where needed.

6. **Global or default guard**  
   Either register `JwtAuthGuard` as default for all routes and use `@Public()` for health/login, or apply guards per controller/route.

## Frontend (Next.js) – Route Protection

1. **Session → JWT for API**  
   When calling NestJS from the client, get token: use `getToken({ req })` (server) or session callback storing a backend-issued token, or call a small API route that uses NextAuth session and returns a short-lived token for the backend. Simpler: have NextAuth `authorize()` call `POST /auth/login` and store backend JWT in the session (e.g. in JWT callback), then use that in API client.

2. **API client**  
   In `lib/api.ts` (or similar): base URL from `NEXT_PUBLIC_API_BASE_URL`, attach `Authorization: Bearer <token>` from session/token. Use in React Query or fetch.

3. **Route protection by role**  
   - Middleware or layout: read session (e.g. `getServerSession`), check `session.user.role`.  
   - For `/admin` (admin-only): redirect to `/login` or `/unauthorized` if not admin.  
   - For operator/viewer areas: allow only if role is in allowed list.  
   - Optional: `RequireRole(['ADMIN','OPERATOR'])` component that shows children or redirects.

4. **Login flow**  
   Keep existing NextAuth credentials login. In `authorize()`, call NestJS `POST /auth/login` with email/password; if success, store returned JWT (and user id/role) in the NextAuth JWT/session so frontend and API client can use it.

## Checklist (copy and track)

```
Backend:
- [ ] Install JWT/Passport/bcrypt (or argon2)
- [ ] Add JWT_SECRET, JWT_EXPIRES_IN to env and ConfigModule
- [ ] AuthService: login (find user, compare password, sign JWT)
- [ ] JwtStrategy: validate token, attach user to request
- [ ] Roles decorator + RolesGuard
- [ ] POST /auth/login (public), protect other routes with JwtAuthGuard + RolesGuard
- [ ] Optional: GET /auth/me

Frontend:
- [ ] NextAuth authorize() calls backend POST /auth/login; store JWT in session
- [ ] API client attaches Authorization: Bearer <token>
- [ ] Route protection by role (middleware or RequireRole / layout checks)
- [ ] Unauthorized/forbidden page or redirect
```

## Consistency

- Use same role enum as `@smart-campaign/types` (`UserRole`: ADMIN, OPERATOR, VIEWER).
- Prisma `User.role` should match (string or enum in schema).
- API response shape: e.g. `{ access_token, user: { id, email, role } }` for login; use a consistent error format (e.g. NestJS standard exception filters).

## References

- NestJS: Auth (JWT), Guards, Custom decorators.
- NextAuth: Credentials provider, JWT callback, session callback.
- This repo: `apps/web/src/lib/auth.ts`, `apps/api/src/modules/health`, `packages/types` (UserRole).
