import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Scroll-triggered reveal: fades & slides up children with `[data-reveal]`
 * inside the returned ref. Stagger included.
 */
export function useGsapReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!ref.current || typeof window === "undefined") return;
    const el = ref.current;
    const ctx = gsap.context(() => {
      const targets = el.querySelectorAll<HTMLElement>("[data-reveal]");
      targets.forEach((t) => {
        gsap.fromTo(
          t,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: t,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      const groups = el.querySelectorAll<HTMLElement>("[data-reveal-group]");
      groups.forEach((g) => {
        const kids = Array.from(g.children) as HTMLElement[];
        gsap.fromTo(
          kids,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: g,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return ref;
}
