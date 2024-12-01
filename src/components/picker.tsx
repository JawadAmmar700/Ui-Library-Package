import React, { memo, useCallback } from "react";
import { useEffect, useState } from "react";
import { ClassValue } from "clsx";
import { cn } from "@/utils/cn";
import useSound from "use-sound";
import { useScroll } from "@/lib/hooks/use-scroll";

interface IOSPickerProps {
  inView: number;
  velocity: number;
  onChange: (value: string | number | boolean | null) => void;
  label?: string | null;
  width: number;
  sound?: "pop" | "click";
  defaultValue?: number | null;
  className?: ClassValue;
  labelClassName?: ClassValue;
  data: string[] | number[];
  firstItem?: string | number | boolean | null;
  ItemclassName?: ClassValue;
  mute?: boolean;
}

interface PickerItemProps {
  value?: string | number | boolean | null;
  option: string;
  id?: number;
  activeIndex?: number;
  label?: string | null;
  ItemclassName?: ClassValue;
}

const audioUrl = {
  pop: "/audio/pop.mp3",
  click: "/audio/click.wav",
};

const Picker = memo(
  ({
    inView,
    velocity,
    onChange,
    label = null,
    width,
    sound = "pop",
    defaultValue = null,
    className,
    labelClassName,
    data,
    firstItem,
    ItemclassName,
    mute = true,
  }: IOSPickerProps) => {
    const { ref } = useScroll({ velocity });
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const itemHeight = 30;
    const rootMargin = (inView - 1) * itemHeight;
    const [play] = useSound(audioUrl[sound || "pop"], {
      volume: 0.25,
    });

    useEffect(() => {
      if (!mute) {
        play();
      }
    }, [activeIndex, mute, play]);

    const handleIntersection = useCallback(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute("data-index")!);
            const value = entry.target.getAttribute("data-value")!;

            setActiveIndex(index);
            onChange(value);
          }
        });
      },
      [onChange]
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
    }, [rootMargin, handleIntersection, ref, data]);

    useEffect(() => {
      if (!ref.current) return;
      const scrollTop = defaultValue
        ? (firstItem ? defaultValue + 1 : defaultValue) * itemHeight
        : 0;

      ref.current.scrollTop = scrollTop;
    }, [defaultValue, ref, data, firstItem]);

    return (
      <div
        style={{
          height: `${inView * itemHeight}px`,
          width: `${width}px`,
        }}
        className={cn(
          "relative group rounded-lg transform-gpu hide-scroll-bar",
          className
        )}
      >
        <div
          className={cn(
            "dark:bg-white/10 shadow-lg bg-white text-sm absolute inset-0  -z-10 select-none h-[30px] w-full  font-bold  rounded-md flex items-center justify-end  dark:text-white text-black",
            labelClassName
          )}
        >
          {label && <div className="mr-2 ">{label}</div>}
        </div>
        <div
          ref={ref}
          style={{
            paddingTop: `${inView * itemHeight - 15}px`,
            paddingBottom: `${inView * itemHeight - 15}px`,
            transform: `translateY(${-((inView - 1) * itemHeight)}px)`,
          }}
          className="h-full overflow-scroll  overflow-x-hidden hide-scroll-bar snap-y snap-mandatory cursor-grab"
        >
          {firstItem && (
            <PickerItem
              key="firstItem"
              option={firstItem.toString()}
              value={null}
              activeIndex={activeIndex}
              id={-1}
              label={label}
              ItemclassName={ItemclassName}
            />
          )}
          {data.map((option, index) => (
            <PickerItem
              key={option}
              option={option.toString()}
              value={option}
              activeIndex={activeIndex}
              id={index + 1}
              label={label}
              ItemclassName={ItemclassName}
            />
          ))}
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.inView === nextProps.inView &&
      prevProps.velocity === nextProps.velocity &&
      prevProps.label === nextProps.label &&
      prevProps.onChange === nextProps.onChange &&
      prevProps.width === nextProps.width &&
      prevProps.sound === nextProps.sound &&
      prevProps.className === nextProps.className &&
      prevProps.labelClassName === nextProps.labelClassName &&
      prevProps.onChange === nextProps.onChange &&
      prevProps.data === nextProps.data &&
      prevProps.defaultValue === nextProps.defaultValue
    );
  }
);

const PickerItem = ({
  value,
  option,
  id,
  activeIndex,
  label,
  ItemclassName,
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
      focus:outline-none focus:ring-4 dark:text-white text-black  flex items-center font-semibold w-full h-[30px] rounded-md select-none snap-center transition-opacity duration-75 ease-in-out transform-gpu`,
        ItemclassName
      )}
    >
      {option}
    </div>
  );
};
Picker.displayName = "Picker";
export default Picker;
