"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RefObject } from "react";

gsap.registerPlugin(ScrollTrigger);

type Params = {
  sectionRef: RefObject<HTMLElement | null>;
  headerRef: RefObject<HTMLDivElement | null>;
  tabsRef: RefObject<HTMLDivElement | null>;
  descriptorRef: RefObject<HTMLDivElement | null>;
  gridRef: RefObject<HTMLDivElement | null>;
  isLoading: boolean;
  eventsLength: number;
  activeKey: string;
};

export function useEventCategoriesAnimation({
  sectionRef,
  headerRef,
  tabsRef,
  descriptorRef,
  gridRef,
  isLoading,
  eventsLength,
  activeKey,
}: Params) {
  // 1. Initial section entrance animation (plays only once when scrolling into view)
  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 50%",
          once: true,
        },
      });

      tl.fromTo(headerRef.current, 
        { y: 40, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" }
      )
      .fromTo(tabsRef.current, 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" }, 
        "-=0.5"
      )
      .fromTo(descriptorRef.current, 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 
        "-=0.4"
      );
    },
    { dependencies: [], scope: sectionRef }  
  );

  // 2. Cards animation - runs when data is ready AND when category changes
  useGSAP(
    () => {
      if (isLoading || !gridRef.current || eventsLength === 0) return;

      const cards = gridRef.current.querySelectorAll(".event-card");
      if (cards.length === 0) return;

      // Set BEFORE paint using gsap.set, then animate
      gsap.set(cards, { opacity: 0, y: 40 });

      // Use requestAnimationFrame to ensure set() has been applied
      const raf = requestAnimationFrame(() => {
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.07,
        });
      });

      return () => cancelAnimationFrame(raf);
    },
    {
      dependencies: [activeKey, eventsLength, isLoading],
      scope: gridRef,
    }
  );
}