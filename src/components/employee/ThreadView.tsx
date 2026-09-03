"use client";

import { useEffect, useRef, useState } from "react";
import { CaretLeft, ArrowRight } from "@phosphor-icons/react";
import { Avatar } from "@/components/ui";
import { useStore } from "@/lib/store";
import { formatTime } from "@/lib/format";

export default function ThreadView({ threadId, onBack }: { threadId: string; onBack: () => void }) {
  const { t, data, currentUser, sendMessage } = useStore();
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const thread = data.threads.find((th) => th.id === threadId);
  const messages = data.messages.filter((m) => m.threadId === threadId).sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  if (!thread || !currentUser) return null;

  const other =
    thread.kind === "dm" ? data.users.find((u) => thread.participantIds.includes(u.id) && u.id !== currentUser.id) : undefined;
  const headerInitials = thread.kind === "group" ? "AL" : other?.initials ?? "?";

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    sendMessage(threadId, draft);
    setDraft("");
  }

  return (
    <div className="thread-view">
      <div className="thread-header">
        <button className="thread-back" onClick={onBack} aria-label={t("hb.article.back")}>
          <CaretLeft size={20} weight="bold" />
        </button>
        <Avatar initials={headerInitials} size={32} />
        <div className="who">
          <div className="name">{thread.name}</div>
          <div className="sub">{thread.sub}</div>
        </div>
      </div>
      <div className="thread-messages">
        {messages.map((m) => {
          const mine = m.senderId === currentUser.id;
          const sender = data.users.find((u) => u.id === m.senderId);
          return (
            <div className={`bubble-row ${mine ? "mine" : "theirs"}`} key={m.id}>
              <div className="bubble">{m.text}</div>
              <div className="bubble-meta">
                {mine ? formatTime(new Date(m.createdAt)) : `${sender?.name} · ${formatTime(new Date(m.createdAt))}`}
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>
      <form className="composer" onSubmit={submit}>
        <input
          className="input"
          placeholder={t("mel.composer.placeholder")}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button type="submit" className="composer-send" disabled={!draft.trim()} aria-label="Send">
          <ArrowRight size={18} />
        </button>
      </form>
    </div>
  );
}
