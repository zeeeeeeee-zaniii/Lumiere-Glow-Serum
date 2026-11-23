"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "How do I use the serum?",
    a: "Apply 2–3 drops to clean, slightly damp skin, morning and night. Press in gently with your fingertips, then follow with your usual moisturiser. In the morning, finish with sunscreen.",
  },
  {
    q: "When will I start seeing results?",
    a: "Skin usually feels more hydrated within the first few days. A brighter, more even look builds gradually — most customers notice a visible difference in 3–4 weeks of twice-daily use.",
  },
  {
    q: "How long does delivery take?",
    a: "Orders are delivered within 2–4 working days, anywhere in Pakistan. The 2-bottle pack ships free; a Rs 200 delivery fee applies to the single bottle.",
  },
  {
    q: "Can I pay cash on delivery?",
    a: "Yes — every order is cash on delivery. You pay only when your parcel arrives at your door. Just fill in the order form and we will call to confirm before dispatch.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="faq">
      {FAQS.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className={`faq-item${isOpen ? " open" : ""}`}>
            <button
              type="button"
              className="faq-q"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              {item.q}
              <span className="chev" aria-hidden="true">
                ▾
              </span>
            </button>
            {isOpen && <p className="faq-a">{item.a}</p>}
          </div>
        );
      })}
    </div>
  );
}
