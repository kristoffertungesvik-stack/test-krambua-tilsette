"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui";
import { useStore } from "@/lib/store";

export default function TilsetteView() {
  const { t, data, resetPassword, deleteUser } = useStore();
  const [notice, setNotice] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const staff = data.users.filter((u) => u.role === "tilsett");

  function handleReset(userId: string, name: string) {
    resetPassword(userId);
    setNotice(`${t("til.resetPassword.done")} (${name})`);
    setTimeout(() => setNotice(null), 4000);
  }

  function handleDelete(userId: string, name: string) {
    deleteUser(userId);
    setConfirmId(null);
    setNotice(`${t("til.delete.done")} (${name})`);
    setTimeout(() => setNotice(null), 4000);
  }

  return (
    <div>
      <h2>{t("mgr.nav.tilsette")}</h2>
      {notice && (
        <div className="tag tag-accent" style={{ marginBottom: 14 }}>
          {notice}
        </div>
      )}
      <div>
        {staff.map((u) => (
          <div className="staff-row" key={u.id}>
            <Avatar initials={u.initials} size={32} />
            <span className="name">{u.name}</span>
            <span className="username">{u.username}</span>
            <span className="role">{u.roleLabel}</span>
            {confirmId === u.id ? (
              <span style={{ display: "flex", gap: 10, alignItems: "center", flex: "none" }}>
                <span className="muted-45" style={{ fontSize: 12 }}>
                  {t("til.delete.confirm")}
                </span>
                <button className="reset-link" style={{ color: "var(--color-accent-300)" }} onClick={() => handleDelete(u.id, u.name)}>
                  {t("til.delete.yes")}
                </button>
                <button className="reset-link" onClick={() => setConfirmId(null)}>
                  {t("til.delete.no")}
                </button>
              </span>
            ) : (
              <span style={{ display: "flex", gap: 14, flex: "none" }}>
                <button className="reset-link" onClick={() => handleReset(u.id, u.name)}>
                  {t("til.resetPassword")}
                </button>
                <button className="reset-link" style={{ color: "#d99191" }} onClick={() => setConfirmId(u.id)}>
                  {t("til.delete")}
                </button>
              </span>
            )}
          </div>
        ))}
        {staff.length === 0 && (
          <div className="muted-45" style={{ fontSize: 13, padding: "14px 4px" }}>
            {t("til.empty")}
          </div>
        )}
      </div>
    </div>
  );
}
