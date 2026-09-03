# Handoff: Krambua — tilsett-app og leiarvising

## Overview

A staff app for **Krambua i Skånevik**, a small Norwegian general store with 6–15 employees.
Two surfaces, one product:

1. **Employee app (phone)** — log in with a personal username + password, work through
   the checklist the manager made for today, read messages from the manager, chat with
   colleagues, and look up routines/rules/forms in a handbook.
2. **Manager web view (desktop)** — see who is working and how far they've got, build
   checklists per person per day (including days in the future), post messages to
   everyone, edit the handbook, manage staff logins.

Interface language is **Norwegian Nynorsk**. Bokmål must be selectable — see *Localisation*.

## About the Design Files

The files in this bundle are **design references created in HTML** — prototypes showing
intended look and behaviour, **not production code to copy directly**.

`Krambua.dc.html` is authored in a streaming component format specific to the design
tool it was made in. Do **not** try to port that format. Read it for structure, exact
values, and copy; then **recreate the screens in your target environment** (React
Native / Expo, Next.js, SwiftUI, Flutter — whatever suits) using that stack's own
patterns and component library.

`Krambua-app.html` is a single self-contained file that runs in any browser — open it
to click through the whole prototype and see the intended behaviour first-hand. Start there.

## Fidelity

**High-fidelity.** Colors, typography, spacing, radii and copy are final and come from a
defined design system (Nocturne — see *Design Tokens*). Recreate the UI faithfully.
Where the target platform has strong native conventions (iOS tab bars, Android back
behaviour), follow the platform and keep the visual tokens.

## Platform

The prototype shows an iPhone frame and a desktop browser, but the intended build is a
**responsive web app installable to the home screen (PWA)** — this avoids app-store
review and lets staff install it from a link. The employee screens are designed at
**402 × 874 CSS px**; the manager view at **1180 px wide** and up.

---

## Screens / Views — Employee app

Container: full-bleed, background `#161826`, no page scroll. A fixed header at top, a
scrolling content region, a fixed tab bar at the bottom. Content region horizontal
padding **20px**.

### 1. Login

- **Purpose**: authenticate with a username issued by the manager.
- **Layout**: single column, padding `96px 30px 40px`, flex column.
- **Components**:
  - Brand mark: 44×44, `border-radius: 12px`, 1px border `#9184d9`, containing a 14×14
    `#9184d9` square with `border-radius: 3px`. Margin-bottom 26px.
  - Kicker: "Krambua i Skånevik" — 11px, `letter-spacing: .12em`, uppercase, `#9184d9`.
  - Heading: "God morgon." — 30px, weight 500, `letter-spacing: -.02em`, line-height 1.1.
  - Sub: "Logg på med brukarnamnet du fekk av Kari." — 14px, `rgba(233,233,237,.6)`.
  - Two fields (Brukarnamn, Passord). Label 12px `rgba(233,233,237,.7)`, 6px below.
    Input: full width, `min-height: 44px`, padding `8px 12px`, font 15px, color `#e9e9ed`,
    background `#232532`, 1px border `rgba(233,233,237,.16)`, `border-radius: 8px`,
    `caret-color: #9184d9`. Placeholders "ingrid.vik" / "••••••••".
  - Primary button "Logg inn": `min-height: 48px`, full width, transparent background,
    1px border `#9184d9`, text `#9184d9` 15px weight 500, `border-radius: 8px`.
    Hover `rgba(145,132,217,.12)`, active `rgba(145,132,217,.22)`.
    **Primary actions in this system are outlined, never filled.**
  - "Gløymt passord?" — 13px, `rgba(233,233,237,.5)`, centred, 14px below the button.
  - Language switch, pinned to the bottom (`margin-top: auto`): caption "Språk i appen"
    11px `rgba(233,233,237,.4)`, then a segmented control — inline-flex, 1px border
    `rgba(233,233,237,.16)`, `border-radius: 8px`, overflow hidden; each option padding
    `9px 18px`, 13px; divider is a 1px left border on the second option. Selected option:
    text `#9184d9` + `box-shadow: inset 0 0 0 1px #9184d9`. Unselected:
    `rgba(233,233,237,.6)`, no ring.

