"use client";

import { CgNotes } from "react-icons/cg";
import HorizontalLine from "@/components/ui/horizontal-line";
import SareeDetails from "@/components/products/saree-details";
import SuitDetails from "@/components/products/suit-details";
import CordsetDetails from "./cordset-details";
import {
  TbCash,
  TbRulerMeasure,
  TbShoppingBag,
  TbShoppingBagPlus,
  TbStars,
} from "react-icons/tb";

import toast from "react-hot-toast";
import { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "nextjs-toploader/app";
import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import AuthContext from "@/context/authContext";
import { MdSwapCalls } from "react-icons/md";
import axios from "axios";
import { RotatingLines } from "react-loader-spinner";
import { IoIosCheckmarkCircle, IoIosCloseCircle } from "react-icons/io";
import Variants from "./variants";
import { GoChevronDown, GoChevronUp } from "react-icons/go";

export default function ProductDetails({
  productData,
  selectedSize,
  setSelectedSize,
}) {
  const discount = productData.mrp
    ? (productData.mrp - productData.price) / productData.mrp
    : 0.5;
  const discountPercentage = Math.floor(discount * 100);

  const [showDescription, setShowDescription] = useState(true);
  const [showShipping, setShowShipping] = useState(false);
  const [showMoreInfo, setShowMoreInfo] = useState(false);

  return (
    <div className="flex flex-col w-full gap-4 bg-white py-8 px-4">
      <div className="flex flex-col gap-4 bg-white">
        <p className={`font-medium text-darkGrayColor text-lg leading-none`}>
          {productData.productName}
        </p>
        <div>
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row gap-2 justify-center items-center">
              <div className="text-2xl font-semibold text-darkGrayColor bg-yellowColor">
                ₹{productData.price}
              </div>
              <div className="text-xl text-silver line-through font-normal justify-center items-center">
                ₹{productData.mrp || 1.5 * productData.price}
              </div>
            </div>
            <Link href={"https://wa.me/8218174830"} passHref legacyBehavior>
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-row items-center justify-center gap-2 p-2 px-4 border border-green bg-white rounded-full w-fit h-fit"
              >
                <FaWhatsapp size={20} className="text-green" />
                <p className="text-sm text-green text-center font-semibold ">
                  Chat with us
                </p>
              </a>
            </Link>
          </div>
          <div className="">(inclusive of all taxes)</div>
          <div className="text-white text-sm font-semibold bg-pink rounded-md p-1 w-fit ">
            Save {discountPercentage}%
          </div>
        </div>

        <Variants />

        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2 items-center text-darkGrayColor">
            <TbRulerMeasure size={"1.5rem"} className="text-darkGrayColor" />
            <p className="text-brightOrange text-base font-semibold">
              Select size
            </p>
          </div>
          {productData.category === "sarees" && productData.inventory > 0 && (
            <div className="border border-brightOrange font-semibold text-brightOrange rounded-full px-4 py-2 w-fit ">
              Free size
            </div>
          )}
          {productData.category === "suits" && (
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
      </div>

      <div className=" bg-white text-darkGrayColor  py-4 text-sm ">
        <div className="text-2xl font-semibold text-center pb-4">
          About the product
        </div>
        <div className="flex flex-col gap-4">
          <div
            onClick={() => setShowDescription(!showDescription)}
            className={` flex flex-row place-content-between gap-2 text-darkGrayColor border-b border-silver w-full py-2 text-lg items-center `}
          >
            <p>Description</p>
            {showDescription ? (
              <GoChevronUp size={"1.5rem"} className="text-darkGrayColor" />
            ) : (
              <GoChevronDown size={"1.5rem"} className="text-darkGrayColor" />
            )}
          </div>
          {showDescription && (
            <div className="flex flex-col gap-8">
              <p className="whitespace-pre-line">{productData.description}</p>
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
          )}
          <div
            onClick={() => setShowShipping(!showShipping)}
            className={` flex flex-row place-content-between gap-2 text-darkGrayColor border-b border-silver w-full py-2 text-lg items-center `}
          >
            <p>Shipping & Exchange Policy</p>
            {showShipping ? (
              <GoChevronUp size={"1.5rem"} className="text-darkGrayColor" />
            ) : (
              <GoChevronDown size={"1.5rem"} className="text-darkGrayColor" />
            )}
          </div>
          {showShipping && (
            <div className="flex flex-col gap-4 text-grayColor">
              <div className="flex flex-col gap-4">
                <p className="text-pink font-semibold">Shipping Policy</p>
                <p className="leading-none text-sm">
                  All orders are dispatched within 24-48 hours after the order
                  is confirmed.
                </p>
                <p className="leading-none text-sm">
                  The standard delivery time is between 2-7 business days from
                  the date of placing the order.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <p className="text-pink font-semibold">Exchange Policy</p>
                <p className="leading-none text-sm">
                  Product can be replaced if there are any manufacturing defects
                  within 3 days of delivery.
                </p>
              </div>
            </div>
          )}
          <div
            onClick={() => setShowMoreInfo(!showMoreInfo)}
            className={` flex flex-row place-content-between gap-2 text-darkGrayColor border-b border-silver w-full py-2 text-lg items-center `}
          >
            <p>More Information</p>
            {showMoreInfo ? (
              <GoChevronUp size={"1.5rem"} className="text-darkGrayColor" />
            ) : (
              <GoChevronDown size={"1.5rem"} className="text-darkGrayColor" />
            )}
          </div>
          {showMoreInfo && (
            <div className="flex flex-col gap-4 text-grayColor">
              <div>
                <p className="text-pink font-semibold">
                  Manufactured and Sold by
                </p>
                <p className="leading-none text-sm">Ubaazar pvt ltd.</p>
                <p className="leading-none text-sm">
                  Address: B/75 , Azad Nagar , Mathura - 281004
                </p>
              </div>
              <div>
                <p className="text-pink font-semibold">Customer Care</p>
                <p className="leading-none text-sm">
                  Phone or Whatsapp: +91 8218174830
                </p>
              </div>
              <div>
                <p className="text-pink font-semibold">Country of Origin</p>
                <p className="leading-none text-sm">India</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CheckDelivery() {
  const [pinCode, setPinCode] = useState("");
  const [isCodAvailable, setIsCodAvailable] = useState("");
  const [isPinServicable, setIsPinServicable] = useState("");
  const [loading, setLoading] = useState(false);

  async function checkDelivery(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setIsPinServicable("");
      setIsCodAvailable("");

      if (pinCode.length != 6) {
        toast.error("Pincode must be exactly 6 characters");
        return;
      }

      const response = await axios.post(
        "/api/orders/check-delivery",
        JSON.stringify({ pinCode })
      );
      console.log("response is : ", response.data);

      if (response.data?.result?.delivery_codes?.length > 0) {
        setIsPinServicable(true);
        if (
          response.data?.result?.delivery_codes?.[0]?.postal_code?.cash === "Y"
        ) {
          setIsCodAvailable(true);
        } else setIsCodAvailable(false);
      } else {
        setIsPinServicable(false);
        setIsCodAvailable(false);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,6}$/.test(value)) {
      setPinCode(value);
    }
  };

  useEffect(() => {
    setIsCodAvailable("");
    setIsPinServicable("");
  }, [pinCode]);

  return (
    <div className="p-4 flex flex-col gap-4 bg-white">
      <div className="flex flex-col gap-2">
        <p className={`font-sans font-medium text-lg`}>Check Delivery</p>
        <form
          onSubmit={(e) => checkDelivery(e)}
          className="flex flex-row place-content-between border border-silver rounded-xl p-2 font-semibold"
        >
          <input
            value={pinCode}
            onChange={(e) => handleChange(e)}
            className="placeholder:text-brightOrange text-darkGrayColor w-3/4 focus:outline-none "
            placeholder="Enter PIN Code"
            style={{ caretColor: "GrayText" }}
            type="text"
            inputMode="numeric"
            onFocus={(e) => {
              e.target.placeholder = "";
            }}
            onBlur={(e) => (e.target.placeholder = "Enter PIN Code")}
          />
          {pinCode && (
            <button
              onClick={(e) => checkDelivery(e)}
              className="text-brightOrange font-semibold px-2 "
            >
              {loading ? (
                <RotatingLines
                  visible={true}
                  height="20"
                  width="20"
                  strokeColor="#ff6341"
                  strokeWidth="5"
                  animationDuration="0.75"
                  ariaLabel="rotating-lines-loading"
                />
              ) : (
                "CHECK"
              )}
            </button>
          )}
        </form>
        <div>
          {isPinServicable && (
            <div className="flex flex-row gap-2">
              <IoIosCheckmarkCircle size={"1rem"} className="text-green" />
              <p className="text-xs font-semibold text-green">
                This pincode is servicable
              </p>
            </div>
          )}
          {isPinServicable === false && (
            <div className="flex flex-row gap-2">
              <IoIosCloseCircle size={"1rem"} className="text-red" />
              <p className="text-xs font-semibold text-red">
                This pincode is not servicable
              </p>
            </div>
          )}
          {isCodAvailable && (
            <div className="flex flex-row gap-2">
              <IoIosCheckmarkCircle size={"1rem"} className="text-green" />
              <p className="text-xs font-semibold text-green">
                Cash on Delivery is available
              </p>
            </div>
          )}
          {isCodAvailable === false && (
            <div className="flex flex-row gap-2">
              <IoIosCloseCircle size={"1rem"} className="text-red" />
              <p className="text-xs font-semibold text-red">
                Cash on Delivery is not available
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col bg-white gap-1 items-start text-darkGrayColor">
        <div className="flex flex-row gap-2 items-center justify-center">
          <TbCash size={"1.5rem"} />
          <p className="text-sm text-center font-bold">Cash on Delivery </p>
        </div>

        <div className="flex flex-row gap-2 items-center justify-center">
          <MdSwapCalls size={"1.5rem"} />
          <p className="font-bold text-sm text-center">
            36 hrs Exchange available
          </p>
        </div>

        <div className="flex flex-row gap-2 items-center justify-center">
          <TbStars strokeWidth={"1.6"} size={"1.5rem"} />
          <p className="font-bold text-sm text-center">
            Premium Quality product
          </p>
        </div>
      </div>
    </div>
  );
}
