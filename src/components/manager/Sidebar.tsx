"use client";

import { ChartBar, ListChecks, ChatCircleText, BookOpen, Users } from "@phosphor-icons/react";
import { useStore } from "@/lib/store";

export type MgrView = "oversikt" | "sjekklister" | "beskjedar" | "handbok" | "tilsette";

export default function Sidebar({ view, onChange }: { view: MgrView; onChange: (v: MgrView) => void }) {
  const { t, currentUser } = useStore();
  if (!currentUser) return null;

  const items: { id: MgrView; label: string; Icon: typeof ChartBar }[] = [
    { id: "oversikt", label: t("mgr.nav.oversikt"), Icon: ChartBar },
    { id: "sjekklister", label: t("mgr.nav.sjekklister"), Icon: ListChecks },
    { id: "beskjedar", label: t("mgr.nav.beskjedar"), Icon: ChatCircleText },
    { id: "handbok", label: t("mgr.nav.handbok"), Icon: BookOpen },
    { id: "tilsette", label: t("mgr.nav.tilsette"), Icon: Users },
  ];

  return (
    <div className="mgr-sidebar">
      <div className="mgr-brand">
        <span className="mark">
          <span />
        </span>
        <span className="label">Krambua</span>
      </div>
      <div className="mgr-nav">
        {items.map(({ id, label, Icon }) => (
          <button key={id} className="mgr-nav-item" aria-current={view === id ? "page" : undefined} onClick={() => onChange(id)}>
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>
      <div className="mgr-footer-card">
        {t("mgr.loggedInAs")} <strong>{currentUser.name}</strong> · {currentUser.roleLabel.toLowerCase()}
      </div>
    </div>
  );
}
