"use client";
import Image from "next/image";
import Sarees from "@/public/images/categories/party_wear_saree.jpg";
import Kurtis from "@/public/images/categories/kurtis.jpg";
import CordSet from "@/public/images/categories/cord_set.jpg";
import DailyWearSarees from "@/public/images/categories/daily_wear_saree.jpeg";
import AnarkaliSuit from "@/public/images/categories/anarkali_suit.jpg";

import { useState } from "react";

const categories = [
  { img: Sarees, description: "Indian Sarees", slug: "sarees" },
  { img: Kurtis, description: "Kurtis & Suits", slug: "suits" },
  { img: CordSet, description: "Cord Set", slug: "cordset" },
  { img: DailyWearSarees, description: "Daily Wear Saree", slug: "daily-wear" },
  { img: AnarkaliSuit, description: "Anarkali Suit", slug: "anarkali" },
];

export default function StoriesSection({ selected, setSelected }) {
  return (
    <div className="bg-white">
      <div className=" overflow-x-auto w-full px-2 scrollbar-hide">
        <div className="inline-flex gap-2">
          {categories.map((value, index) => {
            return (
              <div className="flex flex-col text-center gap-2" key={index}>
                <div
                  onClick={() => setSelected(value.slug)}
                  className={`relative border-2 ${
                    selected === value.slug ? "border-brightOrange" : "border-white"
                  } rounded-full`}
                  style={{
                    height: "5rem",
                    width: "5rem",
                  }}
                >
                  <Image
                    src={value.img}
                    key={index}
                    alt={`${value.description} product category`}
                    fill
                    className="rounded-full object-cover p-1"
                  />
                </div>
                <p className="text-xs lg:text-base  font-semibold text-darkGrayColor">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
