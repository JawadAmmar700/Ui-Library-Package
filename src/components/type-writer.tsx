import { cn } from "@/utils/cn";
import { ClassValue } from "clsx";
import React, { useEffect, useState } from "react";

interface TypeWriterProps {
  text: string;
  loop: boolean;
  cursorStyle?: ClassValue;
  TextStyle?: ClassValue;
  animationDuration: number;
}

const TypeWriter = ({
  loop,
  text,
  cursorStyle,
  TextStyle,
  animationDuration,
}: TypeWriterProps) => {
  const [animatedText, setAnimatedText] = useState("");

  useEffect(() => {
    const lastTimeRef: { current: number | null } = { current: null };
    let currentTextIndex = 0;
    let textLength = text.length + 1;

    const animation = () => {
      const now = performance.now();

      if (!lastTimeRef.current) {
        lastTimeRef.current = now;
      }

      const deltaTime = now - lastTimeRef.current;

      if (deltaTime > animationDuration) {
        if (loop) {
          if (currentTextIndex <= text.length) {
            currentTextIndex++;
            setAnimatedText(text.slice(0, currentTextIndex));
          }
          if (textLength <= currentTextIndex) {
            textLength--;
            setAnimatedText(text.slice(0, textLength));
          }

          lastTimeRef.current = now;
        } else {
          if (currentTextIndex < text.length) {
            currentTextIndex++;
            setAnimatedText(text.slice(0, currentTextIndex));
          }

          lastTimeRef.current = now;
        }
      }
      if (!loop) {
        if (currentTextIndex < text.length) {
          requestAnimationFrame(animation);
        } else {
          cancelAnimationFrame(animationId);
        }
      }
      if (loop) {
        if (textLength >= 0) {
          requestAnimationFrame(animation);
        } else {
          textLength = text.length + 1;
          currentTextIndex = 0;
          setAnimatedText(text.slice(0, currentTextIndex));
          requestAnimationFrame(animation);
        }
      }
    };

    const animationId = requestAnimationFrame(animation);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div
      className={cn("flex text-white text-2xl relative items-start", TextStyle)}
    >
      <span className="relative">
        {animatedText.split("\n").map((line, index) => (
          <React.Fragment key={index}>
            {line}
            {index < animatedText.split("\n").length - 1 && <br />}
          </React.Fragment>
        ))}
        {animatedText.length > 0 && (
          <span
            className={cn(
              "w-[0.5em] h-[30px]  bg-white animate-blink inline-block absolute bottom-[0]",
              cursorStyle
            )}
            aria-hidden="true"
            style={{ marginLeft: "0.1em" }}
          />
        )}
      </span>
    </div>
  );
};

export default TypeWriter;