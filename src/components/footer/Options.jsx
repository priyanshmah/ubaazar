import React, { useState } from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { FaWhatsapp, FaYoutube } from "react-icons/fa6";
import { FiMinus, FiPlus } from "react-icons/fi";

function Options() {
  const [showShop, setShowShop] = useState(false);
  const [showCustomerCare, setShowCustomerCare] = useState(false);
  const [showKnowUs, setShowKnowUs] = useState(false);

  return (
    <div className="min-h-96 pb-20 p-4 w-full bg-black flex flex-col gap-4">
      <div className="flex flex-row gap-4 justify-start items-center">
        <FaFacebook size={20} className="text-silver" />
        <FaInstagram size={20} className="text-silver" />
        <FaYoutube size={20} className="text-silver" />
        <FaWhatsapp size={20} className="text-silver" />
      </div>

      <div className="flex flex-col">
        <div
          onClick={() => setShowShop(!showShop)}
          className={` flex flex-row place-content-between gap-2 text-white w-full py-2 text-sm items-center `}
        >
          <p>SHOP</p>
          {showShop ? (
            <FiMinus size={"1.5rem"} className="text-white" />
          ) : (
            <FiPlus size={"1.5rem"} className="text-white" />
          )}
        </div>
        {showShop && (
          <div className="flex flex-col gap-2 text-grayColor">
            <div>Ethnic Wear</div>
            <div>Wedding Wear</div>
            <div>Daily Wear</div>
            <div>Party Wear</div>
          </div>
        )}
        <div
          onClick={() => setShowCustomerCare(!showCustomerCare)}
          className={` flex flex-row place-content-between gap-2 text-white w-full py-2 text-sm items-center `}
        >
          <p>CUSTOMER CARE</p>
          {showCustomerCare ? (
            <FiMinus size={"1.5rem"} className="text-white" />
          ) : (
            <FiPlus size={"1.5rem"} className="text-white" />
          )}
        </div>
        {showCustomerCare && (
          <div className="flex flex-col gap-2 text-grayColor">
            <div>Track My Order</div>
            <div>Shipping and Exhange</div>
            <div>Terms of use </div>
            <div>Contact us</div>
          </div>
        )}
        <div
          onClick={() => setShowKnowUs(!showKnowUs)}
          className={` flex flex-row place-content-between gap-2 text-white w-full py-2 text-sm items-center `}
        >
          <p>KNOW US</p>
          {showKnowUs ? (
            <FiMinus size={"1.5rem"} className="text-white" />
          ) : (
            <FiPlus size={"1.5rem"} className="text-white" />
          )}
        </div>
        {showKnowUs && (
          <div className="flex flex-col gap-2 text-grayColor">
            <div>About us</div>
          </div>
        )}
      </div>

      <div className="text-white flex flex-col gap-8">
        <div>
          <p className="py-2 text-sm">NEWSLETTER</p>
          <div className="leading-none text-sm text-grayColor">
            Subscribe to get notified about product launches, special offers and
            company news.
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <input
            type="email"
            placeholder="Enter your email"
            className="bg-black border p-2 focus:ring-0 focus:outline-none border-grayColor text-white"
          />
          <button className="bg-white text-black px-4 py-2">Subscribe</button>
        </div>
      </div>
    </div>
  );
}

export default Options;
