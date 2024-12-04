import React, { memo, useCallback } from "react";
import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import useSound from "use-sound";
import { useScroll } from "@/lib/hooks/use-scroll";

interface PickerProps {
  visibleItems: number;
  scrollVelocity: 0.5 | 1 | 1.5 | 2 | 2.5 | 3;
  onValueChange: (value: string | number | boolean | null) => void;
  labelText?: string | null;
  componentWidth: number;
  soundEffect?: "pop" | "click";
  initialValue?: number | null;
  containerClassName?: string;
  labelClassName?: string;
  options: string[] | number[];
  initialItemLabel?: string | number | boolean | null;
  itemClassName?: string;
  isMuted?: boolean;
  ObserverClassName?: string;
}

interface PickerItemProps {
  value?: string | number | boolean | null;
  option: string;
  id?: number;
  activeIndex?: number;
  label?: string | null;
  itemclassName?: string;
}

const audioUrl = {
  pop: "https://gxiporbkm0ip3qac.public.blob.vercel-storage.com/pop-up-eRvfpNCvz3WKxC7o2bZQJxieoonNVF.mp3",
  click:
    "https://gxiporbkm0ip3qac.public.blob.vercel-storage.com/448081__breviceps__tic-toc-click-LspqrDuh6Kp2Du87kRRtLd2UZlujCM.wav",
};

const Picker = memo(
  ({
    onValueChange,
    labelText = null,
    componentWidth,
    soundEffect = "pop",
    initialValue = null,
    containerClassName,
    labelClassName,
    options,
    initialItemLabel,
    itemClassName,
    isMuted = true,
    visibleItems,
    ObserverClassName,
    scrollVelocity,
  }: PickerProps) => {
    const { ref } = useScroll({ velocity: scrollVelocity });
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const itemHeight = 30;
    const rootMargin = (visibleItems - 1) * itemHeight;
    const [play] = useSound(audioUrl[soundEffect || "pop"], {
      volume: 0.25,
    });

    useEffect(() => {
      if (!isMuted) {
        play();
      }
    }, [activeIndex, isMuted, play]);

    const handleIntersection = useCallback(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute("data-index")!);
            const value = entry.target.getAttribute("data-value")!;

            setActiveIndex(index);
            onValueChange(value);
          }
        });
      },
      [onValueChange]
    );

    useEffect(() => {
      const observer = new IntersectionObserver(handleIntersection, {
        threshold: 0.9,
        root: ref.current,
        rootMargin: `-${rootMargin}px 0px -${rootMargin}px 0px`,
      });

      const childrenArray = Array.from(ref.current?.children || []);

      childrenArray.forEach((child) => {
        if (child) {
          observer.observe(child);
        }
      });

      return () => {
        childrenArray.forEach((child) => {
          if (child) {
            observer.unobserve(child);
          }
        });
      };
    }, [rootMargin, ref, options]);

    useEffect(() => {
      if (!ref.current) return;
      const scrollTop = initialValue
        ? (initialItemLabel ? initialValue + 1 : initialValue) * itemHeight
        : 0;

      ref.current.scrollTop = scrollTop;
    }, [initialValue, ref, options, initialItemLabel]);

    return (
      <div
        style={{
          height: `${visibleItems * itemHeight}px`,
          width: `${componentWidth}px`,
        }}
        className={cn(
          "relative group rounded-lg transform-gpu hide-scroll-bar",
          containerClassName
        )}
      >
        <div
          className={cn(
            "dark:bg-white/10 shadow-lg bg-white text-sm absolute inset-0 -z-10 select-none h-[30px] w-full  font-bold  rounded-md flex items-center justify-end text-white",
            ObserverClassName
          )}
        >
          {labelText && (
            <p className={cn("mr-2", labelClassName)}>{labelText}</p>
          )}
        </div>
        <div
          ref={ref}
          style={{
            paddingTop: `${visibleItems * itemHeight - 15}px`,
            paddingBottom: `${visibleItems * itemHeight - 15}px`,
            transform: `translateY(${-((visibleItems - 1) * itemHeight)}px)`,
          }}
          className="h-full overflow-scroll  overflow-x-hidden hide-scroll-bar snap-y snap-mandatory cursor-grab"
        >
          {initialItemLabel && (
            <PickerItem
              key="initialItemLabel"
              option={initialItemLabel.toString()}
              value={null}
              activeIndex={activeIndex}
              id={-1}
              label={labelText}
              itemclassName={itemClassName}
            />
          )}
          {options.map((option, index) => (
            <PickerItem
              key={option}
              option={option.toString()}
              value={option}
              activeIndex={activeIndex}
              id={index + 1}
              label={labelText}
              itemclassName={itemClassName}
            />
          ))}
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.onValueChange === nextProps.onValueChange &&
      prevProps.options === nextProps.options &&
      prevProps.initialValue === nextProps.initialValue &&
      prevProps.initialItemLabel === nextProps.initialItemLabel &&
      prevProps.labelText === nextProps.labelText &&
      prevProps.componentWidth === nextProps.componentWidth &&
      prevProps.soundEffect === nextProps.soundEffect &&
      prevProps.isMuted === nextProps.isMuted &&
      prevProps.visibleItems === nextProps.visibleItems &&
      prevProps.scrollVelocity === nextProps.scrollVelocity &&
      prevProps.ObserverClassName === nextProps.ObserverClassName &&
      prevProps.itemClassName === nextProps.itemClassName &&
      prevProps.containerClassName === nextProps.containerClassName &&
      prevProps.labelClassName === nextProps.labelClassName
    );
  }
);

const PickerItem = ({
  value,
  option,
  id,
  activeIndex,
  label,
  itemclassName,
}: PickerItemProps) => {
  return (
    <div
      key={`${option}-${id}`}
      data-index={id}
      data-value={value}
      className={cn(
        `${
          activeIndex !== id
            ? "opacity-40 text-xs"
            : "opacity-100 scale-100 text-sm"
        } 
        ${label ? "px-2 justify-start" : "justify-center"}
      focus:outline-none focus:ring-4 text-white flex items-center font-semibold w-full h-[30px] rounded-md select-none snap-center transition-opacity duration-75 ease-in-out transform-gpu`,
        itemclassName
      )}
    >
      {option}
    </div>
  );
};
Picker.displayName = "Picker";
export default Picker;
