"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { dayName } from "@/lib/format";

export default function ListBuilderDrawer({
  personId,
  dayIndex,
  editListId,
  onClose,
}: {
  personId: string;
  dayIndex: number;
  editListId?: string;
  onClose: () => void;
}) {
  const { t, data, savePlan } = useStore();
  const staff = data.users.filter((u) => u.role === "tilsett");
  const existing = editListId ? data.lists.find((l) => l.id === editListId) : undefined;

  const [selectedPerson, setSelectedPerson] = useState(personId);
  const [selectedDay, setSelectedDay] = useState(dayIndex);
  const [name, setName] = useState(existing?.name ?? "");
  const [tasks, setTasks] = useState<string[]>(existing?.tasks.map((tk) => tk.title) ?? []);
  const [taskDraft, setTaskDraft] = useState("");

  const person = staff.find((u) => u.id === selectedPerson);

  // Preset lists: distinct list names already used elsewhere, as a starting point.
  const presets = Array.from(new Map(data.lists.map((l) => [l.name, l])).values()).slice(0, 6);

  function addTask() {
    const v = taskDraft.trim();
    if (!v) return;
    setTasks((prev) => [...prev, v]);
    setTaskDraft("");
  }

  function save() {
    if (tasks.length === 0) {
      onClose();
      return;
    }
    savePlan(selectedPerson, selectedDay, { name: name.trim() || "Sjekkliste", tasks }, existing?.id);
    onClose();
  }

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="kicker">{t("bd.kicker")}</div>
          <h2>
            {person?.name ?? "…"} · {dayName(selectedDay)}
          </h2>
        </div>

        <div className="drawer-body">
          <div>
            <div className="drawer-label">{t("bd.who")}</div>
            <div className="chip-row">
              {staff.map((u) => (
                <button
                  key={u.id}
                  className={`chip${u.id === selectedPerson ? " selected" : ""}`}
                  onClick={() => setSelectedPerson(u.id)}
                >
                  {u.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="drawer-label">{t("bd.day")}</div>
            <div className="chip-row">
              {[0, 1, 2, 3, 4, 5, 6].map((d) => (
                <button key={d} className={`chip${d === selectedDay ? " selected" : ""}`} onClick={() => setSelectedDay(d)}>
                  {dayName(d, true)}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label>{t("bd.name.label")}</label>
            <input className="input" placeholder={t("bd.name.placeholder")} value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <div className="drawer-label">
              <span>{t("bd.tasks.label")}</span>
              <span>
                {tasks.length} {t("bd.tasks.count")}
              </span>
            </div>
            {tasks.map((task, i) => (
              <div className="builder-task-row" key={i}>
                <span className="dot" />
                <span className="text">{task}</span>
                <button className="remove" onClick={() => setTasks((prev) => prev.filter((_, idx) => idx !== i))} aria-label="Fjern">
                  ×
                </button>
              </div>
            ))}
            <div className="builder-add-row">
              <input
                className="input"
                placeholder={t("bd.tasks.add.placeholder")}
                value={taskDraft}
                onChange={(e) => setTaskDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTask();
                  }
                }}
              />
              <button className="btn btn-secondary" onClick={addTask}>
                {t("bd.tasks.add")}
              </button>
            </div>

            {presets.length > 0 && (
              <div style={{ marginTop: 14 }}>
                <div className="muted-45" style={{ fontSize: 11.5, marginBottom: 8 }}>
                  {t("bd.presets")}
                </div>
                <div className="chip-row">
                  {presets.map((p) => (
                    <button
                      key={p.id}
                      className="chip small"
                      onClick={() => {
                        setName(p.name);
                        setTasks(p.tasks.map((tk) => tk.title));
                      }}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="drawer-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            {t("bd.cancel")}
          </button>
          <button className="btn btn-primary" onClick={save}>
            {t("bd.save")} · {tasks.length} {t("bd.tasks.count")}
          </button>
        </div>
      </div>
    </div>
  );
}
