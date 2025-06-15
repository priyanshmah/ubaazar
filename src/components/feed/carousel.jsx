"use client";

import React, { useCallback, useEffect, useState } from "react";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,

// } from "@/components/ui/carousel";
import { Carousel } from "react-responsive-carousel";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import Image1 from "@/public/images/categories/sarees.png";
import Image2 from "@/public/images/categories/suits.png";
import Image3 from "@/public/images/categories/cordsets.png";
import Image4 from "@/public/images/categories/lehengas.png";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";

const AUTOPLAY_DELAY = 3000;

const CarouselImages = () => {
  const images = [Image1, Image2, Image3, Image4];

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Update selected index on scroll
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  // Setup autoplay
  useEffect(() => {
    if (!emblaApi) return;

    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, AUTOPLAY_DELAY);

    emblaApi.on("select", onSelect);
    onSelect(); // initial
    return () => clearInterval(autoplay);
  }, [emblaApi, onSelect]);

  return (
    <div className="w-full">
      {/* Embla Viewport */}
      <div className="overflow-hidden w-full" ref={emblaRef}>
        <div className="flex">
          {images?.map((img, idx) => (
            <div
              key={idx}
              className="flex-[0_0_100%] w-min-full relative aspect-[4/5] object-contain"
            >
              <Image
                src={img}
                alt={`slide-${idx}`}
                fill
                className="object-center"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {images.map((_, idx) => (
          <div
            key={idx}
            onClick={() => emblaApi?.scrollTo(idx)}
            className={`relative h-2  rounded-full cursor-pointer overflow-hidden ${
              selectedIndex === idx
                ? "bg-grayColor w-2"
                : "bg-lightGrayColor w-2"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default CarouselImages;
