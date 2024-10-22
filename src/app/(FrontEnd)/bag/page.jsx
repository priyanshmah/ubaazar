"use client";
import shoppingBags from "@/public/icons/shopping-bags.svg";
import Image from "next/image";

import img from "@/public/images/1.jpg";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { CgRadioCheck, CgRadioChecked } from "react-icons/cg";
import { FiTrash2 } from "react-icons/fi";
import axios from "axios";

export default function Bag() {
  const [bag, setBag] = useState([]);

  useEffect(() => {
    const storedBag = JSON.parse(localStorage.getItem("bag")) || [];
    setBag(storedBag);
  }, []);

  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (bag && bag.length > 0) {

      const totalValue = bag.reduce((acc, value) => acc + value.price, 0);
      setTotal(totalValue);

    }
  }, [bag]);

  const qtyIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const qtyDecrement = () => {
    setQuantity((prev) => {
      if (prev === 1) {
        return 1;
      } else {
        return prev - 1;
      }
    });
  };

  const handleDelete = (indexToRemove) => {
    setBag(bag.filter((value) => value.index !== indexToRemove))
  }

  const handleCheckout = async() => {
    try {
      const response = await axios.get('http://192.168.29.100:3000/api/checkout/pay');

      console.log(response.data);
      
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <div className="py-4">
        <h1 className="text-darkGrayColor text-2xl text-center">My Bag</h1>

        <div className="flex flex-col">
          {bag.length === 0 ? (
            <div
              className="flex flex-col justify-center items-center gap-8"
              style={{ minHeight: "70vh" }}
            >
              <div className="h-40 w-40 relative">
                <Image src={shoppingBags} fill className="object-contain" />
              </div>
              <p className="text-xl text-center font-semibold text-darkGrayColor">
                Your Bag is too light !!! Add something yaar...❤️🌟
              </p>
            </div>
          ) : (
            <div
              className="flex flex-col gap-4 p-4 place-content-between"
              style={{ minHeight: "70vh", marginBottom: "5vh" }}
            >
              {bag.map((value, index) => {
                return (
                  <div
                    key={index}
                    className="w-full flex flex-row items-center place-content-between border border-lightGrayColor p-4 rounded-xl shadow-md relative"
                  >
                  <FiTrash2 
                  onClick={() => handleDelete(index)}
                  size={"1rem"} 
                  className="absolute top-2 right-2 text-grayColor"
                  />
                    <div className="relative w-20 h-20">
                      <Image
                        src={value.image}
                        fill
                        className="rounded-xl object-cover"
                      />
                    </div>
                    <div className="w-2/3 flex flex-col gap-2 text-grayColor">
                      <p className="text-sm font-semibold">{value.name}</p>
                      <p className="text-black text-lg">₹{value.price}</p>
                      <div className="flex flex-row items-center place-content-between text-sm font-semibold gap-2 text-darkGrayColor">
                        <div className="">Size: Free Size</div>
                        <div className="flex flex-row items-center gap-2 text-brightOrange">
                          <CiCircleMinus
                            size={"1.5rem"}
                            strokeWidth={1}
                            onClick={qtyDecrement}
                          />
                          <p className="text-darkGrayColor">{quantity}</p>
                          <CiCirclePlus
                            size={"1.5rem"}
                            strokeWidth={1}
                            onClick={qtyIncrement}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="flex flex-row items-center place-content-between w-full bg-white py-2">
                <div>
                  <p className="text-grayColor">Total</p>
                  <p className="font-semibold text-xl">₹{total}</p>
                </div>

                <Drawer>
                  <DrawerTrigger className="min-h-2 h-full">
                    <div className="bg-darkBlue text-white flex flex-row justify-center items-center rounded-lg font-semibold text-lg px-6 h-full py-2">
                      Checkout
                    </div>
                  </DrawerTrigger>
                  <DrawerContent className="flex flex-col">
                    <div className="p-4 ">
                      <button
                        onClick={() => router.push("/bag/add-address")}
                        className="m-2 p-2 font-semibold text-brightOrange rounded-xl border border-dashed border-brightOrange text-center"
                      >
                        + Add New Address
                      </button>
                      <SavedAddresses />
                    </div>
                    <DrawerFooter>
                      <DrawerClose>
                        <button 
                        onClick={handleCheckout}
                        className="bg-darkBlue text-white flex flex-row justify-center items-center rounded-lg font-semibold text-lg px-8 py-2">
                          Continue
                        </button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function SavedAddresses() {
  let savedAddresses = JSON.parse(localStorage.getItem("addresses")) || [];
  const [selectedAddress, setSelectedAddress] = useState(savedAddresses[0]);

  return (
    <div className="flex flex-col gap-4 text-grayColor text-sm">
      {savedAddresses?.map((value, index) => {
        const status =
          JSON.stringify(selectedAddress) ===
          JSON.stringify(savedAddresses[index]);
        return (
          <button
            onClick={() => setSelectedAddress(value)}
            className={`border ${
              status ? "border-brightOrange" : "border-lightGrayColor"
            } p-4 rounded-2xl flex flex-row text-left gap-4 shadow-md `}
            key={index}
          >
            {status ? (
              <CgRadioChecked size={20} className="text-brightOrange" />
            ) : (
              <CgRadioCheck size={20} className="text-white" />
            )}
            <div className="text-xs">
              <p className="text-darkGrayColor font-semibold text-sm">
                {value.name}
              </p>
              <p>
                {value.address} , {value.area}
              </p>
              <p>
                {value.city} , {value.state} - {value.pinCode}
              </p>
              <p>{value.mobileNumber}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
