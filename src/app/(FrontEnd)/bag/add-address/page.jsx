"use client";
import { useState } from "react";
import styles from "@/styles/Bag.module.css";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AddressForm() {
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const router = useRouter();

  const handleAddAddress = () => {
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
    setName('');
    setAddress('');
    setMobileNumber('');
    setPinCode('');
    setArea('');
    setCity('');
    setState('');
    router.replace('/bag?drawerOpen=true');
  };

  return (
    <>
      <div
        className="flex flex-col gap-4 m-4 border-2 border-grayColor rounded-3xl "
        style={{ marginBottom: "10vh" }}
      >
        <p className="border-b-2 border-grayColor p-4 font-semibold text-darkGrayColor flex items-center justify-center">
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
              className={styles.input}
              value={name}
              onChange={(e) => {
                e.preventDefault();
                setName(e.target.value);
              }}
            />
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
            </div>
          </div>
        </div>
        <div className="p-6">
          <Link 
          href={'/bag'}
          className="bg-brightOrange text-white text-lg font-semibold rounded-xl flex flex-row justify-center items-center w-full py-2 shadow-lg"
          onClick={handleAddAddress}
          >
            Add address
          </Link>
        </div>
      </div>
    </>
  );
}
