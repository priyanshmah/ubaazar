"use client";
import Image from "next/image";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
const AUTOPLAY_DELAY = 3000;

const ImagesCarousel = ({images}) => {

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
              className="flex-[0_0_100%] w-min-full relative aspect-[3/4]"
            >
              <Image
                src={img}
                alt={`slide-${idx}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {images?.map((_, idx) => (
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

export default ImagesCarousel;
