"use client";

import PriceDetails from "@/components/order/price-breakdown";
import AuthContext from "@/context/authContext";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import toast, { Toaster } from "react-hot-toast";
import { CgRadioCheck, CgRadioChecked } from "react-icons/cg";
import { FiCheck, FiX } from "react-icons/fi";

export default function PaymentPage() {
  const [paymentMode, setPaymentMode] = useState("online");
  const [totalAmount, setTotalAmount] = useState("");
  const [isCodAvailable, setIsCodAvailable] = useState(false);
  const router = useRouter();

  const [items, setItems] = useState([]);
  const [address, setAddress] = useState({});

  useEffect(() => {
    const selectedItems = localStorage.getItem("selectedItems");
    const savedAddress = localStorage.getItem("address");   

    let parsedItems;
    let parsedAddress;

    if (selectedItems) parsedItems = JSON.parse(selectedItems);
    if (savedAddress) parsedAddress = JSON.parse(savedAddress);

    setItems(parsedItems || []);
    setAddress(parsedAddress || {});
  }, []);

  useEffect(() => {
    const amount = items?.reduce((acc, value) => acc + value.price, 0);
    console.log(totalAmount);

    setTotalAmount(amount);
  }, [items]);

  const handlePlaceOrder = async () => {
    try {
      const products = items?.map((value) => {
        if (value.selectedSize === "Free size") {
          return {
            product: value._id,
            quantity: 1,
          };
        } else {
          return {
            product: value.id,
            quantity: 1,
            size: value.selectedSize,
          };
        }
      });
      const data = {
        products,
        address,
        paymentMode: "online",
      };

      console.log("data is: ", data);
      

      const response = await axios.post(
        `/api/checkout/order`,
        JSON.stringify(data)
      );

      if (response?.data?.url) router.push(response?.data?.url);

      else if (!(response?.data?.success)) toast.error(response?.data?.message);
      
      else if(response?.data?.orderId)
        router.push(`/bag/pay/payment-details/${response?.data?.orderId}`)
      

    } catch (error) {
      console.log(error);
      toast.error("Something went wrong please try again");
    }
  };

  return (
    <div className="flex flex-col justify-center gap-8 text-grayColor text-sm p-4 lg:w-full lg:flex-row ">
      <div className="flex flex-col gap-4">
        <button
          onClick={() => setPaymentMode("online")}
          className={`border ${
            paymentMode === "online"
              ? "border-brightOrange"
              : "border-lightGrayColor"
          } p-4 rounded-2xl flex flex-row  text-left gap-4 shadow-md font-bold `}
        >
          {paymentMode === "online" ? (
            <CgRadioChecked size={20} className="text-brightOrange" />
          ) : (
            <CgRadioCheck size={20} className="text-lightGrayColor" />
          )}
          Pay Online
        </button>
        <button
          onClick={() => {
            if (isCodAvailable) setPaymentMode("cod");
          }}
          className={`border ${
            paymentMode === "cod"
              ? "border-brightOrange"
              : "border-lightGrayColor"
          } p-4 rounded-2xl flex flex-col text-left gap-4 text-grayColor shadow-md font-bold`}
        >
          <div className="flex flex-row gap-2">
            {paymentMode === "cod" ? (
              <CgRadioChecked size={20} className="text-brightOrange" />
            ) : (
              <CgRadioCheck size={20} className="text-lightGrayColor" />
            )}
            Cash On Delivery
          </div>
          {!isCodAvailable && <CodCriteria />}
        </button>
      </div>
      <PriceDetails total={totalAmount} isCod={isCodAvailable}/>

      <div className="flex flex-row items-end place-content-between w-full p-4 fixed bottom-0 left-0 bg-white">
        <div>
          <p className="text-grayColor">Total</p>
          <p className="font-medium text-darkGrayColor text-2xl">
            ₹{totalAmount}
          </p>
        </div>
        <div
          onClick={handlePlaceOrder}
          className="bg-darkBlue text-white flex flex-row justify-center items-center rounded-lg font-medium text-lg w-3/5 h-full py-2"
        >
          Place Order
        </div>
      </div>
      <Toaster />
    </div>
  );
}

function CodCriteria() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <div className="flex flex-col gap-2 text-darkGrayColor font-medium px-4">
      <div className="flex flex-row gap-2">
        <div className="text-red font-sans font-semibold">NOT ELIGIBLE </div>
      </div>
      <div className="flex flex-row items-center gap-2">
        {isLoggedIn ? (
          <FiCheck
            className="bg-green text-white rounded-full p-1"
            size={"1.5rem"}
          />
        ) : (
          <FiX className="bg-red text-white rounded-full p-1" size={"1.5rem"} />
        )}
        Signup or Login to your account
      </div>
      <div className="flex flex-row items-center gap-2">
        <FiX className="bg-red text-white rounded-full p-1" size={"1.5rem"} />
        You have atleast 3 prepaid orders
      </div>
    </div>
  );
}
