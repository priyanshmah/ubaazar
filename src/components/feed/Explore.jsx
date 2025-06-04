import React from "react";
import EthnicWear from "@/public/images/cards/EthnicWear.webp";
import DailyWear from "@/public/images/cards/DailyWear.webp";
import PartyWear from "@/public/images/cards/PartyWear.webp";
import WeddingWear from "@/public/images/cards/WeddingWear.webp";
import Image from "next/image";
import Marquee from "react-fast-marquee";


function Explore() {
  return (
    <div className="w-full flex flex-col items-center justify-center py-4 bg-lightPink">
      {/* <div className="flex flex-row gap-2 text-xl p-4 font-bold text-center justify-center">
        <div className=" text-pink">Explore</div>
        <div classname="text-red">Everything</div>
      </div> */}
      <Marquee gradient={false} speed={60} className="py-4">
      <div className="mx-4 "> curated by #love</div>
      <div className="mx-4 "> curated by #love</div>
      <div className="mx-4 "> curated by #love</div>
      <div className="mx-4 "> curated by #love</div>
    </Marquee>
      
      <div className=" overflow-x-auto whitespace-nowrap w-full p-2 scrollbar-hide">
        <div className="inline-flex flex-nowrap gap-4">
          {[EthnicWear, DailyWear, PartyWear, WeddingWear]?.map(
            (value, index) => {
              return (
                <div
                  key={index}
                  className="w-[50vw] aspect-[3/4] relative border border-grayColor shadow-none  rounded-3xl overflow-hidden"
                >
                  <Image
                    src={value}
                    alt="EthnicWear"
                    fill
                    className="object-cover rounded-none"
                  />
                </div>
              );
            }
          )}
        </div>
      </div>

      <div className="bg-white w-fit border border-grayColor p-2 px-4 text-sm rounded-full">
        Explore
      </div>
    </div>
  );
}

export default Explore;
