import React from "react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import review from "@/public/images/reviews/review";
import Image from "next/image";
import ubaazarWomen from "@/public/images/ubaazar-women.png";

function Rating({ rating }) {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars;

  return (
    <div className="flex flex-col gap-4 bg-white overflow-x-hidden">
      <div className="p-4 flex flex-col gap-4">
        <p className="font-sans text-lg font-medium">Customer reviews</p>
        <div className="bg-red rounded-xl flex flex-row items-end gap-4 justify-center p-2">
          <div className="flex flex-row text-gold items-center justify-center gap-1">
            {Array.from({ length: fullStars }, (_, key) => (
              <FaStar key={key} size={"1.5rem"} className="text-[#FCF596]" />
            ))}

            {halfStar < 1 && (
              <FaStarHalfAlt size={"1.5rem"} className="text-[#FCF596]" />
            )}
            {halfStar == 1 && <FaStar size={"1.5rem"} className="text-gold" />}
          </div>
          <p className="text-sm font-semibold text-white ">{rating} out of 5</p>
        </div>
        <p className="text-xs text-center font-semibold text-darkGrayColor">
          This rating is calculated based on customer reviews via Whatsapp and
          Instagram Dms
        </p>
      </div>

      <div>
        <p className="font-sans text-lg font-medium px-4">
          What customers feel about us ?
        </p>

        <div
          className="overflow-x-auto w-full scroll-smooth py-4"
          style={{ whiteSpace: "nowrap" }}
        >
          <div className="inline-flex gap-2 px-4">
            {review.map((value, index) => {
              return (
                <div
                  className="h-full rounded-xl bg-yellow-50"
                  style={{ width: "70vw", height: "95vw" }}
                  key={index}
                >
                  <Image
                    src={value.img}
                    height={300}
                    width={400}
                    className="h-full w-full rounded-xl object-scale-down border border-darkGrayColor"
                    alt={`customer reviews Image ${index}`}
                  />
                  <div className="text-xs my-2 flex flex-row gap-1 justify-center font-semibold text-center text-grayColor">
                    <p className="text-brightOrange">{value.name}</p>
                    <p>from</p>
                    <p>{value.place}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-row place-content-between items-center gap-4 ">
        <Image
          src={ubaazarWomen}
          className="h-40 w-40 object-contain"
          height={300}
          width={400}
          alt="girl with shopping bags"
        />
        <div>
          <div className="px-4 font-medium font-sans text-3xl text-darkGrayColor">
            <div className="flex flex-row gap-2">
              <p className="">Waiting</p>
              <p className="text-silver">for</p>
            </div>
            <div className="flex flex-row gap-2  ">
              <p className="text-silver">your</p>
              <p className="">review</p>
            </div>
          </div>
          <p className="text-base text-brightOrange font-semibold p-2 text-center">
            Keep Shopping 😘
          </p>
        </div>
      </div>

    </div>
  );
}

export default Rating;
