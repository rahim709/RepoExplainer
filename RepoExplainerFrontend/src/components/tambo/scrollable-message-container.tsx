"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

export type ScrollableMessageContainerProps =
  React.HTMLAttributes<HTMLDivElement>;

/**
 * A generic scrollable container that auto-scrolls to the bottom
 * when new content (children) is added.
 * Detached from Tambo context to work with custom backends.
 */
export const ScrollableMessageContainer = React.forwardRef<
  HTMLDivElement,
  ScrollableMessageContainerProps
>(({ className, children, ...props }, ref) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoscroll, setShouldAutoscroll] = useState(true);
  const lastScrollTopRef = useRef(0);

  // Handle forwarded ref
  React.useImperativeHandle(ref, () => scrollContainerRef.current!, []);

  // Handle scroll events to detect if user manually scrolled up
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current;
    
    // Check if user is near the bottom (20px tolerance)
    const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 20;

    // If user scrolled up, disable autoscroll
    if (scrollTop < lastScrollTopRef.current - 5) {
      setShouldAutoscroll(false);
    }
    // If user is at bottom, re-enable autoscroll
    else if (isAtBottom) {
      setShouldAutoscroll(true);
    }

    lastScrollTopRef.current = scrollTop;
  }, []);

  // Auto-scroll logic: Trigger whenever 'children' changes (e.g. new message added)
  useEffect(() => {
    if (scrollContainerRef.current && shouldAutoscroll) {
      // Use requestAnimationFrame for smoother UI
      requestAnimationFrame(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTo({
            top: scrollContainerRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      });
    }
  }, [children, shouldAutoscroll]);

  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className={cn(
        "flex-1 overflow-y-auto scroll-smooth",
        // Custom scrollbar styling to match GitHub Dark theme
        "[&::-webkit-scrollbar]:w-[8px]",
        "[&::-webkit-scrollbar-track]:bg-transparent",
        "[&::-webkit-scrollbar-thumb]:bg-[#30363d] [&::-webkit-scrollbar-thumb]:rounded-full",
        "[&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-clip-content",
        "[&::-webkit-scrollbar-thumb]:hover:bg-[#8b949e]",
        className,
      )}
      data-slot="scrollable-message-container"
      {...props}
    >
      {children}
    </div>
  );
});

ScrollableMessageContainer.displayName = "ScrollableMessageContainer";