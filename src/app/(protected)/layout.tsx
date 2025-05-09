import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import React from "react";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/navbar/header";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth/login");
  }
  return <>{children}</>;
};

export default layout;
