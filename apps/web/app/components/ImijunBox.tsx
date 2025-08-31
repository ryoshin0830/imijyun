"use client";

import { useDroppable } from "@dnd-kit/core";

interface ImijunBoxProps {
  id: string;
  label: string;
  color: string;
  content: any;
}

export default function ImijunBox({ id, label, color, content }: ImijunBoxProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        ${color} 
        ${isOver ? "ring-4 ring-blue-400" : ""}
        min-h-[120px] rounded-lg p-4 text-white
        flex flex-col items-center justify-center
        transition-all duration-200
        shadow-lg hover:shadow-xl
      `}
    >
      <div className="text-sm font-semibold mb-2 opacity-90">{label}</div>
      <div className="text-xl font-bold">
        {content ? content.text : "―"}
      </div>
    </div>
  );
}