# QuickCart Deployment Runbook

Two separately-deployable packages, each built and run in its own Node
process on the developer's own machine. No hosting provider, registry, or
managed CI is assumed.

## apps/backend (Express API)

```
cd apps/backend
npm install
npm run build          # tsc -p tsconfig.json -> dist/server.js
PORT=4000 \
ALLOWED_ORIGINS=http://localhost:5173 \
PAYMENT_PROVIDER=mock \
node dist/server.js
```

- Listens on `process.env.PORT` (falls back to 4000 for local dev — never
  hardcoded).
- Env vars:
  - `PORT` — default `4000`.
  - `ALLOWED_ORIGINS` — comma-separated frontend origin(s) allowed to call
    the API. Local default: `http://localhost:5173`.
  - `PAYMENT_PROVIDER` — `mock` (default, no network calls) or `stripe`.
  - `STRIPE_SECRET_KEY` — required only if `PAYMENT_PROVIDER=stripe`. Never
    commit a real value; leave unset to use the mock provider.
- Verify: `curl http://localhost:4000/health` returns `200 OK`.

## apps/frontend (React SPA via Vite)

```
cd apps/frontend
npm install
VITE_BACKEND_URL=http://localhost:4000 npm run build   # tsc --noEmit && vite build -> dist/
PORT=5173 npx serve -s dist -l $PORT
```

- Listens on `$PORT` (dev fallback 5173).
- Env vars:
  - `VITE_BACKEND_URL` — base URL of the backend API, baked in at build
    time. Local default: `http://localhost:4000`. Set this to the
    backend's actual `BACKEND_URL` before running `npm run build` when
    deploying against a non-default backend.
- Verify: open `http://localhost:5173/` in a browser — the product list
  loads (fetched from the backend); add an item and open `/cart` to
  confirm the cart page renders and checkout calls succeed (mock
  provider auto-approves).

## Order of operations

1. Build and start the backend first (it has no dependency on the
   frontend).
2. Build the frontend with `VITE_BACKEND_URL` pointed at the running
   backend, then start it with `serve`.
3. Confirm both health checks above before routing any traffic.

## Rollback

Both packages are stateless builds — rollback is "run the previous build":

1. Stop the running `node dist/server.js` / `serve -s dist` process
   (Ctrl-C or `kill <pid>`).
2. `git checkout <previous-good-commit-or-tag>` in the affected package
   directory (or `git revert` the merge commit at the repo root).
3. Re-run the install/build/start commands above for that package only —
   the other package is unaffected since they deploy independently.
4. Re-verify with the `/health` check (backend) and the browser check
   (frontend) before considering rollback complete.

No database/migration state is involved (in-memory catalog, mock payment
provider), so rollback is purely a matter of restarting the previous code.

## CI

`.github/workflows/sdlc-verify.yml` runs install/build/test for both
packages on every push/PR. It does not deploy anywhere — go-live only
happens when a human approves the merge.
