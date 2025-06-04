"use client";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedCategory } from "@/redux/slice/selectedCategory";
import { setProductarray } from "@/redux/slice/productArraySlice";
import axios from "axios";

const categories = [
  { description: "All Products", slug: "all" },
  { description: "Sarees", slug: "sarees" },
  { description: "Kurtis & Suits", slug: "suits" },
  { description: "Cord Set", slug: "cordset" },
  { description: "Lehengas", slug: "daily-wear" },
  { description: "Gown", slug: "anarkali" },
];

export default function StoriesSection() {
  const selected = useSelector((state) => state.selectedCategory);
  const dispatch = useDispatch();

  const getProductsArray = async (category) => {
    try {
      console.log("category is: ", category);

      const response = await axios.post(
        "/api/feed",
        JSON.stringify({ category })
      );
      console.log("product ", response.data);

      if (response.data?.success && response.data?.feed) {
        dispatch(setProductarray({ productArray: response.data?.feed }));
      }
    } catch (error) {
      return;
    }
  };

  return (
    <div className="bg-white sticky top-20 left-0 z-50 px-2 py-4">
      <div className=" overflow-x-auto whitespace-nowrap w-full px-2 scrollbar-hide">
        <div className="inline-flex flex-nowrap gap-4">
          {categories.map((value, index) => {
            const isSelected = selected === value.slug;
            return (
              <div
                onClick={() => {
                  console.log("clicked");

                  dispatch(setSelectedCategory({ category: value.slug }));
                  getProductsArray(value.slug);
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
