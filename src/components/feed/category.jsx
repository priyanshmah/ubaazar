"use client";
import React, { useEffect, useState } from "react";
import StoriesSection from "./stories";
import ProductFeed from "./post";
import axiosInstance from "@/helpers/axios/axiosInstance";
import SearchBar from "../ui/search-bar";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setProductarray } from "@/redux/slice/productArraySlice";
import { setSelectedCategory } from "@/redux/slice/selectedCategory";

function Category({ feed, searchBar, storiesSection }) {
  const selected = useSelector((state) => state.selectedCategory);
  const dispatch = useDispatch();

  const getProductsArray = async (category) => {
    try {
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

  useEffect(() => {
    dispatch(setProductarray({ productArray: feed }));
    dispatch(setSelectedCategory({ category: "sarees" }));
  }, []);

  return (
    <div className="bg-white min-h-[100vh]">
      {storiesSection && <StoriesSection />}
      <div className="flex flex-row">
        {/* <div className="bg-white w-[15vw] h-[50vh] sticky left-0 top-[20vh] flex flex-col place-content-around p-2">
          <div
            onClick={() => {
              dispatch(setSelectedCategory({ category: "sarees" }));
              getProductsArray("sarees");
            }}
            className="h-1/3 flex flex-row items-center justify-center rounded-xl "
          >
            <p
              className={`${selected === "sarees" ? selectedText : normalText}`}
            >
              Indian Sarees
            </p>
          </div>
          <div
            onClick={() => {
              dispatch(setSelectedCategory({ category: "suits" }));
              getProductsArray("suits");
            }}
            className="rounded-xl h-1/3 flex flex-row items-center justify-center"

          >
            <p
              className={`${selected === "suits" ? selectedText : normalText}`}
            >
              Suit & Kurtis
            </p>
          </div>
          <div
            onClick={() => {
              dispatch(setSelectedCategory({ category: "cordset" }));
              getProductsArray("cordset");
            }}
            className="rounded-xl h-1/3 flex flex-row items-center justify-center"

          >
            <p
              className={`${selected === "cordset" ? selectedText : normalText}`}
            >
              Cord Set
            </p>
          </div>
        </div> */}
        <ProductFeed feed={feed} />
      </div>
    </div>
  );
}

const normalText = "-rotate-90 text-xs font-semibold text-silver text-nowrap";
const selectedText = "-rotate-90 text-xs p-2 rounded-xl font-black text-pink bg-rose-100 text-nowrap";

export default Category;
