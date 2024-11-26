"use client";
import Image from "next/image";
import styles from "@/styles/Product.module.css";
import "@/styles/globals.css";
import "react-responsive-carousel/lib/styles/carousel.min.css"; 


import { Carousel } from "react-responsive-carousel";

export default function ImagesCrousel({ images }) {

  return (
    <div
      className={`lg:w-3/5 lg:sticky overflow-x-hidden lg:top-10 `}
    >
      <div className="h-full w-full p-2">
        <Carousel showArrows={false}>
          {images.map((value, index) => {
            return (
              <div key={index}>
                <Image 
                src={value}
                height={400}
                width={300}
                alt="Product Image"
                />
              </div>
            )
          })}
        </Carousel>
        
      </div>

    </div>
  );
}
