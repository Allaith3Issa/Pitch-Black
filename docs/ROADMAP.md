# B4F Player — Roadmap

Work on **one step at a time**. A step is done only when every "Done when" item is true
and the app runs on a real Android phone: with **Expo Go** until Step 2B,
then with the **development build** (from Step 2B on).

Status: `[ ]` not started · `[x]` done

**Order from Step 4B on:** 4B → 4C → 5 → 7 → 8 → 6 → (one new dev build) → 9 → 10.
**Until Step 6: no new native packages.** All native work is collected in Step 6. If a step seems to need a
native package, stop and ask Allaith first. What to test after that build: see "Next build checklist" at the end.

---

## Step 0 — Design ✅
- [x] Figma design for all screens → see `docs/DESIGN.md`

## Step 1 — Setup & foundation
- [x] Folder structure from `CLAUDE.md` (`src/...`)
- [x] Theme: `src/theme` with colors, spacing, radius, typography (exact tokens from DESIGN.md)
- [x] Load Inter font; show nothing (or a black screen) until fonts are ready
- [x] Expo Router: switch the entry to `expo-router/entry`, routes in `src/app/`, remove the old `App.tsx`/`index.ts` entry
- [x] Tabs **Songs / Playlists / Favorites / Settings** in `src/app/(tabs)/` + root Stack in `src/app/_layout.tsx`
      (routes for Now Playing, Playlist Detail, Add Songs, Search can be empty placeholders for now)
- [x] Custom floating `TabBar` component matching the design (pill indicator on the active tab)
- [x] Each tab shows a placeholder screen with its title
- [x] OLED black background everywhere, light status bar

**Done when:** the app opens on Expo Go, all 4 tabs switch correctly, the tab bar looks like the design.

## Step 2 — Permission & reading songs
- [x] Permission screen (design screen 01) — request audio permission with `expo-media-library`
- [x] Handle: granted / denied / "denied forever" (button to open app settings)
- [x] Load all audio files: id, title, artist (if available), duration, uri, date added
- [x] `libraryStore` (Zustand) holds the song list + loading/error state
- [x] Songs screen shows the list with `SongRow` + song count ("248 songs")
- [x] Empty state when there are no songs

**Done when:** real songs from the phone appear in the list.
⚠️ First check that Expo Go can read **audio** with `expo-media-library` on Android 13+. If not, stop and report.
> **Note:** Expo Go cannot read audio on Android 13+ — verified on device in Step 2B.

## Step 2B — Development build & real song metadata
Why: expo-media-library does not expose title / artist / album / date added for audio.
Android's MediaStore has them, but reading them needs native code, which Expo Go cannot run.
- [x] Build with EAS Build (cloud). First check that `eas login` works from my network.
- [x] Add expo-dev-client, create the first development build, install it on the phone
      ✅ Verified on device (2B-1): permission dialog works, "Don't allow" stays on the permission screen,
      641 songs listed, durations correct (MediaStore duration is in ms), no audio under 30 s,
      "Artist - Title" filename split works (other files show no artist).
- [x] Native data source from MediaStore: prefer a small local Expo module (Kotlin) in modules/,
      unless a well-maintained library fits better — compare and ask me
      Fields: id, uri, title, artist, album, albumId, durationMs, dateAdded, filename
- [x] Keep the MIN_SONG_DURATION_SEC filter
- [x] services/mediaLibrary.ts uses the new source; keep expo-media-library only if needed for permission
- [x] parseSongFilename stays as a fallback when tags are empty or "<unknown>"
- [x] Album art: if simple, return an artwork URI with each song; otherwise leave it for Step 6
      → Left for Step 6 (needs cached thumbnails per album). `albumId` is already returned.

**Done when:** the dev build runs on my phone and songs show their real title, artist and date added.
✅ Verified on device (2B-2): 682 audio files, 641 songs ≥ 30 s (same with IS_MUSIC, so that filter is not used),
real titles and artists from MediaStore tags.

## Step 3 — Sorting & search
- [x] Sort by **Name** or **Date added**, order **Ascending** or **Descending** (Sort sheet — screen 03)
- [x] Sort chip on the Songs screen shows the current choice (e.g. "Name · A–Z")
- [x] Sort choice saved (persists after app restart)
- [x] Search screen (screen 05) — filter by title (Arabic-aware: hamza, ة/ه, ى/ي, tashkeel; Latin accents),
      live as you type, results count
- [x] SongRow subtitle: artist and "• 3:45" as separate texts (mixed Arabic/English artists kept the duration
      in the middle); the duration always stays visible
- [x] Titles that repeat the artist ("Artist - Title") show only the title (`stripArtistPrefix`)
- [x] Unit tests (jest-expo) for the pure utils; `npm test` added to "Finishing a step"

