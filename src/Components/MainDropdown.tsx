import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import type { FC, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";

type MainDropdownProps = {
  title: ReactNode | string | null;
  children: ReactNode;
  triggerClass?: string;
  showIcon?: boolean;
  autoClose?: boolean;
};

const MainDropdown: FC<MainDropdownProps> = ({
  title,
  children,
  triggerClass,
  showIcon = true,
  autoClose = true,
}) => {
  const [open, setOpen] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(
    null
  );
  const hasMoved = useRef(false);

  // Detect touch devices
  useEffect(() => {
    const checkTouchDevice = () => {
      return (
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-ignore
        navigator.msMaxTouchPoints > 0
      );
    };
    setIsTouchDevice(checkTouchDevice());
  }, []);

  const handleClose = () => {
    if (autoClose) {
      setOpen(false);
    }
  };

  // Handle touch start - record location and time
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isTouchDevice) return;

    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
    hasMoved.current = false;
  };

  // Handle touch movement - detect any movement
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isTouchDevice || !touchStartRef.current) return;

    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);

    // If moved more than 5 pixels in any direction, consider it movement/scroll
    if (deltaX > 5 || deltaY > 5) {
      hasMoved.current = true;
    }
  };

  // Handle touch end - decide whether to open menu or not
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isTouchDevice || !touchStartRef.current) return;

    const touchDuration = Date.now() - touchStartRef.current.time;

    // Always prevent default behavior on touch devices
    e.preventDefault();
    e.stopPropagation();

    // If there was movement or touch was too long, don't open menu
    if (hasMoved.current || touchDuration > 500) {
      touchStartRef.current = null;
      return;
    }

    // Only if it was a quick tap without movement, open/close menu
    setOpen(!open);
    touchStartRef.current = null;
  };

  // Prevent default Radix UI behavior on touch devices
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isTouchDevice && e.pointerType === "touch") {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <DropdownMenu
      modal={false}
      open={open}
      onOpenChange={(newOpen) => {
        // On touch devices, we manually control open/close completely
        if (!isTouchDevice) {
          setOpen(newOpen);
        }
      }}
    >
      <DropdownMenuTrigger
        className={`${triggerClass} group relative overflow-hidden transition-all duration-300 [@media(hover:hover)]:hover:scale-105 active:scale-95 [&>svg]:hidden touch-manipulation select-none`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onPointerDown={handlePointerDown}
        asChild={false}
      >
        <div className="flex items-center gap-2">
          <span>{title}</span>
          {showIcon && (
            <motion.svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-200 group-data-[state=open]:rotate-180"
            >
              <polyline points="6,9 12,15 18,9" />
            </motion.svg>
          )}
        </div>
        {/* Hover effect - only for devices that support hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 [@media(hover:hover)]:group-hover:opacity-100 transition-opacity duration-300" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="py-2 px-1 bg-white rounded-xl shadow-xl border border-gray-200"
        sideOffset={8}
        onInteractOutside={handleClose}
      >
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MainDropdown;
