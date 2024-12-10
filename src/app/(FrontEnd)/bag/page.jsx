"use client";
import Image from "next/image";

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

import { useRouter } from "next/navigation";
import { CgRadioCheck, CgRadioChecked } from "react-icons/cg";
import { FiCheckSquare, FiSquare, FiTrash2 } from "react-icons/fi";
import axios from "axios";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import { IoIosClose } from "react-icons/io";
import toast, { Toaster } from "react-hot-toast";

export default function Bag() {
  const [total, setTotal] = useState(0);
  const [bag, setBag] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState({});
  const [allSelected, setAllSelected] = useState(true);
  const router = useRouter();
  
  
  useEffect(() => {
    let savedAddresses = JSON.parse(localStorage.getItem("addresses")) || [];
    setSelectedAddress(savedAddresses?.at(-1));

    let storedBag = localStorage.getItem("bag");    
    if (storedBag) {
      let parsedBag = JSON.parse(storedBag);
      
      setBag(parsedBag);
      setSelectedItems(parsedBag);

      if (selectedItems) {
        const totalValue = selectedItems?.reduce(
          (acc, value) => acc + value.price,
          0
        );
        setTotal(totalValue);
      }
    }
  }, []);

  useEffect(() => {
    if (selectedItems) {
      const totalValue = selectedItems?.reduce(
        (acc, value) => acc + value.price,
        0
      );
      setTotal(totalValue);
    }
  }, [selectedItems]);

  useEffect(() => {
    if (bag.length === selectedItems.length) {
      setAllSelected(true);
    } else {
      setAllSelected(false);
    }
  }, [bag, selectedItems]);

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
    if(!selectedAddress){
      toast.error("Please select shipping address");
      return ;
    }

    localStorage.setItem("address", JSON.stringify(selectedAddress));
    localStorage.setItem("selectedItems", JSON.stringify(selectedItems));
    router.push("/bag/pay");
  };

  return (
    <div className="overflow-x-hidden bg-white mb-24">
      <div className="flex flex-col">
        {bag?.length === 0 ? (
          <div
            className="flex flex-col justify-center items-center gap-8"
            style={{ minHeight: "70vh" }}
          >
            <div className="h-40 w-40 relative">
              <Image
                src={"/public/icons/shopping-bags.svg"}
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
          <div className="flex flex-col gap-8 p-4 lg:w-1/2">
            <div className="flex flex-col gap-2">
              <div className="flex flex-row place-content-between items-center text-darkGrayColor font-semibold">
                <p>Shipping address</p>
                <Drawer>
                  <DrawerTrigger>
                    <p className="text-brightOrange font-mona text-xs">
                      Change address
                    </p>
                  </DrawerTrigger>
                  <DrawerContent className="flex flex-col w-full">
                    <div className="p-4">
                      <DrawerClose className="w-full">
                      <SavedAddresses
                        selectedAddress={selectedAddress}
                        setSelectedAddress={setSelectedAddress}
                      />
                      </DrawerClose>
                    </div>
                  </DrawerContent>
                </Drawer>
              </div>
              <AddAddressButton />
              { selectedAddress && <div
                className={`border border-brightOrange rounded-2xl flex flex-row text-left p-4 gap-4 shadow-md `}
              >
                <CgRadioChecked size={20} className="text-brightOrange" />

                <div className="text-xs">
                  <p className="text-darkGrayColor font-semibold text-sm">
                    {selectedAddress?.name}
                  </p>
                  <p>
                    {selectedAddress?.address} , {selectedAddress?.area}
                  </p>
                  <p>
                    {selectedAddress?.city} , {selectedAddress?.state} -{" "}
                    {selectedAddress?.pinCode}
                  </p>
                  <p>{selectedAddress?.mobileNumber}</p>
                </div>
              </div>}
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-row place-content-between text-darkGrayColor">
                <div className="flex flex-row justify-center items-center gap-4">
                  {allSelected ? (
                    <FiCheckSquare
                      size={"1rem"}
                      className="text-brightOrange"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedItems([]);
                      }}
                    />
                  ) : (
                    <FiSquare
                      size={"1rem"}
                      className="text-darkGrayColor"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedItems(bag);
                      }}
                    />
                  )}
                  Product
                </div>
                <div>Price</div>
              </div>
              {bag?.map((value, index) => {
                return (
                  <div key={index} className="border-t gap-2 relative">
                    <div className="flex flex-row gap-1 w-fit items-center absolute top-1 right-0">
                      <IoIosClose
                        size={"1.5rem"}
                        className="text-grayColor"
                        onClick={() => handleDelete(value.id)}
                      />
                    </div>
                    <div
                      key={index}
                      className="w-full flex flex-row items-center place-content-between gap-4 py-2"
                    >
                      <div className="flex flex-row gap-4 items-center">
                        {selectedItems.find((item) => item.id === value.id) ? (
                          <FiCheckSquare
                            onClick={() => removeItem(value.id)}
                            className="text-brightOrange"
                            size={"1rem"}
                          />
                        ) : (
                          <FiSquare
                            onClick={() => addItem(value.id)}
                            className="text-grayColor"
                            size={"1rem"}
                          />
                        )}
                        <div className="flex flex-row gap-4 items-center">
                          <div className="relative rounded-xl w-28 h-28 min-h-24">
                            <Image
                              src={value.image}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                          <div>
                            <p className="text-sm text-darkGrayColor font-semibold">
                              {value.productName}
                            </p>
                            <div className="text-xs font-normal">
                              {value.selectedSize}
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="flex flex-row gap-1 text-darkGrayColor font-normal text-lg">
                        <p>₹</p>
                        <p>{value.price}</p>
                      </p>
                      {/* <div className="flex flex-col text-xs text-grayColor">
                      <div className="flex flex-row items-center place-content-between text-sm font-medium gap-2 text-darkGrayColor">
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
                    </div> */}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-row items-end place-content-between w-full p-4 fixed bottom-0 left-0 bg-white">
              <div>
                <p className="text-grayColor">Total</p>
                <p className="font-normal text-darkGrayColor text-2xl">₹{total}</p>
              </div>
              <button 
              onClick={handleCheckout}
              className="bg-darkBlue text-white flex flex-row justify-center items-center rounded-lg font-semibold w-3/5 text-lg h-full py-2">
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
}

function SavedAddresses({ selectedAddress, setSelectedAddress }) {
  let savedAddresses = JSON.parse(localStorage.getItem("addresses")) || [];

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
            } p-4 rounded-2xl flex flex-row text-left gap-4 shadow-md w-full`}
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

function AddAddressButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push("/bag/add-address")}
      className="p-2 font-semibold text-brightOrange rounded-xl border border-dashed border-brightOrange text-center w-full text-sm"
    >
      + Add New Address
    </button>
  );
}
