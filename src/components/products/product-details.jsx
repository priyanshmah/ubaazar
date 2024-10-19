"use client";

import styles from "@/styles/Product.module.css";

import { FiShoppingBag, FiThumbsUp } from "react-icons/fi";
import { IoHeartCircle } from "react-icons/io5";
import { CgNotes } from "react-icons/cg";

import HorizontalLine from "@/components/ui/horizontal-line";
import SareeDetails from "@/components/products/saree-details";
import SuitDetails from "@/components/products/suit-details";

import toast from "react-hot-toast";


export default function ProductDetails({ productData }) {
    const sizes = ["M", "L", "XL", "XXL", "3XL"];
    const recommendation = 98;
  
    console.log("product data: ", productData);
  
    let bag = JSON.parse(localStorage.getItem('bag')) || [];
  
    const handleAddToBag = () => {
      bag.push({
        name: productData.productName,
        price: productData.price,
        image: productData.variants?.at(0)?.images?.at(0)
      })
  
      localStorage.setItem("bag", JSON.stringify(bag))
      toast.success("Added To Bag")
    }
    
  
    return (
      <div className="flex flex-col w-full lg:w-2/5">
        <div className='p-4 rounded-2xl flex flex-col gap-6'>
          <p className="text-xl text-darkGrayColor">
            {productData.productName}
          </p>
          <div className="hidden my-2">
          <HorizontalLine />
          </div>
          <div className="flex flex-row justify-between items-center">
            <div className="text-2xl font-semibold text-darkGrayColor">
              ₹ {productData.price}
            </div>
            <div className="flex flex-row items-center justify-center gap-3 bg-lightGreen px-3 py-1 rounded-full w-fit h-fit">
              <FiThumbsUp size={"1.5rem"} className="text-green" />
              <p className="text-xs text-green text-center font-bold my-2 ">
                {recommendation}% recommended
              </p>
            </div>
          </div>
          {/* <div className="flex flex-row gap-2">
            <TbRulerMeasure size={"1.5rem"} />
              <p className='text-brightOrange text-sm font-semibold
              '>
                Select size{" "}
              </p>
              
          </div> */}
          {/* <div className="flex flex-row flex-wrap gap-2 text-sm">
            {sizes[0] == "Free Size" ? (
              <button className="border-2 border-darkBlue text-darkBlue text-lg rounded-full px-5 py-2">
                Free Size
              </button>
            ) : (
              sizes.map((value, _) => (
                <button className="rounded-2xl h-12 w-12 flex flex-row  justify-center items-center border border-silver font-semibold">
                  {value}
                </button>
              ))
            )}
          </div> */}
          <div className="flex md:flex-row text-sm place-content-evenly flex-row-reverse">
            <button
            onClick={handleAddToBag}
            className="flex flex-row rounded-xl items-center justify-center font-semibold gap-2 bg-darkBlue text-white py-2 w-1/2">
              <FiShoppingBag size={"1.5rem"}/>
              Add to Bag
            </button>
            <button className="flex flex-row font-semibold rounded-xl justify-center items-center text-darkBlue border-2 border-darkBlue gap-1 py-2 w-2/5">
              <IoHeartCircle className="text-red" size={"1.5rem"} />
              <p>Favourite</p>
            </button>
          </div>
        </div>
        <div className="border-2 text-darkGrayColor border-lightGrayColor text-sm rounded-2xl my-14 mx-2 py-6">
          <div className={`${styles.float} flex flex-row font-semibold gap-4 border-2 border-lightGrayColor w-fit p-4 bg-white rounded-3xl text-base`}>
            <p> Product details</p>
            <CgNotes size={"1.5rem"} />
          </div>
  
          <div className="flex flex-col gap-8 px-4">
            <p
              style={{ whiteSpace: "pre-line" }}
              className="font-semibold text-grayColor"
            >
              {productData.description}
            </p>
  
            {productData.category === "sarees" && (
              <SareeDetails productData={productData} />
            )}
            {productData.category === "suits" && (
              <SuitDetails productData={productData} />
            )}
          </div>
        </div>
      </div>
    );
  }