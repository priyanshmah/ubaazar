"use client";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { setProductarray, setSelectedCategory } from "@/redux/slice/productArraySlice";
import axios from "axios";
import { useEffect } from "react";

const categories = [
  { description: "All", slug: "all" },
  { description: "Sarees", slug: "sarees" },
  { description: "Kurtis & Suits", slug: "suits" },
  { description: "Cord Set", slug: "cordset" },
  { description: "Lehengas", slug: "lehangas" },
  { description: "Gown", slug: "gown" },
];

export default function StoriesSection() {
  const selected = useSelector((state) => state.feed.selectedCategory);
  const dispatch = useDispatch();

  
  return (
    <div className="bg-white sticky top-20 left-0 z-50 px-2 py-4">
      <div className=" overflow-x-auto whitespace-nowrap w-full px-2 scrollbar-hide">
        <div className="inline-flex flex-nowrap gap-4">
          {categories.map((value, index) => {
            const isSelected = selected === value.slug;
            return (
              <div
                onClick={() => {
                  dispatch(setSelectedCategory(value.slug));
                }}
                className={`flex flex-col text-center border-b-2 ${
                  isSelected ? "border-black" : "border-white"
                } gap-2`}
                key={index}
              >
                <p
                  className={`text-base lg:text-base text-black  px-2 ${
                    isSelected ? "font-bold" : "font-normal text-grayColor"
                  }`}
                >
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
