import React from "react";
import axios from "axios";
import OrderDetails from "@/components/order/order-details";

export default async function Details({ params }) {
  const orderId = params.orderId;

  try {
    const response = await axios.post(
      `http://192.168.29.100:3000/api/checkout/pay/validate`,
      JSON.stringify({ orderId })
    );
    return <OrderDetails response={response.data}/>;
    
    
    
  } catch (error) {
    return <OrderDetails response={{ success: false }}/>;
    
  }

}

