"use client";
import React, { useEffect, useState } from "react";
import StoriesSection from "./stories";
import ProductFeed from "./post";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setCategorisedProducts,
  setProducts,
  setSelectedCategory,
} from "@/redux/slice/productArraySlice";

function Category({ feed }) {
  const dispatch = useDispatch();
  console.log("diapatch is: ", feed);

  useEffect(() => {
    if (feed?.length) {
      dispatch(setSelectedCategory("all"));
      dispatch(setProducts(feed));
    }
  }, [feed]);

  return (
    <div className="bg-white min-h-[100vh]">
      <StoriesSection />
      <div className="flex flex-row">
        <ProductFeed />
      </div>
    </div>
  );
}

export default Category;
