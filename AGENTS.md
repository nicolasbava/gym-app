# AGENTS.md

## Cursor Cloud specific instructions

### Overview

This is **Luxion** — a gym/fitness management PWA built with Next.js 16 (App Router), React 19, Supabase (hosted), Shadcn UI, and Tailwind CSS 4. The UI is in Spanish. Coaches manage exercises, routines, and members; members view assigned workouts.

### Running the app

- `yarn dev` starts the dev server on port 3000.
- The app requires a `.env.local` file with Supabase credentials. See `SUPABASE_GOOGLE_SETUP.md` for the public URL and publishable key values.
- Required env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`, `NEXT_PUBLIC_SITE_URL`.
- `SUPABASE_SERVICE_ROLE_KEY` is needed only for admin operations (user invites). The app starts and most features work without it.

### Build and lint

- `yarn build` — production build (uses Turbopack).
- `yarn lint` runs `next lint`, but **Next.js 16 removed the built-in `lint` command**. This script currently does not work. There is no separate ESLint config in the repo.

### Key caveats

- The backend is a **hosted Supabase instance** — there is no local database or Docker setup. All data flows through the remote Supabase project.
- Both `yarn.lock` and `pnpm-lock.yaml` exist; **yarn is the primary package manager** (`pnpm-lock.yaml` is nearly empty).
- The project has a React dev-mode warning in `AuthGuard` ("Cannot update a component (Router) while rendering a different component"). This is a pre-existing issue in the codebase, not caused by environment setup.