### 2. App header (persistent, all four tabs)

Padding `60px 20px 12px` (the 60px clears the phone status bar; use safe-area insets).
Flex row, gap 12px:
- Avatar: 36×36 circle, background `#423a6a`, text `#d2cefd`, 13px weight 600, initials.
- Title "Hei, Ingrid" 15px weight 500; sub "Onsdag 3. september · vakt 06.30–14.00"
  11.5px `rgba(233,233,237,.5)`.
- Log-out icon button: 36×36, `border-radius: 8px`, 1px border `rgba(233,233,237,.16)`,
  hover `rgba(233,233,237,.07)`. Phosphor "sign-out" icon, 16px, stroke
  `rgba(233,233,237,.7)`, stroke-width 1.7.

### 3. Tab bar (persistent)

Background `#1b1d2b`, top border 1px `rgba(233,233,237,.1)`, padding `8px 6px 28px`
(bottom padding clears the home indicator — use safe-area insets). Four equal flex items,
each a column: 21px Phosphor icon over a 10px label, gap 5px, padding `6px 0`.
Active color `#9184d9`; inactive `rgba(233,233,237,.45)`. Icons use `currentColor`.

Tabs: **Heim** (house) · **Sjekkliste** (check-square) · **Meldingar** (chat) ·
**Handbok** (book-open).

Unread badge on Meldingar: absolutely positioned `top: 4px; right: 24px`, `min-width: 16px`,
height 16px, `border-radius: 8px`, background `#9184d9`, text `#161826` 10px weight 600.

**Hit targets are ≥44px throughout — staff use this with wet or cold hands.**

### 4. Heim

Content padding `8px 20px 28px`, flex column, gap 16px.

- **Today's-list card** (tappable → Sjekkliste): `border-radius: 8px`, background
  `#232532`, `box-shadow: 0 0 0 1px #3f424d` (hover `… #595d6c`), padding 18px, gap 14px.
  - Kicker "Dagens liste" 10px uppercase `letter-spacing: .1em` `#9184d9`.
  - List name 19px weight 500; meta "Laga av Kari · onsdag 3. september" 12px
    `rgba(233,233,237,.5)`.
  - Count "2/7" right-aligned, 26px weight 500, `#d2cefd`, `letter-spacing: -.02em`.
  - Progress bar: 4px tall, `border-radius: 2px`, track `#292b31`, fill `#9184d9`.
  - Next-task line 13px `#d2cefd`: "Neste: <first unchecked task title>".
    When everything is done: "Alt er gjort — fint jobba."
- **"Nytt frå Kari"** section: 10px uppercase heading `rgba(233,233,237,.5)`, with a
  "Sjå alle" link 12px `#9184d9` on the right. Two most recent posts as cards —
  `border-radius: 8px`, background `#232532` (hover `#282a38`), padding 14px:
  a 6px `#9184d9` dot, title 14.5px weight 500, time 11px `rgba(233,233,237,.45)`,
  then a truncated body 13px `rgba(233,233,237,.62)` indented 14px.
- **Snarvegar**: 2-column grid, gap 9px. Each tile background `#232532`, padding 14px,
  `border-radius: 8px`: an 18px `#9184d9` Phosphor icon over a 13.5px label.
  Tiles: "Opning av butikken" (→ handbook article r1) and "Meld eit avvik" (→ deviation sheet).

### 5. Sjekkliste

Content padding `8px 20px 28px`, gap 14px.

