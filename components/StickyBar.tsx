"use client";

import { useEffect, useState } from "react";

// Sticky mobile "Order Now" bar — appears after the hero scrolls away and
// hides while the order form itself is on screen.
export default function StickyBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let pastHero = false;
    let orderVisible = false;
    const update = () => setShow(pastHero && !orderVisible);

    const onScroll = () => {
      pastHero = window.scrollY > window.innerHeight * 0.7;
      update();
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const orderEl = document.getElementById("order");
    let observer: IntersectionObserver | undefined;
    if (orderEl) {
      observer = new IntersectionObserver(
        (entries) => {
          orderVisible = entries[0]?.isIntersecting ?? false;
          update();
        },
        { threshold: 0.08 }
      );
      observer.observe(orderEl);
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
    };
  }, []);

  return (
    <div className={`sticky-bar${show ? " show" : ""}`} aria-hidden={!show}>
      <div className="sb-price">
        Rs 1,499
        <small>Lumière Glow Serum</small>
      </div>
      <a href="#order" className="btn btn-accent btn-small">
        Order Now
      </a>
    </div>
  );
}
