import { useCallback, useEffect, useRef } from "react";

type UseScrollProps = {
  // Velocity is a prop for scrolling speed as a numeric value between 0.5 and 3
  velocity: 0.5 | 1 | 1.5 | 2 | 2.5 | 3;
};

const useScroll = ({ velocity }: UseScrollProps) => {
  const wheelRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef<boolean>(false);
  const startPosition = useRef<number>(0);
  const scrollTop = useRef<number>(0);

  const handleStart = useCallback((e: MouseEvent | TouchEvent) => {
    if (!wheelRef.current) return;
    const wheel = wheelRef.current;
    wheel.style.cursor = "grabbing";
    const currentPosition = "touches" in e ? e.touches[0].pageY : e.pageY;
    startPosition.current = currentPosition;
    scrollTop.current = wheel.scrollTop;
    isDragging.current = true;
  }, []);

  const handleEnd = useCallback(() => {
    wheelRef.current!.style.cursor = "grab";
    isDragging.current = false;
  }, []);

  const handleMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      e.preventDefault();

      if (!wheelRef.current || !isDragging.current) return;
      const wheel = wheelRef.current;

      const endPosition = "touches" in e ? e.touches[0].pageY : e.pageY;
      const delta = (endPosition - startPosition.current) * velocity;
      wheel.scrollTop = scrollTop.current - delta;
    },
    [velocity]
  );

  const handleWheel = useCallback((e: WheelEvent) => {
    if (!wheelRef.current) return;
    const wheel = wheelRef.current;

    if (e.deltaY < 50 && e.deltaY > -50) return;
    e.preventDefault();
    const slowDownFactor = 0.2;
    const delta = e.deltaY * slowDownFactor;
    wheel.scrollTop += delta;
  }, []);

  useEffect(() => {
    const wheel = wheelRef.current;
    if (!wheel) return;

    // Mouse events
    wheel.addEventListener("mousedown", handleStart);
    wheel.addEventListener("mouseup", handleEnd);
    wheel.addEventListener("mousemove", handleMove);
    wheel.addEventListener("mouseleave", handleEnd);

    // Touch events
    wheel.addEventListener("touchstart", handleStart);
    wheel.addEventListener("touchend", handleEnd);
    wheel.addEventListener("touchmove", handleMove);

    // Wheel event
    wheel.addEventListener("wheel", handleWheel);

    // Cleanup
    return () => {
      wheel.removeEventListener("mousedown", handleStart);
      wheel.removeEventListener("mouseup", handleEnd);
      wheel.removeEventListener("mousemove", handleMove);
      wheel.removeEventListener("mouseleave", handleEnd);

      wheel.removeEventListener("touchstart", handleStart);
      wheel.removeEventListener("touchend", handleEnd);
      wheel.removeEventListener("touchmove", handleMove);

      wheel.removeEventListener("wheel", handleWheel);
    };
  }, [handleEnd, handleMove, handleStart, handleWheel]);

  return { ref: wheelRef };
};

export { useScroll };
