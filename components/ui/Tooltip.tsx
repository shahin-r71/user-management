"use client";

import { useState } from "react";

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
}

export function Tooltip({
  children,
  content,
  position = "top",
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-1",
    bottom: "top-full left-1/2 transform -translate-x-1/2 translate-y-2 mt-1",
    left: "right-full top-1/2 transform -translate-y-1/2 -translate-x-2 mr-1",
    right: "left-full top-1/2 transform -translate-y-1/2 translate-x-2 ml-1",
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute z-10 w-20 text-center px-2 py-1 text-xs font-medium text-white bg-gray-700 rounded-md shadow-md ${positionClasses[position]}`}
          role="tooltip"
        >
          {content}
          <div
            className={`absolute ${
              position === "top"
                ? "top-full left-1/2 transform -translate-x-1/2 border-t-gray-900"
                : position === "bottom"
                ? "bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-900"
                : position === "left"
                ? "left-full top-1/2 transform -translate-y-1/2 border-l-gray-900"
                : "right-full top-1/2 transform -translate-y-1/2 border-r-gray-900"
            } border-4 border-transparent`}
          />
        </div>
      )}
    </div>
  );
}
