"use client";
import OrderScreen from "@/components/order/order-screen";
import OrderList from "@/components/order/orders-list";
import OrderTabs from "@/components/order/ordertabs";
import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import useSWR from "swr";

const fetcher = (url) =>
  axios
    .get(url, {
      headers: {
        Authorization: Cookies.get("token"),
      },
    })
    .then((res) => res.data);

export default function Orders() {

  const [selectedTab, setSelectedTab] = useState("all");
  const { data, error, isLoading } = useSWR(
    "/api/auth/user/get-orders",
    fetcher
  );

  console.log("User data is: ", data?.user);

  return (
    <div className="overflow-x-hidden mb-20">
      <div className="flex flex-col justify-center items-center">

      <OrderTabs selected={selectedTab} setSelected={setSelectedTab} />
      <OrderList orders={data?.user?.previousOrders} />
      </div>
    </div>
  );
}
