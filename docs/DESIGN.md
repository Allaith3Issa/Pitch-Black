# B4F Player — Design

**Figma (source of truth):** https://www.figma.com/design/sdkcA7PebFwXQZkXxcU54Z

If this file and Figma disagree, Figma wins. If you have Figma access (MCP), read the screen before building it.

- Theme: **OLED** — pure black background, white text, **dark purple** accent
- Device frame: 360 × 800 (Android). Use flex layouts — never hardcode screen sizes.
- Font: **Inter** (Regular 400, Medium 500, Semi Bold 600, Bold 700)
- Icons: lucide style, 2px stroke, rounded caps → `lucide-react-native`

---

## Color tokens → `src/theme/colors.ts`

| Token | Hex | Use |
|---|---|---|
| `bg` | `#000000` | Screen background (true black) |
| `surface` | `#121212` | Mini player, tab bar, sheets, dialogs, setting cards |
| `surface2` | `#1E1E1E` | Secondary buttons, inputs, chips, artwork placeholder |
| `border` | `#262626` | Dividers, outlines, slider track |
| `primary` | `#6D28D9` | **Accent (dark purple):** Play button, play/pause circle, slider fill, toggles, checkboxes |
| `onPrimary` | `#FFFFFF` | Text/icons on `primary` |
| `primarySoft` | `#1F1235` | Playing row background, active tab pill |
| `primaryText` | `#A78BFA` | Purple text/icons on black (playing title, active tab, filled heart) |
| `text` | `#FFFFFF` | Main text and icons |
| `textSecondary` | `#8E8E8E` | Subtitles, meta, inactive icons |
| `textTertiary` | `#5C5C5C` | Section labels, inactive tabs, placeholders |

Scrim behind sheets/dialogs: `bg` at 65% opacity.

## Spacing, radius → `src/theme/spacing.ts`

- **Spacing:** 4, 8, 12, 16, 24, 32 (screen side padding = 16)
- **Radius:**

| Token | Value | Use |
|---|---|---|
| `sm` | 8 | Small artwork (48) |
| `md` | 12 | Buttons, rows, inputs, playlist covers |
| `lg` | 16 | Setting cards, playlist hero cover |
| `xl` | 24 | Bottom sheets (top corners), dialogs, Now Playing artwork |
| `tabBar` | 32 | Floating tab bar |
| `pill` | 999 | Chips, round buttons |

## Typography → `src/theme/typography.ts`

| Token | Size | Weight | Use |
|---|---|---|---|
| `screenTitle` | 30 | Bold | "Songs", "Playlists"... |
| `heroTitle` | 26 | Bold | Playlist name, permission title |
| `playerTitle` | 24 | Bold | Song title on Now Playing |
| `dialogTitle` | 20 | Bold | Dialog titles |
| `sheetTitle` | 18 | Bold | Sheet / top bar titles |
| `itemTitle` | 16 | Semi Bold | Playlist rows, player artist (Regular) |
| `body` | 15 | Medium | Song titles, options, buttons (Semi Bold) |
| `bodySmall` | 13 | Regular / Medium | Subtitles, meta, chip |
| `caption` | 12 | Regular / Semi Bold | Times, section labels |
| `tabLabel` | 11 | Medium (active: Semi Bold) | Tab bar labels, "NOW PLAYING" |

Section labels (SORT BY, LIBRARY...) are uppercase with ~10% letter spacing.

---

## Components → `src/components`

| Component | Description |
|---|---|
| `TabBar` | Floating bar, `surface`, radius 32, 1px `border`, 12px side margin, 64 high. 4 tabs (icon + label). Active tab: icon inside a 56×30 `primarySoft` pill, icon + label `primaryText`. Inactive: `textTertiary` |
| `SongRow` | Height ~64. Artwork 48 + title (15 Medium) + subtitle "Artist • 3:45" (13 `textSecondary`) + "⋯" button. **Playing state:** `primarySoft` background, radius 12, title `primaryText` Semi Bold, equalizer icon |
| `Artwork` | `surface2` square with a music icon in `textTertiary`. Sizes: 44, 48, 120, 296 |
| `MiniPlayer` | `surface`, radius 14, 8px margin. Artwork 44, title (14 Semi Bold), artist (12), heart, 40px `primary` play/pause circle. 2px progress line at the bottom (`border` track, `primary` fill) |
| `Button` | Height 44, radius 12, icon + label (15 Semi Bold). **Primary:** `primary` bg, white content. **Secondary:** `surface2` bg, white content |
| `Chip` | Pill, `surface2`, sort icon 16 + label (13 Medium) |
| `IconButton` | 44×44 round touch area, icon 24 |
| `BottomSheet` | `surface`, top radius 24, 1px `border`, handle 36×4 (`textTertiary`), scrim behind |
| `SheetOption` | Icon 20 + label 15. Selected: `surface2` bg + check icon |
| `Dialog` | Centered, width 312, `surface`, radius 24 |
| `TextInput` | Height 44–48, `surface2`, radius 12. Focused: 1.5px `primary` border |
| `Toggle` | 44×26. On: `primary` track, white knob. Off: `surface2` track |
| `Checkbox` | 24 round. On: `primary` + white check. Off: 2px `textTertiary` border |

---

## Screens

| # | Figma frame | Route (`src/app/`) | Notes |
|---|---|---|---|
| 01 | Permission | `permission.tsx` | Big music icon, "Access your music", Allow access (Primary), Not now |
| 02 | Songs | `(tabs)/index.tsx` | Title + search icon, "N songs" + sort chip, Play / Shuffle, song list, Mini Player |
| 03 | Sort Sheet | component (sheet) | SORT BY: Name, Date added · ORDER: Ascending, Descending |
| 04 | Song Options | component (sheet) | Song header, Add to favorites, Add to playlist |
| 05 | Search | `search.tsx` | Back + input with clear, results count, song list |
| 06 | Now Playing | `player.tsx` (modal) | Chevron down, "NOW PLAYING / All songs", ⋯, artwork 296, title/artist + heart, slider + times, shuffle / prev / play-pause (76) / next / repeat |
| 07 | Playlists | `(tabs)/playlists.tsx` | Title + plus, "Create playlist" dashed tile, playlist rows |
| 08 | New Playlist Dialog | component (dialog) | Name input, Cancel / Create |
| 09 | Playlist Detail | `playlist/[id]/index.tsx` | Back + ⋯, cover 120, name, "8 songs · 31 min", Play / Shuffle, Add songs, list |
| 10 | Add Songs | `playlist/[id]/add-songs.tsx` (modal) | Close, "Add songs to …", Add (n) button, search, rows with checkboxes |
| 11 | Favorites | `(tabs)/favorites.tsx` | Title + search, count, Play / Shuffle, list |
| 12 | Settings | `(tabs)/settings.tsx` | LIBRARY (Rescan, Default sort) · PLAYBACK (toggles) · ABOUT (version) |
| 13 | Add to Playlist | component (sheet) | Song info, New playlist, playlists (check on already added) |

The Mini Player and Tab Bar show on all tab screens. The Mini Player is hidden when nothing is playing.
