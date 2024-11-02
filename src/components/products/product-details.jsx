"use client";

import styles from "@/styles/Product.module.css";

import { FiShoppingBag, FiThumbsUp } from "react-icons/fi";
import { IoHeartCircle } from "react-icons/io5";
import { CgNotes } from "react-icons/cg";

import HorizontalLine from "@/components/ui/horizontal-line";
import SareeDetails from "@/components/products/saree-details";
import SuitDetails from "@/components/products/suit-details";
import { TbRulerMeasure } from "react-icons/tb";

import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductDetails({
  productData,
  selectedSize,
  setSelectedSize,
}) {
  const recommendation = 98;
  const [addedToBag, setAddedToBag] = useState(false);
  const router = useRouter();
  let storedBag = localStorage.getItem("bag");
  let bag = [];

  if (storedBag) {
    bag = JSON.parse(storedBag);
  }

  const handleAddToBag = () => {
    if (selectedSize === "") {
      toast.error("Please select a size");
      return;
    }
    bag.push({
      id: productData._id,
      price: productData.price,
      productName: productData.productName,
      image: productData.images?.[0],
      selectedSize,
    });
    localStorage.setItem("bag", JSON.stringify(bag));
    toast.success("Added To Bag");
    setAddedToBag(true);
  };

  const goToBag = () => {
    router.push('/bag')
  }

  useEffect(() => {
    if (productData.category === "sarees") setSelectedSize("Free size")
  }, [])



  return (
    <div className="flex flex-col w-full lg:w-1/2">
      <div className="p-4 rounded-2xl flex flex-col gap-6">
        <p className="text-xl text-darkGrayColor">{productData.productName}</p>
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
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2 items-center">
            <TbRulerMeasure size={"1.5rem"} />
            <p className="text-brightOrange text-base font-semibold">
              Select size
            </p>
          </div>
          {productData.category === "sarees" &&
            productData.inventory > 0 && (
              <div className="bg-brightOrange text-white rounded-full px-4 py-2 w-fit font-medium">
                Free size
              </div>
            ) 
          }
          {productData.category === "suits" && (
            <div className="flex flex-row overflow-y-auto gap-4">
              {productData.inventory?.map((value, index) => {
                if (value.quantity > 0) {
                  return (
                    <div
                      onClick={() => setSelectedSize(value.size)}
                      key={index}
                      className={`h-12 w-12 rounded-xl  font-semibold flex flex-row justify-center items-center  ${
                        selectedSize === value.size
                          ? "bg-brightOrange border border-brightOrange text-white"
                          : "border border-grayColor"
                      }`}
                    >
                      {value.size}
                    </div>
                  );
                }
              })}
            </div>
          )}
        </div>

        <div className="flex md:flex-row text-base place-content-evenly flex-row-reverse">
          <button
            onClick={addedToBag ? goToBag : handleAddToBag}
            className="flex flex-row rounded-xl items-center justify-center font-bold gap-2 bg-darkBlue text-white py-2 w-1/2"
          >
            <FiShoppingBag size={"1.5rem"} />
            {addedToBag ? 'Go to Bag' :'Add to Bag'}
          </button>
          <button className="flex flex-row font-bold rounded-xl justify-center items-center text-darkBlue border-2 border-darkBlue gap-1 py-2 w-2/5">
            <IoHeartCircle className="text-red" size={"1.5rem"} />
            <p>Favourite</p>
          </button>
        </div>
      </div>
      <div className="border-2 text-darkGrayColor border-lightGrayColor text-sm rounded-2xl my-14 mx-2 py-6">
        <div
          className={`${styles.float} flex flex-row font-semibold gap-4 border-2 border-lightGrayColor w-fit p-4 bg-white rounded-3xl text-base`}
        >
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
