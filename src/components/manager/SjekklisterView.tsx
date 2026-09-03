"use client";

import { Avatar } from "@/components/ui";
import { useStore } from "@/lib/store";
import { currentWeek, isToday, weekDateLabel } from "@/lib/format";

export default function SjekklisterView({
  onOpenBuilder,
}: {
  onOpenBuilder: (personId: string, dayIndex: number) => void;
}) {
  const { t, data } = useStore();
  const { weekNumber, monday } = currentWeek();
  const staff = data.users.filter((u) => u.role === "tilsett");
  const days = [0, 1, 2, 3, 4, 5, 6];

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const rangeLabel = `${monday.getDate()}.–${sunday.getDate()}. ${sunday.toLocaleDateString("nn-NO", { month: "long" })}`;

  return (
    <div>
      <div className="mgr-kicker">
        {t("sl.week")} {weekNumber} · {rangeLabel}
      </div>
      <div className="mgr-header-row">
        <h2 style={{ margin: 0 }}>{t("sl.heading")}</h2>
        <button className="btn btn-primary" style={{ minHeight: 38, padding: "0 16px" }} onClick={() => onOpenBuilder(staff[0]?.id ?? "", 0)}>
          {t("sl.new")}
        </button>
      </div>

      <div className="week-grid-wrap">
        <div className="week-grid">
          <div className="week-grid-header-cell" style={{ background: "var(--color-chrome)" }}>
            {t("sl.col.employee")}
          </div>
          {days.map((d) => (
            <div key={d} className={`week-grid-header-cell${isToday(d, monday) ? " today" : ""}`}>
              {weekDateLabel(d, monday)}
            </div>
          ))}

          {staff.map((user) => (
            <RowFragment key={user.id} personId={user.id} name={user.name} initials={user.initials} monday={monday} days={days} onOpenBuilder={onOpenBuilder} />
          ))}
        </div>
      </div>
      <div className="week-grid-caption">{t("sl.caption")}</div>
    </div>
  );
}

function RowFragment({
  personId,
  name,
  initials,
  monday,
  days,
  onOpenBuilder,
}: {
  personId: string;
  name: string;
  initials: string;
  monday: Date;
  days: number[];
  onOpenBuilder: (personId: string, dayIndex: number) => void;
}) {
  const { data, t } = useStore();
  return (
    <>
      <div className="week-grid-name-cell">
        <Avatar initials={initials} size={26} />
        <span className="name">{name}</span>
      </div>
      {days.map((d) => {
        const list = data.lists.find((l) => l.personId === personId && l.dayIndex === d);
        const live = isToday(d, monday);
        const done = list?.tasks.filter((tk) => tk.done).length ?? 0;
        return (
          <button key={d} className="week-cell" onClick={() => onOpenBuilder(personId, d)}>
            {list ? (
              <div className={`week-cell-block${live ? " live" : ""}`}>
                <div className="name">{list.name}</div>
                <div className="sub">
                  {live ? `${done}/${list.tasks.length} ${t("sl.doneCount")}` : `${list.tasks.length} ${t("sl.tasksCount")}`}
                </div>
              </div>
            ) : (
              <div className="week-cell-fill">+</div>
            )}
          </button>
        );
      })}
    </>
  );
}
