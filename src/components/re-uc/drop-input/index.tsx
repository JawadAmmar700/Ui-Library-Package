import {
  BadgePlus,
  ChevronLeft,
  ChevronRight,
  List,
  Search,
} from "lucide-react";
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { AnimatedButtonComponent } from "./animated-button";
import TypeWriter from "../type-writer";
import LongPressButton from "../long-press-button";

interface DropInputProps {
  theme: "Dark" | "Light";
  inputLabel: string;
  dataLabel: string;
  data: string[];
  onChange: (value: DropItemType[]) => void;
}

type DropItemType = {
  text: string;
};

type TouchItem = {
  element: HTMLElement;
  originalElement: HTMLElement;
  oldXPosition: number;
  oldYPosition: number;
};

export default function DropInput({
  theme = "Dark",
  data,
  dataLabel,
  inputLabel,
  onChange,
}: DropInputProps) {
  const [inputOrDropZone, setInputOrDropZone] = useState<"Input" | "DropZone">(
    "DropZone"
  );
  const [list, setList] = useState<string[]>(data);
  const [inputValue, setInputValue] = useState<string>("");
  const [dropedItems, setDropedItems] = useState<DropItemType[]>([]);
  const [deletedItem, setDeletedItem] = useState<DropItemType | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const draggedItemRef = useRef<DropItemType | null>(null);
  const timeOutRef = useRef<NodeJS.Timeout | null>(null);
  const touchItem = useRef<TouchItem | null>(null);
  const contanierRef = useRef<HTMLDivElement | null>(null);
  const isItemOverDropZone = useRef<boolean | null>(null);

  const inputWidth = inputOrDropZone === "Input" ? "85%" : "15%";
  const dropZoneWidth = inputOrDropZone === "DropZone" ? "85%" : "15%";

  const filteredData = useMemo(() => {
    return list.filter((item) =>
      item.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [inputValue, list]);

  const handleScroll = useCallback(
    (counter: number, isHolding: boolean, direction: "left" | "right") => {
      if (dropZoneRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = dropZoneRef.current;
        if (direction === "left" && scrollLeft > 0) {
          dropZoneRef.current.scrollTo({
            left: Math.max(0, scrollLeft - counter),
            behavior: isHolding ? "instant" : "smooth",
          });
        }
        if (direction === "right" && scrollLeft < scrollWidth - clientWidth) {
          dropZoneRef.current.scrollTo({
            left: Math.min(scrollWidth - clientWidth, scrollLeft + counter),
            behavior: isHolding ? "instant" : "smooth",
          });
        }
      }
    },
    [dropZoneRef.current]
  );

  useEffect(() => {
    if (dropZoneRef.current && !deletedItem) {
      const lastElement = dropZoneRef.current.lastElementChild;
      lastElement?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "end",
      });
    }
  }, [dropedItems]);

  const handleDragStart = useCallback(
    (event: React.DragEvent<HTMLDivElement>, id: number, text: string) => {
      if (dropZoneRef.current) {
        draggedItemRef.current = {
          text: filteredData[id],
        };
        const dragImage = document.createElement("div");
        dragImage.className = `flex-shrink-0 py-1 px-2 rounded shadow-md ${
          theme === "Dark"
            ? "bg-white/20 hover:bg-white/30"
            : "bg-black/20 hover:bg-black/30"
        }   cursor-pointer select-none text-white  text-xs font-semibold whitespace-nowrap`;
        dragImage.textContent = text;
        dragImage.style.position = "absolute";
        dragImage.style.top = "-1000px";
        dragImage.style.left = "-1000px";
        document.body.appendChild(dragImage);
        event.dataTransfer.setDragImage(dragImage, 0, 0);

        setTimeout(() => {
          document.body.removeChild(dragImage);
        }, 0);
      }
    },
    [filteredData]
  );
  const handleDragEnd = useCallback(() => {
    draggedItemRef.current = null;
    setIsDraggingOver(false);
  }, []);

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
    },
    []
  );

  const handleDragEnter = useCallback(() => {
    setIsDraggingOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDraggingOver(false);
  }, []);

  const handleDrop = useCallback(
    (gesture: "Touch" | "Mouse") => {
      if (draggedItemRef.current) {
        const newDropedItems = [...dropedItems, draggedItemRef.current];
        setDropedItems(newDropedItems);
        setList((prevData) =>
          prevData.filter((item) => item !== draggedItemRef.current?.text)
        );
        onChange(newDropedItems);
      }
      if (gesture == "Mouse") setIsDraggingOver(false);
    },
    [dropedItems, list, draggedItemRef.current]
  );

  const handleItemDelete = (item: DropItemType) => {
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current);
    }
    const clonedItems = [...dropedItems];
    const filteredItems = clonedItems.filter((i) => i !== item);
    setDropedItems(filteredItems);
    const newData = [...list, item.text];
    setDeletedItem(item);
    setList(newData.sort((a, b) => data.indexOf(a) - data.indexOf(b)));
    onChange(filteredItems);
    timeOutRef.current = setTimeout(() => {
      setDeletedItem(null);
    }, 200);
  };

  const handleTouchStart = (
    event: React.TouchEvent<HTMLDivElement>,
    id: number
  ) => {
    if (event.touches.length === 1) {
      const touch = event.touches[0];

      // Create a clone of the element
      const originalElement = event.target as HTMLDivElement;
      const clonedElement = originalElement.cloneNode(true) as HTMLDivElement;
      originalElement.style.opacity = "0.5";

      clonedElement.className = `absolute left-[${touch.clientX}px]  top-[${
        touch.clientY
      }px] flex-shrink-0 py-1 px-2 rounded shadow-md ${
        theme === "Dark" ? "bg-white/20 text-white " : "bg-white/20 text-black "
      } select-none flex items-center justify-center text-xs font-semibold whitespace-nowrap`;
      clonedElement.style.pointerEvents = "none";

      document.body.appendChild(clonedElement);

      // Store the cloned element in touchItem
      touchItem.current = {
        element: clonedElement,
        originalElement,
        oldXPosition: touch.clientX,
        oldYPosition: touch.clientY,
      };
      draggedItemRef.current = {
        text: filteredData[id],
      };
    }
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    event.preventDefault();
    const touch = event.touches[0];

    if (touchItem.current && contanierRef.current) {
      const { element, oldXPosition, oldYPosition } = touchItem.current;
      const deltaX = touch.clientX - oldXPosition;
      const deltaY = touch.clientY - oldYPosition;

      const containerRect = contanierRef.current.getBoundingClientRect();

      // Ensure the element stays within the container
      const elementRec = element.getBoundingClientRect();
      const elementLeft = oldXPosition + deltaX - containerRect.left;
      const elementTop = oldYPosition + deltaY - containerRect.top;

      if (
        elementTop >= -elementRec.height / 2 &&
        elementTop <= containerRect.height - elementRec.height / 2 &&
        elementLeft >= -elementRec.width / 2 &&
        elementLeft <= containerRect.width - elementRec.width / 2
      ) {
        element.style.left = `${touch.clientX}px`;
        element.style.top = `${touch.clientY}px`;

        // Handle drop zone check
        if (dropRef.current) {
          const dropRect = dropRef.current.getBoundingClientRect();
          const dropX = touch.clientX - dropRect.left;
          const dropY = touch.clientY - dropRect.top;

          if (
            dropX >= -elementRec.width / 2 &&
            dropX <= dropRect.width - elementRec.width / 2 &&
            dropY >= -elementRec.height / 2 &&
            dropY <= dropRect.height - elementRec.height / 2
          ) {
            isItemOverDropZone.current = true;
            element.style.border = "2px dotted green";
          } else {
            isItemOverDropZone.current = false;
            element.style.border = "none";
          }
        }
      }
    }
  };

  const handleTouchEnd = useCallback(() => {
    if (touchItem.current) {
      const { element, originalElement } = touchItem.current;
      originalElement.style.opacity = "1";
      if (isItemOverDropZone.current) {
        handleDrop("Touch");
      }

      // Reset state
      element.remove();
      touchItem.current = null;
      isItemOverDropZone.current = false;
    }
  }, [draggedItemRef.current, list, dropedItems]);

  return (
    <div
      ref={contanierRef}
      style={{
        backgroundColor: theme === "Dark" ? "#0f172a" : "#e2e8f0",
      }}
      className="p-5 w-4/5 md:w-3/5 lg:w-2/5 rounded-lg"
    >
      <div className="flex flex-col items-start space-y-1">
        <div className="flex items-center justify-between w-full">
          <h1
            className={`text-md font-bold ${
              theme === "Dark" ? "text-slate-100" : "text-black"
            } `}
          >
            {inputLabel}
          </h1>
        </div>
        <div className="w-full flex rounded h-[40px] space-x-2">
          {/* Input Section */}
          <div
            style={{
              width: inputWidth,
              transition: "width 0.3s cubic-bezier(0.895, 0.030, 0.685, 0.220)",
            }}
            className={`${
              theme === "Dark" ? "bg-white/20 " : "bg-black/30 "
            } rounded ring-2 ring-slate-500 flex items-center group justify-center`}
          >
            {inputOrDropZone === "DropZone" ? (
              <button
                onClick={() => setInputOrDropZone("Input")}
                className="py-2 rounded flex group-hover:bg-white/10 transition-colors duration-200 ease-in-out  items-center justify-center w-full  h-full bg-transparent "
              >
                <Search
                  size={20}
                  className="text-white/50 group-hover:text-white"
                />
              </button>
            ) : (
              <input
                type="text"
                className={`w-full rounded px-2 placeholder:font-bold  text-sm font-bold ${
                  theme === "Dark"
                    ? "text-slate-400 "
                    : "text-slate-200 placeholder:text-slate-200"
                }  h-full border-none focus:outline-none bg-transparent`}
                placeholder={`Filter ${dataLabel}...`}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            )}
          </div>
          {/* End of Input Section  */}

          {/* Cart Section */}
          <div
            ref={dropRef}
            style={{
              width: dropZoneWidth,
              transition: "width 0.3s cubic-bezier(0.895, 0.030, 0.685, 0.220)",
            }}
            className={`relative overflow-hidden  rounded bg-custom-gradient bg-large animate-backgroundMove flex h-full items-center `}
          >
            {inputOrDropZone === "Input" ? (
              <button
                onClick={() => setInputOrDropZone("DropZone")}
                className={`w-full ${
                  theme === "Dark" ? "bg-white/30 " : "bg-black/30 "
                } h-full group transition-colors duration-200 ease-in-out  rounded flex items-center justify-center`}
              >
                <List
                  size={20}
                  className={` ${
                    theme === "Dark"
                      ? "text-black group-hover:text-black/80"
                      : "text-white group-hover:text-white/80"
                  }`}
                />
              </button>
            ) : (
              <>
                {dropedItems.length == 0 && (
                  <div
                    className={`h-full w-full flex items-center ${
                      isDraggingOver ? "justify-end" : "justify-between"
                    } px-2 absolute text-sm font-bold text-white/50 select-none ${
                      theme === "Dark" ? "bg-black/20" : "bg-white/20"
                    } `}
                  >
                    {!isDraggingOver && (
                      <TypeWriter
                        text="Drag and drop items here"
                        loop={false}
                        animationDuration={50}
                        TextStyle="text-sm font-bold text-white/50"
                        cursorStyle="hidden"
                      />
                    )}
                    <BadgePlus
                      className={`${
                        isDraggingOver && "animate-spin"
                      } text-white/50 `}
                    />
                  </div>
                )}
                <div
                  ref={dropZoneRef}
                  className="w-full h-full z-50  rounded  space-x-1 px-2 overflow-x-scroll flex items-center text-black hide-scroll-bar"
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop("Mouse")}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                >
                  {dropedItems.map((item, index) => (
                    <AnimatedButtonComponent
                      item={item}
                      key={index}
                      onClick={handleItemDelete}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        {/* End of Cart Section  */}

        {/* Scroll Buttons */}
        {inputOrDropZone === "DropZone" && (
          <div className="flex items-center justify-end space-x-1 w-full relative top-1">
            <LongPressButton
              onPress={handleScroll}
              onPressArgs={["left"]}
              timeOutDuration={200}
              disabled={dropedItems.length === 0}
              className={`rounded p-1 ${
                theme === "Dark"
                  ? "bg-white/20 hover:bg-white/30"
                  : "bg-black/20 hover:bg-black/30"
              }`}
            >
              <ChevronLeft size={20} className="text-white" />
            </LongPressButton>

            {dropedItems.length > 0 && (
              <div
                className={`text-xs font-bold select-none ${
                  theme === "Dark" ? "text-white" : "text-black"
                }`}
              >
                {dropedItems.length}
              </div>
            )}
            <LongPressButton
              onPress={handleScroll}
              onPressArgs={["right"]}
              timeOutDuration={200}
              disabled={dropedItems.length === 0}
              className={`rounded p-1 ${
                theme === "Dark"
                  ? "bg-white/20 hover:bg-white/30"
                  : "bg-black/20 hover:bg-black/30"
              }`}
            >
              <ChevronRight size={20} className="text-white" />
            </LongPressButton>
          </div>
        )}
        {/* End of Scroll Buttons */}

        {/* Drop Items */}
        <div
          className={`flex flex-col items-start space-y-4 ${
            theme === "Dark" ? "text-white" : "text-black"
          } ${inputOrDropZone === "Input" && "relative top-2"} `}
        >
          <h1
            className={`text-md font-bold ${
              theme === "Dark" ? "text-slate-100" : "text-black"
            } `}
          >
            {dataLabel}
          </h1>
          <div className="flex space-x-1">
            <div
              ref={listRef}
              className="flex flex-wrap gap-2 touch-none overflow-y-scroll drop-input-scrollbar"
            >
              {filteredData.map((item, index) => (
                <div
                  key={index}
                  draggable={true}
                  className={` ${
                    deletedItem?.text === item
                      ? "animate-scale"
                      : "animate-none"
                  }  flex-shrink-0 py-1 px-2 rounded shadow-md ${
                    theme === "Dark"
                      ? "bg-white/20 hover:bg-white/30"
                      : "bg-white/20 hover:bg-black/10"
                  } select-none   flex items-center justify-center text-xs font-semibold whitespace-nowrap`}
                  onDragEnd={handleDragEnd}
                  onDragStart={(e) => handleDragStart(e, index, item)}
                  onTouchStart={(e) => handleTouchStart(e, index)}
                  onTouchEnd={handleTouchEnd}
                  onTouchMove={handleTouchMove}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* End of Drop Items */}
      </div>
    </div>
  );
}
