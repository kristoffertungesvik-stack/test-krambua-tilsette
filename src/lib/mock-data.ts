import type {
  AppData,
  ChecklistInstance,
  HandbookArticle,
  Message,
  Post,
  StaffUser,
  Thread,
} from "./types";
import { todayIndex } from "./format";

/**
 * Seed data — realistic placeholders, not real people or real routines
 * (per the handoff). Replace with Krambua's actual staff, checklists and
 * handbook text before anyone uses this for real. The demo password for
 * every seeded user is "demo123", shown on the login screen.
 */

export const DEMO_PASSWORD = "demo123";

export const SEED_USERS: StaffUser[] = [
  { id: "u-kari", username: "kari.nes", password: DEMO_PASSWORD, name: "Kari Nes", initials: "KN", role: "leiar", roleLabel: "Dagleg leiar" },
  { id: "u-ingrid", username: "ingrid.vik", password: DEMO_PASSWORD, name: "Ingrid Vik", initials: "IV", role: "tilsett", roleLabel: "Tilsett", shift: "06.30–14.00" },
  { id: "u-sander", username: "sander.mo", password: DEMO_PASSWORD, name: "Sander Mo", initials: "SM", role: "tilsett", roleLabel: "Tilsett", shift: "08.00–16.00" },
  { id: "u-aase", username: "aase.handeland", password: DEMO_PASSWORD, name: "Åse Handeland", initials: "ÅH", role: "tilsett", roleLabel: "Tilsett", shift: "10.00–18.00" },
  { id: "u-jonas", username: "jonas.tveit", password: DEMO_PASSWORD, name: "Jonas Tveit", initials: "JT", role: "tilsett", roleLabel: "Tilsett", shift: "12.00–20.00" },
  { id: "u-mari", username: "mari.lastad", password: DEMO_PASSWORD, name: "Mari Låstad", initials: "ML", role: "tilsett", roleLabel: "Tilsett", shift: "06.30–14.00" },
  { id: "u-petter", username: "petter.eide", password: DEMO_PASSWORD, name: "Petter Eide", initials: "PE", role: "tilsett", roleLabel: "Tilsett", shift: "14.00–20.00" },
];

const TODAY = todayIndex();

function morningTasks(): ChecklistInstance["tasks"] {
  return [
    { id: "t1", title: "Opne butikken og slå på lys", done: true, doneAt: "06.32", doneBy: "Ingrid Vik" },
    { id: "t2", title: "Sjekk temperatur i kjøledisk", hint: "Skal vise mellom 2 og 4 grader", done: true, doneAt: "06.41", doneBy: "Ingrid Vik" },
    { id: "t3", title: "Ta imot leveranse frå bakeriet", hint: "Leveranse frå Skånevik bakeri kjem 07.30", done: false },
    { id: "t4", title: "Fyll opp brød- og bakevarehylle", done: false },
    { id: "t5", title: "Set ut skilt og varer utandørs", done: false },
    { id: "t6", title: "Tøm søppel frå gårsdagen", done: false, note: "Papircontaineren var full — ringte renovasjon." },
    { id: "t7", title: "Opne kassa og tell startkassen", hint: "Startkasse skal vere 2 000 kr", done: false },
  ];
}

function eveningTasks(): ChecklistInstance["tasks"] {
  return [
    { id: "t1", title: "Tell og lever dagsoppgjer", done: false },
    { id: "t2", title: "Rydd og vask kjøledisk", done: false },
    { id: "t3", title: "Set inn skilt og varer frå utandørs", done: false },
    { id: "t4", title: "Tøm søppel og set ut til henting", done: false },
    { id: "t5", title: "Lås bakdør og alarmer butikken", done: false },
  ];
}

