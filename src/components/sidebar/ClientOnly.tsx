"use client";
import { useEffect, useState } from "react";

const ClientOnly = ({
  children,
  fallback = null,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return fallback || null;

  return <>{children}</>;
};

export default ClientOnly;