- Header row: list name 19px weight 500 + meta 12px; count "2/7" 13px `#d2cefd` right.
- Progress bar (same spec as above).
- **Task rows** — one per task, `border-radius: 8px`, background `#232532`, overflow hidden.
  - Tap row body toggles done. Row padding `15px 14px`, gap 13px, hover `#282a38`.
  - Checkbox, 22×22, `border-radius: 11px`, `margin-top: 1px`:
    - unchecked — 1.5px border `#595d6c`, transparent;
    - checked — solid `#9184d9` with a 12px `#161826` check glyph, stroke-width 3.2.
  - Title 14.5px, line-height 1.35. Color `#e9e9ed` when open, `rgba(233,233,237,.5)` when done.
  - Meta 11.5px `rgba(233,233,237,.45)`: the task's hint when open
    (e.g. "Leveranse frå Skånevik bakeri kjem 07.30"); when done,
    "Kryssa av 07.24 · Ingrid".
  - **Deviation note**, when present: block at `margin: 0 14px 12px 49px`, padding
    `10px 12px`, `border-radius: 6px`, background `#292b31`, 2px left border `#9184d9`.
    Label "Avvik" 10px uppercase `#9184d9`; text 13px `rgba(233,233,237,.8)`.
  - **Note action** below each row: 12.5px `#9184d9` at `padding: 0 14px 12px 49px`,
    reading "+ Skriv avvik" or "Endre avviket".
- **All-done card** (appears when every task is checked): background `#232532`,
  `box-shadow: 0 0 0 1px #9184d9`, padding 18px, `border-radius: 8px`.
  Title 16px weight 500 `#d2cefd` "Heile lista er kryssa av."; body 13px
  "Kari ser dette med ein gong. God vakt vidare." Animates in (see *Animations*).
- Otherwise a 12px hint `rgba(233,233,237,.4)`, centred.

### 6. Deviation sheet (modal)

Bottom sheet over a `rgba(41,43,49,.62)` scrim, `z-index: 80`.
Panel: full width, background `#232532`, `border-radius: 14px 14px 0 0`, padding
`22px 20px 34px`, gap 14px, `box-shadow: 0 0 0 1px #9397ab, 0 -16px 40px rgba(0,0,0,.65)`.
- Kicker "Avvik / kommentar" 10px uppercase `#9184d9`; then the task title 17px weight 500.
- Textarea: `min-height: 96px`, padding `11px 12px`, 14.5px, background `#292b31`,
  1px border `rgba(233,233,237,.16)`, `border-radius: 8px`, `resize: none`.
  Placeholder "Kva var ikkje som det skulle vere?"
- Explainer 11.5px `rgba(233,233,237,.45)`: "Kari får dette på leiarsida med ein gong,
  saman med klokkeslett og namnet ditt."
- Two buttons, equal width, `min-height: 44px`: "Avbryt" (neutral outline
  `rgba(233,233,237,.16)`) and "Send avvik" (accent outline `#9184d9`, weight 500).

Saving an empty note deletes the existing note.

### 7. Meldingar

A segmented control at the top (only when no thread is open): two equal options
**Tavle** / **Chat**, 1px border `rgba(233,233,237,.16)`, `border-radius: 8px`,
padding `9px 12px`, 13.5px. Selected: `#9184d9` + `inset 0 0 0 1px #9184d9`.

**Tavle** (noticeboard, manager → everyone) — cards, gap 10px, background `#232532`,
padding 16px, `border-radius: 8px`:
- Author row: 26px circle `#423a6a`/`#d2cefd` with initials, "Kari Nes · leiar" 12px
  `rgba(233,233,237,.6)`, time 11px right.
- Title 16px weight 500; body 13.5px `rgba(233,233,237,.72)` line-height 1.5.
- Read receipt: 5px `#595d6c` dot + "Lese av 4 av 7" 11px `rgba(233,233,237,.42)`.

**Chat** (list) — full-bleed rows, padding `13px 20px`, gap 13px, hover `#1e2030`:
38px circle `#292b31` with initials (group avatar text is `#9184d9`, people `#d2cefd`),
name 14.5px weight 500, last message 12.5px `rgba(233,233,237,.5)` truncated with
"Du: " prefix when the last sender was you, time 11px right.
Threads: "Krambua — alle" (group), "Kari Nes", "Sander Mo".