export const SEED_LISTS: ChecklistInstance[] = [
  { id: "l-ingrid-today", personId: "u-ingrid", dayIndex: TODAY, name: "Morgon i krambua", madeBy: "Kari Nes", tasks: morningTasks() },
  { id: "l-mari-today", personId: "u-mari", dayIndex: TODAY, name: "Morgon i krambua", madeBy: "Kari Nes", tasks: morningTasks().map((t) => ({ ...t, doneBy: t.doneBy && "Mari Låstad" })) },
  { id: "l-petter-today", personId: "u-petter", dayIndex: TODAY, name: "Stenging", madeBy: "Kari Nes", tasks: eveningTasks() },
  { id: "l-sander-next", personId: "u-sander", dayIndex: (TODAY + 1) % 7, name: "Dagvakt", madeBy: "Kari Nes", tasks: eveningTasks().slice(0, 3).map((t) => ({ ...t, done: false })) },
  { id: "l-aase-next", personId: "u-aase", dayIndex: (TODAY + 2) % 7, name: "Helgevakt", madeBy: "Kari Nes", tasks: morningTasks().slice(0, 4).map((t) => ({ ...t, done: false })) },
  { id: "l-jonas-prev", personId: "u-jonas", dayIndex: (TODAY + 6) % 7, name: "Kveldsvakt", madeBy: "Kari Nes", tasks: eveningTasks().map((t) => ({ ...t, done: true, doneAt: "19.52", doneBy: "Jonas Tveit" })) },
];

export const SEED_POSTS: Post[] = [
  {
    id: "p1",
    authorId: "u-kari",
    title: "Nye opningstider frå måndag",
    body: "Frå og med måndag opnar vi kl. 07.00 i staden for 08.00. Sjå oppdatert vaktliste. Sei ifrå om det kolliderer med noko.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    readBy: ["u-ingrid", "u-mari", "u-jonas", "u-petter"],
  },
  {
    id: "p2",
    authorId: "u-kari",
    title: "Hugs merking av eigne matvarer",
    body: "Fann umerka matboksar i kjøkkenkjøleskapet igjen. Merk med namn og dato, elles kastar vi det på fredag.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    readBy: ["u-ingrid", "u-sander"],
  },
  {
    id: "p3",
    authorId: "u-kari",
    title: "Bra jobba i helga!",
    body: "Travel helg med marknaden i sentrum — takk for innsatsen, alle saman. Butikken såg veldig fin ut på måndag.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 70).toISOString(),
    readBy: ["u-ingrid", "u-sander", "u-aase", "u-jonas", "u-mari", "u-petter"],
  },
];

export const SEED_THREADS: Thread[] = [
  { id: "th-alle", kind: "group", name: "Krambua — alle", sub: "7 personar", participantIds: SEED_USERS.map((u) => u.id) },
  { id: "th-kari", kind: "dm", name: "Kari Nes", sub: "Dagleg leiar", participantIds: ["u-kari", "u-ingrid"] },
  { id: "th-sander", kind: "dm", name: "Sander Mo", sub: "Tilsett", participantIds: ["u-ingrid", "u-sander"] },
];

export const SEED_MESSAGES: Message[] = [
  { id: "m1", threadId: "th-alle", senderId: "u-kari", text: "God morgon alle saman! Hugs den nye rutinen for kjøledisk-temperatur i dag.", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString() },
  { id: "m2", threadId: "th-alle", senderId: "u-sander", text: "Skal bli, notert 👍", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 19).toISOString() },
  { id: "m3", threadId: "th-kari", senderId: "u-kari", text: "Kan du ta bakeri-leveransen litt tidlegare i morgon? Dei kjem kl. 07.15.", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 15).toISOString() },
  { id: "m4", threadId: "th-kari", senderId: "u-ingrid", text: "Ja, går fint!", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString() },
];

