"use client";

import { motion } from "framer-motion";
import React, { HTMLAttributes, useMemo } from "react";
import { cn } from "../../lib/utils";

const createGridMask = (start, end) => {
  const mid = (start + end) / 2;
  return `linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.05) ${start}%, rgba(0,0,0,0.2) ${mid}%, rgba(0,0,0,0.6) ${end - 20}%, rgba(0,0,0,1) ${end}%)`;
};

const generateRayConfig = (index, total) => {
  const progress = index / Math.max(total - 1, 1);
  const leftPercent = 2 + progress * 96;
  const rotation = 28 - progress * 56;
  const variation = (index * 0.618) % 1;

  return {
    left: `${leftPercent}%`,
    rotation,
    width: 40 + variation * 25,
    duration: 6 + variation * 5,
    delay: -variation * 10,
    swayDuration: 12 + variation * 9,
    swayDelay: -variation * 10,
    blur: 24 + variation * 9,
    strongSway: index % 2 === 0,
  };
};

const LightRay = React.memo(
  ({
    left,
    rotation,
    width,
    delay,
    duration,
    swayDuration,
    swayDelay,
    blurAmount,
    isStrongerSway,
    opacity,
    speed,
    length,
  }) => {
    return (
      <motion.div
        className="absolute pointer-events-none -top-[5%] left-[var(--ray-left)] w-[var(--ray-width)] h-[var(--ray-height)] origin-top mix-blend-screen bg-[linear-gradient(to_bottom,rgba(200,220,255,var(--ray-opacity)),rgba(200,220,255,0))] blur-[var(--ray-blur)] translate-x-[-50%] rotate-[var(--ray-rotation)]"
        style={
          {
            "--ray-left": left,
            "--ray-width": `${width}px`,
            "--ray-height": length,
            "--ray-opacity": opacity,
            "--ray-blur": `${blurAmount}px`,
            "--ray-rotation": `${rotation}deg`,
          }
        }
        animate={{
          opacity: [0.3, 0.7, 0.3],
          transform: [
            `translateX(-50%) rotate(${rotation}deg)`,
            `translateX(-50%) rotate(${rotation + (isStrongerSway ? 1 : 0.5)}deg)`,
            `translateX(-50%) rotate(${rotation}deg)`,
          ],
        }}
        transition={{
          opacity: {
            duration: duration / speed,
            delay: delay / speed,
            repeat: Infinity,
            ease: "easeInOut",
          },
          transform: {
            duration: swayDuration / speed,
            delay: swayDelay / speed,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      />
    );
  },
);

export const GridBeams = ({
  children,
  className,
  gridSize = 40,
  rayCount = 15,
  rayOpacity = 0.35,
  raySpeed = 1,
  rayLength = "45vh",
  gridFadeStart = 30,
  gridFadeEnd = 90,
  ...props
}) => {
  const rayConfigs = useMemo(() => {
    return Array.from({ length: rayCount }, (_, i) =>
      generateRayConfig(i, rayCount),
    );
  }, [rayCount]);

  const gridMask = useMemo(
    () => createGridMask(gridFadeStart, gridFadeEnd),
    [gridFadeStart, gridFadeEnd],
  );

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        className,
      )}
      style={{ backgroundColor: "var(--bg-color)" }}
      {...props}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "var(--radial-gradient)" }}
      />
      <div
        className="absolute inset-0 pointer-events-none grid-background bg-size-[var(--grid-size)_var(--grid-size)] [mask-image:var(--grid-mask)] [webkit-mask-image:var(--grid-mask)]"
        style={
          {
            "--grid-size": `${gridSize}px`,
            "--grid-mask": gridMask,
          }
        }
      />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {rayConfigs.map((config, index) => (
          <LightRay
            key={index}
            left={config.left}
            rotation={config.rotation}
            width={config.width}
            delay={config.delay}
            duration={config.duration}
            swayDuration={config.swayDuration}
            swayDelay={config.swayDelay}
            blurAmount={config.blur}
            isStrongerSway={config.strongSway}
            opacity={rayOpacity}
            speed={raySpeed}
            length={rayLength}
          />
        ))}
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
};
