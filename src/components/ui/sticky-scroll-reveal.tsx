"use client";
import React, { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string;
    description: string;
    content?: React.ReactNode | any;
  }[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const { theme } = useTheme();
  const ref = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0,
    );
    setActiveCard(closestBreakpointIndex);
  });

  const backgroundColors = {
    light: [
      "rgb(255 255 255 / 0.9)", // white base
      "rgb(249 250 251 / 0.9)", // gray-50
      "rgb(243 244 246 / 0.9)", // gray-100
    ],
    dark: [
      "#000000", // dark base
      "#0e0e0e", // gray-900
      "#0f0f0f", // gray-800
    ],
  };

  const linearGradients = [
    "linear-gradient(to bottom right, var(--cyan-500), var(--emerald-500))",
    "linear-gradient(to bottom right, var(--pink-500), var(--indigo-500))",
    "linear-gradient(to bottom right, var(--orange-500), var(--yellow-500))",
  ];

  const [backgroundGradient, setBackgroundGradient] = useState(
    linearGradients[0],
  );

  useEffect(() => {
    setBackgroundGradient(linearGradients[activeCard % linearGradients.length]);
  }, [activeCard]);

  const getCurrentBackground = () => {
    const colors =
      theme === "dark" ? backgroundColors.dark : backgroundColors.light;
    return colors[activeCard % colors.length];
  };

  return (
    <motion.div
      animate={{
        backgroundColor: getCurrentBackground(),
      }}
      className={cn(
        "flex h-[300vh] justify-between px-4 md:px-8 lg:px-16",
        "transition-colors duration-200",
      )}
      ref={ref}
    >
      <div className="relative flex w-full max-w-xl items-start">
        <div className="sticky top-20 w-full">
          {content.map((item, index) => (
            <div key={item.title + index} className="my-32">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                  y: activeCard === index ? 0 : 10,
                }}
                transition={{ duration: 0.3 }}
                className="text-3xl font-bold text-gray-900 dark:text-gray-100 md:text-4xl"
              >
                {item.title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                  y: activeCard === index ? 0 : 10,
                }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="mt-6 text-lg text-gray-700 dark:text-gray-300 md:text-xl"
              >
                {item.description}
              </motion.p>
            </div>
          ))}
        </div>
      </div>

      <motion.div
        style={{ background: backgroundGradient }}
        className={cn(
          "sticky top-40 right-40 hidden h-[400px] w-[450px] overflow-hidden rounded-xl lg:block",
          "shadow-lg dark:shadow-[0_8px_16px_rgb(0_0_0/0.4)]",
          "border border-gray-200/50 dark:border-white/10",
          "backdrop-blur-sm",
          contentClassName,
        )}
      >
        {content[activeCard].content ?? null}
      </motion.div>
    </motion.div>
  );
};