**Thread view** — full-screen overlay inside the app, `position: absolute; inset: 0`,
background `#161826`:
- Header padding `60px 16px 12px`, bottom border 1px `rgba(233,233,237,.09)`:
  back chevron (`#9184d9`, 36×36 tap target), 32px avatar, name 15px weight 500,
  sub 11.5px (e.g. "7 personar", "Dagleg leiar").
- Message list: padding 16px, gap 10px, scrolls.
  Bubble: `max-width: 78%`, padding `10px 13px`, `border-radius: 14px`, 14px, line-height 1.45.
  - Mine: right-aligned, background `#423a6a`, text `#f5f4ff`, `border-bottom-right-radius: 4px`.
  - Theirs: left-aligned, background `#232532`, text `#e9e9ed`, `border-bottom-left-radius: 4px`.
  - Meta below, 10.5px `rgba(233,233,237,.35)`: time for mine, "Namn · time" for theirs.
- Composer: padding `10px 14px 30px`, top border 1px `rgba(233,233,237,.09)`, gap 9px.
  Input `min-height: 42px`, `border-radius: 21px`, background `#232532`, 1px border
  `rgba(233,233,237,.16)`, placeholder "Skriv ei melding". Enter sends.
  Send button 42×42 circle, 1px border `#9184d9`, arrow-right icon `#9184d9`.

### 8. Handbok

**Index**:
- Search field: `min-height: 44px`, background `#232532`, 1px border
  `rgba(233,233,237,.16)`, `border-radius: 8px`, padding `0 12px`, gap 9px.
  16px magnifier icon `rgba(233,233,237,.5)`; borderless transparent input 14px.
  Placeholder "Søk i rutinar, reglar og skjema". Filters title + subtitle,
  case-insensitive substring; empty groups disappear.
- Groups: **Rutinar**, **Reglar og HMS**, **Skjema og PDF**. Group heading 10px uppercase
  `letter-spacing: .1em` `rgba(233,233,237,.5)`, items gap 7px.
- Item row: background `#232532` (hover `#282a38`), padding `13px 14px`,
  `border-radius: 8px`, gap 12px. Badge 26×26 `border-radius: 6px` background `#292b31`,
  text `#9184d9` 10px weight 600 ("01", "HMS", "PDF"…). Title 14.5px, sub 11.5px
  `rgba(233,233,237,.45)`. Trailing chevron `rgba(233,233,237,.35)`.
- Empty state, 13px `rgba(233,233,237,.45)`: "Fann ingenting på «<query>». Prøv eit anna
  ord, eller spør Kari i chatten."

**Article**:
- Back link "Tilbake" 13px `#9184d9` with a chevron.
- Kicker (e.g. "Rutine 01") 10px uppercase `#9184d9`; title 24px weight 500
  `letter-spacing: -.015em`; meta 12px `rgba(233,233,237,.45)`
  ("Oppdatert 14. august av Kari Nes · les på 2 min").
- Steps: numbered rows, padding `13px 0`, bottom border 1px `rgba(233,233,237,.08)`, gap 14px.
  Number badge 22×22 circle, 1px border `#595d6c`, text 11px `rgba(233,233,237,.6)`.
  Step text 14px line-height 1.5 `rgba(233,233,237,.85)`.
- Two buttons: "Last ned PDF" (neutral outline) and "Meld avvik" (accent outline),
  `min-height: 42px`, equal width.

---

## Screens / Views — Manager web view

Two columns. Sidebar **214px** fixed; main area scrolls, padding `28px 32px 40px`.

### Sidebar

Background `#1b1d2b`, right border 1px `rgba(233,233,237,.09)`, padding `20px 12px`.
Brand row: 26px square, `border-radius: 7px`, 1px border `#9184d9`, with a 9px `#9184d9`
square inside; label "Krambua" 14px weight 500.
Nav items: padding `9px 10px`, `border-radius: 6px`, 13.5px. Active — text `#e9e9ed`,
background `#292b31`. Inactive — `rgba(233,233,237,.6)`, transparent.
Items: Oversikt · Sjekklister · Beskjedar · Handbok · Tilsette.
Footer card at `margin-top: auto`: background `#232532`, `border-radius: 8px`,
padding `12px 10px`, 11.5px — "Innlogga som **Kari Nes** · leiar".

