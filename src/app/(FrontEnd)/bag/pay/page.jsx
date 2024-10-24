"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function PaymentPage() {
  

  useEffect(() => {
    const fetchHTML = async () => {
      const response = await axios.get(`/api/checkout/pay`);
      
    };
    fetchHTML();
  }, []);

  return (
    <div>

    </div>
  )
   
}
