import { NextResponse } from "next/server";
import { insertLead, supabaseConfigured } from "@/lib/supabase";

const VALID_PACKS = ["1 Bottle", "2 Bottles"];

export async function POST(request: Request) {
  if (!supabaseConfigured()) {
    return NextResponse.json(
      {
        error:
          "Ordering is not connected yet. Please try again later — your details were not saved.",
      },
      { status: 503 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const address = typeof body.address === "string" ? body.address.trim() : "";
  const pack = typeof body.pack === "string" ? body.pack : "";
  const quantity = Number(body.quantity);

  if (name.length < 2)
    return NextResponse.json(
      { error: "Please enter your full name." },
      { status: 400 }
    );
  if (phone.replace(/\D/g, "").length < 10)
    return NextResponse.json(
      { error: "Please enter a valid phone number." },
      { status: 400 }
    );
  if (address.length < 8)
    return NextResponse.json(
      { error: "Please enter your complete delivery address." },
      { status: 400 }
    );
  if (!VALID_PACKS.includes(pack))
    return NextResponse.json(
      { error: "Please choose a pack." },
      { status: 400 }
    );
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10)
    return NextResponse.json(
      { error: "Quantity must be between 1 and 10." },
      { status: 400 }
    );

  try {
    await insertLead({ name, phone, address, pack, quantity });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "We could not save your order. Please try again." },
      { status: 502 }
    );
  }
}
