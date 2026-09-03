"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { todayIndex } from "@/lib/format";
import Header from "./Header";
import TabBar, { type EmpTab } from "./TabBar";
import HeimView from "./HeimView";
import SjekklisteView from "./SjekklisteView";
import DeviationSheet from "./DeviationSheet";
import MeldingarView, { type MTab } from "./MeldingarView";
import ThreadView from "./ThreadView";
import { HandbokIndex, HandbokArticleView } from "./HandbokView";

export default function EmployeeApp() {
  const { data, currentUser } = useStore();
  const [tab, setTab] = useState<EmpTab>("heim");
  const [sheetTaskId, setSheetTaskId] = useState<string | null>(null);
  const [mtab, setMtab] = useState<MTab>("tavle");
  const [threadId, setThreadId] = useState<string | null>(null);
  const [hbQuery, setHbQuery] = useState("");
  const [articleId, setArticleId] = useState<string | null>(null);

  if (!currentUser) return null;

  const todayList = data.lists.find((l) => l.personId === currentUser.id && l.dayIndex === todayIndex());
  const unreadCount = data.posts.filter((p) => !p.readBy.includes(currentUser.id)).length;
  const recentPosts = [...data.posts]
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 2);

  function goTab(next: EmpTab) {
    setArticleId(null);
    setTab(next);
  }

  return (
    <div className="emp-frame">
      <Header user={currentUser} />
      <div className="emp-content">
        {tab === "heim" && (
          <HeimView
            list={todayList}
            recentPosts={recentPosts}
            onOpenList={() => goTab("sjekk")}
            onOpenPost={() => {
              setMtab("tavle");
              goTab("meldingar");
            }}
            onOpenArticle={(id) => {
              setArticleId(id);
              goTab("handbok");
            }}
          />
        )}
        {tab === "sjekk" && <SjekklisteView list={todayList} onOpenSheet={setSheetTaskId} />}
        {tab === "meldingar" && (
          <MeldingarView mtab={mtab} onChangeTab={setMtab} onOpenThread={setThreadId} />
        )}
        {tab === "handbok" &&
          (articleId ? (
            <HandbokArticleView
              articleId={articleId}
              onBack={() => setArticleId(null)}
              onReportDeviation={() => goTab("sjekk")}
            />
          ) : (
            <HandbokIndex query={hbQuery} onQueryChange={setHbQuery} onOpenArticle={setArticleId} />
          ))}
      </div>
      <TabBar tab={tab} onChange={goTab} unreadCount={unreadCount} />

      {threadId && <ThreadView threadId={threadId} onBack={() => setThreadId(null)} />}
      {sheetTaskId && todayList && (
        <DeviationSheet list={todayList} taskId={sheetTaskId} onClose={() => setSheetTaskId(null)} />
      )}
    </div>
  );
}