### Oversikt

- Kicker "Onsdag 3. september" 10px uppercase `#9184d9`; h2 29px weight 500.
- **Stat row**: 4-column grid, gap 14px. Each: background `#232532`, padding 16px,
  `border-radius: 8px`; label 11px `rgba(233,233,237,.5)`, value 26px weight 500.
  Cards: "Lister i dag" 4 · "Oppgåver gjort" (live, `#d2cefd`) · "Avvik i dag" (live) ·
  "Ulesne beskjedar" 3.
- **"Kven som er i gang"** table (rows, no chrome): each row padding `14px 4px`,
  bottom border 1px `rgba(233,233,237,.08)`, gap 16px —
  32px avatar · 150px name block (name 14px, shift 11.5px) · flexible progress column
  (list name 12.5px above a 4px bar, `max-width: 420px`, track `#292b31`, fill
  `#9184d9` when complete else `#796cbf`) · 64px count right-aligned · 96px status tag.
  Status tag: 11px, padding `3px 10px`, `border-radius: 6px` —
  *Ferdig* `#423a6a`/`#f5f4ff`, *I gang* `#3f424d`/`#f3f5fe`,
  *Ikkje starta* transparent/`rgba(233,233,237,.45)`.
- **"Avvik som treng eit svar"**: cards background `#232532`, padding `14px 16px`,
  2px left border `#9184d9`; text 13.5px, meta 11.5px
  ("Ingrid Vik · <task title> · i dag"), "Svar" link 12.5px `#9184d9`.
  Empty state: "Ingen avvik i dag."

### Sjekklister (the core manager task)

- Kicker "Veke 36 · 1.–7. september"; h2 "Sjekklister per person";
  "+ Ny liste" button right (accent outline, `min-height: 38px`, padding `0 16px`).
- **Week grid**: `border-radius: 8px`, `box-shadow: 0 0 0 1px #3f424d`, overflow hidden.
  - Header row background `#1b1d2b`: a 168px "Tilsett" cell, then 7 equal day cells
    ("Man 1." … "Sun 7."), 10.5px uppercase, each with a 1px left border
    `rgba(233,233,237,.07)`. **Today's column header is `#9184d9`**, others
    `rgba(233,233,237,.5)`.
  - One row per employee, `min-height: 62px`, top border 1px `rgba(233,233,237,.07)`.
    Name cell 168px, background `#1b1d2b`, 26px avatar + 13px name (truncated).
  - **Cells are clickable** (hover `rgba(233,233,237,.04)`), padding 8px:
    - With a list: inner block `border-radius: 6px`, padding `8px 9px`, 2px left border,
      background `#292b31` and border `#9184d9` when the list is live today; otherwise
      background `#1f2130` and border `#595d6c`. List name 11.5px truncated;
      sub 10px `rgba(233,233,237,.45)` — "3/7 gjort" when live, "6 oppgåver" otherwise.
    - Empty: a centred "+" 16px `rgba(233,233,237,.18)`.
  - Clicking a cell opens the builder pre-filled with that person and day.
- Caption 12px `rgba(233,233,237,.4)`: "Klikk ei rute for å lage liste for den personen
  den dagen — også fram i tid…"

### List builder (right-hand drawer)

Scrim `rgba(41,43,49,.6)`; panel **460px**, background `#232532`,
`box-shadow: 0 0 0 1px #9397ab, -16px 0 40px rgba(0,0,0,.65)`. Click the scrim to close.
- Header padding `22px 24px 16px`, bottom border: kicker "Ny sjekkliste" 10px uppercase
  `#9184d9`, then "<Person> · <Day> september" 21px weight 500.
