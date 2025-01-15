import { cn } from "@/utils/cn";
import { ClassValue } from "clsx";
import React, { createContext, useContext, useEffect, useRef } from "react";

type Position =
  | "Top-Left"
  | "Top-Right"
  | "Bottom-Left"
  | "Bottom-Right"
  | "Top-Center"
  | "Bottom-Center";

interface IDockProps {
  position: Position;
  className?: ClassValue;
  children: React.ReactNode;
  animationDuration?: 75 | 100 | 150 | 200 | 300 | 500 | 700 | 1000;
}

const dockPositionClassName = (position: Position) => {
  switch (position) {
    case "Top-Left":
      return "top-5 left-2";
    case "Top-Right":
      return "top-5 right-2";
    case "Bottom-Left":
      return "bottom-5 left-2";
    case "Bottom-Right":
      return "bottom-5 right-2";
    case "Top-Center":
      return "top-5 left-1/2 transform -translate-x-1/2";
    case "Bottom-Center":
      return "bottom-5 left-1/2 transform -translate-x-1/2";
  }
};

const DockContext = createContext<
  { dockPosition: number; duration: string | undefined } | undefined
>(undefined);

const IDock = ({
  position = "Bottom-Center",
  className,
  children,
  animationDuration,
}: IDockProps) => {
  const dock = useRef<HTMLDivElement | null>(null);
  const positionX = useRef<{ id: number; x: number }[] | null>(null);
  const dockPosition = position.includes("Top") ? 1 : -1;
  const duration = animationDuration
    ? `duration-${animationDuration}`
    : "duration-300";

  useEffect(() => {
    if (!dock.current) return;
    const childrens = Array.from(dock.current?.children || []);

    if (childrens) {
      positionX.current = childrens.map((child, index) => ({
        x: Math.round(child.getBoundingClientRect().x),
        id: index,
      }));
    }
  }, [dock]);

  useEffect(() => {
    if (!dock.current) return;

    const onMouseMove = (e: MouseEvent) => {
      if (!positionX.current) return;

      const x = e.clientX;

      const closest = positionX.current.reduce((prev, curr) =>
        Math.abs(curr.x - x) < Math.abs(prev.x - x) ? curr : prev
      );

      const updateTransform = (child: HTMLElement, transform: string) => {
        child.style.transform = transform;
      };

      Array.from(dock.current?.children || []).forEach((child, index) => {
        const el = child as HTMLElement;
        const distance = Math.abs(index - closest.id);
        let scale = 1;
        let translateY = 0;

        if (distance === 0) {
          scale = 1.5;
          translateY = 25 * dockPosition;
        } else if (distance === 1) {
          scale = 1.25;
          translateY = 15 * dockPosition;
        } else if (distance === 2) {
          scale = 1;
          translateY = 5 * dockPosition;
        }

        updateTransform(el, `scale(${scale}) translateY(${translateY}px)`);
      });
    };

    const onMouseLeave = () => {
      Array.from(dock.current?.children || []).forEach((child) => {
        const el = child as HTMLElement;
        el.style.transform = `scale(1)`;
      });
    };

    dock.current.addEventListener("mousemove", onMouseMove);
    dock.current.addEventListener("mouseleave", onMouseLeave);

    return () => {
      dock.current?.removeEventListener("mousemove", onMouseMove);
      dock.current?.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <DockContext.Provider value={{ dockPosition, duration }}>
      <div
        ref={dock}
        className={cn(
          "z-50 absolute w-[200px] h-[50px] cursor-pointer px-2 flex space-x-4 items-center justify-center isolate aspect-video backdrop-blur-md rounded-xl bg-white/10 shadow-lg ring-1 ring-black/5 transition-all",
          dockPositionClassName(position),
          duration,
          className
        )}
      >
        {children}
      </div>
    </DockContext.Provider>
  );
};

type IDockChildProps = {
  className?: ClassValue;
  icon: React.ReactNode;
  tooltip?: string;
  tooltipClassName?: ClassValue;
  onClick?: () => void;
};

const IDockChild = ({
  icon,
  className,
  tooltip,
  tooltipClassName,
  onClick,
}: IDockChildProps) => {
  const context = useContext(DockContext);

  if (!context) {
    throw new Error("IDockChild must be used within an IDock.");
  }

  const { dockPosition, duration } = context;

  return (
    <div className={cn("relative group transform ease-linear", duration)}>
      {tooltip && (
        <div className="relative">
          <div
            className={cn(
              "text-white absolute text-xs whitespace-nowrap px-2 hidden group-hover:block left-1/2 -translate-x-1/2 py-0.5 rounded bg-gray-400 shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-[-4px] transition-opacity",
              `${dockPosition > 0 ? "top-8" : "-top-5"}`,
              duration,
              tooltipClassName
            )}
          >
            {tooltip}
          </div>
        </div>
      )}
      <button
        onClick={onClick}
        className={cn(
          "flex items-center rounded-full justify-center cursor-pointer",
          className
        )}
      >
        {icon}
      </button>
    </div>
  );
};

IDock.Child = IDockChild;

export default IDock;