> **From the full review:** also apply the Kotlin fixes in `modules/media-store` — look up the column indexes once
> before the loop, use `Exceptions.ReactContextLost()`, filter `DURATION >= 30000` natively, and remove the
> `IS_MUSIC` column and `isMusic` field (the filter changed nothing: 641 = 641; JS already ignores it). Step 3 needs a new
> dev build anyway (AsyncStorage), so we build only once.

**Done when:** sorting and search work and the sort choice survives a restart.
✅ Verified on device: all 4 sort combinations, sort choice survives a restart, Arabic-aware title search,
still 641 songs with the native 30 s filter.

## Step 4 — Playback engine
- [x] `services/audio` wrapper around `expo-audio`
- [x] `playerStore`: queue, current index, isPlaying, position, duration
- [x] Actions: play song, pause, resume, next, previous
- [x] Tapping a song plays it and sets the queue to the current (sorted) list
- [x] "Play" button plays the list from the start
- [x] Auto-play the next song when one ends
- [x] Playing row is highlighted (`SongRow` State=Playing)
- [x] **Basic Mini Player** (moved here from Step 5, to test pause/next on the phone): above the tab bar on all tabs,
      hidden when nothing is loaded — artwork placeholder, title, artist, heart (no action yet), next, play/pause,
      thin progress line. Tapping it does nothing yet.
- [x] Song that cannot be played → short message (toast) and skip to the next one
- [x] TabBar redesign (JS only): no pill behind the active icon; active icon `primaryText` + bolder line
      (strokeWidth 2.6, inactive 2); Settings tab uses the gear icon
- [x] Native packages for Steps 4 + 5 in one dev build: `expo-audio` + its peer `expo-asset` (background playback enabled in the
      plugin, for Step 9) and `@react-native-community/slider`

> **From the full review:** check early that `expo-audio` plays the `content://` URIs from MediaStore.
> The queue holds song **ids**, not copies of songs.

**Done when:** songs play, pause, skip and continue automatically while the app is open.
✅ Verified on device: content:// URIs from MediaStore play with expo-audio; play / pause / next / previous,
auto-next, highlighted row (also after re-sorting) and the Mini Player on all tabs work.

## Step 4B — Themes & accent colors
Done now so every later screen is written theme-aware from the start. Exact tokens: see `docs/DESIGN.md`.
- [x] Theme tokens: OLED + Light palettes, 6 accents (purple, blue, green, orange, pink, red) with
      `primary` / `primarySoft` / `primaryText` per theme, letter-cover colors per theme (used in Step 6).
      Spacing, radius, sizes and typography stay static.
- [x] `settingsStore` (persisted): `themeMode` 'system' | 'oled' | 'light' (default 'oled'),
      `accent` (default 'purple')
- [x] 'system' follows the phone: dark → OLED, light → Light
- [x] `useTheme()` returns the resolved colors; components build styles with a small `makeStyles` helper
      (`useMemo`) — no hardcoded colors anywhere
- [x] Status bar and React Navigation theme follow the theme
- [x] `app.json` `userInterfaceStyle` → "automatic" (takes effect with the next dev build)
- [x] Every existing component and screen refactored to `useTheme`
- [x] Settings: APPEARANCE section at the top (Figma "12d") — Theme segmented control [System | OLED | Light]
      and 6 accent swatches (selected = ring + check). The rest of Settings stays a placeholder until Step 8.
- [x] Tests: theme resolution (system / oled / light × accent) as a pure function

> Light mode navigation bar buttons → fixed in Step 6 (needs native).

**Done when (on the phone):** switching theme and accent updates the whole app instantly, the choice survives
a restart, System follows the phone setting, nothing is hardcoded.
✅ Verified on device: theme and accent switch the whole app instantly and survive a restart, System follows
the phone. Only open point: the navigation bar buttons in Light mode (see Step 6).

## Step 4C — (scope comes with Allaith's Step 4C prompt)

## Step 5 — Now Playing & Mini Player
Step 5: slider already in the Step 4 dev build.
- [ ] (The basic Mini Player was built in Step 4.)
- [ ] Tapping Mini Player opens Now Playing (screen 06)
- [ ] Now Playing: artwork placeholder, title, artist, heart, slider (`@react-native-community/slider`), times
- [ ] Seek with the slider
- [ ] Shuffle (on/off) and Repeat (off / all / one)
- [ ] Skip back / skip forward buttons around play/pause (default 10 s; options 5 / 10 / 15 / 30 s;
      can be turned off). The setting UI comes in Step 8 — until then use the default.
- [ ] "Shuffle" button on the Songs screen

**Done when:** all controls on Now Playing work and stay in sync with the Mini Player.