- Body scrolls, padding `20px 24px`, gap 20px:
  - **Kven** — wrapping chips, padding `7px 13px`, `border-radius: 8px`, 13px.
    Selected: 1px border `#9184d9`, text `#9184d9`. Unselected: border
    `rgba(233,233,237,.16)`, text `rgba(233,233,237,.75)`.
  - **Kva dag** — same chip pattern, seven days.
  - **Namn på lista** — input, placeholder "T.d. Morgon i krambua".
  - **Oppgåver** — count "N stk" on the right of the label. Each task row:
    background `#292b31`, padding `10px 12px`, `border-radius: 6px`, gap 11px —
    a 16px unchecked circle (1.5px `#595d6c`), text 13.5px, and a "×" remove
    (`rgba(233,233,237,.35)`, hover `#b5abfc`).
    Add row: input (placeholder "Ny oppgåve — trykk enter", Enter adds) + "Legg til"
    neutral-outline button.
    **Presets**: "Eller start frå ein tidlegare liste" — small chips background `#292b31`
    (hover `#3f424d`), 12px, that replace name + tasks.
- Footer padding `16px 24px 20px`, top border: "Avbryt" (neutral outline) and
  "Lagre lista · N oppgåver" (accent outline, flex: 1). Saving with zero tasks just closes.

### Beskjedar

Max width 760px.
- Composer card background `#232532`, padding 20px, `border-radius: 8px`, gap 14px:
  "Overskrift" input (placeholder "T.d. Nye opningstider frå måndag"), "Beskjed"
  textarea `min-height: 92px` (placeholder "Skriv kort. Det viktigaste først."),
  then a footer row — "Går til alle 7 tilsette. Du ser kven som har lese han."
  12.5px, and a "Legg ut" accent-outline button. Inputs inside cards use background
  `#292b31` (one step darker than the card).
- "Lagt ut tidlegare": posts as rows — title 15px weight 500, body 13px
  `rgba(233,233,237,.65)`, and on the right the time 11px plus a read-count tag
  (background `#3f424d`, text `#f3f5fe`, 11px, `border-radius: 6px`).
- **Posting prepends to the same list the employee Tavle reads** — one data source.

### Handbok (manager)

Two-column grid of every handbook item, gap 12px. Row background `#232532`,
padding `15px 16px`, `border-radius: 8px`: badge, title 14px, sub 11.5px,
"Rediger" link 12px `#9184d9`.

### Tilsette

Rows, padding `14px 4px`, bottom border 1px `rgba(233,233,237,.08)`:
32px avatar · 190px name 14px · 190px username 13px in **monospace**
`rgba(233,233,237,.55)` · flexible role 12.5px `rgba(233,233,237,.45)` ·
"Nullstill passord" link 12.5px `#9184d9`.

---

## Interactions & Behavior

**Employee**
- Login: any credentials advance the prototype. In production, authenticate against the
  server; show an inline error under the password field on failure.
- Tapping a checklist row toggles done and stamps a completion time + the user's name.
  This must sync to the manager view — completion is the manager's whole reason for using it.
- "+ Skriv avvik" opens the bottom sheet; saving attaches the note to the task and
  surfaces it in the manager's *Avvik* feed. Saving an empty note removes it.
- Tapping Meldingar always lands on **Tavle**; switching to Chat is one tap.
  Opening a thread pushes a full-screen overlay; back returns to the list.
- Enter in the chat composer sends. Sent messages append with time "no".
- Handbook search filters as you type. Opening an article replaces the index;
  "Tilbake" restores it. Tapping Handbok in the tab bar resets to the index.
- Shortcut "Opning av butikken" deep-links straight to article `r1`.

**Manager**
- Sidebar switches views; state per view is preserved.
- Clicking any grid cell opens the builder pre-filled with that person + day
  (and the existing list, if any). "+ Ny liste" opens it empty.
- Saving writes the list into the grid at `person|dayIndex`; a list saved on today's
  date is marked live and shows live progress.
- Posting a message prepends it to the shared post list with "Lese av 0 av 7".

**Animations** — one keyframe only, used for anything that enters:
```css
@keyframes kb-rise { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: none } }
```
Bottom sheet and drawer `.24s` / `.22s` ease; thread overlay `.22s`; all-done card `.3s`.
Nothing else animates. Keep it restrained.

