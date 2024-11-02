"use client";
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { useRef, useState, useEffect } from "react";

import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/pagination";
import "swiper/css/navigation";

import styles from "@/styles/Product.module.css";
import "@/styles/globals.css";

import { Pagination, Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import { Carousel } from "react-responsive-carousel";
SwiperCore.use([Navigation, Pagination]);

export default function ImagesCrousel({ images }) {

  return (
    <div
      className={`lg:w-3/5 lg:sticky lg:top-10 ${styles.imageCrousel}`}
    >
      <div className="h-full w-full">
        <Swiper
          effect={"cards"}
          grabCursor={true}
          modules={[Pagination, Navigation]}
          centeredSlides={true}
          slidesPerView={1}
          pagination={{
            clickable: true,
          }}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          style={{
            height: "100%",
            width: "100%",
            paddingBottom: "2rem",
          }}
          spaceBetween={25}
          loop={true}
        >
          {images?.map((image, index) => (
            <SwiperSlide
              key={index}
              className="flex flex-row justify-center items-center"
            >
              <div
                className={`lg:h-full lg:w-full rounded-xl relative`}
                key={index}
                style={{
                  height: '60vh',
                  width: '100vw'
                }}
              >
                <Image
                  src={image}
                  alt="product-image"
                  className="object-contain"
                  fill
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <FaAngleLeft
          className={`${styles.butt} hidden lg:block swiper-button-prev`}
          size={50}
        />
        <FaAngleRight
          className={`${styles.butt} hidden lg:block swiper-button-next`}
          size={50}
        />
      </div>

      {/* <div className="flex flex-row justify-center items-center gap-4">
        {variants?.map((value, index) => {
          return (
            <div
              className={`${styles.variantBox} ${
                selectedVariant === value ? styles.selected : ""
              }`}
              onClick={() => handleClick(index)}
              key={index}
            >
              <Image
                src={value.images?.[0]}
                fill
                style={{ objectFit: "cover", borderRadius: "12px" }}
                key={index}
              />
            </div>
          );
        })}
      </div> */}
    </div>
  );
}
