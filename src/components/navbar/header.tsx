"use client";
import { MainNav } from "@/components/navbar/mainNav";
import { MobileNav } from "@/components/navbar/mobileNav";
import { ModeSwitcher } from "@/components/providers/modeSwitcher";
import Logout from "../common/Logout";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "../ui/button";

export function SiteHeader() {
  const { data: session } = useSession();
  const isLoggedIn = !!session;
  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-[100vw] px-4 sm:px-8">
        <div className="flex h-14 items-center justify-between">
          <MainNav />
          <div className="flex items-center gap-4 ml-auto">
            <ModeSwitcher />
            {isLoggedIn ? (
              <Logout />
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/signup">
                  <Button variant="outline" title="Sign Up">
                    Sign Up
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button title="Sign In">Sign In</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
