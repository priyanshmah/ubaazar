"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function PaymentPage() {
  const [htmlContent, setHtmlContent] = useState("");
  console.log(htmlContent);
  

  useEffect(() => {
    const fetchHTML = async () => {
      const response = await axios.get(`/api/checkout/pay`);
      console.log(response.data);
      setHtmlContent(response.data.data);
    };
    fetchHTML();
  }, []);

  return (
    <div>

        <div dangerouslySetInnerHTML={{ __html: htmlContent}}/>
    </div>
  )
   
}
