# B4F Player — Roadmap

Work on **one step at a time**. A step is done only when every "Done when" item is true
and the app runs on a real Android phone with **Expo Go**.

Status: `[ ]` not started · `[x]` done

---

## Step 0 — Design ✅
- [x] Figma design for all screens → see `docs/DESIGN.md`

## Step 1 — Setup & foundation
- [ ] Folder structure from `CLAUDE.md` (`src/...`)
- [ ] Theme: `src/theme` with colors, spacing, radius, typography (exact tokens from DESIGN.md)
- [ ] Load Inter font; show nothing (or a black screen) until fonts are ready
- [ ] Expo Router: switch the entry to `expo-router/entry`, routes in `src/app/`, remove the old `App.tsx`/`index.ts` entry
- [ ] Tabs **Songs / Playlists / Favorites / Settings** in `src/app/(tabs)/` + root Stack in `src/app/_layout.tsx`
      (routes for Now Playing, Playlist Detail, Add Songs, Search can be empty placeholders for now)
- [ ] Custom floating `TabBar` component matching the design (pill indicator on the active tab)
- [ ] Each tab shows a placeholder screen with its title
- [ ] OLED black background everywhere, light status bar

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

## Step 3 — Sorting & search
- [ ] Sort by **Name** or **Date added**, order **Ascending** or **Descending** (Sort sheet — screen 03)
- [ ] Sort chip on the Songs screen shows the current choice (e.g. "Name · A–Z")
- [ ] Sort choice saved (persists after app restart)
- [ ] Search screen (screen 05) — filter by title and artist, live as you type, results count

**Done when:** sorting and search work and the sort choice survives a restart.

## Step 4 — Playback engine
- [ ] `services/audio` wrapper around `expo-audio`
- [ ] `playerStore`: queue, current index, isPlaying, position, duration
- [ ] Actions: play song, pause, resume, next, previous
- [ ] Tapping a song plays it and sets the queue to the current (sorted) list
- [ ] "Play" button plays the list from the start
- [ ] Auto-play the next song when one ends
- [ ] Playing row is highlighted (`SongRow` State=Playing)

**Done when:** songs play, pause, skip and continue automatically while the app is open.

## Step 5 — Now Playing & Mini Player
- [ ] Mini Player above the tab bar (screen 02) — title, artist, heart, play/pause, thin progress line
- [ ] Tapping Mini Player opens Now Playing (screen 06)
- [ ] Now Playing: artwork placeholder, title, artist, heart, slider (`@react-native-community/slider`), times
- [ ] Seek with the slider
- [ ] Shuffle (on/off) and Repeat (off / all / one)
- [ ] "Shuffle" button on the Songs screen

**Done when:** all controls on Now Playing work and stay in sync with the Mini Player.

## Step 6 — Album art
- [ ] Investigate how to get embedded album art for local audio files in Expo Go
- [ ] If possible: show it in SongRow, Mini Player, Now Playing
- [ ] If not possible in Expo Go: keep the placeholder and write the findings in the summary (revisit in Step 9)

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

**Done when:** playlists and favorites work and survive an app restart.

## Step 8 — Settings
- [ ] Settings screen (screen 12)
- [ ] Rescan music library (+ "Last scan" time)
- [ ] Default sort (opens the Sort sheet)
- [ ] Resume last song on start (toggle, saved)
- [ ] About: app name + version from `app.json`

## Step 9 — Development build & background playback
- [ ] Create a development build with EAS (only when Allaith asks)
- [ ] Background playback (`expo-audio` config plugin)
- [ ] Media notification + lock screen controls
- [ ] Re-test everything on the dev build

## Step 10 — Polish & release
- [ ] App icon + splash screen (black, B4F Player)
- [ ] Clean up code, final lint/typecheck
- [ ] README: screenshots, features, tech stack, how to run
- [ ] Build the final APK
