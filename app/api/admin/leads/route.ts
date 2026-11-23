import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { deleteLead, listLeads, supabaseConfigured } from "@/lib/supabase";

export async function GET(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (!supabaseConfigured()) {
    return NextResponse.json(
      { error: "The database is not connected yet." },
      { status: 503 }
    );
  }

  // "Today" is counted on the admin's own clock: the client passes its local
  // date (YYYY-MM-DD) and UTC offset in minutes, and we build the matching
  // UTC window here.
  const { searchParams } = new URL(request.url);
  const todayParam = searchParams.get("today");
  const offsetMin = Number(searchParams.get("tzOffset") ?? "0");

  try {
    const leads = await listLeads();
    let todayCount = 0;
    if (todayParam && /^\d{4}-\d{2}-\d{2}$/.test(todayParam)) {
      const startUtc =
        Date.parse(`${todayParam}T00:00:00.000Z`) - offsetMin * 60_000;
      const endUtc = startUtc + 24 * 60 * 60_000;
      todayCount = leads.filter((lead) => {
        const t = Date.parse(lead.created_at);
        return t >= startUtc && t < endUtc;
      }).length;
    }
    return NextResponse.json({ leads, total: leads.length, todayCount });
  } catch {
    return NextResponse.json(
      { error: "Could not load leads from the database." },
      { status: 502 }
    );
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (!supabaseConfigured()) {
    return NextResponse.json(
      { error: "The database is not connected yet." },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing lead id." }, { status: 400 });
  }

  try {
    await deleteLead(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Could not delete the lead." },
      { status: 502 }
    );
  }
}
