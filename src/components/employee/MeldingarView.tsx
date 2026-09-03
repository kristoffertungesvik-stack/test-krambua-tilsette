"use client";

import { useEffect } from "react";
import { Avatar } from "@/components/ui";
import { useStore } from "@/lib/store";
import { formatTime } from "@/lib/format";
import type { StaffUser, Thread } from "@/lib/types";

export type MTab = "tavle" | "chat";

export default function MeldingarView({
  mtab,
  onChangeTab,
  onOpenThread,
}: {
  mtab: MTab;
  onChangeTab: (t: MTab) => void;
  onOpenThread: (threadId: string) => void;
}) {
  const { t, data, currentUser, markPostRead } = useStore();
  const posts = [...data.posts].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  useEffect(() => {
    if (mtab === "tavle") posts.forEach((p) => markPostRead(p.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mtab]);

  if (!currentUser) return null;

  const threads = data.threads.filter((th) => th.participantIds.includes(currentUser.id));

  return (
    <div className="mel-content">
      <div className="mel-tabs">
        <div className="seg">
          <label className="seg-opt">
            <input type="radio" checked={mtab === "tavle"} onChange={() => onChangeTab("tavle")} />
            {t("mel.tab.tavle")}
          </label>
          <label className="seg-opt">
            <input type="radio" checked={mtab === "chat"} onChange={() => onChangeTab("chat")} />
            {t("mel.tab.chat")}
          </label>
        </div>
      </div>

      {mtab === "tavle" ? (
        <div className="tavle-list">
          {posts.map((p) => {
            const author = data.users.find((u) => u.id === p.authorId);
            return (
              <div className="board-card" key={p.id}>
                <div className="author-row">
                  <Avatar initials={author?.initials ?? "?"} size={26} />
                  <span className="who">
                    {author?.name} · {author?.roleLabel}
                  </span>
                  <span className="time">{formatTime(new Date(p.createdAt))}</span>
                </div>
                <div className="title">{p.title}</div>
                <div className="body">{p.body}</div>
                <div className="receipt">
                  <span className="dot" />
                  {t("mel.readBy")} {p.readBy.length} {t("mel.of")} {data.users.length}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="chat-list">
          {threads.map((th) => (
            <ChatRow key={th.id} thread={th} currentUser={currentUser} onOpen={() => onOpenThread(th.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

function ChatRow({
  thread,
  currentUser,
  onOpen,
}: {
  thread: Thread;
  currentUser: StaffUser;
  onOpen: () => void;
}) {
  const { data, t } = useStore();
  const threadMessages = data.messages
    .filter((m) => m.threadId === thread.id)
    .sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
  const last = threadMessages[threadMessages.length - 1];
  const lastIsMine = last?.senderId === currentUser.id;

  const other =
    thread.kind === "dm" ? data.users.find((u) => thread.participantIds.includes(u.id) && u.id !== currentUser.id) : undefined;
  const initials = thread.kind === "group" ? "AL" : other?.initials ?? "?";

  return (
    <button className="chat-row" onClick={onOpen}>
      <span className={`avatar ${thread.kind === "group" ? "group" : "person"}`}>{initials}</span>
      <span className="body">
        <div className="name">{thread.name}</div>
        <div className="last">
          {last ? `${lastIsMine ? `${t("mel.you")}: ` : ""}${last.text}` : ""}
        </div>
      </span>
      {last && <span className="time">{formatTime(new Date(last.createdAt))}</span>}
    </button>
  );
}
