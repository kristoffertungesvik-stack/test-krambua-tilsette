"use client";

import { Check } from "@phosphor-icons/react";
import { ProgressBar } from "@/components/ui";
import { useStore } from "@/lib/store";
import type { ChecklistInstance } from "@/lib/types";

export default function SjekklisteView({
  list,
  onOpenSheet,
}: {
  list: ChecklistInstance | undefined;
  onOpenSheet: (taskId: string) => void;
}) {
  const { t, toggleTask } = useStore();

  if (!list) {
    return <div className="empty-hint">{t("sjekk.empty")}</div>;
  }

  const done = list.tasks.filter((tk) => tk.done).length;
  const total = list.tasks.length;
  const allDone = total > 0 && done === total;

  return (
    <div className="sjekk-content">
      <div className="sjekk-header-row">
        <div>
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

      <div className="task-list">
        {list.tasks.map((task) => (
          <div className="task-row" key={task.id}>
            <button className="task-row-body" onClick={() => toggleTask(list.id, task.id)}>
              <span className={`checkbox${task.done ? " checked" : ""}`}>
                {task.done && <Check size={12} weight="bold" color="var(--color-bg)" />}
              </span>
              <span className="task-body">
                <span className={`task-title${task.done ? " done" : ""}`}>{task.title}</span>
                <div className="task-meta">
                  {task.done
                    ? `${t("sjekk.doneAt")} ${task.doneAt} · ${task.doneBy}`
                    : task.hint}
                </div>
              </span>
            </button>
            {task.note && (
              <div className="deviation-note">
                <div className="label">{t("sjekk.note.label")}</div>
                <div className="text">{task.note}</div>
              </div>
            )}
            <div className="note-action">
              <button onClick={() => onOpenSheet(task.id)}>
                {task.note ? t("sjekk.note.edit") : t("sjekk.note.add")}
              </button>
            </div>
          </div>
        ))}
      </div>

      {allDone ? (
        <div className="all-done-card kb-enter">
          <div className="title">{t("sjekk.allDone.title")}</div>
          <div className="body">{t("sjekk.allDone.body")}</div>
        </div>
      ) : null}
    </div>
  );
}
