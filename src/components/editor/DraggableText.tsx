"use client";
import React, { useState, useRef, useEffect } from "react";
import { Trash2 } from "lucide-react";
import debounce from "lodash/debounce";
import { DisplayItemFont } from "@/types/types";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedTextIndex } from "@/redux/textSlice";
import { RootState } from "@/redux/store";

export interface DraggableTextProps {
  text?: string;
  onDelete?: () => void;
  initialPosition?: { x: number; y: number };
  containerRef: React.RefObject<HTMLDivElement>;
  onPositionChange?: (position: { x: number; y: number }) => void;
  index?: number;

  styleData?: DisplayItemFont;
  isSelected?: boolean; // Indicates if this text is currently selected.
}

export const DraggableText: React.FC<DraggableTextProps> = ({
  text,
  onDelete,
  initialPosition = { x: 0, y: 0 },
  containerRef,
  onPositionChange,
  index,
  styleData,
  isSelected,
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const elementStartPos = useRef({ x: 0, y: 0 });

  const selectedScene = useSelector(
    (state: RootState) => state.reduxScene.selectedScene,
  );

  const selectedTextIndex = useSelector(
    (state: RootState) => state.reduxScene.selectedTextIndex,
  );

  const dispatch = useDispatch();
  // Debounce the position update.
  const debouncedPositionChange = debounce((newPosition) => {
    onPositionChange?.(newPosition);
  }, 16); // about 60fps

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current || !elementRef.current) return;
    setIsDragging(true);
    if (typeof index !== "undefined") {
      dispatch(setSelectedTextIndex(index));
    }
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    elementStartPos.current = position;
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current || !elementRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const elementRect = elementRef.current.getBoundingClientRect();
    const deltaX = e.clientX - dragStartPos.current.x;
    const deltaY = e.clientY - dragStartPos.current.y;
    let newX = elementStartPos.current.x + deltaX;
    let newY = elementStartPos.current.y + deltaY;
    newX = Math.max(0, Math.min(newX, containerRect.width - elementRect.width));
    newY = Math.max(
      0,
      Math.min(newY, containerRect.height - elementRect.height),
    );
    setPosition({ x: newX, y: newY });
    debouncedPositionChange({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile dragging.
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!containerRef.current || !elementRef.current) return;
    setIsDragging(true);
    if (typeof index !== "undefined") {
      dispatch(setSelectedTextIndex(index));
    }
    const touch = e.touches[0];
    dragStartPos.current = { x: touch.clientX, y: touch.clientY };
    elementStartPos.current = position;
    e.preventDefault();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !containerRef.current || !elementRef.current) return;
    const touch = e.touches[0];
    const containerRect = containerRef.current.getBoundingClientRect();
    const elementRect = elementRef.current.getBoundingClientRect();
    const deltaX = touch.clientX - dragStartPos.current.x;
    const deltaY = touch.clientY - dragStartPos.current.y;
    let newX = elementStartPos.current.x + deltaX;
    let newY = elementStartPos.current.y + deltaY;
    newX = Math.max(0, Math.min(newX, containerRect.width - elementRect.width));
    newY = Math.max(
      0,
      Math.min(newY, containerRect.height - elementRect.height),
    );
    setPosition({ x: newX, y: newY });
    debouncedPositionChange({ x: newX, y: newY });
    e.preventDefault();
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      debouncedPositionChange.cancel();
    };
  }, [isDragging]);

  return (
    <div
      ref={elementRef}
      className={`absolute cursor-move group ${isDragging ? "select-none" : ""}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: isDragging ? "none" : "transform 0.1s ease",
        zIndex: isSelected ? 10 : 1,
        pointerEvents: "auto",
        border: isSelected ? "2px solid blue" : "none", // Border indicates selection.
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative">
        <div className="px-3 py-1.5 rounded-md">
          <div
            className="md:text-base text-center font-medium"
            style={{
              color: styleData?.fontColor || "white",
              fontSize: styleData?.fontSize
                ? `${styleData.fontSize}px`
                : undefined,
              fontFamily: styleData?.fontName || "inherit",
            }}
            dangerouslySetInnerHTML={{ __html: text || "" }}
          />
        </div>
      </div>
    </div>
  );
};
