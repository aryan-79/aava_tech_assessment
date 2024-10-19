import { useState, useEffect, useRef } from "react";

interface ExpandableTextProps {
  text: string;
  maxLines?: number;
}

export default function ExpandableText({ text }: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        const { scrollHeight, clientHeight } = textRef.current;
        setIsOverflowing(scrollHeight > clientHeight);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);

    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, [text]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="w-full">
      <p
        ref={textRef}
        className={`text-sm leading-normal ${
          !isExpanded ? `line-clamp-3` : ""
        }`}
        aria-expanded={isExpanded}
      >
        {text}
      </p>
      {isOverflowing && (
        <button
          onClick={toggleExpand}
          className="mt-2 p-0 h-auto font-normal text-sm text-neutral-400"
          aria-label="expand"
        >
          {isExpanded ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
}
