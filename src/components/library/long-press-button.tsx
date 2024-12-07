import { cn } from "@/utils/cn";
import { ClassValue } from "clsx";
import React, { useRef } from "react";

interface LongPressButtonProps<TArgs extends (string | number | boolean)[]> {
  // Function to execute when the button is pressed or long-pressed. (counter: number, isHolding: boolean, ...args: TArgs) => void
  onPress: (counter: number, isHolding: boolean, ...args: TArgs) => void;
  // TailwindCSS classes for customizing the button's appearance.
  className?: ClassValue;
  // The content displayed inside the button.
  children: React.ReactNode;
  // Total duration (in milliseconds) before which the button starts responding.
  timeOutDuration?: number;
  // Arguments passed to the `onPress` function. It can be an array of strings, numbers, or boolean values.
  onPressArgs: TArgs;
  // Disable the button from being pressed or long-pressed.
  disabled?: boolean;
  // Delay between each press action in milliseconds.
  delay?: number;
}

const LongPressButton = <TArgs extends (string | number | boolean)[]>({
  onPress,
  className,
  children,
  timeOutDuration = 200,
  onPressArgs,
  disabled,
  delay = 10,
}: LongPressButtonProps<TArgs>) => {
  const requestAnimationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const timeOut = useRef<NodeJS.Timeout | null>(null);

  const counterRef = useRef<number>(0);

  const handleLongPressLogic = () => {
    const animation = () => {
      const now = performance.now();

      if (!lastTimeRef.current) {
        lastTimeRef.current = now;
      }

      const deltaTime = now - lastTimeRef.current;

      if (deltaTime > delay) {
        counterRef.current += 1;
        onPress(counterRef.current, true, ...onPressArgs);
        lastTimeRef.current = now;
      }

      requestAnimationFrameRef.current = requestAnimationFrame(animation);
    };

    requestAnimationFrameRef.current = requestAnimationFrame(animation);
  };

  const handleMouseDown = () => {
    timeOut.current = setTimeout(() => {
      handleLongPressLogic();
    }, timeOutDuration);
  };

  const handleMouseUp = () => {
    if (timeOut.current) {
      clearTimeout(timeOut.current);
      timeOut.current = null;
    }
    if (requestAnimationFrameRef.current !== null) {
      cancelAnimationFrame(requestAnimationFrameRef.current);
      requestAnimationFrameRef.current = null;
      counterRef.current = 0;
    } else {
      onPress(20, false, ...onPressArgs);
    }
  };

  return (
    <button
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      className={cn("p-2 bg-white rounded-md text-black", className)}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default LongPressButton;
