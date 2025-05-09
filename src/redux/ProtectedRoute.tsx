"use client";

import React from "react";
import { useRouter } from "next/navigation"; // Use Next.js navigation

const ProtectedRoute: React.FC = () => {
  const router = useRouter();

  // Redirect if no access token
  // React.useEffect(() => {
  //   if (!accessToken) {
  //     router.push("/"); // Redirect to home page
  //   }
  // }, [accessToken, router]);

  // If accessToken exists, render children
  return <>{/* Render your protected content here */}</>;
};

export default ProtectedRoute;
