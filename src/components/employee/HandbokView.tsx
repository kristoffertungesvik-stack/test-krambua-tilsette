"use client";

import { MagnifyingGlass, CaretRight, CaretLeft } from "@phosphor-icons/react";
import { useStore } from "@/lib/store";
import type { HandbookGroup } from "@/lib/types";

const GROUP_ORDER: {
  id: HandbookGroup;
  labelKey: "hb.group.rutinar" | "hb.group.reglar" | "hb.group.skjema";
}[] = [
  { id: "rutinar", labelKey: "hb.group.rutinar" },
  { id: "reglar", labelKey: "hb.group.reglar" },
  { id: "skjema", labelKey: "hb.group.skjema" },
];

export function HandbokIndex({
  query,
  onQueryChange,
  onOpenArticle,
}: {
  query: string;
  onQueryChange: (q: string) => void;
  onOpenArticle: (id: string) => void;
}) {
  const { t, data } = useStore();
  const q = query.trim().toLowerCase();
  const matches = (title: string, sub: string, steps: string[]) =>
    !q ||
    title.toLowerCase().includes(q) ||
    sub.toLowerCase().includes(q) ||
    steps.some((step) => step.toLowerCase().includes(q));

  const groups = GROUP_ORDER.map((g) => ({
    ...g,
    items: data.handbook.filter(
      (a) => a.group === g.id && matches(a.title, a.sub, a.steps)
    ),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="hb-content">
      <div className="hb-search">
        <MagnifyingGlass size={16} />
        <input
          placeholder={t("hb.search.placeholder")}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </div>
      {groups.length === 0 ? (
        <div className="empty-hint" style={{ padding: "20px 0" }}>
          {t("hb.empty").replace(".", "")} på «{query}». {t("hb.empty.hint")}
        </div>
      ) : (
        groups.map((g) => (
          <div key={g.id}>
            <div className="hb-group-heading">{t(g.labelKey)}</div>
            <div className="hb-group">
              {g.items.map((a) => (
                <button className="hb-item" key={a.id} onClick={() => onOpenArticle(a.id)}>
                  <span className="hb-badge">{a.badge}</span>
                  <span className="body">
                    <div className="title">{a.title}</div>
                    <div className="sub">{a.sub}</div>
                  </span>
                  <CaretRight className="chev" size={16} />
                </button>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export function HandbokArticleView({
  articleId,
  onBack,
  onReportDeviation,
}: {
  articleId: string;
  onBack: () => void;
  onReportDeviation: () => void;
}) {
  const { t, data } = useStore();
  const article = data.handbook.find((a) => a.id === articleId);
  if (!article) return null;

  return (
    <div className="hb-content hb-article">
      <button className="hb-back" onClick={onBack}>
        <CaretLeft size={14} weight="bold" />
        {t("hb.article.back")}
      </button>
      <div className="kicker">
        {article.group === "rutinar" ? "Rutine" : article.badge} {article.badge}
      </div>
      <h1>{article.title}</h1>
      {article.sub && <div className="muted-62">{article.sub}</div>}
      <div className="meta">
        {t("hb.article.updatedBy")} {article.updatedAt} av {article.updatedBy} ·{" "}
        {t("hb.article.readTime")} {article.readMinutes} {t("hb.article.min")}
      </div>

      {article.steps.length > 0 && (
        <div className="hb-steps">
          {article.steps.map((step, i) => (
            <div className="hb-step" key={i}>
              <span className="hb-step-num">{i + 1}</span>
              <span className="hb-step-text">{step}</span>
            </div>
          ))}
        </div>
      )}

      <div className="hb-article-actions">
        {article.attachment ? (
          <a
            className="btn btn-secondary"
            href={article.attachment.dataUrl}
            download={article.attachment.name}
          >
            Last ned {article.attachment.name}
          </a>
        ) : (
          <button className="btn btn-secondary" disabled>
            Ingen vedlegg
          </button>
        )}
        <button className="btn btn-primary" onClick={onReportDeviation}>
          {t("hb.article.reportDeviation")}
        </button>
      </div>
    </div>
  );
}
