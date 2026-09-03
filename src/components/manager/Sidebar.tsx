"use client";

import { ChartBar, ListChecks, ChatCircleText, BookOpen, Users, SignOut } from "@phosphor-icons/react";
import { useStore } from "@/lib/store";
import { BASE_PATH } from "@/lib/base-path";

export type MgrView = "oversikt" | "sjekklister" | "beskjedar" | "handbok" | "tilsette";

export default function Sidebar({ view, onChange }: { view: MgrView; onChange: (v: MgrView) => void }) {
  const { t, currentUser, logout } = useStore();
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${BASE_PATH}/brand/mark.png`} alt="Krambua" style={{ height: 22, width: "auto" }} />
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
      <div className="mgr-footer-row">
        <div className="mgr-footer-card">
          {t("mgr.loggedInAs")} <strong>{currentUser.name}</strong> · {currentUser.roleLabel.toLowerCase()}
        </div>
        <button className="icon-btn" onClick={logout} aria-label={t("header.logout")} title={t("header.logout")}>
          <SignOut size={16} />
        </button>
      </div>
    </div>
  );
}
