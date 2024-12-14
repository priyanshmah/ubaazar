"use client";
import { useState } from "react";
import styles from "@/styles/Bag.module.css";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { addressSchema } from "@/schemas/addressSchema";
import * as Yup from "yup";
import { FiAlertCircle } from "react-icons/fi";
import { Roboto } from "next/font/google";
import toast, { Toaster } from "react-hot-toast";

const roboto = Roboto({
  subsets: ["cyrillic"],
  weight: ["300", "400", "500", "700"],
});

export default function AddressForm() {
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const [errors, setErrors] = useState({});
  const router = useRouter();

  const handleAddAddress = async () => {
    if (
      !name ||
      !mobileNumber ||
      !pinCode ||
      !address ||
      !area ||
      !city ||
      !state
    ) {
      toast.error("Please fill all field first");
      return;
    }

    try {
      await addressSchema.validate(
        {
          name,
          mobileNumber,
          pinCode,
          address,
          area,
          city,
          state,
        },
        { abortEarly: false }
      );

      let savedAddresses = JSON.parse(localStorage.getItem("addresses")) || [];
      savedAddresses.push({
        name,
        mobileNumber,
        pinCode,
        address,
        area,
        city,
        state,
      });
      localStorage.setItem("addresses", JSON.stringify(savedAddresses));
      setName("");
      setAddress("");
      setMobileNumber("");
      setPinCode("");
      setArea("");
      setCity("");
      setState("");
      router.back();
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errorMessages = error.errors.reduce((acc, errorMessage) => {
          const fieldName = errorMessage.split(" ")[0].toLowerCase();
          if (!acc[fieldName]) {
            acc[fieldName] = errorMessage;
          }

          return acc;
        }, {});
        setErrors(errorMessages);
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div
        className="flex flex-col gap-4 m-4  border-brightOrange rounded-2xl lg:w-1/3 "
        style={{ marginBottom: "10vh" }}
      >
        <p className="border-b border-brightOrange p-2 text-lg font-semibold text-white bg-brightOrange flex items-center justify-center rounded-t-xl">
          Add new address
        </p>
        <div className="flex flex-col gap-2 px-6">
          <p className="text-brightOrange font-semibold">Contact Details</p>
          <div className="flex flex-col">
            <label htmlFor="name" className={styles.label}>
              Name
            </label>
            <input
              maxLength={40}
              min={3}
              type="text"
              placeholder="Your name"
              className={`${styles.input}`}
              value={name}
              onChange={(e) => {
                e.preventDefault();
                setName(e.target.value);
              }}
            />
            {errors.name && (
              <div
                className={`flex flex-row items-center justify-start gap-2 text-red font-medium ${roboto.className}`}
                style={{ fontSize: "0.6rem" }}
              >
                <FiAlertCircle className="text-red" size={"0.85rem"} />
                {errors.name}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <label htmlFor="mobileNumber" className={styles.label}>
              Mobile Number
            </label>
            <input
              id="mobileNumber"
              maxLength={10}
              required
              type="tel"
              pattern="[0-9]{10}"
              placeholder="Mobile Number"
              className={styles.input}
              value={mobileNumber}
              onChange={(e) => {
                e.preventDefault();
                setMobileNumber(e.target.value);
              }}
            />
            {errors.mobile && (
              <div
                className={`flex flex-row items-center justify-start gap-2 text-red font-medium ${roboto.className}`}
                style={{ fontSize: "0.6rem" }}
              >
                <FiAlertCircle className="text-red" size={"0.85rem"} />
                {errors.mobile}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 px-6">
          <p className="font-semibold text-brightOrange">Address</p>
          <div className="flex flex-col">
            <label htmlFor="name" className={styles.label}>
              PinCode
            </label>
            <input
              type="tel"
              maxLength={6}
              pattern="[0-9]{6}"
              required
              placeholder="Pin Code"
              className={styles.input}
              value={pinCode}
              onChange={(e) => {
                e.preventDefault();
                setPinCode(e.target.value);
              }}
            />
            {errors.pincode && (
              <div
                className={`flex flex-row items-center justify-start gap-2 text-red font-medium ${roboto.className}`}
                style={{ fontSize: "0.6rem" }}
              >
                <FiAlertCircle className="text-red" size={"0.85rem"} />
                {errors.pincode}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="name" className={styles.label}>
              Address
            </label>
            <input
              maxLength={40}
              min={3}
              type="text"
              placeholder="House No, Building, Company, Sector"
              className={styles.input}
              value={address}
              onChange={(e) => {
                e.preventDefault();
                setAddress(e.target.value);
              }}
            />
            {errors.address && (
              <div
                className={`flex flex-row items-center justify-start gap-2 text-red font-medium ${roboto.className}`}
                style={{ fontSize: "0.6rem" }}
              >
                <FiAlertCircle className="text-red" size={"0.85rem"} />
                {errors.address}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="name" className={styles.label}>
              Area / Colony
            </label>
            <input
              maxLength={40}
              min={3}
              type="text"
              placeholder="Area, Street, Sector"
              className={styles.input}
              value={area}
              onChange={(e) => {
                e.preventDefault();
                setArea(e.target.value);
              }}
            />
            {errors.area && (
              <div
                className={`flex flex-row items-center justify-start gap-2 text-red font-medium ${roboto.className}`}
                style={{ fontSize: "0.6rem" }}
              >
                <FiAlertCircle className="text-red" size={"0.85rem"} />
                {errors.area}
              </div>
            )}
          </div>

          <div className="flex flex-row place-content-between gap-4">
            <div className="flex flex-col">
              <label htmlFor="name" className={styles.label}>
                City / District
              </label>
              <input
                maxLength={20}
                min={3}
                placeholder="City"
                type="text"
                className={styles.input}
                value={city}
                onChange={(e) => {
                  e.preventDefault();
                  setCity(e.target.value);
                }}
              />
              {errors.city && (
                <div
                  className={`flex flex-row items-center justify-start gap-2 text-red font-medium ${roboto.className}`}
                  style={{ fontSize: "0.6rem" }}
                >
                  <FiAlertCircle className="text-red" size={"0.85rem"} />
                  {errors.city}
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <label htmlFor="name" className={styles.label}>
                State
              </label>
              <input
                maxLength={20}
                min={3}
                placeholder="State"
                type="text"
                className={styles.input}
                value={state}
                onChange={(e) => {
                  e.preventDefault();
                  setState(e.target.value);
                }}
              />
              {errors.state && (
                <div
                  className={`flex flex-row items-center justify-start gap-2 text-red font-medium ${roboto.className}`}
                  style={{ fontSize: "0.6rem" }}
                >
                  <FiAlertCircle className="text-red" size={"0.85rem"} />
                  {errors.state}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="p-6">
          <button
            className="bg-brightOrange text-white text-lg font-semibold rounded-xl flex flex-row justify-center items-center w-full py-2 shadow-lg"
            onClick={handleAddAddress}
          >
            Add address
          </button>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
