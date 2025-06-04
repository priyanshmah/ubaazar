"use client";
import AuthContext from "@/context/authContext";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { HiOutlineHeart } from "react-icons/hi";
import { useSelector } from "react-redux";

function BottomBar() {
  const [bag, setBag] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const { setBagItems } = useContext(AuthContext);
  const productData = useSelector(state => state.product.productData);
  const variantData = useSelector(state => state.product.variantData);
  const selectedSize = useSelector(state => state.product.selectedSize);
  const variantId = useSelector(state => state.product.selectedVariantId);
  const router = useRouter();

  useEffect(() => {
    // if (productData.category === "sarees") setSelectedSize("Free size");

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

  const handleAddToBag = () => {
       

    let addedItems = bag?.map((value) => value._id);
    let alreadyAdded = addedItems.includes(productData._id);

    if (alreadyAdded) {
      toast.success("Already in your bag");
      return;
    }

    const newBag = [
      ...bag,
      {
        productId: productData._id,
        variantId: variantId,
        price: productData.price,
        mrp: productData.mrp || (productData.price * 1.5),
        productName: productData.productName,
        image: variantData?.images?.[0],
        selectedSize,
      },
    ];

    setBag(newBag);
    localStorage.setItem("bag", JSON.stringify(newBag));

    setBagItems((prev) => prev + 1);
    toast.success("Added to bag");
    router.push("/bag");
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

  return (
    <div className="flex flex-row items-center place-content-between gap-2 justify-center fixed bottom-0 left-0 right-0 bg-white w-full py-2 px-4">
      <HiOutlineHeart size={32} className="text-black" strokeWidth={1} />
      <button 
      onClick={handleAddToBag}
      className="border bg-black border-black text-white text-lg w-full rounded-full p-2">
        Add to Bag
      </button>
      
    </div>
  );
}

export default BottomBar;
