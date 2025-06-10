"use client";

import PriceDetails from "@/components/order/price-breakdown";
import CustomNavbar from "@/components/ui/CustomNavbar";
import AuthContext from "@/context/authContext";
import { setPaymentMode } from "@/redux/slice/bagSlice";
import axios from "axios";
import { useRouter } from "nextjs-toploader/app";
import { useState, useEffect, useContext } from "react";
import toast, { Toaster } from "react-hot-toast";
import { CgRadioCheck, CgRadioChecked } from "react-icons/cg";
import { FiCheck, FiX } from "react-icons/fi";
import { RotatingLines } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";

export default function PaymentPage() {
  const paymentMode = useSelector((state) => state.bag?.paymentMode);
  const subTotal = useSelector((state) => state.bag?.priceDetails?.subTotal);
  const products = useSelector((state) => state.bag?.products);
  const addressId = useSelector((state) => state.bag?.selectedAddress);
  const couponCode = useSelector((state) => state.bag?.appliedCoupon);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const updatedProducts = products.map(({ productId, ...rest }) => ({
        id: productId,
        ...rest
      }));

      console.log("products: ", products);
      
      
      const response = await axios.post(
        "http://localhost:3000/api/checkout/order",
        JSON.stringify({
          products: updatedProducts,
          addressId,
          paymentMode,
          couponCode,
        })
      );
      
      console.log("response aa gya: ", response.data)
      if (response?.data?.url) router.push(response?.data?.url);
      else if (!response?.data?.success) toast.error(response?.data?.message);
      else if (response?.data?.orderId)
        router.push(`/bag/pay/payment-details/${response?.data?.orderId}`);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-lightBackground min-h-screen">
      <CustomNavbar customText={"Payment Details"} />
      <div className="flex flex-col min-h-[80vh] my-2 gap-2 text-darkGrayColor text-sm lg:w-full lg:flex-row ">
        <div className="flex flex-col gap-2 px-2 py-4 bg-white">
          <button
            onClick={() => dispatch(setPaymentMode("ONLINE"))}
            className={`border ${
              paymentMode === "ONLINE"
                ? "border-pink font-semibold"
                : "border-lightGrayColor text-grayColor"
            } p-4  flex flex-row text-base rounded-lg  text-left gap-4  `}
          >
            {paymentMode === "ONLINE" ? (
              <CgRadioChecked size={20} className="text-pink" />
            ) : (
              <CgRadioCheck size={20} className="text-lightGrayColor" />
            )}
            Pay Online
          </button>
          <button
            onClick={() => dispatch(setPaymentMode("COD"))}
            className={`border ${
              paymentMode === "COD"
                ? "border-pink font-semibold"
                : "border-lightGrayColor text-grayColor"
            } p-4  flex flex-col text-left gap-4 rounded-lg`}
          >
            <div className="flex flex-row gap-2 text-base">
              {paymentMode === "COD" ? (
                <CgRadioChecked size={20} className="text-pink" />
              ) : (
                <CgRadioCheck size={20} className="text-lightGrayColor" />
              )}
              Cash On Delivery
            </div>
          </button>

          <button
            onClick={() => dispatch(setPaymentMode("PARTIAL_COD"))}
            className={`border ${
              paymentMode === "PARTIAL_COD"
                ? "border-pink font-semibold"
                : "border-lightGrayColor text-grayColor"
            } p-4  flex flex-col text-left rounded-lg gap-4 `}
          >
            <div className="flex flex-row gap-2 text-base">
              {paymentMode === "PARTIAL_COD" ? (
                <CgRadioChecked size={20} className="text-pink" />
              ) : (
                <CgRadioCheck size={20} className="text-lightGrayColor" />
              )}
              Partial Cash on Delivery
            </div>
          </button>
        </div>
        <PriceDetails />

        <div className="flex flex-col items-end place-content-between w-full p-4 fixed bottom-0 left-0 bg-white">
          <div className="flex flex-row items-center place-content-between w-full">
            <p className="text-grayColor text-xl">Total</p>
            <p className="font-medium text-darkGrayColor text-2xl">
              ₹{subTotal + (paymentMode === "COD" ? 79 : 0)}
            </p>
          </div>
          <div
            onClick={handlePlaceOrder}
            className="bg-black text-white flex flex-row justify-center items-center font-semibold text-lg w-full h-12 py-2"
          >
            {loading ? (
              <RotatingLines
                visible={true}
                height="30"
                width="30"
                strokeColor="white"
                strokeWidth="5"
                animationDuration="0.75"
                ariaLabel="rotating-lines-loading"
              />
            ) : (
              'PLACE ORDER'
            )}
          </div>
        </div>
        <Toaster />
      </div>
    </div>
  );
}
