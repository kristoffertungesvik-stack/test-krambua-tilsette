"use client";

import { useState } from "react";
import Sidebar, { type MgrView } from "./Sidebar";
import OversiktView from "./OversiktView";
import SjekklisterView from "./SjekklisterView";
import ListBuilderDrawer from "./ListBuilderDrawer";
import BeskjedarView from "./BeskjedarView";
import HandbokManagerView from "./HandbokManagerView";
import TilsetteView from "./TilsetteView";
import { useStore } from "@/lib/store";
import { todayIndex } from "@/lib/format";

interface BuilderState {
  personId: string;
  dayIndex: number;
  editListId?: string;
}

export default function ManagerApp() {
  const { data } = useStore();
  const [view, setView] = useState<MgrView>("oversikt");
  const [builder, setBuilder] = useState<BuilderState | null>(null);

  function openBuilder(personId: string, dayIndex: number) {
    const existing = data.lists.find((l) => l.personId === personId && l.dayIndex === dayIndex);
    setBuilder({ personId, dayIndex, editListId: existing?.id });
  }

  return (
    <div className="mgr-frame">
      <Sidebar view={view} onChange={setView} />
      <div className="mgr-main">
        {view === "oversikt" && <OversiktView onGoToBuilder={openBuilder} />}
        {view === "sjekklister" && <SjekklisterView onOpenBuilder={openBuilder} />}
        {view === "beskjedar" && <BeskjedarView />}
        {view === "handbok" && <HandbokManagerView />}
        {view === "tilsette" && <TilsetteView />}
      </div>

      {builder && (
        <ListBuilderDrawer
          key={`${builder.personId}-${builder.dayIndex}-${builder.editListId ?? "new"}`}
          personId={builder.personId || data.users.find((u) => u.role === "tilsett")?.id || ""}
          dayIndex={builder.dayIndex ?? todayIndex()}
          editListId={builder.editListId}
          onClose={() => setBuilder(null)}
        />
      )}
    </div>
  );
}
