"use client";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import shoppingBags from "@/public/images/illustrations/empty.webp";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import styles from "@/styles/Bag.module.css";
import { useRouter } from "nextjs-toploader/app";
import { CgRadioCheck, CgRadioChecked } from "react-icons/cg";
import {
  FiAlertCircle,
  FiCheckSquare,
  FiMapPin,
  FiMinus,
  FiPlus,
  FiSquare,
  FiTrash2,
} from "react-icons/fi";
import { IoIosClose } from "react-icons/io";
import toast, { Toaster } from "react-hot-toast";
import AuthContext from "@/context/authContext";
import { PiMapPinFill } from "react-icons/pi";
import GetCurrentLocation from "@/hooks/location/getCurrentLocation";
import axios from "axios";
import { FaCircleInfo } from "react-icons/fa6";
import { IoInformationCircleOutline, IoTicketOutline } from "react-icons/io5";
import CustomNavbar from "../../../components/ui/CustomNavbar";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import BagItems from "@/components/bag/BagItems";
import { setProducts, setSelectedAddress } from "@/redux/slice/bagSlice";
import { useDispatch, useSelector } from "react-redux";
import AddressForm from "./add-address/page";

export default function Bag() {
  const bag = useSelector((state) => state.bag?.products);
  const total = useSelector((state) => state.bag?.priceDetails?.subTotal);
  const price = useSelector((state) => state.bag?.priceDetails);
  const [address, setAddress] = useState({});
  const [openDrawer, setOpenDrawer] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    let savedAddresses = JSON.parse(localStorage.getItem("addresses")) || [];
    setAddress(savedAddresses?.at(-1));
    dispatch(setSelectedAddress(savedAddresses?.at(-1)?._id));

    let storedBag = localStorage.getItem("bag");
    if (storedBag) {
      let parsedBag = JSON.parse(storedBag);
      dispatch(setProducts(parsedBag));
    }
  }, []);

  useEffect(() => {
    if (bag.length > 0) localStorage.setItem("bag", JSON.stringify(bag));
  }, [bag]);


  
  
  const handleCheckout = () => {
    if (!address) {
      setOpenDrawer(true);
      return;
    }

    router.push("/bag/pay");
  };

  return (
    <div className="overflow-x-hidden bg-lightBackground min-h-screen  text-darkGrayColor">
      <CustomNavbar customText={"Shopping Bag"} />
      <div className="flex flex-col">
        {bag?.length === 0 ? (
          <div
            className="flex flex-col justify-center items-center gap-4"
            style={{ minHeight: "80vh" }}
          >
            <div className="h-40 w-40 relative">
              <Image
                src={shoppingBags}
                className="object-cover"
                fill
                alt="empty shopping bag showing image"
              />
            </div>
            <p className="text-lg text-center font-medium text-darkGrayColor">
              Your Shopping Bag is Empty
            </p>

            <button
              className="py-2 px-6 text-black font-medium  rounded-full border border-black"
              onClick={() => router.replace("/")}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 py-2  lg:w-1/2">
            <div className="flex flex-col gap-2 bg-white  p-2">
              <div className="flex flex-row place-content-between items-center text-darkGrayColor font-semibold">
                <p>Shipping address</p>
                <Drawer >
                  <DrawerTrigger>
                    <div className="text-pink font-mona text-xs">
                      Change address
                    </div>
                  </DrawerTrigger>
                  <DrawerContent className="flex flex-col w-full">
                    <div className="p-4">
                      <DrawerClose className="w-full">
                        <SavedAddresses
                          selectedAddress={address}
                          setSelectedAddress={setAddress}
                        />
                      </DrawerClose>
                    </div>
                  </DrawerContent>
                </Drawer>
              </div>
              <AddAddressButton isOpen={openDrawer} setIsOpen={setOpenDrawer} />
                {address && (
                <div
                  className={`border border-pink text-pink rounded-2xl flex flex-row text-left p-4 gap-4`}
                >
                  <CgRadioChecked size={"1.5rem"} className="text-pink" />

                  <div className="text-xs">
                    <p className="text-darkGrayColor font-semibold text-sm">
                      {address?.name}
                    </p>
                    <p>
                      {address?.address} , {address?.area}
                    </p>
                    <p>
                      {address?.city} , {address?.state} -{" "}
                      {address?.pincode}
                    </p>
                    <p>{address?.mobileNumber}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col bg-white">
              {bag?.map((value, index) => {
                return <BagItems product={value} key={index} />;
              })}
            </div>

            <div className="flex flex-col items-start place-content-between w-full p-4 fixed bottom-0 left-0 bg-white">
              <div className="flex flex-row justify-between items-center w-full text-lg">
                <p className="text-grayColor">Subtotal</p>
                <p className="font-normal text-darkGrayColor">₹{total}</p>
              </div>
              <button
                onClick={handleCheckout}
                className="bg-black text-white flex flex-row justify-center items-center  font-semibold w-full text-lg h-full py-2"
              >
                {address ? "Place order" : "Add address"}
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
              status ? "border-pitext-pink" : "border-lightGrayColor"
            } p-4 rounded-2xl flex flex-row text-left gap-4 shadow-md w-full`}
            key={index}
          >
            {status ? (
              <CgRadioChecked size={20} className="text-pink" />
            ) : (
              <CgRadioCheck size={20} className="text-white" />
            )}
            {value.formatted_address ? (
              <div className="text-xs">
                <p className="text-darkGrayColor font-semibold text-sm">
                  {value?.name}
                </p>
                <p>{value?.formatted_address}</p>
                <p>{value?.mobileNumber}</p>
              </div>
            ) : (
              <div className="text-xs">
                <p className="text-darkGrayColor font-semibold text-sm">
                  {value?.name}
                </p>
                <p>
                  {value?.address} , {value?.area}
                </p>
                <p>
                  {value?.city} , {value?.state} - {value?.pinCode}
                </p>
                <p>{value?.mobileNumber}</p>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

function AddAddressButton({ isOpen, setIsOpen }) {
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <div 
        onClick={() => setIsOpen(true)}
        className="p-2 flex flex-row gap-1 items-center justify-center font-semibold text-darkGrayColor bg-lightPink rounded-full border  border-darkGrayColor text-center w-full text-sm">
          <FiPlus size={20} />
          Add address
        </div>
      <DrawerContent className="flex flex-col w-full">
        <AddressForm />
      </DrawerContent>
    </Drawer>
  );
}
