# Contributing to TransitOps

> This is a hackathon project. These rules exist to prevent merge conflicts and keep the team moving fast.

---

## Branch Model

| Branch | Purpose |
|--------|---------|
| `main` | Stable releases only — never commit directly |
| `develop` | Integration branch — all pull requests target here |
| `feature/jagdeep-backend` | Jagdeep's backend foundation work |
| `backend/lacki` | Lacki's module implementation |
| `frontend/tanya` | Tanya's frontend work |
| `frontend/niharika` | Niharika's frontend work |

---

## Workflow Rules

1. **Pull `develop` before starting any work session.**

   ```bash
   git checkout develop
   git pull origin develop
   git checkout your-branch
   git merge develop
   ```

2. **Work only on your assigned branch.** Do not commit to another person's branch.

3. **Commit working code every hour.** Partial work is fine — broken imports are not.

4. **Never commit `.env` files.** Only `.env.example` files are committed.

5. **Do not push directly to `main`.** All changes go through pull requests to `develop`.

6. **Pull requests target `develop`.** Jagdeep reviews and merges.

7. **Resolve conflicts locally** before opening a pull request.

8. **Test before pushing.** At minimum, confirm the server starts and `/api/health` responds.

---

## Commit Message Format

```
type(scope): short description
```

| Type | When to use |
|------|-------------|
| `chore` | Setup, config, tooling, dependencies |
| `feat` | New feature or endpoint |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `refactor` | Code restructure without behaviour change |
| `test` | Adding or updating tests |

### Examples

```
chore(backend): initialize Express Prisma MySQL architecture
feat(auth): implement JWT authentication and RBAC
feat(vehicle): add vehicle CRUD API
feat(driver): add driver management API
feat(trips): implement trip dispatch workflow
fix(trips): prevent duplicate vehicle assignment on dispatch
fix(maintenance): correct status transition validation
docs(api): update endpoint contract for vehicles
refactor(services): extract shared pagination helper
```

---

## Code Standards

### Backend (Jagdeep, Lacki)

- ES Modules only — no `require()`, no `module.exports`
- One `PrismaClient` instance — import from `src/config/prisma.js`
- All async controllers wrapped with `asyncHandler`
- All operational errors thrown as `ApiError`
- All success responses use `ApiResponse.send(res)`
- Business logic in services, not in routes or controllers
- Use Prisma transactions for multi-table writes

### Frontend (Tanya, Niharika)

- Use `VITE_API_URL` from `.env` — never hardcode `localhost:5000`
- Use the exact field names from `docs/API.md`
- Parse decimal strings with `parseFloat()` before arithmetic
- Handle both `success: true` and `success: false` response shapes
- Store JWT token in memory or `localStorage` — never in a cookie without `httpOnly`

---

## Pull Request Checklist

Before opening a PR to `develop`:

- [ ] Pulled latest `develop` and resolved conflicts
- [ ] Server starts without errors
- [ ] `GET /api/health` returns HTTP 200
- [ ] No `.env` files staged
- [ ] No `console.log` debug statements left in production paths
- [ ] Commit message follows the format above
