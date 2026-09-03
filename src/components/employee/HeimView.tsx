"use client";

import { DoorOpen, WarningCircle } from "@phosphor-icons/react";
import { ProgressBar } from "@/components/ui";
import { useStore } from "@/lib/store";
import type { ChecklistInstance, Post } from "@/lib/types";
import { formatTime } from "@/lib/format";

export default function HeimView({
  list,
  recentPosts,
  onOpenList,
  onOpenPost,
  onOpenArticle,
}: {
  list: ChecklistInstance | undefined;
  recentPosts: Post[];
  onOpenList: () => void;
  onOpenPost: () => void;
  onOpenArticle: (id: string) => void;
}) {
  const { t } = useStore();
  const done = list?.tasks.filter((tk) => tk.done).length ?? 0;
  const total = list?.tasks.length ?? 0;
  const nextTask = list?.tasks.find((tk) => !tk.done);

  return (
    <div className="heim-content">
      {list ? (
        <button className="today-card" onClick={onOpenList}>
          <div className="row-top">
            <div>
              <div className="card-kicker">{t("heim.today.kicker")}</div>
              <div className="list-name">{list.name}</div>
              <div className="list-meta">
                {t("heim.today.madeBy")} {list.madeBy}
              </div>
            </div>
            <div className="count">
              {done}/{total}
            </div>
          </div>
          <ProgressBar value={done} max={total} />
          <div className="next-line">
            {nextTask ? `${t("heim.today.next")}: ${nextTask.title}` : t("heim.today.allDone")}
          </div>
        </button>
      ) : (
        <div className="today-card" style={{ cursor: "default" }}>
          <div className="muted-50" style={{ fontSize: 13 }}>
            {t("heim.today.none")}
          </div>
        </div>
      )}

      <div>
        <div className="section-heading-row" style={{ marginBottom: 10 }}>
          <div className="section-heading">{t("heim.posts.heading")}</div>
          <button className="section-link" onClick={onOpenPost}>
            {t("heim.posts.seeAll")}
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {recentPosts.map((p) => (
            <button key={p.id} className="post-mini" onClick={onOpenPost}>
              <div className="row">
                <span className="dot" />
                <span className="title">{p.title}</span>
                <span className="time">{formatTime(new Date(p.createdAt))}</span>
              </div>
              <div className="body">{p.body}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="section-heading" style={{ marginBottom: 10 }}>
          Snarvegar
        </div>
        <div className="shortcuts">
          <button className="shortcut-tile" onClick={() => onOpenArticle("r1")}>
            <DoorOpen size={18} color="var(--color-accent)" />
            <span>{t("heim.shortcuts.opening")}</span>
          </button>
          <button className="shortcut-tile" onClick={onOpenList}>
            <WarningCircle size={18} color="var(--color-accent)" />
            <span>{t("heim.shortcuts.deviation")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
