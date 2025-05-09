"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import { RxChevronRight } from "react-icons/rx";

export function Features() {
  return (
    <section
      id="relume"
      className="px-[5%] py-16 md:py-24 lg:py-28 flex items-center justify-center w-full"
    >
      <div className="container">
        <div className="flex flex-col items-center">
          <div className="rb-12 mb-12 text-center md:mb-18 lg:mb-20">
            <div className="w-full max-w-lg">
              <p className="mb-3 font-semibold md:mb-4">Features</p>
              <h2 className="mb-5 text-5xl font-bold md:mb-6">
                Empowering Creators Across Various Fields
              </h2>
              <p className="md:text-sm">
                Our platform is designed to cater to diverse needs. Whether
                you're a YouTuber, educator, founder, or marketer, we have you
                covered.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 items-start justify-center gap-y-12 md:grid-cols-3 md:gap-x-8 md:gap-y-16 lg:gap-x-12">
            <div className="relative w-full min-h-[300px] group">
              <Image
                src="https://image.lexica.art/full_webp/071ceaaa-e48b-4c55-94ae-4f4058b57e7f"
                alt="YouTubers background"
                fill
                className="object-cover rounded-lg -z-10"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 rounded-lg transition-all duration-300 group-hover:from-black/90 group-hover:via-black/60 group-hover:to-black/40" />
              <div className="relative flex flex-col items-center text-center p-8 text-white h-full">
                <div className="mb-4"></div>
                <h3 className="mb-5 text-2xl font-bold md:mb-6 md:text-3xl md:leading-[1.3] lg:text-4xl">
                  For YouTubers Who Want to Publish More
                </h3>
                <p className="mb-6">
                  Create engaging videos quickly and easily.
                </p>
              </div>
            </div>

            <div className="relative w-full min-h-[300px] group">
              <Image
                src="https://image.lexica.art/full_webp/348df6db-86b2-40be-8341-22f9411b9b7a"
                alt="Educators background"
                fill
                className="object-cover rounded-lg -z-10"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 rounded-lg transition-all duration-300 group-hover:from-black/90 group-hover:via-black/60 group-hover:to-black/40" />
              <div className="relative flex flex-col items-center text-center p-8 text-white h-full">
                <div className="mb-4"></div>
                <h3 className="mb-5 text-2xl font-bold md:mb-6 md:text-3xl md:leading-[1.3] lg:text-4xl">
                  For Educators Who Need to Teach Visually
                </h3>
                <p className="mb-6">
                  Transform lessons into captivating visual content.
                </p>
              </div>
            </div>

            <div className="relative w-full min-h-[300px] group">
              <Image
                src="https://image.lexica.art/full_webp/6099dca8-aa61-4780-ab4c-f7afc3722daa"
                alt="Founders background"
                fill
                className="object-cover rounded-lg -z-10"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 rounded-lg transition-all duration-300 group-hover:from-black/90 group-hover:via-black/60 group-hover:to-black/40" />
              <div className="relative flex flex-col items-center text-center p-8 text-white h-full">
                <div className="mb-4"></div>
                <h3 className="mb-5 text-2xl font-bold md:mb-6 md:text-3xl md:leading-[1.3] lg:text-4xl">
                  For Founders with Ideas That Need Sharing
                </h3>
                <p className="mb-6">
                  Bring your innovative concepts to life effortlessly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
