"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutGrid,
  Image,
  Music,
  Palette,
  Type,
  Briefcase,
  Heart,
  FormInputIcon,
  RatioIcon,
  ListMusic,
} from "lucide-react";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  isActive,
  onClick,
}) => (
  <div
    className={`flex flex-col items-center p-4 cursor-pointer transition-colors ${
      isActive
        ? "text-black bg-white font-extrabold"
        : "text-gray-400 hover:text-gray-200"
    }`}
    onClick={onClick}
  >
    <div className="w-6 h-6">{icon}</div>
    <span className="mt-1 text-xs font-medium">{label}</span>
  </div>
);

interface SidebarProps {
  onPageChange: (page: string) => void;
  activePage?: string;
}

const Sidebar = React.forwardRef<any, SidebarProps>(
  ({ onPageChange, activePage = "Story" }, ref) => {
    const [activeNav, setActiveNav] = useState(activePage);

    useEffect(() => {
      setActiveNav(activePage);
    }, [activePage]);

    React.useImperativeHandle(ref, () => ({
      setActivePage: (page: string) => setActiveNav(page),
    }));

    const handleClick = (page: string) => {
      setActiveNav(page);
      onPageChange(page);
    };

    const menuItems = [
      { icon: <LayoutGrid size={24} />, label: "Story" },
      { icon: <Image size={24} />, label: "Visuals" },
      { icon: <Music size={24} />, label: "Audio" },
      { icon: <Palette size={24} />, label: "Styles" },
      { icon: <Type size={24} />, label: "Text" },
      { icon: <RatioIcon size={24} />, label: "Format" },
      { icon: <ListMusic size={24} />, label: "Music" },
    ];

    return (
      <div className="shadow-md">
        <div
          className="flex flex-col items-center space-y-2 py-2 pb-10 h-screen overflow-y-auto w-[80px]  [&::-webkit-scrollbar]:w-1
        [&::-webkit-scrollbar-track]:bg-gray-100
        [&::-webkit-scrollbar-thumb]:bg-gray-300
        dark:[&::-webkit-scrollbar-track]:bg-neutral-700
        dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
        >
          {menuItems.map((item) => (
            <SidebarItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              isActive={activeNav === item.label}
              onClick={() => handleClick(item.label)}
            />
          ))}
        </div>
        <br />
        <br />
      </div>
    );
  },
);

Sidebar.displayName = "Sidebar";

export default Sidebar;
