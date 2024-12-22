"use client";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import shoppingBags from "@/public/icons/shopping-bags.svg";
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
import { IoInformationCircleOutline } from "react-icons/io5";

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

    console.log("auto detected address: ", autoDetectedAddress);
    console.log("selected address: ", selectedAddress);

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
    <div className="overflow-x-hidden bg-white mb-24">
      <div className="flex flex-col">
        {bag?.length === 0 ? (
          <div
            className="flex flex-col justify-center items-center gap-8"
            style={{ minHeight: "70vh" }}
          >
            <div className="h-40 w-40">
              <Image
                src={shoppingBags}
                className="object-contain"
                height={300}
                width={400}
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
          <div className="flex flex-col gap-8 p-2 lg:w-1/2">
            <div className="flex flex-col gap-2">
              <div className="flex flex-row place-content-between items-center text-darkGrayColor font-semibold">
                <p>Shipping address</p>
                <Drawer>
                  <DrawerTrigger>
                    <div className="text-brightOrange font-mona text-xs">
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
              {selectedAddress ? (
                <div
                  className={`border border-brightOrange rounded-2xl flex flex-row text-left p-4 gap-4 shadow-md `}
                >
                  <CgRadioChecked
                    size={"1.5rem"}
                    className="text-brightOrange"
                  />

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
              ) : (
                <AutoDetectedAddress
                  address={autoDetectedAddress}
                  setAddress={setAutoDetectedAddress}
                  checkout={checkout}
                />
              )}
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
                        onClick={() => handleDelete(value._id)}
                      />
                    </div>
                    <div
                      key={index}
                      className="w-full flex flex-row items-center place-content-between gap-4 py-2"
                    >
                      <div className="flex flex-row gap-4 items-center">
                        <div>
                        {selectedItems.find(
                          (item) => item._id === value._id
                        ) ? (
                          <FiCheckSquare
                            onClick={() => removeItem(value._id)}
                            className="text-brightOrange"
                            size={"1rem"}
                          />
                        ) : (
                          <FiSquare
                            onClick={() => addItem(value._id)}
                            className="text-grayColor"
                            size={"1rem"}
                          />
                        )}
                        </div>
                        <div className="flex flex-row gap-4 items-center">
                          <div className="w-1/2">
                            <Image
                              src={value.image}
                              height={300}
                              width={400}
                              className="object-cover h-20 w-20 rounded-xl"
                            />
                          </div>
                          <div className="w-1/2">
                            <p className="text-sm text-darkGrayColor font-semibold">
                              {value.productName}
                            </p>
                            <div className="text-xs font-normal">
                              {value.selectedSize}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row gap-1 text-darkGrayColor font-normal text-lg">
                        <p>₹</p>
                        <p>{value.price}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-row items-end place-content-between w-full p-4 fixed bottom-0 left-0 bg-white">
              <div>
                <p className="text-grayColor">Total</p>
                <p className="font-normal text-darkGrayColor text-2xl">
                  ₹{total}
                </p>
              </div>
              <button
                onClick={handleCheckout}
                className="bg-darkBlue text-white flex flex-row justify-center items-center rounded-lg font-semibold w-3/5 text-lg h-full py-2"
              >
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
      className="p-2 font-semibold text-brightOrange rounded-xl border border-dashed border-brightOrange text-center w-full text-sm"
    >
      + Add New Address
    </button>
  );
}

function AutoDetectedAddress({ address, setAddress }) {
  return (
    <div className="p-4 shadow rounded-2xl border border-brightOrange flex flex-col gap-2">
      <div className="flex flex-row gap-2 items-center justify-start ">
        <PiMapPinFill size={"1rem"} className="text-brightOrange" />
        <p className="text-brightOrange font-semibold text-sm">
          AutoDetected Address
        </p>
      </div>
      <div className={`flex flex-row text-left items-center gap-4 `}>
        <CgRadioChecked size={20} className="text-brightOrange" />

        <div className="text-xs w-full ">
          <textarea
            type="text"
            rows={address.formatted_address.length < 60 ? 2 : 4}
            cols={25}
            maxLength={400}
            placeholder="Address"
            value={address?.formatted_address}
            className={`${styles.input} focus:outline-none`}
            style={{
              padding: "4px",
              borderRadius: "0.50rem",
            }}
            onChange={(e) => {
              e.preventDefault();
              setAddress((prev) => ({
                ...prev,
                formatted_address: e.target.value,
              }));
            }}
          />

          <div className="flex flex-row gap-2 pt-2">
            <div className="flex flex-col w-1/2">
              <label htmlFor="name" className={styles.label}>
                Mobile Number
              </label>
              <input
                type="tel"
                maxLength={10}
                pattern="[0-9]{10}"
                required
                autoComplete="Phone number"
                placeholder="Mobile Number"
                className={`${styles.input} focus:outline-none`}
                style={{
                  padding: "4px",
                  borderRadius: "0.50rem",
                }}
                value={address?.mobileNumber}
                onChange={(e) => {
                  e.preventDefault();
                  setAddress((prev) => ({
                    ...prev,
                    mobileNumber: e.target.value,
                  }));
                }}
              />
            </div>
            <div className="flex flex-col w-1/2">
              <label htmlFor="name" className={styles.label}>
                Name
              </label>
              <input
                type="text"
                maxLength={30}
                required
                placeholder="Name"
                className={`${styles.input} focus:outline-none`}
                style={{
                  padding: "4px",
                  borderRadius: "0.50rem",
                }}
                autoComplete="name"
                value={address?.name}
                onChange={(e) => {
                  e.preventDefault();
                  setAddress((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }));
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-row gap-2 text-xs font-semibold text-green">
        <IoInformationCircleOutline size={"1rem"} />
        <p>If this address is correct then you can proceed </p>
      </div>
    </div>
  );
}
