import React from "react";

import { Footer } from "@/components/landing/Footer";
import { LandingHero } from "@/components/landing/LandingHero";
import { Hero2 } from "@/components/landing/Hero2";
import { Features } from "@/components/landing/Features";
import { Usage } from "@/components/landing/Usage";
import { DemoSteps } from "@/components/landing/DemoSteps";
import { Testimonial } from "@/components/landing/Testimonial";
import { Cta } from "@/components/landing/Cta";

export default function Page() {
  return (
    <div>
      <LandingHero />
      <Hero2 />
      <Features />
      <Usage />
      <DemoSteps />
      <Testimonial />
      <Cta />
      <Footer />
    </div>
  );
}
