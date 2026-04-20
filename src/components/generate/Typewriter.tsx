"use client";

import { useEffect, useState } from "react";

export function Typewriter({ content, speed = 10 }: { content: string; speed?: number }) {
  const [displayedContent, setDisplayedContent] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < content.length) {
        setDisplayedContent((prev) => prev + content.charAt(index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [content, speed]);

  return (
    <div className="prose prose-sm max-w-none whitespace-pre-wrap font-sans text-foreground">
      {displayedContent}
    </div>
  );
}
