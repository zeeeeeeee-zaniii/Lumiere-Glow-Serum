"use client";

import { useMemo, useState, type FormEvent } from "react";
import Faq from "@/components/Faq";
import Reveal from "@/components/Reveal";

export const PACKS = [
  {
    id: "1 Bottle",
    label: "1 Bottle — Rs 1,499",
    price: 1499,
    was: 2200,
    popular: false,
    points: ["30 ml — about 1 month", "Delivery Rs 200", "Cash on Delivery"],
  },
  {
    id: "2 Bottles",
    label: "2 Bottles — Rs 2,499 (Free delivery)",
    price: 2499,
    was: 4400,
    popular: true,
    points: ["2 × 30 ml — about 2 months", "FREE delivery", "Cash on Delivery", "Save Rs 1,901"],
  },
] as const;

type PackId = (typeof PACKS)[number]["id"];

function scrollToOrder() {
  document
    .getElementById("order")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function ShopSection() {
  const [pack, setPack] = useState<PackId>("2 Bottles");
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");

  const selected = useMemo(
    () => PACKS.find((p) => p.id === pack) ?? PACKS[0],
    [pack]
  );
  const total = selected.price * quantity;

  function choosePack(id: PackId) {
    setPack(id);
    scrollToOrder();
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (name.trim().length < 2) return setError("Please enter your full name.");
    if (phone.replace(/\D/g, "").length < 10)
      return setError("Please enter a valid phone number.");
    if (address.trim().length < 8)
      return setError("Please enter your complete delivery address.");

    setStatus("sending");
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          pack,
          quantity,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setStatus("done");
    } catch (err) {
      setStatus("idle");
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  }

  return (
    <>
      {/* ---------- pricing ---------- */}
      <section className="section section-soft" id="pricing">
        <div className="container">
          <div className="section-head center">
            <span className="kicker">Pricing</span>
            <h2>Simple launch pricing</h2>
            <p>Pay only when your parcel arrives — cash on delivery, always.</p>
          </div>
          <div className="packs">
            {PACKS.map((p) => (
              <div key={p.id} className={`pack${p.popular ? " popular" : ""}`}>
                {p.popular && <span className="pack-badge">Most Popular</span>}
                <h3>{p.id}</h3>
                <div className="pack-price">
                  Rs {p.price.toLocaleString()}
                  <small>Rs {p.was.toLocaleString()}</small>
                </div>
                <ul>
                  {p.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <button
                  type="button"
                  className={`btn ${p.popular ? "btn-accent" : "btn-primary"}`}
                  onClick={() => choosePack(p.id)}
                >
                  Order {p.id}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- faq ---------- */}
      <section className="section section-soft">
        <div className="container">
          <Reveal>
            <div className="section-head center">
              <span className="kicker">Questions</span>
              <h2>Before you order</h2>
            </div>
          </Reveal>
          <Faq />
        </div>
      </section>

      {/* ---------- order form ---------- */}
      <section className="section" id="order">
        <div className="container">
          <div className="order-panel">
            <div className="order-copy">
              <span className="kicker">Order now</span>
              <h2>Get your glow delivered</h2>
              <p>
                Fill in the form — we call to confirm, you pay cash when it
                arrives.
              </p>
              <ul className="cod-points">
                <li>
                  <span className="tick">✓</span> Pay cash at your doorstep
                </li>
                <li>
                  <span className="tick">✓</span> Free delivery on the 2-bottle
                  pack
                </li>
                <li>
                  <span className="tick">✓</span> Dispatched within 24 hours
                </li>
              </ul>
            </div>

            {status === "done" ? (
              <div className="order-form">
                <div className="form-success">
                  <span className="big-tick">✓</span>
                  <h3 className="display">Thank you, {name.split(" ")[0]}!</h3>
                  <p>
                    Your order for <strong>{pack}</strong> (×{quantity}) is
                    received. We will call {phone} shortly to confirm, and you
                    pay <strong>Rs {total.toLocaleString()}</strong> in cash
                    on delivery.
                  </p>
                  <button
                    type="button"
                    className="btn btn-ghost btn-small"
                    onClick={() => {
                      setStatus("idle");
                      setName("");
                      setPhone("");
                      setAddress("");
                      setQuantity(1);
                    }}
                  >
                    Place another order
                  </button>
                </div>
              </div>
            ) : (
              <form className="order-form" onSubmit={onSubmit} noValidate>
                <div className="field">
                  <label htmlFor="f-name">Full name</label>
                  <input
                    id="f-name"
                    className="input"
                    type="text"
                    autoComplete="name"
                    placeholder="e.g. Ayesha Khan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="f-phone">Phone number</label>
                  <input
                    id="f-phone"
                    className="input"
                    type="tel"
                    autoComplete="tel"
                    placeholder="03XX-XXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="f-address">Complete address</label>
                  <textarea
                    id="f-address"
                    className="input"
                    rows={3}
                    autoComplete="street-address"
                    placeholder="House, street, area, city"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="field">
                    <label htmlFor="f-pack">Pack</label>
                    <select
                      id="f-pack"
                      className="input"
                      value={pack}
                      onChange={(e) => setPack(e.target.value as PackId)}
                    >
                      {PACKS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="f-qty">Quantity</label>
                    <input
                      id="f-qty"
                      className="input"
                      type="number"
                      min={1}
                      max={10}
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(
                          Math.min(10, Math.max(1, Number(e.target.value) || 1))
                        )
                      }
                    />
                  </div>
                </div>
                {error && <p className="form-error">{error}</p>}
                <div className="order-total">
                  <span>Total (pay on delivery)</span>
                  <strong>Rs {total.toLocaleString()}</strong>
                </div>
                <button
                  type="submit"
                  className="btn btn-accent"
                  disabled={status === "sending"}
                >
                  {status === "sending"
                    ? "Placing your order…"
                    : "Place Order — Cash on Delivery"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