## Step 7 — Favorites & Playlists
- [ ] Favorites: heart toggles in Song Options, Mini Player, Now Playing; Favorites tab lists them (screen 11)
- [ ] Song Options sheet (screen 04): Add to favorites, Add to playlist
- [ ] Add to Playlist sheet (screen 13): New playlist + list of playlists, check on playlists that already have the song
- [ ] Playlists tab (screen 07): list, Create playlist
- [ ] New Playlist dialog (screen 08)
- [ ] Playlist Detail (screen 09): Play / Shuffle, Add songs, song list, rename & delete playlist (from "⋯")
- [ ] Add Songs screen (screen 10): search + multi-select with checkboxes
- [ ] Remove a song from a playlist
- [ ] `playlistStore` + favorites saved with `persist` (survive restart)
- [ ] If a saved song no longer exists on the device, skip it safely

> **From the full review:** MediaStore ids are not stable (they change when a file is re-added, after a phone
> migration...). Store a fallback key (filename + duration) next to each id and re-match on load.
> Favorites, playlists and settings live in separate small persisted stores that hold ids only.

**Done when:** playlists and favorites work and survive an app restart.

## Step 8 — Settings
- [ ] Settings screen (screen 12)
- [ ] Rescan music library (+ "Last scan" time)
- [ ] Default sort (opens the Sort sheet)
- [ ] Resume last song on start (toggle, saved)
- [ ] "Download covers on Wi-Fi only" (toggle, default on — saved now, used by covers in Step 6)
- [ ] Skip buttons: on/off + seconds (5 / 10 / 15 / 30)
- [ ] About: app name + version from `app.json`

> **From the full review:** rescan needs a separate `isRefreshing` flag — don't replace the list with a spinner.

## Step 6 — Covers, song info, share, navigation bar (all native work)
Step 6 collects **all** native work, so there is only one new dev build (after this step).
- [ ] Cover from the audio file itself first (embedded artwork), cached in the app
- [ ] Show covers in SongRow, Mini Player, Now Playing
- [ ] Songs with no cover: colored placeholder with the first letter of the title
- [ ] First find which free cover sources (no API key) work from my network — test them before building on them
- [ ] No cover → a "Search for a cover" button **only on Now Playing**, on top of the artwork placeholder:
      searches online by artist + title, shows several options, I pick one
- [ ] A chosen cover is saved in the **app cache only** (never written into the audio file)
- [ ] After a cover is chosen, Now Playing also offers "Change cover" / "Remove cover"
- [ ] Respect the "Download covers on Wi-Fi only" setting (Step 8; default on)
- [ ] Song info sheet from the "⋯" menu: title, artist, album, duration, filename, folder, size, format,
      bitrate, date added
- [ ] Share from the "⋯" menu: Android share sheet with the audio file itself
- [ ] Light mode navigation bar buttons (found in Step 4B — light buttons on white). Exact solution:
      - `npx expo install expo-navigation-bar`
      - in `app.json` plugins: `["expo-navigation-bar", { "enforceContrast": false, "style": "light" }]`
        (`enforceContrast: false` = fully transparent bar, so the style is not ignored on 3-button navigation;
        `"light"` matches the OLED default at launch)
      - in `src/app/_layout.tsx`, next to `<StatusBar>`: `<NavigationBar style={isDark ? 'light' : 'dark'} />`
        (import `{ NavigationBar }` from `expo-navigation-bar`; the component, not the deprecated top-level `setStyle`)
      - the style is the **button** color: `'light'` = light buttons (OLED), `'dark'` = dark buttons (Light)
      - check 3-button mode: the tab bar and Mini Player stay clear of the buttons

**Then: one new dev build** → go through the "Next build checklist" below.

## Step 9 — Background playback
`enableBackgroundPlayback` is already on in the `expo-audio` plugin since the Step 4 dev build, so this step may be
JS only (`shouldPlayInBackground`, `setActiveForLockScreen`). Check that first.
- [ ] Background playback (`expo-audio`)
- [ ] Media notification + lock screen controls
- [ ] Re-test everything on the dev build

## Step 10 — Polish & release
- [ ] App icon + splash screen (black, B4F Player)
- [ ] Clean up code, final lint/typecheck
- [ ] README: screenshots, features, tech stack, how to run
- [ ] Build the final APK

> **From the full review:** remove the iOS/web config from `app.json`; add `preview` and `production`
> profiles to `eas.json`.

---

## Next build checklist
What to test on the phone after the next dev build (end of Step 6). Add to it whenever a step leaves
something for that build.
- [ ] Navigation bar buttons: light on OLED, dark on Light, switch instantly, follow the phone on System
- [ ] Navigation bar in **3-button mode** and gesture mode: no gray band, tab bar and Mini Player stay clear
      of the buttons, buttons readable in both themes
- [ ] Cold start in Light mode: buttons may be light for a moment before JS runs (plugin starts with "light")
- [ ] `userInterfaceStyle: "automatic"` (Step 4B): System theme still follows the phone; OLED / Light still forced
- [ ] All Step 6 native features (covers, song info, share) on the new build
- [ ] Quick re-test of everything before: playback, sorting, search, themes, favorites, playlists, settings

---

## Ideas for later
Not planned for now.
- Set a song as ringtone / notification sound
