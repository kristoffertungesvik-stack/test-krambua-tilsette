# Krambua i Skånevik — prosjektskjelett

Dette er et **startpunkt**, ikke et ferdig produkt: en fungerende Next.js-app som
implementerer skjermene, navigasjonen og designsystemet fra design-handoffen
(`nocturne-readme.md` / `nocturne-styles.css` / `README.md` i den opprinnelige
bunten), med data som ligger i nettleserens `localStorage` i staden for ein ekte
server. Alt som README-en peika på som "data the server must own" ligg samla i
eitt lag (`src/lib/store.tsx`) nettopp slik at det er enkelt å byte ut med ekte
API-kall/websocket seinare — komponentane bryr seg berre om funksjonane
`useStore()` eksponerer, ikkje om kor dataen faktisk kjem frå.

## Publisere på nett (GitHub Pages — ingen installasjon nødvendig)

Appen er sett opp som ein **statisk eksport** (sjå `next.config.js`), så ho
kan hostast som ei vanleg nettside — heile bygginga skjer på GitHub sine
serverar, ikkje på din eigen maskin:

1. Opprett eit nytt, tomt repository på [github.com](https://github.com/new).
2. Last opp innhaldet i denne mappa dit — dra og slepp alle filene/mappene
   (unntatt `node_modules` og `.next`, som ikkje skal finnast her uansett)
   inn i "Add file → Upload files" på repoet, eller bruk `git push` om du
   er kjend med det.
3. Gå til repoet sine **Settings → Pages**, og set **"Build and
   deployment" → Source** til **"GitHub Actions"**.
4. Sjå fana **Actions** i repoet — ei bygging startar automatisk. Når den er
   grøn (etter 1–2 minutt), ligg lenkja klar under **Settings → Pages**
   (typisk `https://<brukarnamn>.github.io/<repo-namn>/`).

Alt anna er automatisk — `.github/workflows/deploy.yml` byggjer appen på
nytt kvar gong du lastar opp ei endring.

## Køyre lokalt i staden

```bash
npm install
npm run dev
```

Opne `http://localhost:3000`. Logg inn med eitt av brukarnamna i
`src/lib/mock-data.ts` (t.d. `ingrid.vik` for tilsett-appen, `kari.nes` for
leiarvisinga) — passordet for alle er `demo123` (vist på innloggingssida).

## Kva som er ekte og kva som er mocka

| Del | Status |
| --- | --- |
| Skjermar, navigasjon, design-tokens | Bygd — matchar Nocturne-systemet |
| Innlogging | Fungerer, men mot mock-brukarar i `localStorage`, ikkje ein server |
| Sjekklister, avvik, meldingar, handbok | Fungerer i UI, data lagra lokalt i nettlesaren din åleine |
| Fleire einingar / sanntid mellom tilsett og leiar | **Ikkje bygd** — treng ein ekte backend (sjå under) |
| Passord-hashing, tilgangskontroll, GDPR-rutinar | **Ikkje bygd** — sjå README-en sitt "Privacy & data protection"-avsnitt |

Med andre ord: appen ser og oppfører seg rett for éin brukar i éin nettlesar,
men to personar som opnar appen på kvar sin telefon ser *ikkje* dei same
dataa. Det er det neste steget.

## Filstruktur

```
src/
  app/                  Next.js App Router-sider
    logg-inn/            Innloggingsskjerm
    ansatt/               Tilsett-app (mobil, 402×874-skjermane)
    leiar/                Leiarvising (desktop, 1180px+)
  components/
    employee/            Skjermane i tilsett-appen
    manager/              Skjermane i leiarvisinga
    ui.tsx, AuthGuard.tsx, Splash.tsx
  lib/
    types.ts              Domenetypar (User, ChecklistInstance, Post, Thread, …)
    mock-data.ts           Frø-data — ALT her er placeholder, sjå README sitt "Content"-avsnitt
    store.tsx              Datalaget å byte ut med ein ekte backend (sjå under)
    i18n.ts                Strengtabell nn/nb
    format.ts              Norsk dato-/tidsformatering
  styles/
    nocturne.css           Design-tokens + komponentklassar, porta 1:1 frå handoffen
    app.css                 Skjerm-spesifikk layout bygd på tokens over
public/
  manifest.json, sw.js, icons/   Minimalt PWA-oppsett (installerbar, enkel offline-app-shell)
```

## Neste steg — dette er jobben for Claude Code

Resten er eit fleirvekers utviklingsprosjekt som bør gjerast i ein ekte
kodebase med git, ein dev-server du kan teste mot, og ein ekte database — det
er difor dette vart levert som eit skjelett i staden for eit ferdig produkt.
Ta dette prosjektet inn i Claude Code og jobb vidare med:

0. **Merk:** når appen får ein ekte backend (neste punkt), sluttar ho å vere
   ei rein statisk side — fjern då `output: "export"` frå `next.config.js`
   og flytt hostinga frå GitHub Pages til noko som køyrer ein Node-server
   (t.d. Vercel), sidan API-kall/server-rendering ikkje fungerer på ein
   rein filhost.
1. **Backend og database.** Bytt ut `src/lib/store.tsx` med ein ekte API-klient.
   Datamodellen i `src/lib/types.ts` er eit rimeleg utgangspunkt for eit skjema
   (Postgres/SQLite via t.d. Prisma er eit vanleg val for eit Next.js-prosjekt
   av denne storleiken).
2. **Autentisering.** Hash passord (argon2/bcrypt), ekte sesjonar/JWT, og fjern
   `password`-feltet frå alt som sendast til klienten.
3. **Sanntid.** Leiarens "kven er i gang"-vising og tilsette sine meldingar må
   oppdaterast på tvers av einingar — websocket (t.d. via Pusher/Ably, eller
   ein enkel WS-server) eller kort polling mot API-et.
4. **GDPR/personvern**, per den opphavlege README-en: behandlingsgrunnlag,
   TLS, lagringstid med automatisk sletting, DPA med leverandørar, ein måte
   for tilsette å sjå/slette eigen data, og eit rutineoppsett for
   avviksmelding til Datatilsynet innan 72 timar.
5. **Deploy.** Next.js + ein Postgres-database køyrer fint på t.d. Vercel +
   Neon/Supabase, eller på eigen server i EU/EØS.
6. **Ikon/manifest.** `public/icons/*.png` er plassholdarar generert frå
   merket i design-systemet — byt ut med Krambua sin eigentlege logo før
   lansering (sjå handoffen sitt "Assets"-avsnitt).

## Design-handoffen

`design-handoff/` inneheld dei originale filene appen vart bygd frå (den
detaljerte skjerm-for-skjerm-spesifikasjonen, Nocturne-designsystemet, og dei
to klikkbare HTML-prototypane). Bruk dei som fasit på eksakte verdiar
(padding, storleikar, kopitekst) dette skjelettet ikkje fanga opp pixel-nøyaktig.

## Innhald som må bytast ut

Alle namn, oppgåver, meldingar og handbok-tekstar i `src/lib/mock-data.ts` er
placeholder, akkurat som i den opphavlege prototypen — byt dei ut med Krambua
sine faktiske tilsette, sjekklister og handbok-tekst før nokon brukar dette.
