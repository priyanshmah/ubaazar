"use client";
import React, { useEffect, useState } from "react";
import Search from "../ui/search";
import OrderTabs from "./ordertabs";
import OrderList from "./orders-list";
import { usePathname } from "next/navigation";

function OrderScreen({orders}) {
  const [date, setDate] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");


  return (
    <div className="overflow-x-hidden">
      <Search date={date} setDate={setDate}/>
      <OrderTabs selected={selectedTab} setSelected={setSelectedTab}/>
      <OrderList date={date} orders={orders}/>
    </div>
  );
}

export default OrderScreen;