**Focus** — never leave the browser default:
`:focus-visible { outline: 2px solid #9184d9; outline-offset: 2px }`.

**Responsive** — the manager view should collapse the sidebar to a top bar below
~900px and let the week grid scroll horizontally. The employee screens are
single-column and already fluid.

---

## State Management

Employee:
| State | Type | Notes |
| --- | --- | --- |
| `session` | user or null | username, display name, initials, role |
| `lang` | `'nn' \| 'nb'` | persist per user |
| `tab` | `heim \| sjekk \| meldingar \| handbok` | |
| `todayList` | list + tasks | fetched for (user, today) |
| `done` | map taskId → { at, by } | server-authoritative |
| `notes` | map taskId → string | deviations |
| `sheet` | taskId or null | open deviation sheet |
| `mtab` | `tavle \| chat` | |
| `thread` | threadId or null | |
| `draft` | string | chat composer |
| `q` | string | handbook search |
| `article` | articleId or null | |

Manager:
| State | Type | Notes |
| --- | --- | --- |
| `atab` | view id | |
| `plans` | map `person\|dayIndex` → { name, taskCount, live } | the week grid |
| `posts` | array | shared with the employee Tavle |
| `builder` | { open, person, day, name, tasks[], editKey } | |
| `compose` | { title, body } | |

**Data the server must own**: users and credentials, checklist templates and dated
instances per person, task completions (who + when), deviation notes, posts and read
receipts, chat threads and messages, handbook articles and PDFs.
Everything should be realtime or near-realtime (websocket or short polling) —
the manager watching progress is a live view.

---

## Localisation

The interface must ship in **Nynorsk and Bokmål**. The prototype is written in Nynorsk
with the switch on the login screen and in the profile.

Implement as a plain string table keyed by id, with `nn` and `nb` columns; the language
is a user setting, not a device setting. Every string in this document is the `nn` value.
No layout changes are needed between the two — Bokmål strings run within a few
characters of the Nynorsk ones.

Dates and times: Norwegian formatting throughout — "Onsdag 3. september", "06.30–14.00",
"07.24" (period, not colon, as the time separator).

---

## Privacy & data protection (Norway / GDPR)

This app stores personal data: names, usernames, credentials, and a record of who did
what and when. That last one is employee monitoring data and is treated seriously here.
Before launch the operator needs, at minimum:

- A lawful basis and a written record of processing.
- Hashed passwords (argon2 or bcrypt), TLS everywhere, no credentials in logs.
- A retention policy — completions and chat messages should auto-delete after a defined
  period rather than accumulate forever.
- A data processing agreement with any hosting or messaging provider, and hosting inside
  the EU/EEA where practical.
- A route for an employee to see and delete their own data.
- A documented plan for reporting a breach to Datatilsynet within 72 hours.

Build these in from the start; retrofitting them is much harder.

---

## Design Tokens — Nocturne

The design system is **Nocturne**: a quiet, compact dark interface. Contrast comes from
tonal ramps, not saturation. The accent is a line and a glow — never a flood.

**Core**
| Token | Value |
| --- | --- |
| Background | `#161826` |
| Surface | `#232532` |
| Surface (raised / inset) | `#292b31` |
| Sidebar / tab-bar ground | `#1b1d2b` |
| Text | `#e9e9ed` |
| Accent | `#9184d9` |
| Divider | `rgba(233,233,237,.16)` |

**Neutral ramp** `100 #f3f5fe` · `200 #e4e7f5` · `300 #cfd3e5` · `400 #b2b6ca` ·
`500 #9397ab` · `600 #75798c` · `700 #595d6c` · `800 #3f424d` · `900 #292b31`

**Accent ramp** `100 #f5f4ff` · `200 #e7e5fe` · `300 #d2cefd` · `400 #b5abfc` ·
`500 #968ae0` · `600 #796cbf` · `700 #5d5294` · `800 #423a6a` · `900 #2b2741`

