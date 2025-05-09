"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import { RxChevronRight } from "react-icons/rx";
import { HiOutlineVideoCamera, HiOutlineShare } from "react-icons/hi";
import { MdOutlineAutoAwesome } from "react-icons/md";
import { BsLightningCharge } from "react-icons/bs";

export function Usage() {
  return (
    <section
      id="relume"
      className="px-[5%] py-16 min-h-[90vh] md:py-24 lg:py-28 flex items-center justify-center w-full"
    >
      <div className="container">
        <div className="mb-12 md:mb-18 lg:mb-20">
          <div className="mx-auto max-w-lg text-center">
            <p className="md:text-lg">
              Creating videos has never been easier. Just type a simple prompt,
              and our advanced AI does the rest, crafting scripts, voiceovers,
              and visuals in seconds.
            </p>
          </div>
        </div>
        <div className="grid place-items-center gap-x-8 gap-y-12 sm:grid-cols-2 md:gap-y-16 lg:grid-cols-[1fr_1.5fr_1fr] lg:gap-x-12">
          <div className="grid w-full grid-cols-1 gap-x-20 gap-y-12 md:gap-y-16">
            <div className="flex flex-col items-center text-center">
              <div className="mb-5 flex items-center justify-center md:mb-6">
                <HiOutlineVideoCamera className="size-12 text-gray-800 dark:text-gray-200" />
              </div>
              <h3 className="mb-3 text-xl font-bold md:mb-4 md:text-2xl">
                Effortless Video Creation: Just Describe, and We Deliver
              </h3>
              <p>
                Your vision comes to life without the hassle of traditional
                video production.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-5 flex items-center justify-center md:mb-6">
                <HiOutlineShare className="size-12 text-gray-800 dark:text-gray-200" />
              </div>
              <h3 className="mb-3 text-xl font-bold md:mb-4 md:text-2xl">
                Share Your Videos Across Platforms with One Click
              </h3>
              <p>
                Easily download or share your videos, optimized for any
                platform.
              </p>
            </div>
          </div>
          <div className="relative order-last w-full sm:col-span-2 lg:order-none lg:col-span-1">
            <Image
              src="https://image.lexica.art/full_webp/6e986a92-f353-4a77-899a-e74b79f45d27"
              alt="Relume placeholder image"
              width={1000}
              height={1000}
              className="h-auto w-full rounded-image object-cover rounded-4xl"
            />
          </div>
          <div className="grid w-full grid-cols-1 gap-x-20 gap-y-12 md:gap-y-16">
            <div className="flex flex-col items-center text-center">
              <div className="mb-5 flex items-center justify-center md:mb-6">
                <MdOutlineAutoAwesome className="size-12 text-gray-800 dark:text-gray-200" />
              </div>
              <h3 className="mb-3 text-xl font-bold md:mb-4 md:text-2xl">
                Instantly Generate High-Quality Videos with a Simple Prompt
              </h3>
              <p>
                Our AI-powered platform takes your ideas and turns them into
                engaging videos.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-5 flex items-center justify-center md:mb-6">
                <BsLightningCharge className="size-12 text-gray-800 dark:text-gray-200" />
              </div>
              <h3 className="mb-3 text-xl font-bold md:mb-4 md:text-2xl">
                What if video creation felt effortless?
              </h3>
              <p>
                From script to voice to visuals, we automate the entire process.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
