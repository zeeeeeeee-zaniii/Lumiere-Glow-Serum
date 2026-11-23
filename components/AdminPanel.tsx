"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { THEMES, DEFAULT_THEME, type ThemeId } from "@/lib/themes";
import type { Lead } from "@/lib/supabase";

type SessionState = "checking" | "signed-out" | "signed-in";

function localToday(): { today: string; tzOffset: number } {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    today: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
    tzOffset: -now.getTimezoneOffset(),
  };
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AdminPanel() {
  const router = useRouter();
  const [session, setSession] = useState<SessionState>("checking");
  const [passcode, setPasscode] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [tab, setTab] = useState<"leads" | "theme">("leads");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [todayCount, setTodayCount] = useState(0);
  const [leadsError, setLeadsError] = useState("");
  const [loadingLeads, setLoadingLeads] = useState(false);

  const [theme, setThemeState] = useState<ThemeId>(DEFAULT_THEME);
  const [themeMsg, setThemeMsg] = useState("");
  const [savingTheme, setSavingTheme] = useState(false);

  const loadLeads = useCallback(async () => {
    setLoadingLeads(true);
    setLeadsError("");
    const { today, tzOffset } = localToday();
    try {
      const res = await fetch(
        `/api/admin/leads?today=${today}&tzOffset=${tzOffset}`
      );
      if (res.status === 401) {
        setSession("signed-out");
        return;
      }
      const data = (await res.json()) as {
        leads?: Lead[];
        total?: number;
        todayCount?: number;
        error?: string;
      };
      if (!res.ok) throw new Error(data.error || "Could not load leads.");
      setLeads(data.leads ?? []);
      setTotal(data.total ?? 0);
      setTodayCount(data.todayCount ?? 0);
      setSession("signed-in");
    } catch (err) {
      setLeadsError(
        err instanceof Error ? err.message : "Could not load leads."
      );
      setSession("signed-in");
    } finally {
      setLoadingLeads(false);
    }
  }, []);

  const loadTheme = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/theme");
      if (res.ok) {
        const data = (await res.json()) as { theme: ThemeId };
        setThemeState(data.theme);
      }
    } catch {
      /* keep the default */
    }
  }, []);

  useEffect(() => {
    void loadLeads();
    void loadTheme();
  }, [loadLeads, loadTheme]);

  async function onLogin(e: FormEvent) {
    e.preventDefault();
    setLoginError("");
    setLoggingIn(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Login failed.");
      setPasscode("");
      await loadLeads();
      await loadTheme();
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoggingIn(false);
    }
  }

  async function onLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setSession("signed-out");
    setLeads([]);
  }

  async function onDelete(id: string) {
    if (!window.confirm("Delete this lead? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/leads?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      await loadLeads();
    } catch {
      setLeadsError("Could not delete the lead. Please try again.");
    }
  }

  async function onTheme(id: ThemeId) {
    setSavingTheme(true);
    setThemeMsg("");
    // Apply instantly in this browser, then persist for every visitor.
    document.documentElement.dataset.theme = id;
    try {
      const res = await fetch("/api/admin/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: id }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Could not save the theme.");
      setThemeState(id);
      setThemeMsg("Theme saved — it is now live for all visitors.");
      router.refresh();
    } catch (err) {
      setThemeMsg(
        err instanceof Error ? err.message : "Could not save the theme."
      );
    } finally {
      setSavingTheme(false);
    }
  }

  if (session === "checking") {
    return (
      <div className="admin-card login-card">
        <p className="empty-note">Checking your session…</p>
      </div>
    );
  }

  if (session === "signed-out") {
    return (
      <form className="admin-card login-card" onSubmit={onLogin}>
        <div>
          <h1 className="display" style={{ fontSize: "1.5rem" }}>
            Lumière Admin
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "0.93rem" }}>
            Enter the admin passcode to see orders and change the site theme.
          </p>
        </div>
        <div className="field">
          <label htmlFor="a-pass">Passcode</label>
          <input
            id="a-pass"
            className="input"
            type="password"
            autoComplete="current-password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            required
          />
        </div>
        {loginError && <p className="form-error">{loginError}</p>}
        <button type="submit" className="btn btn-primary" disabled={loggingIn}>
          {loggingIn ? "Signing in…" : "Sign in"}
        </button>
        <a href="/" className="admin-link" style={{ textAlign: "center" }}>
          ← Back to the site
        </a>
      </form>
    );
  }

  const bottlesToday = leads
    .filter((lead) => {
      const { today } = localToday();
      const d = new Date(lead.created_at);
      const pad = (n: number) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` === today;
    })
    .reduce((sum, lead) => sum + lead.quantity, 0);

  return (
    <div>
      <div className="admin-head">
        <h1 className="display">Lumière Admin</h1>
        <div style={{ display: "flex", gap: "0.6rem" }}>
          <a href="/" className="btn btn-ghost btn-small">
            View site
          </a>
          <button
            type="button"
            className="btn btn-ghost btn-small"
            onClick={onLogout}
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="tabs" role="tablist">
        <button
          type="button"
          className={`tab${tab === "leads" ? " active" : ""}`}
          onClick={() => setTab("leads")}
        >
          Leads
        </button>
        <button
          type="button"
          className={`tab${tab === "theme" ? " active" : ""}`}
          onClick={() => setTab("theme")}
        >
          Theme
        </button>
      </div>

      {tab === "leads" && (
        <>
          <div className="stat-grid">
            <div className="stat">
              <strong>{total}</strong>
              <span>Total leads</span>
            </div>
            <div className="stat">
              <strong>{todayCount}</strong>
              <span>Leads today</span>
            </div>
            <div className="stat">
              <strong>{bottlesToday}</strong>
              <span>Bottles ordered today</span>
            </div>
          </div>

          {leadsError && (
            <p className="form-error" style={{ marginBottom: "1rem" }}>
              {leadsError}
            </p>
          )}

          {loadingLeads ? (
            <p className="empty-note">Loading leads…</p>
          ) : leads.length === 0 && !leadsError ? (
            <div className="admin-card">
              <p className="empty-note">
                No leads yet. New orders from the landing page will appear
                here.
              </p>
            </div>
          ) : (
            <div className="lead-list">
              {leads.map((lead) => (
                <div key={lead.id} className="lead-row">
                  <div>
                    <h3>{lead.name}</h3>
                    <p>
                      {lead.phone} · {lead.address}
                    </p>
                    <p className="lead-pack">
                      {lead.pack} × {lead.quantity}
                    </p>
                    <span className="lead-date">
                      {formatDate(lead.created_at)}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-danger btn-small"
                    onClick={() => onDelete(lead.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === "theme" && (
        <div className="admin-card">
          <h2 className="display" style={{ fontSize: "1.3rem", marginBottom: "0.4rem" }}>
            Site theme
          </h2>
          <p style={{ color: "var(--muted)", marginBottom: "1.3rem" }}>
            Pick a palette and the whole landing page — hero included — changes
            for every visitor.
          </p>
          <div className="theme-grid">
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`theme-card${theme === t.id ? " active" : ""}`}
                onClick={() => onTheme(t.id)}
                disabled={savingTheme}
              >
                <span className="swatches">
                  {t.swatches.map((hex) => (
                    <span key={hex} style={{ background: hex }} />
                  ))}
                </span>
                <strong>{t.name}</strong>
                <small>
                  {theme === t.id ? "Active theme" : "Tap to apply"}
                </small>
              </button>
            ))}
          </div>
          {themeMsg && (
            <p style={{ marginTop: "1rem", color: "var(--muted)" }}>{themeMsg}</p>
          )}
        </div>
      )}
    </div>
  );
}
