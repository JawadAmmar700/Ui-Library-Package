import { Trash } from "lucide-react";

type DraggableItemType = {
  text: string;
};

interface AnimatedButtonProps {
  item: DraggableItemType;
  onClick: (item: DraggableItemType) => void;
}

export function AnimatedButtonComponent({
  item,
  onClick,
}: AnimatedButtonProps) {
  return (
    <div className="relative group overflow-hidden text-white px-4 py-1 bg-white/30  rounded-lg shadow-lg  flex-shrink-0">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-teal-400 opacity-0 group-hover:opacity-30 transition-opacity duration-500 ease-in-out rounded-lg" />
      <p className="relative z-10 font-semibold text-sm truncate select-none">
        {item.text}
      </p>
      <button
        onClick={() => onClick(item)}
        className="absolute inset-0 flex items-center justify-center z-20 font-bold text-black bg-white dark:bg-gray-800 rounded-lg transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out group-hover:shadow-xl"
        style={{ clipPath: "polygon(0 0, 100% 0, 80% 100%, 0% 100%)" }}
      >
        <Trash size={18} className="text-red-500" />
      </button>
    </div>
  );
}
