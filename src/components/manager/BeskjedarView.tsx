"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { audienceLine } from "@/lib/i18n";
import { formatTime } from "@/lib/format";

export default function BeskjedarView() {
  const { t, lang, data, createPost } = useStore();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const staffCount = data.users.filter((u) => u.role === "tilsett").length;
  const posts = [...data.posts].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    createPost(title, body);
    setTitle("");
    setBody("");
  }

  return (
    <div>
      <h2>{t("mgr.nav.beskjedar")}</h2>
      <form className="compose-card" onSubmit={submit}>
        <div className="field">
          <label>{t("bk.title.label")}</label>
          <input className="input" placeholder={t("bk.title.placeholder")} value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="field">
          <label>{t("bk.body.label")}</label>
          <textarea className="input" placeholder={t("bk.body.placeholder")} value={body} onChange={(e) => setBody(e.target.value)} />
        </div>
        <div className="compose-footer-row">
          <span className="muted-45" style={{ fontSize: 12.5 }}>
            {audienceLine(staffCount, lang)}
          </span>
          <button type="submit" className="btn btn-primary">
            {t("bk.submit")}
          </button>
        </div>
      </form>

      <div className="mgr-section-title">{t("bk.earlier")}</div>
      {posts.map((p) => (
        <div className="post-row" key={p.id}>
          <div>
            <div className="title">{p.title}</div>
            <div className="body">{p.body}</div>
          </div>
          <div className="side">
            <span className="time">{formatTime(new Date(p.createdAt))}</span>
            <span className="read-count-tag">
              {p.readBy.length}/{staffCount}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
