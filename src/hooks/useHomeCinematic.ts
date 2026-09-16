"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const formatCounter = (
  value: number,
  decimals: number,
  prefix: string,
  suffix: string,
) => `${prefix}${value.toLocaleString("en-US", {
  minimumFractionDigits: decimals,
  maximumFractionDigits: decimals,
})}${suffix}`;

/**
 * Coordinates the public homepage cinematic system from one GSAP context.
 *
 * Design goals:
 * - ScrollTrigger only works while a scene is in its active scroll range.
 * - Desktop-only pinning avoids heavy scroll choreography on small screens.
 * - prefers-reduced-motion receives the complete static experience.
 * - All timelines/triggers are reverted when the route unmounts.
 */
export function useHomeCinematic<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || typeof window === "undefined") return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) return;

    const media = gsap.matchMedia();
    const ctx = gsap.context(() => {
      const hero = root.querySelector<HTMLElement>("[data-cinema-hero]");
      const heroImage = root.querySelector<HTMLElement>(
        "[data-cinema-hero-image]",
      );
      const heroContent = root.querySelector<HTMLElement>(
        "[data-cinema-hero-content]",
      );

      if (hero && heroImage && heroContent) {
        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
        intro
          .fromTo(
            heroImage,
            { scale: 1.08, filter: "saturate(.82) brightness(.84)" },
            {
              scale: 1,
              filter: "saturate(1) brightness(1)",
              duration: 1.35,
            },
          )
          .fromTo(
            heroContent.querySelectorAll("[data-cinema-intro]"),
            { y: 28, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.85, stagger: 0.09 },
            "-=.85",
          );

        gsap.to(heroImage, {
          yPercent: 8,
          scale: 1.045,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
          },
        });

        gsap.to(heroContent, {
          yPercent: 12,
          autoAlpha: 0.42,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "45% top",
            end: "bottom top",
            scrub: 0.7,
          },
        });
      }

      const reveals = gsap.utils.toArray<HTMLElement>(
        "[data-cinema-reveal], [data-reveal]",
        root,
      );
      reveals.forEach((element) => {
        gsap.fromTo(
          element,
          { y: 34, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 86%",
              toggleActions: "play none none none",
              once: true,
            },
          },
        );
      });

      const revealGroups = gsap.utils.toArray<HTMLElement>(
        "[data-cinema-group], [data-reveal-group]",
        root,
      );
      revealGroups.forEach((group) => {
        const children = Array.from(group.children) as HTMLElement[];
        if (!children.length) return;
        gsap.fromTo(
          children,
          { y: 28, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.72,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: group,
              start: "top 84%",
              once: true,
            },
          },
        );
      });

      const masks = gsap.utils.toArray<HTMLElement>(
        "[data-cinema-mask]",
        root,
      );
      masks.forEach((element) => {
        gsap.fromTo(
          element,
          {
            clipPath: "inset(8% 7% 8% 7% round 18px)",
            scale: 1.035,
          },
          {
            clipPath: "inset(0% 0% 0% 0% round 18px)",
            scale: 1,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 82%",
              once: true,
            },
          },
        );
      });

      const depthLayers = gsap.utils.toArray<HTMLElement>("[data-depth]", root);
      depthLayers.forEach((element) => {
        const amount = Number(element.dataset.depth ?? 8);
        const section = element.closest("section") ?? element;
        gsap.fromTo(
          element,
          { yPercent: -amount * 0.28 },
          {
            yPercent: amount * 0.28,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          },
        );
      });

      const counters = gsap.utils.toArray<HTMLElement>("[data-counter]", root);
      counters.forEach((element) => {
        const finalValue = Number(element.dataset.counter ?? 0);
        const decimals = Number(element.dataset.counterDecimals ?? 0);
        const prefix = element.dataset.counterPrefix ?? "";
        const suffix = element.dataset.counterSuffix ?? "";
        const state = { value: 0 };

        ScrollTrigger.create({
          trigger: element,
          start: "top 90%",
          once: true,
          onEnter: () => {
            gsap.to(state, {
              value: finalValue,
              duration: 1.35,
              ease: "power2.out",
              onUpdate: () => {
                element.textContent = formatCounter(
                  state.value,
                  decimals,
                  prefix,
                  suffix,
                );
              },
              onComplete: () => {
                element.textContent = formatCounter(
                  finalValue,
                  decimals,
                  prefix,
                  suffix,
                );
              },
            });
          },
        });
      });

      media.add("(min-width: 1024px)", () => {
        const story = root.querySelector<HTMLElement>("[data-clean-story]");
        const storyMotion = story?.querySelector<HTMLElement>(
          "[data-story-motion]",
        );

        if (story && storyMotion) {
          const steps = gsap.utils.toArray<HTMLElement>(
            "[data-story-step]",
            storyMotion,
          );
          const scenes = gsap.utils.toArray<HTMLElement>(
            "[data-story-scene]",
            storyMotion,
          );
          const progress = storyMotion.querySelector<HTMLElement>(
            "[data-story-progress]",
          );

          if (steps.length && scenes.length && steps.length === scenes.length) {
            gsap.set(steps, { autoAlpha: 0.32, y: 10 });
            gsap.set(steps[0], { autoAlpha: 1, y: 0 });
            gsap.set(scenes, { autoAlpha: 0, scale: 1.045, yPercent: 2 });
            gsap.set(scenes[0], { autoAlpha: 1, scale: 1, yPercent: 0 });
            if (progress) gsap.set(progress, { scaleY: 1 / steps.length });

            const storyTimeline = gsap.timeline({
              defaults: { duration: 0.8, ease: "power2.inOut" },
              scrollTrigger: {
                trigger: storyMotion,
                start: "top top+=84",
                end: () => `+=${window.innerHeight * (steps.length - 0.25)}`,
                scrub: 0.65,
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            });

            steps.forEach((step, index) => {
              if (index === 0) return;
              const scene = scenes[index];
              const previousStep = steps[index - 1];
              const previousScene = scenes[index - 1];
              const position = index;

              storyTimeline
                .to(previousStep, { autoAlpha: 0.32, y: -8 }, position)
                .to(step, { autoAlpha: 1, y: 0 }, position)
                .to(
                  previousScene,
                  { autoAlpha: 0, scale: 0.985, yPercent: -2 },
                  position,
                )
                .fromTo(
                  scene,
                  { autoAlpha: 0, scale: 1.04, yPercent: 3 },
                  { autoAlpha: 1, scale: 1, yPercent: 0 },
                  position,
                );

              if (progress) {
                storyTimeline.to(
                  progress,
                  { scaleY: (index + 1) / steps.length },
                  position,
                );
              }
            });
          }
        }

        const horizontalSections = gsap.utils.toArray<HTMLElement>(
          "[data-horizontal-scene]",
          root,
        );

        horizontalSections.forEach((section) => {
          const pin = section.querySelector<HTMLElement>("[data-horizontal-pin]");
          const viewport = section.querySelector<HTMLElement>(
            "[data-horizontal-viewport]",
          );
          const track = section.querySelector<HTMLElement>("[data-horizontal-track]");
          if (!pin || !viewport || !track) return;

          const getDistance = () =>
            Math.max(0, track.scrollWidth - viewport.clientWidth);

          if (getDistance() < 80) return;

          gsap.to(track, {
            x: () => -getDistance(),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top+=84",
              end: () => `+=${getDistance() + window.innerWidth * 0.45}`,
              scrub: 0.7,
              pin,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
        });
      });

    }, root);

    return () => {
      media.revert();
      ctx.revert();
    };
  }, []);

  return ref;
}
