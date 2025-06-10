import {
  removeProduct,
  setProductQuantity,
  setProducts,
} from "@/redux/slice/bagSlice";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

function BagItems({ product }) {
  const bag = useSelector((state) => state.bag?.products);
  const quantity = useSelector(
    (state) =>
      state.bag?.products?.find(
        (value) => value.productId === product.productId
      )?.quantity
  );
  const dispatch = useDispatch();

  const handleReduceQuantity = () => {
    if (quantity > 1) {
      dispatch(
        setProductQuantity({ productId: product.productId, quantity: quantity - 1 })
      );
    }
  };

  const handleIncreaseQuantity = () => {
    dispatch(
      setProductQuantity({ productId: product.productId, quantity: quantity + 1 })
    );
  };

  const handleRemoveItem = () => {
    dispatch(removeProduct({ productId: product.productId }));

    const updatedBag = bag.filter(
      (item) => item.productId !== product.productId
    );
    localStorage.setItem("bag", JSON.stringify(updatedBag));
  };

  console.log(
    "product is: ",
    bag.find((value) => value.productId === product.productId)
  );

  return (
    <div className="p-2">
      <div className="w-full flex flex-row items-center place-content-between">
        <div className="flex flex-row items-center gap-2 w-[70vw]">
          <div className="relative w-1/2 aspect-[3/4]">
            <Image
              src={product.image}
              alt="product image"
              fill
              className="object-cover"
            />
          </div>

          <div className="w-1/2">
            <p className="text-sm font-semibold line-clamp-2">
              {product.productName}
            </p>
            <div className="text-xs text-grayColor font-normal">
              {product.selectedSize || "Free size"}
            </div>
            <div className="flex flex-row items-center gap-2">
              <div className="flex flex-row text-xs items-center bg-lightPink w-fit border border-pink rounded-sm px-1 gap-2 text-pink">
                <FiMinus onClick={handleReduceQuantity} size={15} />
                <p className="text-sm text-darkGrayColor font-semibold">
                  {quantity}
                </p>
                <FiPlus onClick={handleIncreaseQuantity} size={15} />
              </div>
              <div
                onClick={handleRemoveItem}
                className="text-xs text-silver font-normal underline"
              >
                Remove
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-row text-darkGrayColor font-semibold leading-none text-lg">
            <p>₹{product.price}</p>
          </div>
          <div className="text-silver line-through font-normal text-sm">
            <p>₹{product.mrp || Math.floor(product.price * 1.5)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BagItems;
