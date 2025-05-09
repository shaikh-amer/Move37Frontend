"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
export function LandingHero() {
  const { data: session } = useSession();

  const router = useRouter();

  const handleSignUp = () => {
    router.push("/auth/signup");
  };

  const handleSignIn = () => {
    router.push("/auth/login");
  };

  const isLoggedIn = !!session;

  return (
    <section
      id="relume"
      className="px-[5%] py-16 md:py-18 min-h-[90vh] flex items-center justify-center w-full"
    >
      <div className="container">
        <div className="grid grid-cols-1 gap-x-20 gap-y-12 md:gap-y-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="mb-5 text-6xl font-bold md:mb-6 md:text-5xl lg:text-8xl bg-gradient-to-r from-gray-800 to-gray-500 bg-clip-text text-transparent">
              Create Stunning AI Videos in Minutes
            </h1>
            <p className="md:text-md">
              M37 Productions transforms your ideas into high-quality videos
              swiftly. Designed for creators, marketers, educators, and
              founders, we make video creation effortless.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 md:mt-8">
              {!isLoggedIn ? (
                <>
                  <Button
                    title="Sign Up"
                    className="md:h-12 md:w-32"
                    onClick={handleSignUp}
                  >
                    Sign Up
                  </Button>
                  <Button
                    title="Sign In"
                    variant="secondary"
                    className="md:h-12 md:w-32"
                    onClick={handleSignIn}
                  >
                    Sign In
                  </Button>
                </>
              ) : (
                <Link href="/generate">
                  <Button title="Get Started" className="md:h-12 md:w-32">
                    Get Started
                  </Button>
                </Link>
              )}
            </div>
          </div>
          <div>
            <video
              src="https://videos.pexels.com/video-files/3064220/3064220-hd_1920_1080_24fps.mp4"
              className="w-[90%] rounded-image object-cover rounded-4xl"
              width={700}
              height={700}
              autoPlay
              muted
              loop
            />
          </div>
        </div>
      </div>
    </section>
  );
}
