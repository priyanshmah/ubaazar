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
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Bag() {
  const [bag, setBag] = useState([]);
  const [total, setTotal] = useState(0);
  const [allSelected, setAllSelected] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState({});
  const [autoDetectedAddress, setAutoDetectedAddress] = useState({
    formatted_address: "",
    name: "",
    mobileNumber: "",
  });
  const [checkout, setCheckout] = useState(false);
  const { setBagItems } = useContext(AuthContext);
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

  // To detect current location
  useEffect(() => {
    if (!selectedAddress) {
      const fetchLocation = async () => {
        try {
          const { latitude, longitude } = await GetCurrentLocation();
          if (!latitude || !longitude) return null;

          const response = await axios.post(
            "/api/get-address",
            JSON.stringify({ latitude, longitude })
          );

          console.log("response :", response.data);

          if (response.data?.success) {
            setAutoDetectedAddress((prev) => ({
              ...prev,
              formatted_address: response.data?.address?.formatted_address,
            }));
          }
        } catch (error) {
          console.error("Error while fetching your location :", error);
          return null;
        }
      };
      fetchLocation();
    }
  }, [selectedAddress]);

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
    if (bag.length > 0) localStorage.setItem("bag", JSON.stringify(bag));
    if (selectedItems.length > 0)
      localStorage.setItem("selectedItems", JSON.stringify(selectedItems));

    if (bag.length === selectedItems.length) setAllSelected(true);
    else setAllSelected(false);
  }, [bag, selectedItems]);

  const handleDelete = (idToBeRemoved) => {
    console.log("id to be removed: ", idToBeRemoved);

    let updatedBag = bag.filter((value) => value._id !== idToBeRemoved);

    console.log("updated bag is: ", updatedBag);

    if (updatedBag) {
      setBagItems(updatedBag.length);
      setBag(updatedBag);
    }

    setSelectedItems(
      selectedItems.filter((value) => value._id !== idToBeRemoved)
    );
  };
  const removeItem = (idToBeRemoved) => {
    let updatedItems = selectedItems.filter(
      (value) => value._id !== idToBeRemoved
    );
    if (updatedItems) setSelectedItems(updatedItems);
  };
  const addItem = (idToBeAdded) => {
    let updatedItems = bag.filter((value) => value._id === idToBeAdded);
    if (updatedItems) setSelectedItems((prev) => [...prev, ...updatedItems]);
  };
  const handleCheckout = () => {
    setCheckout(true);

    if (!selectedAddress && !autoDetectedAddress) {
      toast.error("Please select shipping address");
      return;
    }

    if (
      autoDetectedAddress.formatted_address ||
      autoDetectedAddress.mobileNumber ||
      autoDetectedAddress.name
    ) {
      if (!autoDetectedAddress.formatted_address) {
        toast.error("Invalid address");
        return;
      }
      if (!autoDetectedAddress.name) {
        toast.error("Please enter your name");
        return;
      }
      if (!autoDetectedAddress.mobileNumber) {
        toast.error("Please enter your mobile number");
        return;
      }

      localStorage.setItem(
        "address",
        JSON.stringify({ ...autoDetectedAddress })
      );
      localStorage.setItem(
        "addresses",
        JSON.stringify([{ ...autoDetectedAddress }])
      );
    }

    if (selectedAddress)
      localStorage.setItem("address", JSON.stringify(selectedAddress));
    localStorage.setItem("selectedItems", JSON.stringify(selectedItems));
    router.push("/bag/pay");
  };

  return (
    <div className="overflow-x-hidden bg-lightBackground text-darkGrayColor">
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
          <div className="flex flex-col gap-2 py-2 min-h-[80vh] lg:w-1/2">
            <div className="flex flex-col gap-2 bg-white  p-2">
              <div className="flex flex-row place-content-between items-center text-darkGrayColor font-semibold">
                <p>Shipping address</p>
                <Drawer>
                  <DrawerTrigger>
                    <div className="text-pink font-mona text-xs">
                      Change address
                    </div>
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
              {selectedAddress && (
                <div
                  className={`border border-pink text-pink rounded-2xl flex flex-row text-left p-4 gap-4 shadow-md `}
                >
                  <CgRadioChecked size={"1.5rem"} className="text-pink" />

                  {selectedAddress.formatted_address ? (
                    <div className="text-xs">
                      <p className="text-darkGrayColor font-semibold text-sm">
                        {selectedAddress?.name}
                      </p>
                      <p>{selectedAddress?.formatted_address}</p>
                      <p>{selectedAddress?.mobileNumber}</p>
                    </div>
                  ) : (
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
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-col bg-white">
              {bag?.map((value, index) => {
                return (
                  <div key={index} className="p-2">
                    <div
                      key={index}
                      className="w-full flex flex-row items-center place-content-between"
                    >
                      <div className="flex flex-row items-center gap-2 w-[70vw]">
                        <div className="relative w-1/2 aspect-[3/4]">
                          <Image
                            src={value.image}
                            alt="product image"
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="w-1/2">
                          <p className="text-sm font-semibold line-clamp-2">
                            {value.productName}
                          </p>
                          <div className="text-xs text-grayColor font-normal">
                            {value.selectedSize || "Free size"}
                          </div>
                          <div className="flex flex-row text-xs items-center bg-lightPink w-fit border border-pink rounded-sm px-1 gap-2 text-pink">
                            <FiMinus size={15} />
                            <p className="text-sm text-darkGrayColor font-semibold">
                              1
                            </p>
                            <FiPlus size={15} />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-center justify-center">
                        <div className="flex flex-row text-darkGrayColor font-semibold leading-none text-lg">
                          <p>₹{value.price}</p>
                        </div>
                        <div className="text-silver line-through font-normal text-sm">
                          <p>₹{value.mrp}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
                })}
             
            </div>

            <div className="flex flex-col items-start place-content-between w-full p-4 fixed bottom-0 left-0 bg-white">
              <div className="flex flex-row justify-between items-center w-full text-lg">
                <p className="text-grayColor">Subtotal</p>
                <p className="font-normal text-darkGrayColor">₹{total}</p>
              </div>
              <button
                onClick={() => router.push("/bag/pay")}
                className="bg-black text-white flex flex-row justify-center items-center  font-semibold w-full text-lg h-full py-2"
              >
                Place order
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

function AddAddressButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push("/bag/add-address")}
      className="p-2 font-semibold text-darkGrayColor rounded-full border  border-darkGrayColor text-center w-full text-sm"
    >
      + Add new address
    </button>
  );
}
