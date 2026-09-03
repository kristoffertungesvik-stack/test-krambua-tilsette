"use client";

import { SignOut } from "@phosphor-icons/react";
import { Avatar } from "@/components/ui";
import { useStore } from "@/lib/store";
import { formatFullDate } from "@/lib/format";
import type { StaffUser } from "@/lib/types";

export default function Header({ user }: { user: StaffUser }) {
  const { logout, t } = useStore();
  const shiftLine = `${formatFullDate(new Date())}${user.shift ? ` · vakt ${user.shift}` : ""}`;

  return (
    <div className="emp-header">
      <Avatar initials={user.initials} size={36} />
      <div className="who">
        <div className="name">Hei, {user.name.split(" ")[0]}</div>
        <div className="shift muted-50">{shiftLine}</div>
      </div>
      <div className="spacer" />
      <button className="icon-btn" onClick={logout} aria-label={t("header.logout")} title={t("header.logout")}>
        <SignOut size={16} weight="regular" />
      </button>
    </div>
  );
}
