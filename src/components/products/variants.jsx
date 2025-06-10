"use client";
import { setVariantData, setVariantId } from "@/redux/slice/ProductSlice";
import Image from "next/image";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

function Variants() {
  const product = useSelector((state) => state.product.productData);
  const selectedVariantId = useSelector((state) => state.product.selectedVariantId);
  const dispatch = useDispatch();

  const handleSelectVariant = (variantId) => {
    dispatch(setVariantId(variantId));
    const targetedVariant = product?.variants?.find(variant => variant._id === variantId);
    dispatch(setVariantData(targetedVariant));
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-base text-darkGrayColor font-semibold">Colour options</p>
      <div className="flex flex-row overflow-x-auto scrollbar-hide gap-2">
        {product?.variants?.map((variant) => {
            const selected = variant._id === selectedVariantId;
          return (
            <div
              key={variant._id}
              onClick={() => handleSelectVariant(variant._id)}
              className="flex flex-col items-center justify-center gap-2"
            >
              <div className={`w-24 aspect-[3/4] ${selected ? "border-2 border-black" : "border-2 border-transparent"} relative rounded-xl overflow-hidden`}>
                <Image
                  src={variant?.images?.[0]}
                  alt={variant.name}
                  fill
                  className="object-cover"
                />
              </div>

              {variant.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Variants;
