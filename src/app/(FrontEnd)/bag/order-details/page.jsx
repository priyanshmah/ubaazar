"use client";
import { useSearchParams } from "next/navigation";
import { FiCheck, FiX } from "react-icons/fi";
import React, { Suspense, useEffect, useState } from "react";
import Jwt from "jsonwebtoken";
import Loading from "@/components/ui/loading";

function Details() {
  const searchParams = useSearchParams();
  const [amount, setAmount] = useState(0);
  const [success, setSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  
  useEffect(() => {
    try {
      const token = searchParams.get("token");
      const decoded = Jwt.verify(token, process.env.PAYMENT_STATUS_TOKEN_SECRET);

      setAmount(decoded.amount);
      setSuccess(decoded.success);
      setTransactionId(decoded.transactionId);

    } catch (error) {
      setSuccess(false);
    }
  }, [searchParams])

  const now = new Date();
  const date = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex flex-col gap-4 justify-center items-center rounded-xl shadow-md p-4">
        <div
          className={`${
            success ? "bg-lightGreen" : "bg-rose-50"
          } p-4 rounded-full`}
        >
          {success ? (
            <FiCheck
              className="bg-green text-white rounded-full p-2"
              size={"3rem"}
            />
          ) : (
            <FiX className="bg-red text-white rounded-full p-2" size={"3rem"} />
          )}
        </div>
        {success ? (
          <h1 className="text-lg text-green font-semibold">Order confirmed!</h1>
        ) : (
          <div className="flex flex-col justify-center items-center text-center gap-2">
            <h1 className="text-lg text-red font-semibold">Order cancelled</h1>
            <div className="text-grayColor text-xs">
              if any amount is debited from your account it will be credited
              within 24 hours to 48 hours{" "}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6 p-6 rounded-xl shadow-md">
        <div className="text-lg font-semibold">Payment Details</div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center place-content-between">
            <div className="text-sm text-grayColor">Ref Number</div>
            <div className="text-sm text-darkGrayColor">{transactionId}</div>
          </div>
          <div className="flex flex-row items-center place-content-between">
            <div className="text-sm text-grayColor">Payment Status</div>

            {success ? (
              <div className="text-green font-semibold">success</div>
            ) : (
              <div className="text-red font-semibold">failed</div>
            )}
          </div>
          <div className="flex flex-row items-center place-content-between">
            <div className="text-sm text-grayColor">Payment Time</div>
            <div className="text-sm text-darkGrayColor">
              {date}, {time}
            </div>
          </div>
        </div>
        <div className="flex flex-row  place-content-between border-t-2 border-dotted border-silver pt-4">
          <div className="text-sm text-grayColor">Total Payment</div>
          <div className="text-sm font-semibold text-darkGrayColor">
            ₹{amount}
          </div>
        </div>
      </div>

      {/* <div className="flex flex-col gap-6 div-6 rounded-xl shadow-md">
      <div className="text-lg font-semibold flex flex-row place-content-between items-center">
        Order Details
        <div className="font-normal text-sm font-sans text-grayColor"># {orderNumber}</div>
        </div>
        </div> */}
    </div>
  );
}

export default function OrderDetails(){
  return (
    <Suspense>
      <Details />
    </Suspense>
  )
}

