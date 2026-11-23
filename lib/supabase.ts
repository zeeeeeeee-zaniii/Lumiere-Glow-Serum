// Server-only Supabase REST helper.
// All database access goes through Next.js API routes / server components
// using the secret key, so nothing sensitive ever reaches the browser.

import { DEFAULT_THEME, isThemeId, type ThemeId } from "./themes";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

export function supabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_SECRET_KEY);
}

async function sbFetch(path: string, init?: RequestInit): Promise<Response> {
  if (!supabaseConfigured()) {
    throw new Error("Supabase is not configured");
  }
  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: SUPABASE_SECRET_KEY as string,
      Authorization: `Bearer ${SUPABASE_SECRET_KEY}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  address: string;
  pack: string;
  quantity: number;
  created_at: string;
}

export async function getTheme(): Promise<ThemeId> {
  if (!supabaseConfigured()) return DEFAULT_THEME;
  try {
    const res = await sbFetch(
      "land_settings?key=eq.theme&select=value&limit=1"
    );
    if (!res.ok) return DEFAULT_THEME;
    const rows = (await res.json()) as { value?: string }[];
    const value = rows?.[0]?.value;
    return isThemeId(value) ? value : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

export async function setTheme(theme: ThemeId): Promise<void> {
  const res = await sbFetch("land_settings", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({ key: "theme", value: theme }),
  });
  if (!res.ok) {
    throw new Error(`Failed to save theme (${res.status})`);
  }
}

export async function insertLead(lead: {
  name: string;
  phone: string;
  address: string;
  pack: string;
  quantity: number;
}): Promise<void> {
  const res = await sbFetch("land_leads", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify(lead),
  });
  if (!res.ok) {
    throw new Error(`Failed to save lead (${res.status})`);
  }
}

export async function listLeads(): Promise<Lead[]> {
  const res = await sbFetch(
    "land_leads?select=id,name,phone,address,pack,quantity,created_at&order=created_at.desc&limit=500"
  );
  if (!res.ok) {
    throw new Error(`Failed to load leads (${res.status})`);
  }
  return (await res.json()) as Lead[];
}

export async function deleteLead(id: string): Promise<void> {
  const res = await sbFetch(`land_leads?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { Prefer: "return=minimal" },
  });
  if (!res.ok) {
    throw new Error(`Failed to delete lead (${res.status})`);
  }
}
