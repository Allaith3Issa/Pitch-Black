# B4F Player — Rules for Claude Code

B4F Player is an **Android-only** music player built with **React Native + Expo (SDK 58) + TypeScript**.
It plays audio files stored on the user's device. No backend, no accounts, no streaming.

The project owner (Allaith) is learning. He reviews every change, so code must be clear,
small and easy to read. You write the code; he reviews it.

Also follow the Expo rules in @AGENTS.md (versioned docs, `npx expo install`, typecheck/lint).

Read these before working on any step:
- @docs/ROADMAP.md — the steps, their scope and "done" criteria
- @docs/DESIGN.md — design tokens, components and screens (Figma is the source of truth)

---

## 1. How we work (most important)

- Work on **ONE step at a time** — only the step Allaith asks for. Never start the next step on your own.
- Stay inside the step's scope. If you notice something that belongs to another step, write it under
  "Notes for later" in your summary instead of doing it.
- Before writing code for a step, give a **short plan** (files you will create/change, packages you will install)
  and wait for Allaith's OK.
- If something is unclear or a decision is needed, **ask** — do not guess.
- If a feature cannot work in **Expo Go**, stop and explain why. Do not add hacks or workarounds without approval.

## 2. Tech stack (decided — do not change)

| Area | Choice |
|---|---|
| Framework | Expo SDK 58, Expo Go for testing (dev build only in Step 9) |
| Language | TypeScript, `strict: true` |
| Navigation | **Expo Router** (file-based routing, routes in `src/app/`) — see AGENTS.md |
| State | **Zustand** (+ `persist` middleware with AsyncStorage for saved data) |
| Audio | `expo-audio` |
| Reading songs | `expo-media-library` (audio only) |
| Storage | `@react-native-async-storage/async-storage` |
| Icons | `lucide-react-native` (+ `react-native-svg`) |
| Font | Inter (`@expo-google-fonts/inter`) |

- Install every package with `npx expo install <pkg>` so versions match SDK 58.
- Before installing a package, say **what** it is and **why** it is needed. Do not add packages that are not needed for the current step.
- Platform: **Android only**. Do not write iOS-specific or web-specific code.

## 3. Project structure

```
src/
  app/                  → ROUTES ONLY (Expo Router). Every file here is a screen.
    _layout.tsx         → root Stack: fonts, providers, status bar
    permission.tsx      → screen 01
    (tabs)/
      _layout.tsx       → Tabs with the custom TabBar
      index.tsx         → Songs (screen 02)
      playlists.tsx     → screen 07
      favorites.tsx     → screen 11
      settings.tsx      → screen 12
    player.tsx          → Now Playing (screen 06, modal)
    search.tsx          → screen 05
    playlist/
      [id]/index.tsx    → Playlist Detail (screen 09)
      [id]/add-songs.tsx→ Add Songs (screen 10, modal)
  components/           → reusable UI (SongRow, MiniPlayer, TabBar, Button, Chip, BottomSheet, ...)
  features/             → bigger screen pieces used by routes (e.g. songs/SongList.tsx)
  store/                → Zustand stores (playerStore, libraryStore, playlistStore, settingsStore)
  services/             → non-UI logic (audio player, media library access)
  hooks/                → custom hooks
  theme/                → colors, spacing, radius, typography (tokens from DESIGN.md)
  types/                → shared TypeScript types (Song, Playlist, SortOption, ...)
  utils/                → small pure helpers (formatDuration, sortSongs, ...)
```

- Keep route files in `src/app/` **thin**: they read params/stores and render components. No business logic there.
- Never put components, hooks or utils inside `src/app/` (every file there becomes a route).
- Navigate with `router.push(...)` / `<Link>` from `expo-router`; read params with `useLocalSearchParams`. Use typed routes.
Put new files in the right folder. Do not create new top-level folders without asking.

## 4. Code rules

- **TypeScript:** no `any`, no `@ts-ignore`. Type props, store state and function returns.
- **Components:** function components + hooks only. One component per file. File name = component name (PascalCase).
- **Small files:** if a file grows past ~200 lines, split it.
- **Styling:** `StyleSheet.create`. **Never hardcode colors, font sizes, spacing or radius** — always import from `src/theme`.
- **UI text:** English only.
- **Naming:** `camelCase` for variables/functions, `PascalCase` for components/types, `useXxx` for hooks, `xxxStore` for stores.
- **Logic out of screens:** screens compose components and read stores. Audio/media logic lives in `services/` and stores.
- **Comments:** only where the code is not obvious. Write them in simple English.
- **No dead code:** no commented-out code, no unused imports, no `console.log` left behind.
- **Errors:** handle permission denial, empty library and unreadable files with a clear message on screen — never crash.
- **Performance:** use `FlatList` for song lists (never `.map` inside a ScrollView). Select only the store slices you need in Zustand.

## 5. Finishing a step

When the step is done, in this order:

1. Run `npx tsc --noEmit` and `npx expo lint` — fix every error.
2. Run the `step-reviewer` subagent (`.claude/agents/step-reviewer.md`) and fix every ❌ item it reports.
   Mention its ⚠️ items in the summary.
3. Write a summary (in English) with:
   - **What was done** (short bullets)
   - **Files** created / changed
   - **Packages** installed and why
   - **How to test on Expo Go** (exact steps on the phone)
   - **Notes for later** (anything out of scope you noticed)
4. Update the step's checkbox in `docs/ROADMAP.md` to `[x]`.
5. Make **one commit** for the step (see Git rules).

## 6. Git rules

- Commit on the current branch after finishing a step. **Do not push** — Allaith pushes himself.
- Use Conventional Commits: `feat: ...`, `fix: ...`, `chore: ...`, `refactor: ...`, `docs: ...`
  Example: `feat(step-2): load device songs with expo-media-library`
- **Never add `Co-Authored-By`, "Generated with Claude Code", or any AI attribution** to commit messages or PRs.
  The commit must look like Allaith wrote it.
- Never change git config (`user.name`, `user.email`), never force-push, never rewrite history.
- Never commit `node_modules/`, `.env` files, keystores or build output.

## 7. Never do this

- Never run `npm audit fix --force` (breaks Expo dependency versions).
- Never create or edit `android/` or `ios/` folders by hand.
- Never run `eas build` or `npx expo prebuild` before Step 9 — and only when Allaith asks.
- Never delete files you did not create in this step without asking.