export const SEED_HANDBOOK: HandbookArticle[] = [
  {
    id: "r1",
    group: "rutinar",
    badge: "01",
    title: "Opning av butikken",
    sub: "Steg for steg frå dør til kasse",
    updatedAt: "14. august",
    updatedBy: "Kari Nes",
    readMinutes: 2,
    steps: [
      "Lås opp bakdør og slå av alarmen.",
      "Slå på alle lys, inkludert utstillingsvindauge.",
      "Sjekk temperatur i kjøledisk og frys — skal vere 2–4 °C / -18 °C.",
      "Set ut skilt, aviser og varer som skal stå utandørs.",
      "Opne kassaapparatet og tell startkassen mot kassarapporten.",
      "Lås opp inngangsdøra presis kl. 07.00.",
    ],
  },
  {
    id: "r2",
    group: "rutinar",
    badge: "02",
    title: "Ta imot varelevering",
    sub: "Kontroll, temperatur og signering",
    updatedAt: "2. august",
    updatedBy: "Kari Nes",
    readMinutes: 3,
    steps: [
      "Kontroller at følgeseddel stemmer med det som faktisk kjem.",
      "Mål temperatur på kjøle- og frysevarer før du signerer.",
      "Meld avvik med det same dersom noko manglar eller er skadd.",
      "Sett varene på plass før neste oppgåve — ikkje la paller stå i gangen.",
    ],
  },
  {
    id: "r3",
    group: "rutinar",
    badge: "03",
    title: "Stenging av butikken",
    sub: "Oppgjer, rydding og alarm",
    updatedAt: "20. juli",
    updatedBy: "Kari Nes",
    readMinutes: 2,
    steps: [
      "Tell kassa og fyll ut dagsoppgjerskjema.",
      "Rydd og tørk av kjøledisk og benkar.",
      "Set inn alt som har stått utandørs.",
      "Tøm søppel og sett det ut til henting.",
      "Lås alle dører og aktiver alarmen på veg ut.",
    ],
  },
  {
    id: "h1",
    group: "reglar",
    badge: "HMS",
    title: "Handtering av kniv og skjeremaskin",
    sub: "Tryggleiksrutinar på kjøkkenet",
    updatedAt: "9. juni",
    updatedBy: "Kari Nes",
    readMinutes: 2,
    steps: [
      "Bruk alltid kutthanske ved handtering av kniv i delikatessedisken.",
      "Skjeremaskinen skal vere avslått og reingjort mellom kvar vare.",
      "Meld frå til Kari med det same ved kutt eller skade, uansett storleik.",
    ],
  },
  {
    id: "h2",
    group: "reglar",
    badge: "HMS",
    title: "Handtering av allergen og matmerking",
    sub: "Kva som må merkast og korleis",
    updatedAt: "9. juni",
    updatedBy: "Kari Nes",
    readMinutes: 3,
    steps: [
      "All eigenprodusert mat skal merkast med innhald og dato.",
      "Sjå allergenlista på kjøkkenveggen ved uvisse.",
      "Spør alltid vidare ved kundespørsmål om allergen — ikkje gjett.",
    ],
  },
  {
    id: "s1",
    group: "skjema",
    badge: "PDF",
    title: "Avviksskjema (papir)",
    sub: "Til bruk ved straumbrot eller systemfeil",
    updatedAt: "3. mai",
    updatedBy: "Kari Nes",
    readMinutes: 1,
    steps: ["Skriv ut skjemaet frå kontoret.", "Fyll ut for hand ved systemfeil.", "Legg det ferdig utfylte skjemaet i Kari sin postkasse."],
  },
  {
    id: "s2",
    group: "skjema",
    badge: "PDF",
    title: "Dagsoppgjerskjema",
    sub: "Kassaoppgjer ved stenging",
    updatedAt: "3. mai",
    updatedBy: "Kari Nes",
    readMinutes: 1,
    steps: ["Tell kassa og noter beløp per valør.", "Sammenlikn med kassarapporten.", "Signer og legg i safen."],
  },
];

export function buildSeed(): AppData {
  return {
    lang: "nn",
    users: SEED_USERS,
    lists: SEED_LISTS,
    posts: SEED_POSTS,
    threads: SEED_THREADS,
    messages: SEED_MESSAGES,
    handbook: SEED_HANDBOOK,
  };
}
