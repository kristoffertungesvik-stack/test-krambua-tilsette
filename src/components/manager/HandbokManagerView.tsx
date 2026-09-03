"use client";

import { useStore } from "@/lib/store";

export default function HandbokManagerView() {
  const { t, data } = useStore();

  return (
    <div>
      <h2>{t("mgr.nav.handbok")}</h2>
      <div className="hb-mgr-grid">
        {data.handbook.map((a) => (
          <div className="hb-mgr-row" key={a.id}>
            <span className="hb-badge">{a.badge}</span>
            <span className="body">
              <div className="title">{a.title}</div>
              <div className="sub">{a.sub}</div>
            </span>
            <button className="edit-link" title="Åpner redigeringsvisning i produksjon">
              {t("hbm.edit")}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
