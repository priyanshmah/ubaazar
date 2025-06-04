"use client";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { IoCashOutline, IoTicketOutline } from "react-icons/io5";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { TbRosetteDiscount, TbShoppingBag } from "react-icons/tb";

function PriceDetails({ total, isCod, showDiscount }) {
  const [discountCode, setDiscountCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const handleApplyDiscount = () => {
    toast.error("Invalid Disount Code");
  };

  return (
    <div>
      <div className="flex flex-col bg-lightBackground  gap-2">
        <div className="p-4 bg-white">
          <p className="font-semibold text-lg text-darkGrayColor">
            Discount Code
          </p>
          <form className="flex flex-row items-center place-content-between">
            <input
              value={discountCode}
              onChange={(e) => {
                e.preventDefault();
                setDiscountCode(e.target.value.toUpperCase());
              }}
              type="text"
              className="p-2 border border-silver font-medium w-3/4 outline-none
                focus:border focus:border-silver focus:border-r-0 border-r-0"
              placeholder="Discount code or gift card"
              autoCorrect="off"
              spellCheck="false"
            />
            <button
              onClick={handleApplyDiscount}
              className="p-2 border bg-black text-white border-black w-1/4 "
            >
              CHECK
            </button>
          </form>
        </div>
        <div className="bg-white">
            <p className="font-semibold p-2 text-lg text-darkGrayColor">
              Bill Summary
            </p>
          <div className="flex flex-col gap-1 p-4">
            <div className="flex flex-row items-center place-content-between">
              <div className="flex flex-row items-center gap-2">
                <TbShoppingBag
                  size={25}
                  strokeWidth={1.75}
                  className="bg-lightBackground p-1 rounded-full text-grayColor"
                />
                <p className="font-medium text-sm">Total MRP</p>
              </div>
              <p className="font-normal text-darkGrayColor">₹{total}</p>
            </div>
            <div className="flex flex-row items-center place-content-between">
            <div className="flex flex-row items-center gap-2">
                <TbRosetteDiscount
                  size={25}
                  strokeWidth={1.75}
                  className="bg-lightBackground p-1 rounded-full text-grayColor"
                />
                <p className="font-medium text-sm">Discount on MRP</p>
              </div>
              <p className="font-normal text-green">-₹{discount}</p>
            </div>
            <div className="flex flex-row items-center place-content-between">
            <div className="flex flex-row items-center gap-2">
                <IoTicketOutline
                  size={25}
                  strokeWidth={1.5}
                  className="bg-lightBackground p-1 rounded-full text-grayColor"
                />
                <p className="font-medium text-sm">Coupon Discount</p>
              </div>
              <p className="text-green font-normal">-₹0</p>
            </div>
            <div className="flex flex-row items-center place-content-between">
            <div className="flex flex-row items-center gap-2">
                <RiMoneyRupeeCircleLine
                  size={25}
                  className="bg-lightBackground p-1 rounded-full text-grayColor"
                />
                <p className="font-medium text-sm">COD Charges</p>
              </div>
              {isCod ? (
                <p className="font-normal text-darkGrayColor">₹79</p>
              ) : (
                <div className="flex flex-row gap-1">
                  <p className="font-normal text-darkGrayColor line-through">
                    ₹79
                  </p>
                  <p className="font-normal text-darkGrayColor">₹0</p>
                </div>
              )}
            </div>
            
          </div>
          <div className="flex flex-row items-center place-content-between p-2 border-t border-dashed border-silver">
            <p className="font-medium text-base text-darkGrayColor">
              Grand total
            </p>
            <p className="font-semibold text-lg text-darkGrayColor ">
              ₹{total - discount + (isCod ? 79 : 0)}
            </p>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default PriceDetails;
