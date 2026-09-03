"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Avatar } from "@/components/ui";
import { useStore } from "@/lib/store";
import type { Role, StaffUser } from "@/lib/types";

type UserForm = {
  name: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  shift: string;
  role: Role;
};

const EMPTY_FORM: UserForm = {
  name: "",
  username: "",
  password: "",
  email: "",
  phone: "",
  shift: "",
  role: "tilsett",
};

export default function TilsetteView() {
  const { data, saveUser } = useStore();
  const [editing, setEditing] = useState<StaffUser | null>(null);
  const [form, setForm] = useState<UserForm>(EMPTY_FORM);
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const users = useMemo(
    () => [...data.users].sort((a, b) => a.name.localeCompare(b.name, "nn")),
    [data.users]
  );

  function startNew() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError(null);
    setOpen(true);
  }

  function startEdit(user: StaffUser) {
    setEditing(user);
    setForm({
      name: user.name,
      username: user.username,
      password: "",
      email: user.email ?? "",
      phone: user.phone ?? "",
      shift: user.shift ?? "",
      role: user.role,
    });
    setError(null);
    setOpen(true);
  }

  function update<K extends keyof UserForm>(key: K, value: UserForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    const name = form.name.trim();
    const username = form.username.trim();
    const password = form.password.trim();

    if (!name || !username) {
      setError("Namn og brukarnamn må fyllast ut.");
      return;
    }
    if (!editing && !password) {
      setError("Ny brukar må ha eit passord.");
      return;
    }
    const duplicate = data.users.some(
      (u) => u.id !== editing?.id && u.username.toLowerCase() === username.toLowerCase()
    );
    if (duplicate) {
      setError("Dette brukarnamnet er allereie i bruk.");
      return;
    }

    const user: StaffUser = {
      id: editing?.id ?? `u-${Date.now()}`,
      name,
      username,
      password: password || editing?.password || "",
      email: form.email.trim() || undefined,
      phone: form.phone.trim() || undefined,
      shift: form.shift.trim() || undefined,
      role: form.role,
      roleLabel: form.role === "leiar" ? "Leiar" : "Tilsett",
      initials: makeInitials(name),
    };

    saveUser(user);
    setOpen(false);
    setNotice(editing ? `${name} er oppdatert.` : `${name} er lagt til.`);
    setTimeout(() => setNotice(null), 3500);
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
          <h2>Tilsette og brukarar</h2>
          <div className="muted-50" style={{ fontSize: 12 }}>
            Endre innlogging, kontaktinformasjon og rolle.
          </div>
        </div>
        <button className="btn btn-primary" onClick={startNew}>
          + Legg til brukar
        </button>
      </div>

      {notice && (
        <div className="tag tag-accent" style={{ marginBottom: 14 }}>
          {notice}
        </div>
      )}

      <div>
        {users.map((u) => (
          <div className="staff-row" key={u.id} style={{ alignItems: "flex-start" }}>
            <Avatar initials={u.initials} size={32} />
            <span className="name">
              <strong style={{ fontWeight: 500 }}>{u.name}</strong>
              <span className="muted-50" style={{ display: "block", fontSize: 11.5 }}>
                {u.email || "Ingen e-post"}
                {u.phone ? ` · ${u.phone}` : ""}
              </span>
            </span>
            <span className="username">{u.username}</span>
            <span className="role">
              {u.roleLabel}
              {u.shift ? ` · ${u.shift}` : ""}
            </span>
            <button className="reset-link" onClick={() => startEdit(u)}>
              Rediger
            </button>
          </div>
        ))}
      </div>

      {open && (
        <div className="dialog-backdrop" onMouseDown={() => setOpen(false)}>
          <div
            className="dialog"
            style={{ width: "min(640px, 100%)", maxHeight: "90vh", overflowY: "auto" }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="dialog-title">
              {editing ? `Rediger ${editing.name}` : "Legg til brukar"}
            </div>
            <div className="dialog-body">
              {editing
                ? "La passordfeltet stå tomt dersom passordet ikkje skal endrast."
                : "Lag innlogging og kontaktinformasjon for den nye brukaren."}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 12,
              }}
            >
              <Field label="Namn">
                <input className="input" value={form.name} onChange={(e) => update("name", e.target.value)} />
              </Field>
              <Field label="Brukarnamn">
                <input
                  className="input"
                  autoCapitalize="none"
                  value={form.username}
                  onChange={(e) => update("username", e.target.value)}
                />
              </Field>
              <Field label={editing ? "Nytt passord (valfritt)" : "Passord"}>
                <input
                  className="input"
                  type="password"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                />
              </Field>
              <Field label="Rolle">
                <select className="input" value={form.role} onChange={(e) => update("role", e.target.value as Role)}>
                  <option value="tilsett">Tilsett</option>
                  <option value="leiar">Leiar</option>
                </select>
              </Field>
              <Field label="E-post">
                <input
                  className="input"
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                />
              </Field>
              <Field label="Mobil">
                <input
                  className="input"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                />
              </Field>
              <Field label="Vakt / arbeidstid">
                <input
                  className="input"
                  placeholder="t.d. 08.00–16.00"
                  value={form.shift}
                  onChange={(e) => update("shift", e.target.value)}
                />
              </Field>
            </div>

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

function makeInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return `${parts[0][0] ?? ""}${parts.length > 1 ? parts[parts.length - 1][0] ?? "" : ""}`.toUpperCase();
}
