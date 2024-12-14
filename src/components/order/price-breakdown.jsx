"use client";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

function PriceDetails({ total, isCod, showDiscount }) {
  const [discountCode, setDiscountCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const handleApplyDiscount = () => {
    toast.error("Invalid Disount Code")
  }

  return (
    <div>
      <div className="flex flex-col gap-4">
        { showDiscount && <div>
        <p className="font-sans font-normal text-lg text-darkGrayColor">
          Discount Code
        </p>
        <form 
        className="flex flex-row items-center place-content-between gap-2">
          <input
            value={discountCode}
            onChange={(e) => {
              e.preventDefault();
              setDiscountCode(e.target.value.toUpperCase());
            }}
            type="text"
            className="bg-searchBarColor p-2 rounded-md w-3/4 outline-none
                focus:border focus:border-silver text-darkBlue font-medium"
            placeholder="Add discount code"
            autoCorrect="off"
            spellCheck="false"
          />
          <button 
          onClick={handleApplyDiscount}
          className="p-2 border border-silver shadow-sm w-1/4 rounded-md">
            Apply
          </button>
        </form>
        </div>}
        <div className="">
          <div className="flex flex-row items-center place-content-between">
            <p className="font-medium text-sm">Subtotal</p>
            <p className="font-normal text-darkGrayColor">₹{total}</p>
          </div>
          <div className="flex flex-row items-center place-content-between">
            <p className="font-medium text-sm">Discount</p>
            <p className="font-normal text-darkGrayColor">
              ₹{discount}
            </p>
          </div>
          <div className="flex flex-row items-center place-content-between">
            <p className="font-medium text-sm">COD Charges</p>
            <p className="font-normal text-darkGrayColor">
              ₹{isCod ? 79 : 0}
            </p>
          </div>
          <div className="flex flex-row items-center place-content-between">
            <p className="font-medium text-sm">Platform fee</p>
            <p className="text-green font-semibold font-sans">FREE</p>
          </div>
        </div>
        <div className="flex flex-row items-center place-content-between py-2 border-t border-dashed border-silver">
          <p className="font-medium text-lg text-darkGrayColor">Grand total</p>
          <p className="font-normal text-lg text-darkGrayColor font-sans">
            ₹{total - discount + (isCod ? 79 : 0)}
          </p>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default PriceDetails;
