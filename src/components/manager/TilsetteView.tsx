"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui";
import { useStore } from "@/lib/store";

export default function TilsetteView() {
  const { t, data, resetPassword } = useStore();
  const [notice, setNotice] = useState<string | null>(null);
  const staff = data.users.filter((u) => u.role === "tilsett");

  function handleReset(userId: string, name: string) {
    resetPassword(userId);
    setNotice(`${t("til.resetPassword.done")} (${name})`);
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
            <button className="reset-link" onClick={() => handleReset(u.id, u.name)}>
              {t("til.resetPassword")}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
