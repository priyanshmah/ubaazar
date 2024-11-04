"use client";

import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { CgRadioCheck, CgRadioChecked } from "react-icons/cg";

export default function PaymentPage() {
  const [paymentMode, setPaymentMode] = useState("online");
  const [totalAmount, setTotalAmount] = useState("");
  const router = useRouter();

  const [items, setItems] = useState([]);
  const [address, setAddress] = useState({});
  
  useEffect(() => {
    
    const selectedItems = localStorage.getItem("selectedItems");
    const savedAddress = localStorage.getItem("address");
    
    const parsedItems = JSON.parse(selectedItems) || [];
    const parsedAddress = JSON.parse(savedAddress) || {};
    
    setItems(parsedItems);
    setAddress(parsedAddress);
    
  }, []);

  useEffect(() => {
    const amount = items?.reduce((acc, value) => acc + value.price, 0);
        console.log(totalAmount);
        
        setTotalAmount(amount);
  }, [items])


  const handlePlaceOrder = async () => {
    try {      
      const products = items?.map((value) => {
        if (value.selectedSize === "Free size") {
          return {
            product: value.id,
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
      
      const response = await axios.post(
        `/api/checkout/order`,
        JSON.stringify(data)
      );

      if (response.data.url) {
        router.push(response.data.url);
      }
      else if (response.data.message) {
        toast.error(response.data.message);
      }
      
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong please try again");
    }
  };

  return (
    <div className="flex flex-col gap-4 text-grayColor text-sm p-4">
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
        onClick={() => setPaymentMode("cod")}
        className={`border ${
          paymentMode === "cod"
            ? "border-brightOrange"
            : "border-lightGrayColor"
        } p-4 rounded-2xl flex flex-row text-left gap-4 shadow-md font-bold`}
      >
        {paymentMode === "cod" ? (
          <CgRadioChecked size={20} className="text-brightOrange" />
        ) : (
          <CgRadioCheck size={20} className="text-lightGrayColor" />
        )}
        Cash On Delivery
      </button>

      <div className="flex flex-row items-end place-content-between w-full p-4 fixed bottom-0 left-0 bg-white">
        <div>
          <p className="text-grayColor">Total</p>
          <p className="font-medium text-2xl">₹{totalAmount}</p>
        </div>
        <div
          onClick={handlePlaceOrder}
          className="bg-darkBlue text-white flex flex-row justify-center items-center rounded-lg font-medium text-lg px-6 h-full py-2"
        >
          Place Order
        </div>
      </div>
      <Toaster />
    </div>
  );
}
