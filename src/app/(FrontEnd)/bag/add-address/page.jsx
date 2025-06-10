"use client";
import { useEffect, useState } from "react";
import styles from "@/styles/Bag.module.css";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { addressSchema } from "@/schemas/addressSchema";
import * as Yup from "yup";
import { FiAlertCircle } from "react-icons/fi";
import { Roboto } from "next/font/google";
import toast, { Toaster } from "react-hot-toast";
import FloatingInput from "@/components/ui/FloatingInput";
import { HiOutlineHome, HiOutlineShoppingBag } from "react-icons/hi";
import { PiHouse, PiHouseBold } from "react-icons/pi";
import { IoBagOutline } from "react-icons/io5";
import { LucideBriefcaseBusiness, LucideHouse } from "lucide-react";
import { LuMapPin } from "react-icons/lu";
import axios from "axios";

const roboto = Roboto({
  subsets: ["cyrillic"],
  weight: ["300", "400", "500", "700"],
});

export default function AddressForm() {
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [pincode, setPincode] = useState("");
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("");
  const [addressType, setAddressType] = useState("home");

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const handleAddAddress = async () => {
    if (!isValid) return;
    
    try {
      setIsLoading(true);
      const response = await axios.post("/api/auth/user/add-address", {
        name,
        mobileNumber,
        pincode,
        address,
        area,
        addressType,
      });

      if (response.data.success) {
        let savedAddresses =
        JSON.parse(localStorage.getItem("addresses")) || [];
        savedAddresses.push(response.data.address);
        localStorage.setItem("addresses", JSON.stringify(savedAddresses));
        
        toast.success(response.data.message);
        router.push("/bag/pay");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (name && mobileNumber && pincode && address && area && addressType) {
      setIsValid(true);
    }
  }, [name, mobileNumber, pincode, address, area, addressType]);

  return (
    <div className="flex flex-col max-h-[80vh] overflow-y-auto font-normal bg-lightBackground p-2 gap-4">
      <p className="text-xl mt-2 px-2 font-semibold">Enter Complete Address</p>
      <div className="flex flex-col gap-4 bg-white rounded-2xl p-4">
        <FloatingInput
          id={"name"}
          label={"Receiver's name"}
          type={"text"}
          value={name}
          onChange={(e) => {
            e.preventDefault();
            setName(e.target.value);
          }}
        />
        <div className="flex flex-row gap-2 items-center justify-center">
          <p className="text-darkGrayColor text-xl">+91</p>
          <FloatingInput
            id={"mobileNumber"}
            label={"Mobile Number"}
            type={"tel"}
            maxLength={10}
            required
            pattern="[0-9]{10}"
            value={mobileNumber}
            onChange={(e) => {
              e.preventDefault();
              setMobileNumber(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="flex flex-col bg-white rounded-2xl gap-4 p-4">
        <div>
          <p className="after:content-['*'] after:ml-0.5 text-base text-silver">
            Save address as
          </p>
          <div className="flex flex-row gap-2">
            <div
              className={`flex flex-row gap-1 items-center ${
                addressType === "home"
                  ? "text-pink border-pink bg-lightPink"
                  : "text-silver border-silver"
              } justify-center w-fit border rounded-xl px-4 py-1`}
              onClick={() => setAddressType("home")}
            >
              <LucideHouse size={20} strokeWidth={1.5} />
              <p className="text-sm">Home</p>
            </div>
            <div
              className={`flex flex-row gap-1 items-center ${
                addressType === "work"
                  ? "text-pink border-pink bg-lightPink"
                  : "text-silver border-silver"
              } justify-center w-fit border rounded-xl px-4 py-1`}
              onClick={() => setAddressType("work")}
            >
              <LucideBriefcaseBusiness size={20} strokeWidth={1.5} />
              <p className="text-sm">Office</p>
            </div>
            <div
              className={`flex flex-row gap-1 items-center ${
                addressType === "other"
                  ? "text-pink border-pink bg-lightPink"
                  : "text-silver border-silver"
              } justify-center w-fit border rounded-xl px-4 py-1`}
              onClick={() => setAddressType("other")}
            >
              <LuMapPin size={20} strokeWidth={1.5} />
              <p className="text-sm ">Other</p>
            </div>
          </div>
        </div>
        <FloatingInput
          id={"pincode"}
          label={"PinCode"}
          type={"tel"}
          maxLength={6}
          pattern="[0-9]{6}"
          required
          value={pincode}
          onChange={(e) => {
            e.preventDefault();
            setPincode(e.target.value);
          }}
        />

        <FloatingInput
          id={"address"}
          label={"Address"}
          type={"text"}
          value={address}
          maxLength={40}
          minLength={3}
          onChange={(e) => {
            e.preventDefault();
            setAddress(e.target.value);
          }}
        />

        <FloatingInput
          id={"area"}
          label={"Area / Colony"}
          type={"text"}
          value={area}
          maxLength={40}
          minLength={3}
          onChange={(e) => {
            e.preventDefault();
            setArea(e.target.value);
          }}
        />
      </div>
      <button
        className={`text-white text-lg font-semibold rounded-sm flex flex-row justify-center items-center w-full py-2 ${
          isValid ? "bg-pink" : "bg-lightGrayColor"
        }`}
        onClick={handleAddAddress}
      >
        {isLoading ? "Adding..." : "Confirm address"}
      </button>
    </div>
  );
}
