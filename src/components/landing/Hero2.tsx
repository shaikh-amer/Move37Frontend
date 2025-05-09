"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export function Hero2() {
  return (
    <section
      id="relume"
      className="px-[5%] py-16 md:py-24 min-h-[60vh] lg:py-28 flex flex-col items-center justify-center bg-gradient-to-tr from-gray-100 to-white dark:from-gray-900 dark:to-black"
    >
      <div className="container max-w-lg text-center">
        <p className="mb-3 font-semibold md:mb-4 text-gray-800 dark:text-gray-200">
          Effortless
        </p>
        <h1 className="mb-5 text-5xl font-bold md:mb-6 lg:whitespace-nowrap text-gray-900 dark:text-white">
          Create Videos Instantly
        </h1>
        <p className="md:text-md text-gray-700 dark:text-gray-300">
          Transform your ideas into stunning videos without the hassle of
          traditional production methods.
        </p>
        <div className="mt-6 flex items-center justify-center gap-x-4 md:mt-8">
          <Link href="/generate">
            <Button title="Get Started">Get Started</Button>
          </Link>
          <Link href="/learn-more">
            <Button title="Learn More" variant="secondary">
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
