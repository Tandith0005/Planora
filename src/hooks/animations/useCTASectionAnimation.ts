"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RefObject } from "react";

gsap.registerPlugin(ScrollTrigger);

type Params = {
  sectionRef: RefObject<HTMLElement | null>;
  leftRef: RefObject<HTMLDivElement | null>;
  featuresRef: RefObject<HTMLDivElement | null>;
};

export function useCTASectionAnimation({
  sectionRef,
  leftRef,
  featuresRef,
}: Params) {
  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });

      // Left side (text + buttons)
      tl.fromTo(
        leftRef.current,
        { opacity: 0, y: 60 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1.0, 
          ease: "power3.out" 
        }
      );

      // Feature cards with stagger
      if (featuresRef.current) {
        const featureCards = featuresRef.current.querySelectorAll(".feature-card");

        tl.fromTo(
          featureCards,
          { 
            opacity: 0, 
            y: 50,
            scale: 0.95 
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.12,
          },
          "-=0.6"   // overlap with left side
        );
      }
    },
    { dependencies: [], scope: sectionRef }
  );
}