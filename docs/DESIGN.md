# B4F Player — Design

**Figma (source of truth):** https://www.figma.com/design/sdkcA7PebFwXQZkXxcU54Z

If this file and Figma disagree, Figma wins. If you have Figma access (MCP), read the screen before building it.

- Themes: **OLED** (default: pure black background, white text), **Light**, or **System** (follows the phone);
  6 accent colors, **purple** by default. See "Color tokens" below.
- Device frame: 360 × 800 (Android). Use flex layouts — never hardcode screen sizes.
- Font: **Inter** (Regular 400, Medium 500, Semi Bold 600, Bold 700)
- Icons: lucide style, 2px stroke, rounded caps → `lucide-react-native`

---

## Color tokens → `src/theme/palettes.ts`

Since Step 4B the colors depend on the **theme** (System / OLED / Light, default OLED) and the **accent**
(default purple), chosen in Settings. Code never imports a color directly: use `useTheme()` or `makeStyles()`.
"System" follows the phone: dark → OLED, light → Light.

### Base colors

| Token | OLED | Light | Use |
|---|---|---|---|
| `bg` | `#000000` | `#FFFFFF` | Screen background |
| `surface` | `#121212` | `#F4F4F5` | Mini player, tab bar, sheets, dialogs, setting cards |
| `surface2` | `#1E1E1E` | `#E9E9EC` | Secondary buttons, inputs, chips, artwork placeholder, segmented control track |
| `border` | `#262626` | `#E4E4E7` | Dividers, outlines, slider track |
| `progressTrack` | `#262626` | `#C4C4CA` | Empty part of the Mini Player progress line (darker in Light, so it shows on `surface2`) |
| `text` | `#FFFFFF` | `#0A0A0A` | Main text and icons |
| `textSecondary` | `#8E8E8E` | `#6B6B70` | Subtitles, meta, inactive icons |
| `textTertiary` | `#5C5C5C` | `#9A9AA0` | Section labels, inactive tabs, placeholders |
| `onPrimary` | `#FFFFFF` | `#FFFFFF` | Text/icons on `primary` |
| `scrim` | black 65% | black 40% | Layer behind sheets/dialogs |

### Accent colors

`primary` is the same in both themes. Uses: `primary` = Play button, play/pause circle, slider fill, toggles,
checkboxes, selected segment · `primarySoft` = playing row background · `primaryText` = accent text/icons on `bg`
(playing title, active tab, filled heart).

| Accent | `primary` | `primarySoft` OLED / Light | `primaryText` OLED / Light |
|---|---|---|---|
| purple (default) | `#6D28D9` | `#1F1235` / `#EDE9FE` | `#A78BFA` / `#6D28D9` |
| blue | `#2563EB` | `#0F1E3D` / `#DBEAFE` | `#93C5FD` / `#1D4ED8` |
| green | `#059669` | `#0B2A22` / `#D1FAE5` | `#6EE7B7` / `#047857` |
| orange | `#EA580C` | `#3A1A0B` / `#FFEDD5` | `#FDBA74` / `#C2410C` |
| pink | `#DB2777` | `#3A0F24` / `#FCE7F3` | `#F9A8D4` / `#BE185D` |
| red | `#DC2626` | `#3A1010` / `#FEE2E2` | `#FCA5A5` / `#B91C1C` |

### Letter-cover colors (Step 6)

Background / letter, per theme.

| Color | OLED | Light |
|---|---|---|
| purple | `#2A1A45` / `#C4B5FD` | `#EDE9FE` / `#6D28D9` |
| blue | `#13284A` / `#93C5FD` | `#DBEAFE` / `#1D4ED8` |
| teal | `#0F3330` / `#5EEAD4` | `#CCFBF1` / `#0F766E` |
| rose | `#3D1525` / `#FDA4AF` | `#FFE4E6` / `#BE123C` |
| amber | `#3A2A0F` / `#FCD34D` | `#FEF3C7` / `#B45309` |

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
| `iconLabel` | 8 | Bold | Number inside the skip back / forward icons ("10") |

Section labels (SORT BY, LIBRARY...) are uppercase with ~10% letter spacing.

---

## Components → `src/components`

