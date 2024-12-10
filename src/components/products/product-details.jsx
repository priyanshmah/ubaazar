"use client";

import styles from "@/styles/Product.module.css";

import { FiShoppingBag } from "react-icons/fi";
import { IoHeartCircle } from "react-icons/io5";
import { CgNotes } from "react-icons/cg";

import HorizontalLine from "@/components/ui/horizontal-line";
import SareeDetails from "@/components/products/saree-details";
import SuitDetails from "@/components/products/suit-details";
import { TbRulerMeasure } from "react-icons/tb";

import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import CordsetDetails from "./cordset-details";

export default function ProductDetails({
  productData,
  selectedSize,
  setSelectedSize,
}) {
  const router = useRouter();
  const [bag, setBag] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [addedToBag, setAddedToBag] = useState(false);

  console.log("product data is: ", productData);
  
  console.log("saved bag is: ", bag);
  useEffect(() => {
    if (productData.category === "sarees") setSelectedSize("Free size");

    let storedBag = localStorage.getItem("bag");
    let storedFavourites = localStorage.getItem("favourites");

    if (storedBag) {
      let parsedBag = JSON.parse(storedBag) || [];
      setBag(parsedBag);
    }

    if (storedFavourites) {
      let parsedFav = JSON.parse(storedFavourites) || [];
      setFavourites(parsedFav);
    }
  }, []);

  useEffect(() => {
    if (bag.length > 0) localStorage.setItem("bag", JSON.stringify(bag));
  }, [bag]);

  const handleAddToBag = () => {
    if (selectedSize === "") {
      toast.error("Please select a size");
      return;
    }

    let addedItems = bag?.map((value) => value._id);
    let alreadyAdded = addedItems.includes(productData._id);

    if (alreadyAdded) {
      toast.success("Already in your bag");
      return;
    }

    console.log("bag before push: ", bag);

    setBag([
      ...bag,
      {
        _id: productData._id,
        price: productData.price,
        productName: productData.productName,
        image: productData.images?.[0],
        selectedSize,
      },
    ]);

    toast.success("Added To Bag");
    setAddedToBag(true);
  };

  const handleAddToFavourites = () => {
    favourites.push({
      id: productData._id,
      price: productData.price,
      productName: productData.productName,
      image: productData.images?.[0],
    });
    localStorage.setItem("favourites", JSON.stringify(favourites));
    toast.success("Favourites added");
  };

  const goToBag = () => {
    router.push("/bag");
  };

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
          <Link href={"https://wa.me/8218174830"} passHref legacyBehavior>
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-row items-center justify-center gap-1 px-3 py-2 border border-green bg-green rounded-full w-fit h-fit"
            >
              <FaWhatsapp size={"1.5rem"} className="text-white" />
              <p className="text-sm text-white text-center font-semibold ">
                Message us
              </p>
            </a>
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2 items-center">
            <TbRulerMeasure size={"1.5rem"} />
            <p className="text-brightOrange text-base font-semibold">
              Select size
            </p>
          </div>
          {productData.category === "sarees" && productData.inventory > 0 && (
            <div className="border border-brightOrange font-semibold text-brightOrange rounded-full px-4 py-2 w-fit ">
              Free size
            </div>
          )}
          {(productData.category === "suits") && (
            <div className="flex flex-row overflow-y-auto gap-4">
              {productData.sizes?.map((value, index) => {
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

          {productData.category === "cordset" && (
            <div className="flex flex-row overflow-y-auto gap-4">
              {productData.sizes?.map((value, index) => {
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
            {addedToBag ? "Go to Bag" : "Add to Bag"}
          </button>
          <button
            onClick={handleAddToFavourites}
            className="flex flex-row font-bold rounded-xl justify-center items-center text-darkBlue border-2 border-darkBlue gap-1 py-2 w-2/5"
          >
            <IoHeartCircle className="text-red" size={"1.5rem"} />
            <p>Favourite</p>
          </button>
        </div>
      </div>
      <div className="border-2 text-darkGrayColor border-lightGrayColor text-sm rounded-2xl my-14 mx-2 py-6">
        <div
          className={`${styles.float} flex flex-row font-semibold gap-4 border-2 border-lightGrayColor w-fit p-2 px-4 bg-white rounded-xl text-base`}
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
          {productData.category === "cordset" && (
            <CordsetDetails productData={productData} />
          )}
        </div>
      </div>
    </div>
  );
}
