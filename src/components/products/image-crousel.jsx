"use client";
import Image from "next/image";
import styles from "@/styles/Product.module.css";
import "@/styles/globals.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import { useSelector } from "react-redux";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";


export default function ImagesCrousel({ images }) {

  if (!images) {
    return null;
  }
  
  return (
    <div
      className={`lg:w-3/5 lg:sticky overflow-x-auto w-full min-w-[100vw] justify-center lg:top-10 bg-white`}
    >
      <Carousel
        // ref={carouselRef}
        className="w-full"
        plugins={[
          Autoplay({
            delay: 3000,
          }),
        ]}
      >
        <CarouselContent>
          {images?.map((img, idx) => (
            <CarouselItem key={idx} className="w-full aspect-[3/4] relative">
              <Image
                src={img}
                alt={`slide-${idx}`}
                fill
                className="object-cover"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
