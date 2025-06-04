"use client";
import React, { useEffect, useState } from "react";
import ImagesCrousel from "./image-crousel";
import ProductDetails from "./product-details";
import { useDispatch, useSelector } from "react-redux";
import { setProductData, setSelectedSize, setVariantData, setVariantId } from "@/redux/slice/ProductSlice";

function Product({ productData }) {
 
  const variantData = useSelector(state => state.product.variantData);
  const selectedSize = useSelector(state => state.product.selectedSize);
  const variantId = useSelector(state => state.product.selectedVariantId);
  const dispatch = useDispatch();

  const handleSelectSize = size => {
    dispatch(setSelectedSize(size));
  };

  const handleSelectVariant = variant => {
    dispatch(setVariantId(variant._id))
    dispatch(setVariantData(variant));
  };

  useEffect(() => {

    if(productData) dispatch(setProductData(productData));

    if (!variantId) {
      dispatch(setVariantId(productData?.variants[0]?._id));
      dispatch(setVariantData(productData?.variants[0]));
    } else {
      const targetedVariant = productData?.variants?.find(
        variant => variant._id === variantId,
      );
      dispatch(setVariantData(targetedVariant));
    }
  }, []);

 
  

  return (
    <div className="flex flex-col lg:flex-row w-full">
      <ImagesCrousel
      images={variantData?.images}
      />
      <ProductDetails 
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        productData={productData} 
      />
    </div>
  );
}

export default Product;
