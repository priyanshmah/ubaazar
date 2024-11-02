"use client";
import shoppingBags from "@/public/icons/shopping-bags.svg";
import Image from "next/image";

import img from "@/public/images/1.jpg";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import { IoIosClose } from "react-icons/io";
import toast, { Toaster } from "react-hot-toast";

export default function Bag() {

  const [total, setTotal] = useState(0);
  const [bag, setBag] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');
  const router = useRouter();

  console.log("bag: ", bag);

  console.log("selected items: ", selectedItems);

  useEffect(() => {
    const storedBag = localStorage.getItem("bag");
    if (storedBag) {
      setBag(JSON.parse(storedBag));
      setSelectedItems(JSON.parse(storedBag));
      if (selectedItems) {
        const totalValue = selectedItems?.reduce(
          (acc, value) => acc + value.price,
          0
        );
        setTotal(totalValue);
      }
    }
  }, []);

  console.log("total: ", total);
  useEffect(() => {
    if (selectedItems) {
      const totalValue = selectedItems?.reduce(
        (acc, value) => acc + value.price,
        0
      );
      setTotal(totalValue);

      if (selectedItems.length >= 1) {
        setDrawerOpen(true)
      } else {
        setDrawerOpen(false)
      }
    }

  }, [selectedItems]);

  const handleDelete = (idToBeRemoved) => {
    let updatedBag = bag.filter((value) => value.id !== idToBeRemoved);

    if (updatedBag) {
      localStorage.setItem("bag", JSON.stringify(updatedBag));
      setBag(updatedBag);
    }

    setSelectedItems(
      selectedItems.filter((value) => value.id !== idToBeRemoved)
    );
  };
  const removeItem = (idToBeRemoved) => {
    let updatedItems = selectedItems.filter(
      (value) => value.id !== idToBeRemoved
    );
    if (updatedItems) setSelectedItems(updatedItems);
  };
  const addItem = (idToBeAdded) => {
    let updatedItems = bag.filter((value) => value.id === idToBeAdded);
    if (updatedItems) setSelectedItems((prev) => [...prev, ...updatedItems]);
  };
  const handleCheckout = () => {
    localStorage.setItem('address', JSON.stringify(selectedAddress));
    localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
    router.push("/bag/pay");
  }


  return (
    <div className="overflow-x-hidden bg-searchBarColor">
      <div className="flex flex-col">
        {bag?.length === 0 ? (
          <div
            className="flex flex-col justify-center items-center gap-8"
            style={{ minHeight: "70vh" }}
          >
            <div className="h-40 w-40 relative">
              <Image
                src={shoppingBags}
                fill
                className="object-contain"
                alt="empty shopping bag showing image"
              />
            </div>
            <p className="text-lg text-center font-medium text-darkGrayColor">
              Your Bag is too light !!! Add something yaar...❤️🌟
            </p>

            <button
              className="py-2 px-6 text-white rounded-lg font-medium bg-darkBlue"
              onClick={() => router.replace("/")}
            >
              Shop now
            </button>
          </div>
        ) : (
          <div
            className="flex flex-col gap-4 py-4"
            style={{ minHeight: "75vh" }}
          >
            {bag?.map((value, index) => {
              return (
                <div
                  key={index}
                  className="flex flex-col bg-white border-y gap-2"
                >
                  <div className="flex flex-row items-center place-content-between">
                    {selectedItems.find((item) => item.id === value.id) ? (
                      <MdCheckBox
                        onClick={() => removeItem(value.id)}
                        className="text-brightOrange"
                        size={"1.5rem"}
                      />
                    ) : (
                      <MdCheckBoxOutlineBlank
                        onClick={() => addItem(value.id)}
                        className="text-darkGrayColor"
                        size={"1.5rem"}
                      />
                    )}
                    <IoIosClose
                      size={"1.5rem"}
                      className="text-grayColor"
                      onClick={() => handleDelete(value.id)}
                    />
                  </div>
                  <div
                    key={index}
                    className="w-full flex flex-row items-center justify-center gap-4 px-4 pb-6"
                  >
                    <div className="relative rounded-xl w-28 h-28 min-h-24">
                      <Image
                        src={value.image}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex flex-col text-xs text-grayColor">
                      <p className="text-sm ">{value.productName}</p>
                      <p className="text-black text-lg">₹{value.price}</p>
                      <div className="flex flex-row items-center place-content-between text-sm font-medium gap-2 text-darkGrayColor">
                        <div className="">Size: {value.selectedSize}</div>
                        {/* <div className="flex flex-row items-center gap-2 text-brightOrange">
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
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="flex flex-row items-end place-content-between w-full p-4 fixed bottom-0 left-0 bg-white">
              <div>
                <p className="text-grayColor">Total</p>
                <p className="font-medium text-2xl">₹{total}</p>
              </div>

              <Drawer>
                <DrawerTrigger className="min-h-2 h-full">
                  <div
                    onClick={() => { 
                      if (selectedItems.length >= 1) {
                        setDrawerOpen(true)
                        setButtonClicked(true)
                      } else {
                        setDrawerOpen(false)
                        setButtonClicked(false)
                        toast.error("Please select atleast one item")
                      }
                    }}
                    className="bg-darkBlue text-white flex flex-row justify-center items-center rounded-lg font-medium text-lg px-6 h-full py-2"
                  >
                    Checkout
                  </div>
                </DrawerTrigger>
                {drawerOpen && buttonClicked && (
                  <DrawerContent className="flex flex-col">
                    <div className="p-4">
                      <button
                        onClick={() => router.push("/bag/add-address")}
                        className="m-2 p-2 font-semibold text-brightOrange rounded-xl border border-dashed border-brightOrange text-center"
                      >
                        + Add New Address
                      </button>
                      <SavedAddresses 
                        selectedAddress={selectedAddress}
                        setSelectedAddress={setSelectedAddress}  
                      />
                    </div>
                    <DrawerFooter>
                      <DrawerClose>
                        <button
                          onClick={handleCheckout}
                          className="bg-darkBlue text-white flex flex-row justify-center items-center rounded-lg font-semibold text-lg px-8 py-2"
                        >
                          Continue
                        </button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                )}
              </Drawer>
            </div>
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
}

function SavedAddresses({ selectedAddress, setSelectedAddress}) {
  let savedAddresses = JSON.parse(localStorage.getItem("addresses")) || [];
  useEffect(() => {
    setSelectedAddress(savedAddresses[0]);
  }, []);

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
