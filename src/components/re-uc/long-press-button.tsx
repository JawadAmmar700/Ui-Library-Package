import React, { useRef } from "react";

interface LongPressButtonProps<TArgs extends (string | number | boolean)[]> {
  onPress: (counter: number, isHolding: boolean, ...args: TArgs) => void;
  className?: string;
  children: React.ReactNode;
  timeOutDuration: number;
  onPressArgs: TArgs;
  disabled?: boolean;
  delay?: number;
}

const LongPressButton = <TArgs extends (string | number | boolean)[]>({
  onPress,
  className,
  children,
  timeOutDuration,
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
      className={className}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default LongPressButton;
