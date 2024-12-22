"use client";
import Image from "next/image";
import styles from "@/styles/Product.module.css";
import "@/styles/globals.css";
import "react-responsive-carousel/lib/styles/carousel.min.css"; 


import { Carousel } from "react-responsive-carousel";

export default function ImagesCrousel({ images }) {

  return (
    <div
      className={`lg:w-3/5 lg:sticky overflow-x-auto w-full min-w-[100vw] justify-center lg:top-10 bg-white`}
    >
      <div className="inline-flex gap-4 p-2">
          {images.map((value, index) => {
            return (
              <div
              className="h-full rounded-xl"
              style={{ width: "80vw", height: "120vw", borderRadius: "0.75rem" }}
              key={index}
            >
              <Image
                src={value}
                height={300}
                width={400}
                className="h-full w-full rounded-xl object-cover"
              />
            </div>
            )
          })}
        
      </div>

    </div>
  );
}
