import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  // Initialize with the current match state if window exists (client-side)
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia(query).matches;
    }
    return false; // Default value for server-side rendering
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(query);

    // Update the state initially
    setMatches(mediaQuery.matches);

    // Create event listener function
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);

    // Add the event listener
    mediaQuery.addEventListener("change", handler);

    // Clean up
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]); // Re-run effect if query changes

  return matches;
}
