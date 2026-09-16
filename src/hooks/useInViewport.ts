"use client";

import { useEffect, useRef, useState } from "react";

export function useInViewport<T extends HTMLElement = HTMLDivElement>(
  rootMargin = "120px",
) {
  const ref = useRef<T | null>(null);
  const [isInViewport, setIsInViewport] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInViewport(entry.isIntersecting),
      { rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, isInViewport };
}
