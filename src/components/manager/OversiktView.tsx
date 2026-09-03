"use client";

import { Avatar, ProgressBar } from "@/components/ui";
import { useStore } from "@/lib/store";
import { formatFullDate, todayIndex } from "@/lib/format";

export default function OversiktView({ onGoToBuilder }: { onGoToBuilder: (personId: string, dayIndex: number) => void }) {
  const { t, data } = useStore();
  const today = todayIndex();
  const staff = data.users.filter((u) => u.role === "tilsett");
  const todaysLists = data.lists.filter((l) => l.dayIndex === today);

  const doneCount = todaysLists.reduce((sum, l) => sum + l.tasks.filter((tk) => tk.done).length, 0);
  const totalCount = todaysLists.reduce((sum, l) => sum + l.tasks.length, 0);
  const deviationsToday = todaysLists.flatMap((l) =>
    l.tasks.filter((tk) => tk.note).map((tk) => ({ list: l, task: tk }))
  );
  const unreadPosts = data.posts.filter((p) => p.readBy.length < staff.length).length;

  return (
    <div>
      <div className="mgr-kicker">{formatFullDate(new Date())}</div>
      <h2>{t("mgr.nav.oversikt")}</h2>

      <div className="stat-row">
        <StatCard label={t("ov.stat.lists")} value={String(todaysLists.length)} />
        <StatCard label={t("ov.stat.done")} value={`${doneCount}/${totalCount}`} live />
        <StatCard label={t("ov.stat.deviations")} value={String(deviationsToday.length)} live />
        <StatCard label={t("ov.stat.unread")} value={String(unreadPosts)} />
      </div>

      <div className="mgr-section">
        <div className="mgr-section-title">{t("ov.progress.heading")}</div>
        <div className="progress-table">
          {staff.map((user) => {
            const list = todaysLists.find((l) => l.personId === user.id);
            const done = list?.tasks.filter((tk) => tk.done).length ?? 0;
            const total = list?.tasks.length ?? 0;
            const status = !list || total === 0 ? "ikkje-starta" : done === total ? "ferdig" : done > 0 ? "i-gang" : "ikkje-starta";
            const statusLabel = status === "ferdig" ? t("ov.status.ferdig") : status === "i-gang" ? t("ov.status.iGang") : t("ov.status.ikkjeStarta");
            return (
              <button
                key={user.id}
                className="progress-table-row"
                style={{ width: "100%", border: "none", background: "none", cursor: "pointer", font: "inherit", color: "inherit" }}
                onClick={() => onGoToBuilder(user.id, today)}
              >
                <Avatar initials={user.initials} size={32} />
                <div className="name-block">
                  <div className="name">{user.name}</div>
                  <div className="shift">{user.shift}</div>
                </div>
                <div className="progress-col">
                  <div className="list-name muted-62">{list?.name ?? "—"}</div>
                  <div className="progress-track" style={{ maxWidth: 420 }}>
                    <div
                      className="progress-fill"
                      style={{
                        width: total > 0 ? `${Math.round((done / total) * 100)}%` : "0%",
                        background: done === total && total > 0 ? "var(--color-accent)" : "var(--color-accent-600)",
                      }}
                    />
                  </div>
                </div>
                <div className="count">
                  {done}/{total}
                </div>
                <div className={`status-tag ${status}`}>{statusLabel}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mgr-section">
        <div className="mgr-section-title">{t("ov.deviations.heading")}</div>
        {deviationsToday.length === 0 ? (
          <div className="muted-45" style={{ fontSize: 13 }}>
            {t("ov.deviations.empty")}
          </div>
        ) : (
          deviationsToday.map(({ list, task }) => {
            const person = data.users.find((u) => u.id === list.personId);
            return (
              <div className="deviation-card" key={task.id + list.id}>
                <div className="text">{task.note}</div>
                <div className="row">
                  <div className="meta">
                    {person?.name} · {task.title} · {t("ov.deviations.today")}
                  </div>
                  <button className="reply" title="Svar (kobles til varsling/chat i produksjon)">
                    {t("ov.deviations.reply")}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, live }: { label: string; value: string; live?: boolean }) {
  return (
    <div className="stat-card">
      <div className="label">{label}</div>
      <div className={`value${live ? " live" : ""}`}>{value}</div>
    </div>
  );
}
