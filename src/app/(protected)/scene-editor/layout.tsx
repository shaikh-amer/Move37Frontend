import React from "react";
import SidebarRenderPage from "@/components/sidebar/SidebarRenderPage";

const layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex overflow-hidden h-[calc(100vh-57px)]">
      <SidebarRenderPage />
      <div
        className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1
        [&::-webkit-scrollbar-track]:bg-gray-100
        [&::-webkit-scrollbar-thumb]:bg-gray-300
        dark:[&::-webkit-scrollbar-track]:bg-neutral-700
        dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500  "
      >
        {children}
      </div>
    </div>
  );
};

export default layout;
