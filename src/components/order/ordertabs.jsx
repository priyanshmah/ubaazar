"use client";
import React, { useState } from "react";

function OrderTabs({selected, setSelected}) {
  return (
    <div className="overflow-x-auto w-full scrollbar-hide">
      <div className="inline-flex gap-3 text-sm whitespace-nowrap">
        <button
          onClick={() => setSelected("all")}
          className={`${ordersTabStyle} ${selected === "all" && activeTab}`}
        >
        All Orders
        </button>
        <button
          onClick={() => setSelected("ready-to-ship")}
          className={`${ordersTabStyle} ${selected === "ready-to-ship" && activeTab}`}
        >
        Ready to Ship
        </button>
        <button
          onClick={() => setSelected("delivered")}
          className={`${ordersTabStyle} ${
            selected === "delivered" && activeTab
          }`}
        >
          Delivered
        </button>
        <button
          onClick={() => setSelected("shipped")}
          className={`${ordersTabStyle} ${selected === "shipped" && activeTab}`}
        >
          Shipped
        </button>
        <button
          onClick={() => setSelected("transit")}
          className={`${ordersTabStyle} ${selected === "transit" && activeTab}`}
        >
          In-transit
        </button>
        <button
          onClick={() => setSelected("cancel")}
          className={`${ordersTabStyle} ${selected === "cancel" && activeTab}`}
        >
          Cancelled
        </button>
      </div>
    </div>
  );
}

const ordersTabStyle = "p-2 cursor:hover";
const activeTab =
  "text-brightOrange border-b-2 border-brightOrange font-semibold";

export default OrderTabs;
