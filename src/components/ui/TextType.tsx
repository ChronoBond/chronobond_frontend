"use client";

import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";

interface TextTypeProps {
  text: string[];
  typingSpeed?: number;
  pauseDuration?: number;
  loop?: boolean;
  showCursor?: boolean;
  cursorCharacter?: string;
  className?: string;
  onComplete?: () => void;
}

export const TextType: React.FC<TextTypeProps> = ({
  text,
  typingSpeed = 75,
  pauseDuration = 1500,
  loop = true,
  showCursor = true,
  cursorCharacter = "|",
  className = "",
  onComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (!containerRef.current || text.length === 0) return;

    let currentIndex = 0;
    let currentText = "";
    let isDeleting = false;
    let timeoutId: NodeJS.Timeout;

    const typeText = () => {
      const currentTextToType = text[currentTextIndex];
      
      if (isDeleting) {
        currentText = currentTextToType.substring(0, currentText.length - 1);
      } else {
        currentText = currentTextToType.substring(0, currentText.length + 1);
      }

      if (containerRef.current) {
        containerRef.current.textContent = currentText;
      }

      if (!isDeleting && currentText === currentTextToType) {
        // Finished typing, pause then start deleting
        timeoutId = setTimeout(() => {
          isDeleting = true;
          typeText();
        }, pauseDuration);
      } else if (isDeleting && currentText === "") {
        // Finished deleting, move to next text
        isDeleting = false;
        setCurrentTextIndex((prev) => {
          const nextIndex = (prev + 1) % text.length;
          if (nextIndex === 0 && !loop) {
            setIsTyping(false);
            onComplete?.();
            return prev;
          }
          return nextIndex;
        });
        timeoutId = setTimeout(typeText, typingSpeed);
      } else {
        // Continue typing or deleting
        timeoutId = setTimeout(typeText, isDeleting ? typingSpeed / 2 : typingSpeed);
      }
    };

    // Start typing
    timeoutId = setTimeout(typeText, typingSpeed);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [text, typingSpeed, pauseDuration, loop, currentTextIndex, onComplete]);

  // Cursor blinking animation
  useEffect(() => {
    if (!cursorRef.current || !showCursor) return;

    const cursorAnimation = gsap.to(cursorRef.current, {
      opacity: 0,
      duration: 0.5,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    });

    return () => {
      cursorAnimation.kill();
    };
  }, [showCursor]);

  return (
    <div className={`inline-block ${className}`}>
      <span ref={containerRef}></span>
      {showCursor && isTyping && (
        <span ref={cursorRef} className="text-current">
          {cursorCharacter}
        </span>
      )}
    </div>
  );
};
