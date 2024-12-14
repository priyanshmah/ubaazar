"use client";
import OrderScreen from "@/components/order/order-screen";
import OrderList from "@/components/order/orders-list";
import OrderTabs from "@/components/order/ordertabs";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";



export default function Orders() {

  const [selectedTab, setSelectedTab] = useState("all");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function GetOrders(){
      try {
        const orderIds = localStorage.getItem('orders');
        if(orderIds){
          const parsedOrderIds = JSON.parse(orderIds);

          const response = await axios.post("/api/orders", JSON.stringify({
            orderIds: parsedOrderIds
          }));

          if(response.data?.success){
            setOrders(response.data?.orders)
          }
        }
        
      } catch (error) {
        return null;
      }
    }
    GetOrders();
  }, [])


  return (
    <div className="overflow-x-hidden mb-20">
      <div className="flex flex-col justify-center items-center">

      <OrderTabs selected={selectedTab} setSelected={setSelectedTab} />
      {orders && <OrderList orders={orders} />}
      </div>
    </div>
  );
}
