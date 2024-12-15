"use client";
import React, { useEffect, useState } from "react";
import StoriesSection from "./stories";
import ProductFeed from "./post";
import axiosInstance from "@/helpers/axios/axiosInstance";
import SearchBar from "../ui/search-bar";
import axios from "axios";

function Category({ feed, searchBar, storiesSection }) {
  const [selected, setSelected] = useState("sarees");
  const [productsArray, setProductsArray] = useState(feed || []);

  useEffect(() => {    
    const getProductsArray = async() => {
      try {
        const response = await axios.post(
          '/api/feed', 
          JSON.stringify({ category: selected })
        )
        console.log("product ", response.data);
        
        if (response.data?.success && response.data?.feed) {
          setProductsArray(response.data?.feed)
        }
      } catch (error) {
        return ;
      }
    }
    getProductsArray();
  }, [selected])

  return (
    <div className="bg-white min-h-[100vh]">
      {searchBar &&  <SearchBar />}
      {storiesSection && <StoriesSection selected={selected} setSelected={setSelected}/>}
      <div className="flex flex-row">
    <div className="bg-white w-[15vw] h-[50vh] sticky left-0 top-[20vh] flex flex-col place-content-around">
      <div
        onClick={() => setSelected("sarees")}
        className={`${
          selected === "sarees" ? selectedText : normalText
        } text-nowrap`}
      >
        Indian Sarees
      </div>
      <div
        onClick={() => setSelected("suits")}
        className={`${
          selected === "suits" ? selectedText : normalText
        } text-nowrap`}
      >
        Suit & Kurtis
      </div>
      <div
        onClick={() => setSelected("cordset")}
        className={`${
          selected === "cordset" ? selectedText : normalText
        } text-nowrap`}
      >
        Cord Set
      </div>
    </div>
    <ProductFeed feed={productsArray}/>
    </div>
        
    </div>
  );
}

const normalText = "-rotate-90 text-xs font-semibold text-silver";
const selectedText = "-rotate-90 text-xs font-black text-darkGrayColor";

export default Category;

