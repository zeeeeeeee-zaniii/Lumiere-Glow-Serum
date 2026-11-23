import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getTheme, setTheme, supabaseConfigured } from "@/lib/supabase";
import { isThemeId } from "@/lib/themes";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  const theme = await getTheme();
  return NextResponse.json({ theme });
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (!supabaseConfigured()) {
    return NextResponse.json(
      { error: "The database is not connected yet." },
      { status: 503 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!isThemeId(body.theme)) {
    return NextResponse.json({ error: "Unknown theme." }, { status: 400 });
  }

  try {
    await setTheme(body.theme);
    return NextResponse.json({ ok: true, theme: body.theme });
  } catch {
    return NextResponse.json(
      { error: "Could not save the theme." },
      { status: 502 }
    );
  }
}
