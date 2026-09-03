"use client";

import { House, CheckSquare, ChatCircle, BookOpen } from "@phosphor-icons/react";
import { useStore } from "@/lib/store";

export type EmpTab = "heim" | "sjekk" | "meldingar" | "handbok";

export default function TabBar({
  tab,
  onChange,
  unreadCount,
}: {
  tab: EmpTab;
  onChange: (t: EmpTab) => void;
  unreadCount: number;
}) {
  const { t } = useStore();
  const items: { id: EmpTab; label: string; Icon: typeof House }[] = [
    { id: "heim", label: t("tab.heim"), Icon: House },
    { id: "sjekk", label: t("tab.sjekkliste"), Icon: CheckSquare },
    { id: "meldingar", label: t("tab.meldingar"), Icon: ChatCircle },
    { id: "handbok", label: t("tab.handbok"), Icon: BookOpen },
  ];

  return (
    <div className="emp-tabbar">
      {items.map(({ id, label, Icon }) => (
        <button
          key={id}
          className="emp-tab"
          aria-current={tab === id ? "page" : undefined}
          onClick={() => onChange(id)}
        >
          <Icon size={21} weight={tab === id ? "fill" : "regular"} color="currentColor" />
          {label}
          {id === "meldingar" && unreadCount > 0 && <span className="badge">{unreadCount}</span>}
        </button>
      ))}
    </div>
  );
}
