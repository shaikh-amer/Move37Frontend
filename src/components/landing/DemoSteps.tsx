"use client";
import React from "react";

import Image from "next/image";
import { StickyScroll } from "../ui/sticky-scroll-reveal";

const content = [
  {
    title: "1. Type a Prompt",
    description:
      "Start with a simple idea - just describe what you want in one or two sentences. Our intuitive interface makes it easy to turn your thoughts into action.",
    content: (
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-emerald-500 opacity-10 dark:opacity-20" />
        <div className="relative flex flex-col items-center gap-4 p-8">
          <div className="rounded-xl bg-white/80 dark:bg-white/10 p-4 backdrop-blur-sm">
            <Image
              src="/prompt.jpg"
              width={350}
              height={350}
              className="h-auto w-auto rounded-lg object-cover"
              alt="typing prompt demo"
            />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "2. Script Generation",
    description:
      "Our AI generates a script based on your prompt. The script is then used to create a video.",
    content: (
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-indigo-500 opacity-10 dark:opacity-20" />
        <div className="relative flex flex-col items-center gap-4 p-8">
          <div className="rounded-xl bg-white/80 dark:bg-white/10 p-4 backdrop-blur-sm">
            <Image
              src="/generated-content.jpg"
              width={350}
              height={350}
              className="h-auto w-auto rounded-lg object-cover"
              alt="script generation demo"
            />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "3. Watch the Magic Happen",
    description:
      "Sit back and watch as our AI transforms your prompt into a complete solution in seconds. No complex tools or technical knowledge required - just pure magic at your fingertips.",
    content: (
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-indigo-500 opacity-10 dark:opacity-20" />
        <div className="relative flex flex-col items-center gap-4 p-8">
          <div className="rounded-xl bg-white/80 dark:bg-white/10 p-4 backdrop-blur-sm">
            <Image
              src="/magic.jpg"
              width={350}
              height={350}
              className="h-auto w-auto rounded-lg object-cover"
              alt="AI processing demo"
            />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "4. See Results Instantly",
    description:
      "Get immediate results that you can use right away. Whether you're building a website, creating content, or solving complex problems, your solution is just moments away from reality.",
    content: (
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-yellow-500 opacity-10 dark:opacity-20" />
        <div className="relative flex flex-col items-center gap-4 p-8">
          <div className="rounded-xl bg-white/80 dark:bg-white/10 p-4 backdrop-blur-sm">
            <Image
              src="/result-display.jpg"
              width={350}
              height={350}
              className="h-auto w-auto rounded-lg object-cover"
              alt="results demo"
            />
          </div>
        </div>
      </div>
    ),
  },
];
export function DemoSteps() {
  return (
    <div className="w-full text-left my-8 bg-gray-50 dark:bg-black">
      <StickyScroll content={content} />
    </div>
  );
}
