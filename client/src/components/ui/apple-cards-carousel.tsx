"use client";

import React, {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
} from "react";
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconX,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useOutsideClick } from "@/hooks/use-outside-click";

// ----------------------
// Types & Context
// ----------------------
interface CarouselProps {
  items: React.ReactElement[];
}

export type CardType = {
  src: string;
  title: string;
  category: string;
};

export const CarouselContext = createContext<{
  onCardClose: (index: number) => void;
  currentIndex: number;
}>({
  onCardClose: () => {},
  currentIndex: 0,
});

// ----------------------
// Carousel Component
// ----------------------
export const Carousel = ({ items }: CarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    if (carouselRef.current) checkScrollability();
  }, []);

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const scrollLeft = () => {
    carouselRef.current?.scrollBy({ left: -350, behavior: "smooth" });
  };

  const scrollRight = () => {
    carouselRef.current?.scrollBy({ left: 350, behavior: "smooth" });
  };

  return (
    <div className="relative w-full">
      {/* Scrollable Carousel */}
      <div
        ref={carouselRef}
        onScroll={checkScrollability}
        className="flex w-full overflow-x-scroll scroll-smooth scrollbar-hide space-x-6 px-6 py-10"
      >
        {items.map((item, index) => (
          <motion.div
            key={"card" + index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1 * index, ease: "easeOut" } }}
            className="flex-shrink-0"
          >
            {item}
          </motion.div>
        ))}
      </div>

      {/* Left & Right Navigation */}
      <div className="absolute top-1/2 left-2 transform -translate-y-1/2">
        <button
          className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center disabled:opacity-50 shadow"
          onClick={scrollLeft}
          disabled={!canScrollLeft}
        >
          <IconArrowNarrowLeft className="h-6 w-6 text-gray-500" />
        </button>
      </div>
      <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
        <button
          className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center disabled:opacity-50 shadow"
          onClick={scrollRight}
          disabled={!canScrollRight}
        >
          <IconArrowNarrowRight className="h-6 w-6 text-gray-500" />
        </button>
      </div>
    </div>
  );
};

// ----------------------
// Card Component
// ----------------------
export const Card = ({ card }: { card: CardType }) => {
  return (
    <motion.div className="relative w-[280px] md:w-[350px] h-[500px] rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
      <Image src={card.src} alt={card.title} fill className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      <div className="absolute bottom-4 left-4 text-white z-10">
        <p className="text-sm font-light uppercase">{card.category}</p>
        <h3 className="text-2xl font-semibold">{card.title}</h3>
      </div>
    </motion.div>
  );
};