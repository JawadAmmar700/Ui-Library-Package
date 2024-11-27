import React, { useRef, useState } from "react";
import useMobileDrop from "@/lib/hooks/mobile-drop";
import { cn } from "@/utils/cn";

type MobileDropProps = {
  list: string[];
  onChange: (list: string[]) => void;
  className?: string;
};

const MobileDrop = ({ list, onChange, className }: MobileDropProps) => {
  const [theme, setTheme] = useState<"Dark" | "Light">("Light");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dropRef = useRef<HTMLDivElement | null>(null);
  const {
    draggableItems,
    droppedItems,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleDroppedItemDelete,
  } = useMobileDrop({
    list,
    containerRef,
    dropRef,
    theme,
    onChange,
  });

  const toggleTheme = () => {
    setTheme((prev) => (prev === "Light" ? "Dark" : "Light"));
  };
  return (
    <div
      className={cn(
        `${
          theme === "Dark" ? "bg-gray-900 text-white" : "bg-white text-black"
        }`,
        className
      )}
    >
      <div className="container mx-auto p-4">
        <button onClick={toggleTheme} className="mb-4">
          Toggle Theme
        </button>
        <div ref={containerRef} className="border p-4 mb-4">
          <h2 className="text-xl font-bold mb-2">Draggable Items</h2>
          <div className="flex flex-wrap gap-2">
            {draggableItems.map((item, index) => (
              <div
                key={index}
                className={`py-1 px-2 rounded shadow-md ${
                  theme === "Dark" ? "bg-gray-700" : "bg-gray-200"
                }`}
                onTouchStart={(e) => handleTouchStart(e, index)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {item}
              </div>
            ))}
          </div>
          <div
            ref={dropRef}
            className={`border-2 border-dashed p-4 mt-10 ${
              theme === "Dark" ? "border-white" : "border-black"
            }`}
          >
            <h2 className="text-xl font-bold mb-2">Drop Zone</h2>
            <div className="flex flex-wrap gap-2">
              {droppedItems.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleDroppedItemDelete(item)}
                  className={`py-1 px-2 rounded shadow-md ${
                    theme === "Dark" ? "bg-gray-700" : "bg-gray-200"
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileDrop;
