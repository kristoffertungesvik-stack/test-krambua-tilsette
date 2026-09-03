"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { DEMO_PASSWORD } from "@/lib/mock-data";
import Splash from "@/components/Splash";
import type { Lang } from "@/lib/i18n";

export default function LoginPage() {
  const { hydrated, currentUser, login, lang, setLang, t } = useStore();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (hydrated && currentUser) {
      router.replace(currentUser.role === "leiar" ? "/leiar" : "/ansatt");
    }
  }, [hydrated, currentUser, router]);

  if (!hydrated || currentUser) return <Splash />;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = login(username, password);
    if (!ok) setError(true);
  }

  return (
    <form className="login-screen" onSubmit={handleSubmit}>
      <div className="login-mark">
        <span />
      </div>
      <div className="login-kicker">{t("login.kicker")}</div>
      <h1 className="login-heading">{t("login.heading")}</h1>
      <p className="login-sub">{t("login.sub")}</p>

      <div className="login-fields">
        <div className="field">
          <label htmlFor="username">{t("login.username.label")}</label>
          <input
            id="username"
            className="input"
            placeholder="ingrid.vik"
            autoComplete="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError(false);
            }}
          />
        </div>
        <div className="field">
          <label htmlFor="password">{t("login.password.label")}</label>
          <input
            id="password"
            type="password"
            className="input"
            placeholder="••••••••"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
          />
        </div>
        {error && <div className="login-error">{t("login.error")}</div>}

        <button type="submit" className="btn btn-primary btn-block" style={{ minHeight: 48 }}>
          {t("login.submit")}
        </button>
      </div>

      <button type="button" className="login-forgot" onClick={() => setShowHint((v) => !v)}>
        {t("login.forgot")}
      </button>
      {showHint && (
        <p className="muted-45" style={{ fontSize: 12, textAlign: "center", marginTop: -6 }}>
          {t("login.forgot.body")} (Demo: passordet er «{DEMO_PASSWORD}» for alle.)
        </p>
      )}

      <div className="lang-switch">
        <div className="caption">{t("login.lang.caption")}</div>
        <div className="seg">
          <LangOption lang="nn" current={lang} onSelect={setLang} label="Nynorsk" />
          <LangOption lang="nb" current={lang} onSelect={setLang} label="Bokmål" />
        </div>
      </div>
    </form>
  );
}

function LangOption({
  lang,
  current,
  onSelect,
  label,
}: {
  lang: Lang;
  current: Lang;
  onSelect: (l: Lang) => void;
  label: string;
}) {
  return (
    <label className="seg-opt">
      <input type="radio" name="lang" checked={current === lang} onChange={() => onSelect(lang)} />
      {label}
    </label>
  );
}