| Component | Description |
|---|---|
| `TabBar` | Floating bar, `surface`, radius 32, 1px `border`, 12px side margin, 64 high. 4 tabs (icon + label): Songs (music), Playlists (list-music), Favorites (heart), Settings (**gear**). **Active:** no background behind the icon; icon `primaryText` with a bolder line (strokeWidth 2.6), label `primaryText` Semi Bold. **Inactive:** icon `textTertiary` (strokeWidth 2), label Medium. Icons keep the same size, so nothing moves when switching tabs |
| `SongRow` | Height ~64. Artwork 48 + title (15 Medium) + subtitle "Artist • 3:45 • ▶ 12" (13 `textSecondary`) + "⋯" button. **Play count** (since Step 4C): small filled play icon (12) + number in `textTertiary`, only when the count is > 0. Artist, duration and count are separate texts (bidi-safe); duration and count always stay visible, the artist is cut off first. **Playing state:** `primarySoft` background, radius 12, title `primaryText` Semi Bold, equalizer icon |
| `Artwork` | `surface2` square with a music icon in `textTertiary`. Sizes: 44, 48, 120, 296. From Step 6: the song's cover; songs without a cover get a colored placeholder with the first letter of the title |
| `MiniPlayer` | `surface2`, 1px `border`, radius 14, 8px margin (Step 5: stands out from the song list). Artwork 44, title (14 Semi Bold), artist (12), heart, **next** (Allaith's decision, not in Figma), 40px `primary` play/pause circle. 3px progress line at the bottom (`progressTrack` track, `primary` fill). **Gestures (Step 5):** tap or swipe up = open Now Playing, swipe left = next song, swipe right = previous song. The card follows the finger sideways; past 60 px it slides out in that direction and the new song slides in from the other side (~270 ms), a shorter swipe springs back; a move under 12 px stays a tap |
| `Button` | Height 44, radius 12, icon + label (15 Semi Bold). **Primary:** `primary` bg, white content. **Secondary:** `surface2` bg, white content |
| `Chip` | Pill, `surface2`, sort icon 16 + label (13 Medium) |
| `IconButton` | 44×44 round touch area, icon 24 |
| `BottomSheet` | `surface`, top radius 24, 1px `border`, handle 36×4 (`textTertiary`), scrim behind |
| `SheetOption` | Icon 20 + label 15. Selected: `surface2` bg + check icon |
| `Dialog` | Centered, width 312, `surface`, radius 24 |
| `TextInput` | Height 44–48, `surface2`, radius 12. Focused: 1.5px `primary` border |
| `Toggle` | 44×26. On: `primary` track, white knob. Off: `surface2` track |
| `SegmentedControl` | Height 44, `surface2` track, radius 12, 4px padding. Selected segment: `primary` bg (radius 8), `onPrimary` label Semi Bold. Others: `textSecondary` label |
| `AccentSwatch` | 36 circle in the accent's `primary`, inside a 44 touch area. Selected: 2px ring in `text` + white check |
| `Checkbox` | 24 round. On: `primary` + white check. Off: 2px `textTertiary` border |

---

## Screens

| # | Figma frame | Route (`src/app/`) | Notes |
|---|---|---|---|
| 01 | Permission | `permission.tsx` | Big music icon, "Access your music", Allow access (Primary), Not now |
| 02 | Songs | `(tabs)/index.tsx` | Title + search icon, "N songs" + sort chip, Play / Shuffle, song list, Mini Player |
| 03 | Sort Sheet | component (sheet) | SORT BY: Name, Date added, Most played (trending-up icon, Step 4C) · ORDER: Ascending, Descending. Chip labels: "Name · A–Z / Z–A", "Date added · Oldest / Newest", "Most played · Least / Most" (Descending = most played first; picking "Most played" switches to Descending). The "Most played" order is frozen while the list is on screen; it updates when the screen is shown again or the sort changes |
| 04 | Song Options | component (sheet) | Song header, Add to favorites, Add to playlist |
| 05 | Search | `search.tsx` | Back + input with clear, results count, song list |
| 06 | Now Playing | `player.tsx` (modal) | Slides up from the bottom (300 ms) and slides down when it closes (chevron, back button, or swipe down: follows the finger, closes after 120 px or a fast swipe, otherwise springs back; the slider never starts it). Chevron down, "NOW PLAYING / <queue>" ("All songs" or "Search results"), ⋯, artwork 296 (smaller on narrow screens), title/artist + heart, slider + times. **Controls (Allaith's decision, Layout A — differs from Figma 06b's single row):** main row skip back 10 s / previous (52) / play-pause (76) / next (52) / skip forward 10 s; under it shuffle (left) and repeat (right): active = `primaryText` + 4px dot, repeat-one uses the repeat-1 icon. Skip buttons can be turned off in Step 8. No cover → "Search for a cover" button on the artwork placeholder; with a chosen cover → "Change cover" / "Remove cover" |
| 07 | Playlists | `(tabs)/playlists.tsx` | Title + plus, "Create playlist" dashed tile, playlist rows |
| 08 | New Playlist Dialog | component (dialog) | Name input, Cancel / Create |
| 09 | Playlist Detail | `playlist/[id]/index.tsx` | Back + ⋯, cover 120, name, "8 songs · 31 min", Play / Shuffle, Add songs, list |
| 10 | Add Songs | `playlist/[id]/add-songs.tsx` (modal) | Close, "Add songs to …", Add (n) button, search, rows with checkboxes |
| 11 | Favorites | `(tabs)/favorites.tsx` | Title + search, count, Play / Shuffle, list |
| 12 | Settings | `(tabs)/settings.tsx` | LIBRARY (Rescan, Default sort) · PLAYBACK (toggles, skip buttons on/off + 5 / 10 / 15 / 30 s) · COVERS ("Download covers on Wi-Fi only", default on) · ABOUT (version) |
| 13 | Add to Playlist | component (sheet) | Song info, New playlist, playlists (check on already added) |

The Mini Player and Tab Bar show on all tab screens. The Mini Player is hidden when nothing is playing.
