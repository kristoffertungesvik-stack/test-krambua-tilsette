/**
 * Plain string table keyed by id, with `nn` and `nb` columns — per the
 * handoff's Localisation section. Language is a per-user setting (see
 * store.tsx), not a device setting. No layout changes are needed between
 * the two languages.
 *
 * This is a scaffold: it covers every label used in the screens below.
 * When wiring a real backend, keep content (task titles, post bodies,
 * handbook text) in the database rather than here — this file is only for
 * UI chrome strings.
 */

export type Lang = "nn" | "nb";

export const strings = {
  // — login —
  "login.kicker": { nn: "Krambua i Skånevik", nb: "Krambua i Skånevik" },
  "login.heading": { nn: "God morgon.", nb: "God morgen." },
  "login.sub": { nn: "Logg på med brukarnamnet du fekk av Kari.", nb: "Logg på med brukernavnet du fikk av Kari." },
  "login.username.label": { nn: "Brukarnamn", nb: "Brukernavn" },
  "login.password.label": { nn: "Passord", nb: "Passord" },
  "login.submit": { nn: "Logg inn", nb: "Logg inn" },
  "login.forgot": { nn: "Gløymt passord?", nb: "Glemt passord?" },
  "login.forgot.body": { nn: "Ta kontakt med Kari for å nullstille passordet.", nb: "Ta kontakt med Kari for å nullstille passordet." },
  "login.error": { nn: "Feil brukarnamn eller passord.", nb: "Feil brukernavn eller passord." },
  "login.lang.caption": { nn: "Språk i appen", nb: "Språk i appen" },

  // — header / shared —
  "header.logout": { nn: "Logg ut", nb: "Logg ut" },

  // — tabs —
  "tab.heim": { nn: "Heim", nb: "Hjem" },
  "tab.sjekkliste": { nn: "Sjekkliste", nb: "Sjekkliste" },
  "tab.meldingar": { nn: "Meldingar", nb: "Meldinger" },
  "tab.handbok": { nn: "Handbok", nb: "Håndbok" },

  // — heim —
  "heim.today.kicker": { nn: "Dagens liste", nb: "Dagens liste" },
  "heim.today.madeBy": { nn: "Laga av", nb: "Laget av" },
  "heim.today.next": { nn: "Neste", nb: "Neste" },
  "heim.today.allDone": { nn: "Alt er gjort — fint jobba.", nb: "Alt er gjort — fint jobbet." },
  "heim.today.none": { nn: "Ingen liste for deg i dag.", nb: "Ingen liste for deg i dag." },
  "heim.posts.heading": { nn: "Nytt frå Kari", nb: "Nytt fra Kari" },
  "heim.posts.seeAll": { nn: "Sjå alle", nb: "Se alle" },
  "heim.shortcuts.opening": { nn: "Opning av butikken", nb: "Åpning av butikken" },
  "heim.shortcuts.deviation": { nn: "Meld eit avvik", nb: "Meld et avvik" },

  // — sjekkliste —
  "sjekk.doneAt": { nn: "Kryssa av", nb: "Krysset av" },
  "sjekk.note.add": { nn: "+ Skriv avvik", nb: "+ Skriv avvik" },
  "sjekk.note.edit": { nn: "Endre avviket", nb: "Endre avviket" },
  "sjekk.note.label": { nn: "Avvik", nb: "Avvik" },
  "sjekk.allDone.title": { nn: "Heile lista er kryssa av.", nb: "Hele listen er krysset av." },
  "sjekk.allDone.body": { nn: "Kari ser dette med ein gong. God vakt vidare.", nb: "Kari ser dette med en gang. God vakt videre." },
  "sjekk.empty": { nn: "Du har ingen sjekkliste i dag.", nb: "Du har ingen sjekkliste i dag." },

  // — deviation sheet —
  "sheet.kicker": { nn: "Avvik / kommentar", nb: "Avvik / kommentar" },
  "sheet.placeholder": { nn: "Kva var ikkje som det skulle vere?", nb: "Hva var ikke som det skulle være?" },
  "sheet.explainer": { nn: "Kari får dette på leiarsida med ein gong, saman med klokkeslett og namnet ditt.", nb: "Kari får dette på ledersiden med en gang, sammen med klokkeslett og navnet ditt." },
  "sheet.cancel": { nn: "Avbryt", nb: "Avbryt" },
  "sheet.submit": { nn: "Send avvik", nb: "Send avvik" },

  // — meldingar —
  "mel.tab.tavle": { nn: "Tavle", nb: "Tavle" },
  "mel.tab.chat": { nn: "Chat", nb: "Chat" },
  "mel.readBy": { nn: "Lese av", nb: "Lest av" },
  "mel.of": { nn: "av", nb: "av" },
  "mel.you": { nn: "Du", nb: "Du" },
  "mel.composer.placeholder": { nn: "Skriv ei melding", nb: "Skriv en melding" },
  "mel.now": { nn: "no", nb: "nå" },

  // — handbok —
  "hb.search.placeholder": { nn: "Søk i rutinar, reglar og skjema", nb: "Søk i rutiner, regler og skjema" },
  "hb.group.rutinar": { nn: "Rutinar", nb: "Rutiner" },
  "hb.group.reglar": { nn: "Reglar og HMS", nb: "Regler og HMS" },
  "hb.group.skjema": { nn: "Skjema og PDF", nb: "Skjema og PDF" },
  "hb.empty": { nn: "Fann ingenting.", nb: "Fant ingenting." },
  "hb.empty.hint": { nn: "Prøv eit anna ord, eller spør Kari i chatten.", nb: "Prøv et annet ord, eller spør Kari i chatten." },
  "hb.article.back": { nn: "Tilbake", nb: "Tilbake" },
  "hb.article.updatedBy": { nn: "Oppdatert", nb: "Oppdatert" },
  "hb.article.readTime": { nn: "les på", nb: "les på" },
  "hb.article.min": { nn: "min", nb: "min" },
  "hb.article.downloadPdf": { nn: "Last ned PDF", nb: "Last ned PDF" },
  "hb.article.reportDeviation": { nn: "Meld avvik", nb: "Meld avvik" },

  // — manager sidebar —
  "mgr.nav.oversikt": { nn: "Oversikt", nb: "Oversikt" },
  "mgr.nav.sjekklister": { nn: "Sjekklister", nb: "Sjekklister" },
  "mgr.nav.beskjedar": { nn: "Beskjedar", nb: "Beskjeder" },
  "mgr.nav.handbok": { nn: "Handbok", nb: "Håndbok" },
  "mgr.nav.tilsette": { nn: "Tilsette", nb: "Ansatte" },
  "mgr.loggedInAs": { nn: "Innlogga som", nb: "Innlogget som" },

  // — oversikt —
  "ov.stat.lists": { nn: "Lister i dag", nb: "Lister i dag" },
  "ov.stat.done": { nn: "Oppgåver gjort", nb: "Oppgaver gjort" },
  "ov.stat.deviations": { nn: "Avvik i dag", nb: "Avvik i dag" },
  "ov.stat.unread": { nn: "Ulesne beskjedar", nb: "Uleste beskjeder" },
  "ov.progress.heading": { nn: "Kven som er i gang", nb: "Hvem som er i gang" },
  "ov.status.ferdig": { nn: "Ferdig", nb: "Ferdig" },
  "ov.status.iGang": { nn: "I gang", nb: "I gang" },
  "ov.status.ikkjeStarta": { nn: "Ikkje starta", nb: "Ikke startet" },
  "ov.deviations.heading": { nn: "Avvik som treng eit svar", nb: "Avvik som trenger et svar" },
  "ov.deviations.empty": { nn: "Ingen avvik i dag.", nb: "Ingen avvik i dag." },
  "ov.deviations.reply": { nn: "Svar", nb: "Svar" },
  "ov.deviations.today": { nn: "i dag", nb: "i dag" },

  // — sjekklister (week grid) —
  "sl.week": { nn: "Veke", nb: "Uke" },
  "sl.heading": { nn: "Sjekklister per person", nb: "Sjekklister per person" },
  "sl.new": { nn: "+ Ny liste", nb: "+ Ny liste" },
  "sl.col.employee": { nn: "Tilsett", nb: "Ansatt" },
  "sl.caption": { nn: "Klikk ei rute for å lage liste for den personen den dagen — også fram i tid.", nb: "Klikk en rute for å lage liste for den personen den dagen — også frem i tid." },
  "sl.tasksCount": { nn: "oppgåver", nb: "oppgaver" },
  "sl.doneCount": { nn: "gjort", nb: "gjort" },

  // — builder drawer —
  "bd.kicker": { nn: "Ny sjekkliste", nb: "Ny sjekkliste" },
  "bd.who": { nn: "Kven", nb: "Hvem" },
  "bd.day": { nn: "Kva dag", nb: "Hvilken dag" },
  "bd.name.label": { nn: "Namn på lista", nb: "Navn på listen" },
  "bd.name.placeholder": { nn: "T.d. Morgon i krambua", nb: "F.eks. Morgen i krambua" },
  "bd.tasks.label": { nn: "Oppgåver", nb: "Oppgaver" },
  "bd.tasks.count": { nn: "stk", nb: "stk" },
  "bd.tasks.add.placeholder": { nn: "Ny oppgåve — trykk enter", nb: "Ny oppgave — trykk enter" },
  "bd.tasks.add": { nn: "Legg til", nb: "Legg til" },
  "bd.presets": { nn: "Eller start frå ein tidlegare liste", nb: "Eller start fra en tidligere liste" },
  "bd.cancel": { nn: "Avbryt", nb: "Avbryt" },
  "bd.save": { nn: "Lagre lista", nb: "Lagre listen" },

  // — beskjedar —
  "bk.title.placeholder": { nn: "T.d. Nye opningstider frå måndag", nb: "F.eks. Nye åpningstider fra mandag" },
  "bk.title.label": { nn: "Overskrift", nb: "Overskrift" },
  "bk.body.label": { nn: "Beskjed", nb: "Beskjed" },
  "bk.body.placeholder": { nn: "Skriv kort. Det viktigaste først.", nb: "Skriv kort. Det viktigste først." },
  "bk.submit": { nn: "Legg ut", nb: "Legg ut" },
  "bk.earlier": { nn: "Lagt ut tidlegare", nb: "Lagt ut tidligere" },

  // — handbok manager —
  "hbm.edit": { nn: "Rediger", nb: "Rediger" },

  // — tilsette —
  "til.resetPassword": { nn: "Nullstill passord", nb: "Nullstill passord" },
  "til.resetPassword.done": { nn: "Nytt eingongspassord sendt.", nb: "Nytt engangspassord sendt." },
  "til.delete": { nn: "Slett", nb: "Slett" },
  "til.delete.confirm": { nn: "Slette denne personen?", nb: "Slette denne personen?" },
  "til.delete.yes": { nn: "Ja, slett", nb: "Ja, slett" },
  "til.delete.no": { nn: "Avbryt", nb: "Avbryt" },
  "til.delete.done": { nn: "Tilsett sletta.", nb: "Ansatt slettet." },
  "til.empty": { nn: "Ingen tilsette registrert.", nb: "Ingen ansatte registrert." },
} as const;

export type StringId = keyof typeof strings;

export function translate(id: StringId, lang: Lang): string {
  const entry = strings[id];
  if (!entry) return id;
  return entry[lang] ?? entry.nn;
}

/** "Går til alle N tilsette. Du ser kven som har lese han." — count is data, not a fixed string. */
export function audienceLine(count: number, lang: Lang): string {
  return lang === "nb"
    ? `Går til alle ${count} ansatte. Du ser hvem som har lest den.`
    : `Går til alle ${count} tilsette. Du ser kven som har lese han.`;
}
