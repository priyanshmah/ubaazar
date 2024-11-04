import React from "react";
import axios from "axios";
import OrderDetails from "@/components/order/order-details";

export default async function Details({ params }) {
  const transactionId = params.transactionId;

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/checkout/pay/validate`,
    JSON.stringify({ transactionId })
  );

  return <OrderDetails response={response.data}/>;
}

