"use client";
import React, { useState } from "react";
import ImagesCrousel from "./image-crousel";
import ProductDetails from "./product-details";

function Product({ productData }) {
  const [selectedSize, setSelectedSize] = useState('');
  console.log("product data: ", productData);
  

  return (
    <div className="flex flex-col lg:flex-row w-full">
      <ImagesCrousel
        images={productData?.images}
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
