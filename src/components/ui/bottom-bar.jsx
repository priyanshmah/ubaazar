"use client";

import styles from "@/styles/Home.module.css";
import { FaTags } from "react-icons/fa6";
import { FaRegCompass } from "react-icons/fa";
import { LuClapperboard } from "react-icons/lu";
import { MdOutlineFilterVintage } from "react-icons/md";
import { useState } from "react";
import { CiShoppingTag } from "react-icons/ci";
import { PiCompassDuotone } from "react-icons/pi";
import { BsFlower1 } from "react-icons/bs";

import reels from '@/public/icons/reels.svg'
import Image from "next/image";



export default function BottomBar() {
  const [clickedState, setClickedState] = useState(1);

  return (
    <div className='fixed bottom-0 w-full left-0 z-50 flex flex-row bg-white text-darkBlue text-xs font-semibold place-content-evenly py-2 md:hidden'>
      <div
        className={`flex flex-col justify-center items-center gap-1 ${
            clickedState === 1 ? "text-brightOrange" : ""
        }`}
        onClick={() => setClickedState(1)}
      >
        <PiCompassDuotone size={25} strokeWidth={2}/>
        <p className={` ${
          clickedState === 1 ? "text-brightOrange" : ""
        }`}>Explore</p>
      </div>

      <div
        className={`flex flex-col justify-center items-center gap-1 ${
            clickedState === 4 ? "text-brightOrange" : ""
        }`}
        onClick={() => setClickedState(4)}
      >
        <LuClapperboard size={25} strokeWidth={1.5} />
        {/* <Image src={reels} height="1rem" width="1rem"/> */}
        <p className={` ${
          clickedState === 4 ? "text-brightOrange" : ""
        }`}>Watch & Buy</p>
      </div>

      <div
        className={`flex flex-col justify-center items-center gap-1 ${
            clickedState === 3 ? "text-brightOrange" : ""
        }`}
        onClick={() => setClickedState(3)}
      >
        <BsFlower1 size={25}/>
        <p className={` ${
          clickedState === 3 ? "text-brightOrange" : ""
        }`}>New Arrival</p>
      </div>

      
      <div
        className={`flex flex-col justify-center items-center gap-1 ${
            clickedState === 2 ? "text-brightOrange" : ""
        }`}
        onClick={() => setClickedState(2)}
      >
        <CiShoppingTag size={25} strokeWidth={0.5}/>
        <p className={`${
          clickedState === 2 ? "text-brightOrange" : ""
        }`}>Best Seller</p>
      </div>
    </div>
  );
}
