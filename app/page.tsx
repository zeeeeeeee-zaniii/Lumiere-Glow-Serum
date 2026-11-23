import Link from "next/link";
import Reveal from "@/components/Reveal";
import ShopSection from "@/components/ShopSection";
import StickyBar from "@/components/StickyBar";

const BENEFITS = [
  {
    icon: "✦",
    title: "Brighter-looking skin",
    text: "Vitamin C helps skin look fresher and more even, day after day.",
  },
  {
    icon: "💧",
    title: "Deep hydration",
    text: "Hyaluronic Acid draws in moisture, so skin feels soft and plump — never tight.",
  },
  {
    icon: "🌿",
    title: "Fades the look of dark spots",
    text: "With regular use, dark spots and dull patches look softer and less visible.",
  },
  {
    icon: "☁",
    title: "Lightweight & non-sticky",
    text: "A silky, fast-absorbing texture that sits comfortably under moisturiser and makeup.",
  },
];

const LANDING_PHOTO_BASE =
  "https://rltxedmwdojuovlblkea.supabase.co/storage/v1/object/public/site-assets/landing";

const HERO_PHOTO_URL = `${LANDING_PHOTO_BASE}/hero.jpg`;

/** Prototype photos per how-to-use step title. */
const STEP_PHOTOS: Record<string, string> = {
  "Apply 2–3 drops": `${LANDING_PHOTO_BASE}/step-apply.jpg`,
  "Press in gently": `${LANDING_PHOTO_BASE}/step-press.jpg`,
  "Glow, twice a day": `${LANDING_PHOTO_BASE}/step-glow.jpg`,
};

/** Prototype photos per ingredient name. */
const INGREDIENT_PHOTOS: Record<string, string> = {
  "Vitamin C": `${LANDING_PHOTO_BASE}/vitc.jpg`,
  "Hyaluronic Acid": `${LANDING_PHOTO_BASE}/hyaluronic.webp`,
  "Rosehip Oil": `${LANDING_PHOTO_BASE}/rosehip.webp`,
};

const STEPS = [
  {
    title: "Apply 2–3 drops",
    text: "On clean, slightly damp skin, smooth a few drops over your face and neck.",
  },
  {
    title: "Press in gently",
    text: "Pat with your fingertips until it absorbs — no rubbing needed.",
  },
  {
    title: "Glow, twice a day",
    text: "Follow with moisturiser. Use morning and night for your best glow.",
  },
];

const INGREDIENTS = [
  {
    name: "Vitamin C",
    text: "The brightening favourite — supports a fresh, even-looking glow.",
  },
  {
    name: "Hyaluronic Acid",
    text: "A moisture magnet that helps skin hold water and feel deeply hydrated.",
  },
  {
    name: "Rosehip Oil",
    text: "A gentle botanical oil that nourishes and softens the look of skin.",
  },
];

const REVIEWS = [
  {
    quote:
      "Two weeks in and my skin genuinely looks brighter in the morning. It sinks in fast and never feels sticky.",
    name: "Ayesha",
    meta: "Using it for 1 month",
  },
  {
    quote:
      "My dark spots look softer and my makeup sits so much better now. I ordered the 2-bottle pack the second time.",
    name: "Mahnoor",
    meta: "Using it for 2 months",
  },
  {
    quote:
      "I have dry, sensitive skin and this is the first serum that didn't irritate it. My face feels hydrated all day.",
    name: "Fatima",
    meta: "Using it for 3 weeks",
  },
];

const TICKS = [
  "Vitamin C + Hyaluronic Acid",
  "For all skin types",
  "Cash on Delivery available",
];

