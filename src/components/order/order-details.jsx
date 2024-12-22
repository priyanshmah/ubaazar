"use client";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { CiDeliveryTruck } from "react-icons/ci";
import { FiCheck, FiX } from "react-icons/fi";
import { useRouter } from "nextjs-toploader/app";
import AuthContext from "@/context/authContext";

function OrderDetails({ response }) {
  const router = useRouter();
  const { setBagItems } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let productIds = response?.order?.products?.map((value) => {
      return value?.product?._id;
    });
    const storedOrders = localStorage.getItem("orders");
    let parsedOrders = [];

    if (storedOrders) parsedOrders = JSON.parse(storedOrders) || [];
    if (response.order) {
      const alreadyAdded = parsedOrders.includes(response.order?._id);

      if (alreadyAdded) setOrders(parsedOrders);
      else setOrders([...parsedOrders, response.order?._id]);
    }

    //remove products from cart which user ordered already
    if (productIds) {
      let bagItems = localStorage.getItem("bag");
      let parsedBag = JSON.parse(bagItems) || [];

      let updatedBag = parsedBag?.filter((value) => {
        return !productIds?.includes(value?._id);
      });

      localStorage.setItem("bag", JSON.stringify(updatedBag));
      setBagItems(updatedBag?.length);
    }
  }, []);

  useEffect(() => {
    if (orders.length > 0)
      localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  return (
    <div className="flex flex-col justify-center items-center mb-20">
      <div className="flex flex-col gap-4 justify-center items-center p-4">
        <div
          className={`${
            response.success ? "bg-lightGreen" : "bg-rose-50"
          } p-4 rounded-full`}
        >
          {response.success ? (
            <FiCheck
              className="bg-green text-white rounded-full p-2"
              size={"3rem"}
            />
          ) : (
            <FiX className="bg-red text-white rounded-full p-2" size={"3rem"} />
          )}
        </div>
        {response.success ? (
          <div className="text-lg text-green font-semibold">
            Order confirmed!
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center text-center gap-2">
            <h1 className="text-lg text-red font-semibold">Order cancelled</h1>
            <div className="text-grayColor text-xs">
              if any amount is debited from your account it will be credited
              within 24 hours to 48 hours
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6 p-6">
        <div>
          <div className="text-base font-semibold font-mona">Order Details</div>
          <div className="text-xs text-grayColor font-mona">
            # {response?.order?.orderNumber}
          </div>
        </div>

        <div className="text-sm font-semibold text-green flex flex-row gap-2 items-center justify-start">
          <CiDeliveryTruck size={"1.5rem"} strokeWidth={0.5} />
          <p>Estimated delivery : {formatDate(response?.order?.createdAt)}</p>
        </div>

        <div className="flex flex-col gap-2">
          {response?.order?.products?.map((value, index) => {
            return (
              <div
                className="flex flex-row place-content-between items-center"
                key={index}
              >
                <div className="flex flex-row gap-2 w-3/4">
                  <Image
                    src={value?.product?.images?.[0]}
                    className="h-24 w-24 rounded-md object-cover"
                    height={400}
                    width={300}
                    alt={value?.product?.productName}
                  />
                  <div>
                    <p className="text-darkGrayColor text-base font-semibold">
                      {value?.product?.productName}
                    </p>
                    <p className="text-grayColor text-sm">
                      {value?.size || "Free size"}
                    </p>
                  </div>
                </div>
                <div className="text-center text-darkGrayColor font-semibold w-1/4">
                  ₹{value?.product?.price}
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-2 border-t border-dashed border-grayColor">
          <div className="flex flex-row place-content-between text-grayColor">
            <p className="text-base text-darkGrayColor font-semibold">Total</p>
            <p>₹{response?.amount}</p>
          </div>
          <div className="flex flex-row place-content-between">
            <p className="text-base text-darkGrayColor font-semibold">
              Payment status
            </p>
            {response?.order?.paymentStatus ? (
              <p className="text-green font-semibold font-sans">PAID</p>
            ) : (
              <p className="text-yellowColor font-semibold font-sans">
                NOT PAID
              </p>
            )}
          </div>
          <div className="flex flex-row place-content-between text-grayColor">
            <p className="text-base text-darkGrayColor font-semibold">
              Payment method
            </p>
            <p>
              {response?.order?.paymentMode === "cod"
                ? "Cash on Delivery"
                : "Online Payment"}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-base font-semibold font-mona">Delivery Address</p>
          <div
            className={`border p-4 rounded-2xl flex flex-row text-left gap-4 shadow-md w-full place-content-between`}
          >
            {response.order.address.formatted_address ? (
              <div className="text-xs">
                <p className="text-darkGrayColor font-semibold text-sm">
                  {response?.order?.address?.name}
                </p>
                <p>{response?.order?.address?.formatted_address}</p>
                <p>{response?.order?.address?.mobileNumber}</p>
              </div>
            ) : (
              <div className="text-xs">
                <p className="text-darkBlue font-semibold text-sm">
                  {response?.order?.address?.name}
                </p>
                <p>
                  {response?.order?.address?.address} ,{" "}
                  {response?.order?.address?.area}
                </p>
                <p>
                  {response?.order?.address?.city} ,{" "}
                  {response?.order?.address?.state} -{" "}
                  {response?.order?.address?.pincode}
                </p>
                <p>{response?.order?.address?.mobileNumber}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={() => router.replace("/")}
        className="bg-darkBlue text-white py-1 w-1/3 rounded-md font-semibold text-lg"
      >
        Shop now
      </button>
    </div>
  );
}

function formatDate(dateString) {
  const date = new Date(dateString);
  date.setDate(date.getDate() + 6);

  const options = { weekday: "long", day: "numeric", month: "short" };
  return new Intl.DateTimeFormat("en-US", options).format(date);
}
export default OrderDetails;
