"use client";

import { useState, type ChangeEvent, type ReactNode } from "react";
import { useStore } from "@/lib/store";
import type {
  HandbookArticle,
  HandbookAttachment,
  HandbookGroup,
} from "@/lib/types";

type ArticleForm = {
  group: HandbookGroup;
  badge: string;
  title: string;
  sub: string;
  stepsText: string;
  attachment?: HandbookAttachment;
};

const EMPTY_FORM: ArticleForm = {
  group: "rutinar",
  badge: "NY",
  title: "",
  sub: "",
  stepsText: "",
};

const MAX_FILE_BYTES = 1_500_000;

export default function HandbokManagerView() {
  const {
    data,
    currentUser,
    saveHandbookArticle,
    deleteHandbookArticle,
  } = useStore();
  const [editing, setEditing] = useState<HandbookArticle | null>(null);
  const [form, setForm] = useState<ArticleForm>(EMPTY_FORM);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  function startNew() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError(null);
    setOpen(true);
  }

  function startEdit(article: HandbookArticle) {
    setEditing(article);
    setForm({
      group: article.group,
      badge: article.badge,
      title: article.title,
      sub: article.sub,
      stepsText: article.steps.join("\n"),
      attachment: article.attachment,
    });
    setError(null);
    setOpen(true);
  }

  function update<K extends keyof ArticleForm>(key: K, value: ArticleForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) {
      setError("Fila er for stor. I testversjonen er maks filstorleik 1,5 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      update("attachment", {
        name: file.name,
        type: file.type || "application/octet-stream",
        dataUrl: reader.result,
      });
      setError(null);
    };
    reader.onerror = () => setError("Klarte ikkje å lese fila.");
    reader.readAsDataURL(file);
  }

  function handleSave() {
    const title = form.title.trim();
    const sub = form.sub.trim();
    const steps = form.stepsText
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);

    if (!title) {
      setError("Tittel må fyllast ut.");
      return;
    }
    if (steps.length === 0 && !form.attachment) {
      setError("Skriv minst eitt punkt, eller last opp eit vedlegg.");
      return;
    }

    const wordCount = steps.join(" ").split(/\s+/).filter(Boolean).length;
    const article: HandbookArticle = {
      id: editing?.id ?? `hb-${Date.now()}`,
      group: form.group,
      badge: form.badge.trim() || defaultBadge(form.group),
      title,
      sub,
      steps,
      attachment: form.attachment,
      updatedAt: formatDate(new Date()),
      updatedBy: currentUser?.name ?? "Leiar",
      readMinutes: Math.max(1, Math.ceil(wordCount / 180)),
    };

    saveHandbookArticle(article);
    setOpen(false);
    setNotice(editing ? "Innhaldet er oppdatert." : "Nytt innhald er lagt til.");
    setTimeout(() => setNotice(null), 3500);
  }

  function handleDelete(article: HandbookArticle) {
    if (!window.confirm(`Slette «${article.title}»?`)) return;
    deleteHandbookArticle(article.id);
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          marginBottom: 18,
        }}
      >
        <div>
          <h2>Handbok</h2>
          <div className="muted-50" style={{ fontSize: 12 }}>
            Skriv reglar og rutinar, eller legg ved ei fil.
          </div>
        </div>
        <button className="btn btn-primary" onClick={startNew}>
          + Ny regel / rutine
        </button>
      </div>

      {notice && (
        <div className="tag tag-accent" style={{ marginBottom: 14 }}>
          {notice}
        </div>
      )}

      <div className="hb-mgr-grid">
        {data.handbook.map((a) => (
          <div className="hb-mgr-row" key={a.id}>
            <span className="hb-badge">{a.badge}</span>
            <span className="body">
              <div className="title">{a.title}</div>
              <div className="sub">
                {a.sub || groupLabel(a.group)}
                {a.attachment ? ` · ${a.attachment.name}` : ""}
              </div>
            </span>
            <span style={{ display: "flex", gap: 8 }}>
              <button className="edit-link" onClick={() => startEdit(a)}>
                Rediger
              </button>
              <button
                className="edit-link"
                style={{ color: "#e8a3a3" }}
                onClick={() => handleDelete(a)}
              >
                Slett
              </button>
            </span>
          </div>
        ))}
      </div>

      {open && (
        <div className="dialog-backdrop" onMouseDown={() => setOpen(false)}>
          <div
            className="dialog"
            style={{ width: "min(720px, 100%)", maxHeight: "92vh", overflowY: "auto" }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="dialog-title">
              {editing ? "Rediger innhald" : "Nytt innhald i handboka"}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "160px 110px 1fr",
                gap: 12,
              }}
            >
              <Field label="Type">
                <select
                  className="input"
                  value={form.group}
                  onChange={(e) => update("group", e.target.value as HandbookGroup)}
                >
                  <option value="rutinar">Rutine</option>
                  <option value="reglar">Regel / HMS</option>
                  <option value="skjema">Skjema / dokument</option>
                </select>
              </Field>
              <Field label="Merke">
                <input
                  className="input"
                  maxLength={5}
                  value={form.badge}
                  onChange={(e) => update("badge", e.target.value)}
                />
              </Field>
              <Field label="Tittel">
                <input
                  className="input"
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                />
              </Field>
            </div>

            <Field label="Kort forklaring">
              <input
                className="input"
                placeholder="Kva handlar regelen eller rutinen om?"
                value={form.sub}
                onChange={(e) => update("sub", e.target.value)}
              />
            </Field>

            <Field label="Punkt / framgangsmåte — eitt punkt per linje">
              <textarea
                className="input"
                style={{ minHeight: 180 }}
                placeholder={"Opne bakdøra og slå av alarmen.\nSjekk temperaturen i kjøledisken.\n..."}
                value={form.stepsText}
                onChange={(e) => update("stepsText", e.target.value)}
              />
            </Field>

            <Field label="Vedlegg (valfritt, maks 1,5 MB i denne testversjonen)">
              <input
                className="input"
                type="file"
                accept=".pdf,.doc,.docx,.txt,image/png,image/jpeg"
                onChange={handleFile}
              />
            </Field>

            {form.attachment && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                  padding: 10,
                  border: "1px solid var(--color-divider)",
                  borderRadius: 8,
                }}
              >
                <span style={{ fontSize: 13 }}>{form.attachment.name}</span>
                <button
                  className="btn btn-ghost"
                  onClick={() => update("attachment", undefined)}
                >
                  Fjern vedlegg
                </button>
              </div>
            )}

            {error && <div style={{ color: "#e8a3a3", fontSize: 12.5 }}>{error}</div>}

            <div className="dialog-actions">
              <button className="btn btn-secondary" onClick={() => setOpen(false)}>
                Avbryt
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                Lagre
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
    </div>
  );
}

function defaultBadge(group: HandbookGroup): string {
  if (group === "reglar") return "HMS";
  if (group === "skjema") return "FIL";
  return "RUT";
}

function groupLabel(group: HandbookGroup): string {
  if (group === "reglar") return "Regel / HMS";
  if (group === "skjema") return "Skjema / dokument";
  return "Rutine";
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("nn-NO", {
    day: "numeric",
    month: "long",
  }).format(date);
}
