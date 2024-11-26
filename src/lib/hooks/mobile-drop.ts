import React, { useRef, useState } from "react";

type TouchItem = {
  element: HTMLElement;
  originalElement: HTMLElement;
  oldXPosition: number;
  oldYPosition: number;
};

type useMobileDropProps = {
  list: string[];
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
  dropRef: React.MutableRefObject<HTMLDivElement | null>;
  theme: "Dark" | "Light";
  onChange: (list: string[]) => void;
};

const useMobileDrop = ({
  list,
  containerRef,
  dropRef,
  theme = "Dark",
  onChange,
}: useMobileDropProps) => {
  const [draggableItems, setDraggableItems] = useState<string[]>(list);
  const [droppedItems, setDroppedItems] = useState<string[]>([]);

  const touchItem = useRef<TouchItem | null>(null);

  const draggedItemRef = useRef<string | null>(null);
  const isItemOverDropZone = useRef<boolean | null>(false);
  const handleTouchStart = (
    event: React.TouchEvent<HTMLDivElement>,
    id: number
  ) => {
    if (event.touches.length === 1) {
      const touch = event.touches[0]!;

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
      draggedItemRef.current = draggableItems[id]!;
    }
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    event.preventDefault();
    const touch = event.touches[0]!;

    if (touchItem.current && containerRef.current) {
      const { element, oldXPosition, oldYPosition } = touchItem.current;
      const deltaX = touch.clientX - oldXPosition;
      const deltaY = touch.clientY - oldYPosition;

      const containerRect = containerRef.current.getBoundingClientRect();

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

  const handleTouchEnd = () => {
    if (touchItem.current) {
      const { element, originalElement } = touchItem.current;
      originalElement.style.opacity = "1";
      if (isItemOverDropZone.current) {
        handleDrop();
      }

      element.remove();
      touchItem.current = null;
      isItemOverDropZone.current = false;
    }
  };

  const handleDrop = () => {
    if (draggedItemRef.current) {
      const newDropedItems = [...droppedItems, draggedItemRef.current];
      setDroppedItems(newDropedItems);
      setDraggableItems((prevData) =>
        prevData.filter((item) => item !== draggedItemRef.current)
      );
      onChange(newDropedItems);
    }
  };

  const handleDroppedItemDelete = (item: string) => {
    const clonedItems = [...droppedItems];
    const filteredItems = clonedItems.filter((i) => i !== item);
    setDroppedItems(filteredItems);
    const newData = [...draggableItems, item];
    setDraggableItems(
      newData.sort((a, b) => list.indexOf(a) - list.indexOf(b))
    );
    onChange(filteredItems);
  };

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleDroppedItemDelete,
    draggableItems,
    droppedItems,
  };
};

export default useMobileDrop;