export default function Home() {
  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <Link href="/" className="brand">
            Lumière <em>Glow</em>
          </Link>
          <div className="header-actions">
            <Link href="/admin" className="admin-link">
              Admin
            </Link>
            <a href="#order" className="btn btn-primary btn-small">
              Order Now
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* ---------- hero ---------- */}
        <section className="hero">
          <div className="container hero-grid">
            <div>
              <span className="eyebrow">Launch offer — save Rs 701</span>
              <h1>
                Brighter, deeply hydrated skin — in one small bottle.
              </h1>
              <p className="hero-promise">
                Lumière Glow Serum blends Vitamin C and Hyaluronic Acid into a
                feather-light daily serum that helps skin look fresh, even and
                lit from within.
              </p>
              <div className="price-row">
                <span className="price-now">Rs 1,499</span>
                <span className="price-was">Rs 2,200</span>
                <span className="price-tag">Launch Offer</span>
              </div>
              <ul className="ticks">
                {TICKS.map((tick) => (
                  <li key={tick}>
                    <span className="tick">✓</span>
                    {tick}
                  </li>
                ))}
              </ul>
              <a href="#order" className="btn btn-accent">
                Order Now
              </a>
              <p className="hero-note">
                <span aria-label="5 out of 5 stars">★★★★★</span> Loved by early
                customers
              </p>
            </div>
            <div className="hero-art">
              <div className="glow" aria-hidden="true" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={HERO_PHOTO_URL}
                alt="Lumière Glow Serum bottle"
                className="hero-photo"
                loading="eager"
              />
            </div>
          </div>
        </section>

        {/* ---------- trust strip ---------- */}
        <section className="trust-strip">
          <div className="container">
            <span>🚚 Delivery in 2–4 working days</span>
            <span>💵 Cash on Delivery</span>
            <span>🛡 Sealed, genuine product</span>
          </div>
        </section>

        {/* ---------- benefits ---------- */}
        <section className="section">
          <div className="container">
            <Reveal>
              <div className="section-head">
                <span className="kicker">Why Lumière</span>
                <h2>One serum, four things your skin will thank you for</h2>
              </div>
            </Reveal>
            <div className="cards cards-4">
              {BENEFITS.map((b) => (
                <article key={b.title} className="card">
                  <div className="card-icon" aria-hidden="true">
                    {b.icon}
                  </div>
                  <h3>{b.title}</h3>
                  <p>{b.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- how to use ---------- */}
        <section className="section section-soft">
          <div className="container">
            <Reveal>
              <div className="section-head">
                <span className="kicker">How to use</span>
                <h2>Thirty seconds, morning and night</h2>
                <p>
                  No complicated routine — the serum slips into whatever you
                  already do.
                </p>
              </div>
            </Reveal>
            <div className="steps">
              {STEPS.map((step, i) => (
                <div key={step.title} className="step">
                  {STEP_PHOTOS[step.title] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={STEP_PHOTOS[step.title]}
                      alt={step.title}
                      className="step-photo"
                      loading="lazy"
                    />
                  )}
                  <span className="step-num">{i + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- ingredients ---------- */}
        <section className="section">
          <div className="container">
            <Reveal>
              <div className="section-head">
                <span className="kicker">What&apos;s inside</span>
                <h2>Three ingredients that earn their place</h2>
                <p>Nothing decorative — every drop is there to do a job.</p>
              </div>
            </Reveal>
            <div className="cards cards-3">
              {INGREDIENTS.map((ing) => (
                <article key={ing.name} className="card">
                  {INGREDIENT_PHOTOS[ing.name] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={INGREDIENT_PHOTOS[ing.name]}
                      alt={ing.name}
                      className="ingredient-photo"
                      loading="lazy"
                    />
                  )}
                  <h3>{ing.name}</h3>
                  <p>{ing.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- reviews ---------- */}
        <section className="section section-soft">
          <div className="container">
            <Reveal>
              <div className="section-head center">
                <span className="kicker">Reviews</span>
                <h2>What early customers say</h2>
              </div>
            </Reveal>
            <div className="cards cards-3">
              {REVIEWS.map((review) => (
                <article key={review.name} className="card">
                  <div className="stars" aria-label="5 out of 5 stars">
                    ★★★★★
                  </div>
                  <p>“{review.quote}”</p>
                  <div className="review-name">{review.name}</div>
                  <div className="review-meta">{review.meta}</div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- pricing, faq + order form ---------- */}
        <ShopSection />
      </main>

      <footer className="site-footer">
        <div className="container">
          <span className="brand">
            Lumière <em>Glow</em>
          </span>
          <p>
            Lumière Glow Serum — a daily brightening serum with Vitamin C,
            Hyaluronic Acid and Rosehip Oil. Cash on Delivery available.
          </p>
          <span className="demo-note">
            Demo website — fictional product, built to showcase a landing page
            design
          </span>
        </div>
      </footer>

      <StickyBar />
    </>
  );
}
