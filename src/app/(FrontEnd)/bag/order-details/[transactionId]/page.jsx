import React from "react";
import axios from "axios";
import OrderDetails from "@/components/order/order-details";

export default async function Details({ params }) {
  const transactionId = params.transactionId;

  const response = await axios.post(
    `https://www.ubaazar.com/api/checkout/pay/validate`,
    JSON.stringify({ transactionId })
  );

  return <OrderDetails response={response.data}/>;
}

