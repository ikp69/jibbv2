"use client";

import { useState, useRef, ReactNode, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  tiltMaxAngle?: number;
  scale?: number;
  speed?: number;
}

export function TiltCard({
  children,
  className,
  tiltMaxAngle = 5,
  scale = 1.05,
  speed = 0.5,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(max-width: 640px)");
      setIsMobile(mediaQuery.matches);
      const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateXValue = ((y - centerY) / centerY) * tiltMaxAngle * -1;
    const rotateYValue = ((x - centerX) / centerX) * tiltMaxAngle;

    setRotateX(rotateXValue * speed);
    setRotateY(rotateYValue * speed);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsHovered(true);
    }
  };

  return (
    <motion.div
      ref={ref}
      className={cn("cursor-pointer perspective", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        transformStyle: "preserve-3d",
      } as any}
      animate={{
        rotateX: isHovered && !isMobile ? rotateX : 0,
        rotateY: isHovered && !isMobile ? rotateY : 0,
        scale: isHovered && !isMobile ? scale : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 60,
      }}
    >
      <motion.div
        className="w-full h-full"
        style={{
          transformStyle: "preserve-3d",
        } as any}
      >
        {/* Glow effect on hover */}
        <motion.div
          className="absolute inset-0 rounded-[2rem] opacity-0 pointer-events-none"
          style={{
            background: "radial-gradient(circle at center, rgba(255,200,100,0.3) 0%, transparent 70%)",
            transformStyle: "preserve-3d",
            transform: "translateZ(20px)",
          } as any}
          animate={{
            opacity: isHovered && !isMobile ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Main content */}
        <div
          className="w-full h-full"
          style={{
            transformStyle: "preserve-3d",
            transform: "translateZ(30px)",
          } as any}
        >
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}
