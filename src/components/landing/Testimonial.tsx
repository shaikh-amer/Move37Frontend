"use client";

import React from "react";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

export function Testimonial() {
  const testimonials = [
    {
      quote:
        "I created an entire YouTube channel in a week. Without ever recording my voice.",
      name: "Natasha Smith",
      designation: "Solopreneur, Freelance",
      src: "https://image.lexica.art/full_webp/6da99a63-45c7-416a-91ba-35f4cdee4d6f",
    },
    {
      quote:
        "This is what I always imagined AI would be capable of — it actually thinks creatively.",
      name: "Alexandra Chen",
      designation: "Content Creator",
      src: "https://image.lexica.art/full_webp/ff3db2e0-aa6f-494e-8008-986c4c8b941b",
    },
    // ... you can add more testimonials here following the same pattern
  ];

  return <AnimatedTestimonials testimonials={testimonials} />;
}