Use 700–900 for tinted fills, hovers and subtle borders; 500 as base; 100–300 for text
on those tints. **Accent-on-ground is ~3:1** — fine for icons, large text and chrome,
but for accent-colored body copy use `#d2cefd` (accent-300), not the accent itself.

**Muted text scale** (all derived from the text color):
`rgba(233,233,237,.85)` body on tint · `.72` secondary body · `.62` tertiary ·
`.5` labels · `.45` meta · `.4` captions · `.35` timestamps.

**Type** — Inter, weights 400/500/600. Headings never go past **500** — hierarchy is
size and space, not weight.
| Role | Size / weight / tracking |
| --- | --- |
| Page h1 | 42 / 500 / -.02em |
| Manager h2 | 29 / 500 / -.02em |
| Login heading | 30 / 500 / -.02em |
| Article title | 24 / 500 / -.015em |
| Card title | 19 / 500 |
| Sheet title | 17 / 500 |
| Body | 14–15 / 400 / line-height 1.45–1.55 |
| Secondary | 13 / 400 |
| Meta | 11–12 / 400 |
| Kicker | 10 / 500 / .1em uppercase |

**Spacing** (density 0.7×): `2.8 · 5.6 · 8.4 · 11.2 · 16.8 · 22.4`px.
In practice the layouts use 6 / 8 / 9 / 12 / 14 / 16 / 20 / 22 / 26 / 28px.

**Radius** — `4` small · `8` default (cards, inputs, buttons) · `14` large
(sheets, chat bubbles). Circles for avatars and checkboxes.

**Elevation** — an edge plus ambient darkness; never stacked shadows.
| Level | Value |
| --- | --- |
| sm | `0 0 0 1px #3f424d` |
| md | `0 0 0 1px #595d6c, 0 6px 18px rgba(0,0,0,.55)` |
| lg | `0 0 0 1px #9397ab, 0 16px 40px rgba(0,0,0,.65)` |

**Rules** — freestanding horizontal rules fade to transparent over 48px at each end:
`linear-gradient(to right, transparent, <divider> 48px, <divider> calc(100% - 48px), transparent)`.
Box outlines and in-control separators stay solid.

**Buttons** — primary is an **accent outline on transparent**, never a fill:
1px `#9184d9`, text `#9184d9`, hover `rgba(145,132,217,.12)`, active `rgba(145,132,217,.22)`.
Secondary: 1px `rgba(233,233,237,.16)`, hover `rgba(233,233,237,.07)`.

**Don't** — flood large areas with the accent; use pure black or pure white; stack heavy
shadows; bolden headings past 500.

---

## Assets

- **Icons**: [Phosphor](https://phosphoricons.com), regular weight, stroke 1.6–1.8,
  rendered on `currentColor`. Used: house, check-square, chat, book-open, sign-out,
  magnifying-glass, caret-left, caret-right, arrow-right, check, warning-circle.
  The prototype draws simplified stand-ins — **use the real Phosphor set**.
- **Fonts**: Inter (Google Fonts), weights 400/500/600/700.
- **Photography**: none in this design. If any is added later, Nocturne blends images
  with `mix-blend-mode: lighten` and prefers subjects shot on dark backgrounds.
- **Logo**: none exists. The brand mark is a placeholder — an outlined rounded square
  containing a filled accent square. Replace it with Krambua's real mark.

---

## Content in the prototype

All names, tasks and messages are **realistic placeholders**, not real people or real
routines. Replace them with Krambua's actual staff, checklists and handbook text before
anyone uses this. Staff shown: Ingrid Vik, Sander Mo, Åse Handeland, Jonas Tveit,
Mari Låstad, Petter Eide, and Kari Nes (manager).

---

## Files

| File | What it is |
| --- | --- |
| `Krambua-app.html` | Self-contained runnable prototype — **open this first** |
| `Krambua.dc.html` | Design source: exact markup, styles and state logic. Read, don't port |
| `nocturne-styles.css` | The design system's token sheet and component classes |
| `nocturne-readme.md` | The design system's own guide |
| `README.md` | This document |
