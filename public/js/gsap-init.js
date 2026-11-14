/**
 * GSAP entrance animations. Two scopes, both guarded so this never throws
 * on a page that doesn't have the targeted elements:
 *  1. Site-wide: every page's big heading (.page-title) and the floating
 *     emoji (.float-icon used on About/Education/Knowledge) fade/slide in.
 *  2. Home page only: a staggered timeline for the hero section, since it
 *     doesn't use .page-title (it has its own two-line layout).
 * Respects prefers-reduced-motion by skipping straight to the end state
 * instead of animating, for visitors who've asked for less motion.
 */
document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap === "undefined") return; // CDN failed to load — page still works, just without this

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const duration = reduceMotion ? 0 : 0.6;

  if (document.querySelector(".page-title")) {
    gsap.from(".page-title", { opacity: 0, y: -24, duration, ease: "power2.out" });
  }
  if (document.querySelector(".float-icon")) {
    gsap.from(".float-icon", { opacity: 0, scale: 0.5, duration, delay: reduceMotion ? 0 : 0.1, ease: "back.out(1.7)" });
  }

  const hero = document.getElementById("hero-heading");
  if (hero) {
    gsap
      .timeline({ defaults: { duration, ease: "power2.out" } })
      .from("#hero-heading", { opacity: 0, y: 24 })
      .from("#hero-tagline", { opacity: 0, y: 24 }, reduceMotion ? "<" : "-=0.4")
      .from("#hero-subtext", { opacity: 0, y: 16 }, reduceMotion ? "<" : "-=0.35")
      .from("#hero-social", { opacity: 0, y: 16 }, reduceMotion ? "<" : "-=0.3")
      .from("#hero-avatar", { opacity: 0, scale: 0.85 }, reduceMotion ? "<" : "-=0.5")
      .from("#hero-cta", { opacity: 0, y: 16 }, reduceMotion ? "<" : "-=0.3");
  }
});
