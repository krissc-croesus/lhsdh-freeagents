# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

LHSDB Free Agents — an Angular 14 web app used once a year during a fantasy/sim hockey league's (LHSDB) free-agency period. It lets team managers browse all free agents, manage their own team's free agents, send/track contract offers during negotiations, and view team salary caps. Non-owners/admins can view a league-wide teams summary and results.

The app has a strong seasonal lifecycle: each year the "market" opens for a window and is then closed. Git history reflects this ("fermeture agents libres 2023/2024", "feat: update 2025", "fix: fermeture fa 2025"). When the market is closed, `OffersService.sendNewContractOffer` and `removeOffer` are short-circuited to just show a "market closed" alert (`Le marché des agents libres est maintenant fermé`) instead of hitting the API — check `src/app/services/offers.service.ts` for the current state of this toggle before assuming offer-related features are live.

## Commands

- `npm start` / `ng serve` — dev server at `http://localhost:4200`.
- `ng build` — dev build to `dist/lhsdb-freeagents`; `ng build --configuration production` for the production build (enables optimization, hashing, budgets — see `angular.json`).
- `ng test` — unit tests via Karma/Jasmine, watches by default. Run once via `ng test --watch=false`. Run a single spec by narrowing `--include`, e.g. `ng test --watch=false --include='**/all-free-agents.component.spec.ts'`.
- `ng lint` — TSLint (`tslint.json`, extends `tslint:recommended` + `codelyzer`).
- `ng e2e` — Protractor end-to-end tests (config in `e2e/protractor.conf.js`).

There is no CI workflow in this repo (no `.github/workflows`); linting/tests are run manually.

## Architecture

Classic Angular CLI (v14) module-based app — no standalone components. Single `AppModule` (`src/app/app.module.ts`) declares every component and imports Angular Material modules individually (no shared Material module). Routing is flat, defined in `src/app/app-routing.module.ts`; most routes are guarded by `AuthGuard`.

**Layout of `src/app/`:**
- `views/` — route-level page components (login, my-free-agents, my-salary-cap, negotiations, adm-teams-summary, results, my-salary-cap).
- `widgets/` — smaller reusable components embedded inside views/tables (player-detail, nego-player-detail, table-player-detail, offer-sender, player-result).
- `all-free-agents/` — the one route-level component that lives outside `views/` (historical inconsistency, not a mistake to "fix" reflexively).
- `services/` — `PlayersService` and `OffersService` talk to the backend REST API; `PlayerMapperService` converts backend DTOs to frontend models; `SalaryScaleService` computes expected salary ranges and RFA compensation tiers; `AlertServiceService` wraps `MatSnackBar` for user-facing toasts.
- `models/` — frontend domain models (`Player`, `Team`, `Offer`) plus `models/backend/playerResponse.ts` for the raw API DTO shape.
- `interceptors/` — `JwtInterceptor` attaches the Amplify Cognito access token as a Bearer header to every request; `ErrorInterceptor` force-signs-out the user on a 401 response. Registered together via `HttpInterceptorProviders` in `interceptor-provider.ts`.

**Auth**: AWS Amplify (`aws-amplify`, `aws-amplify-angular`, `@aws-amplify/ui-angular`) backed by Cognito. `AuthGuard` (`src/app/auth.guard.ts`) calls `Auth.currentAuthenticatedUser()` to gate routes and redirects to `/login` on failure. Components read the signed-in user's team via `Auth.currentUserInfo()` → `info.attributes['custom:team']` (see `all-free-agents.component.ts`), not via a dedicated user/session service.

**Backend API**: A separate REST API (not in this repo), currently hosted on AWS Elastic Beanstalk. The base URL is **hardcoded as a class field directly in each service** (`PlayersService.PLAYER_RESSOURCE_URL`, `OffersService.OFFERS_RESSOURCE_URL`) rather than sourced from `src/environments/*` — those environment files only carry a `production` boolean. When the backend moves or a different environment is needed, the URL constants in the services are edited directly (and old URLs left commented above as history) — this is the existing convention, not a bug to clean up unless asked.

**Player data flow**: API returns `PlayerResponse` DTOs → `PlayerMapperService.playerResponseToPlayer()` maps them to the `Player` model, resolving: `team` via a hardcoded switch on numeric team IDs (`mapTeam`), `status` (`Signed` / `RFA` / `UFA` / `35+`) via age + free-agent flag (`mapStatus`), and `expectedSalary` via `SalaryScaleService` (OVK-rating-based salary bands, different curves for goalies vs. skaters, with a `35+` override). Team ID → city/name/abbreviation mappings live only in `PlayerMapperService.mapTeam` — update there when teams relocate/rename (see the recent Utah Mammoth naming fix).

**Locale**: App-wide locale is forced to `fr-ca` (`LOCALE_ID` provider in `app.module.ts`, plus French locale data registered for `Intl`/pipes). UI copy and user-facing alert strings are written in French — match that when adding new user-facing text.

**Styling**: Bootstrap 4 + Angular Material (`purple-green` prebuilt theme) loaded globally in `angular.json`; no CSS-in-JS.
