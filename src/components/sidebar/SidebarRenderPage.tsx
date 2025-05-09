"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./SideBar";
import StoryPage from "./story/StoryPage";
import VisualsPage from "./visuals/VisualsPage";
import AudioPage from "./audio/AudioPage";
import StylesPage from "./styles/StylesPage";
import TextPage from "./text/TextPage";
import AspectRatio from "./format/AspectRatio";
import FavoritesPage from "./favorites/FavoritesPage";
import BackgroundMusic from "./audio/BackgroundMusic";

// Add this to expose setActivePage to parent components
interface SidebarRenderPageProps {
  onPageChange?: (page: string) => void;
}

function SidebarRenderPage({ onPageChange }: SidebarRenderPageProps) {
  const [activePage, setActivePage] = useState("Story");
  // Add a ref to the Sidebar component
  const sidebarRef = React.useRef<any>(null);

  useEffect(() => {
    const handlePageChange = (event: CustomEvent) => {
      const newPage = event.detail;
      setActivePage(newPage);

      // Also notify the parent if the callback exists
      if (onPageChange) {
        onPageChange(newPage);
      }

      // Attempt to update the Sidebar's active state if it exposes a method
      if (sidebarRef.current && sidebarRef.current.setActivePage) {
        sidebarRef.current.setActivePage(newPage);
      }
    };

    window.addEventListener(
      "changeSidebarPage",
      handlePageChange as EventListener,
    );

    return () => {
      window.removeEventListener(
        "changeSidebarPage",
        handlePageChange as EventListener,
      );
    };
  }, [onPageChange]);

  // Update the page state and notify parent
  const handlePageChange = (page: string) => {
    setActivePage(page);
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case "Story":
        return <StoryPage />;
      case "Visuals":
        return <VisualsPage />;
      case "Audio":
        return <AudioPage />;
      case "Styles":
        return <StylesPage />;
      case "Text":
        return <TextPage />;
      case "Format":
        return <AspectRatio />;
      case "Music":
        return <BackgroundMusic />;
      default:
        return <StoryPage />;
    }
  };

  return (
    <div className="flex w-1/3">
      <Sidebar
        ref={sidebarRef}
        onPageChange={handlePageChange}
        activePage={activePage}
      />
      <div
        className="flex-1 bg-gray-100 dark:bg-neutral-800 p-6 overflow-y-auto  [&::-webkit-scrollbar]:w-1
        [&::-webkit-scrollbar-track]:bg-gray-100
        [&::-webkit-scrollbar-thumb]:bg-gray-300
        dark:[&::-webkit-scrollbar-track]:bg-neutral-700
        dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
      >
        {renderPage()}
      </div>
    </div>
  );
}

export default SidebarRenderPage;
