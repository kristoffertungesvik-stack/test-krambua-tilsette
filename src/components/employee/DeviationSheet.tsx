"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import type { ChecklistInstance } from "@/lib/types";

export default function DeviationSheet({
  list,
  taskId,
  onClose,
}: {
  list: ChecklistInstance;
  taskId: string;
  onClose: () => void;
}) {
  const { t, setDeviationNote } = useStore();
  const task = list.tasks.find((tk) => tk.id === taskId)!;
  const [text, setText] = useState(task.note ?? "");

  function save() {
    setDeviationNote(list.id, taskId, text);
    onClose();
  }

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet-panel" onClick={(e) => e.stopPropagation()}>
        <div>
          <div className="kicker">{t("sheet.kicker")}</div>
          <div className="task-title">{task.title}</div>
        </div>
        <textarea
          className="input"
          placeholder={t("sheet.placeholder")}
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoFocus
        />
        <div className="sheet-explainer">{t("sheet.explainer")}</div>
        <div className="sheet-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            {t("sheet.cancel")}
          </button>
          <button className="btn btn-primary" onClick={save}>
            {t("sheet.submit")}
          </button>
        </div>
      </div>
    </div>
  );
}
