"use client";

import { Button } from "@/components/ui/button";
import React from "react";

export function Cta() {
  return (
    <section
      id="relume"
      className="px-[5%] py-16 md:py-24 lg:py-28 flex items-center justify-center w-full"
    >
      <div className="container grid w-full grid-cols-1 items-start justify-between gap-6 md:grid-cols-[1fr_max-content] md:gap-x-12 md:gap-y-8 lg:gap-x-20">
        <div className="md:mr-12 lg:mr-0">
          <div className="w-full max-w-lg">
            <h2 className="mb-3 text-4xl leading-[1.2] font-bold md:mb-4 md:text-5xl lg:text-6xl">
              Create Videos Effortlessly Today
            </h2>
            <p className="md:text-md">
              Unlock your creativity with AI-powered video generation.
            </p>
          </div>
        </div>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Join the early access list.
          </h2>
          <p className="text-xl mb-8 text-gray-700">
            Get early access to our platform and be among the first to
            experience the magic of video creation.
          </p>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white h-12 px-8 rounded-lg w-full hover:scale-105 transition-all duration-300 ease-in-out">
            Get Early Access
          </Button>
        </div>
      </div>
    </section>
  );
}
