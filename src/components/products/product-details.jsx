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


export default function ProductDetails({
  productData,
  selectedSize,
  setSelectedSize,
}) {
  const router = useRouter();
  const [bag, setBag] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const { setBagItems } = useContext(AuthContext);

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

    setBagItems((prev) => prev + 1);
    toast.success("Added to bag");
  };

  const handleShopNow = () => {
    handleAddToBag();
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
    <div className="flex flex-col w-full gap-4 bg-white lg:w-1/2">
      <div className="p-4  flex flex-col gap-4 bg-white">
        <p className={`font-sans font-medium text-darkGrayColor text-lg`}>{productData.productName}</p>
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
          <div className="flex flex-row gap-2 items-center text-darkGrayColor">
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

        <div className="flex w-full bg-white md:flex-row text-base place-content-evenly flex-row-reverse gap-2">
          <button
            onClick={handleShopNow}
            className="flex flex-row  items-center justify-center font-bold gap-2 bg-darkBlue text-white w-1/2 py-2 rounded-xl"
          >
            <TbShoppingBag strokeWidth={1.5} size={"1.5rem"} />
            <p>Shop now</p>
          </button>
          <button
            onClick={handleAddToBag}
            className="flex flex-row font-bold justify-center items-center text-darkBlue gap-1 w-2/5 py-2 rounded-xl border border-darkBlue"
          >
            <TbShoppingBagPlus
              className="text-darkBlue"
              strokeWidth={1.5}
              size={"1.5rem"}
            />
            <p>Add to bag</p>
          </button>
        </div>
      </div>

      <CheckDelivery />

      <div className=" bg-white text-darkGrayColor  py-4 text-sm ">
        <div
          className={` flex flex-row font-semibold gap-2  w-full p-2 px-4 rounded-xl text-sm items-center `}
        >
          <CgNotes size={"1.5rem"} />
          <p> Product details</p>
        </div>

        <div className="flex flex-col gap-4 p-4">
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
