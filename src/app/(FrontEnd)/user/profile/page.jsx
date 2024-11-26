"use client";
import User from "@/components/user/user-details";
import { getUserData } from "@/lib/api";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CgRadioCheck, CgRadioChecked } from "react-icons/cg";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import useSWR from "swr";

const fetcher = (url) =>
  axios
    .get(url, {
      headers: {
        Authorization: Cookies.get("token"),
      },
    })
    .then((res) => res.data);

export default function Profile() {

  const { data, error, isLoading } = useSWR("/api/auth/user/get-address", fetcher);

  console.log("user data is: ", data?.user);
  

  return (
    <div className="p-4 flex flex-col gap-4">
      <User user={data?.user}/>
       <SavedAddress addressList={data?.user?.savedAddresses} />
    </div>
  );
}

function SavedAddress({ addressList }) {

  return (
    <div className="p-2 flex flex-col gap-2">
      <p className="font-semibold text-darkBlue">Saved address</p>
      <AddAddressButton />
      <div className="flex flex-col gap-4 text-grayColor text-sm">
        {addressList?.map((value, index) => {
          return (
            <div
              className={`border p-4 rounded-2xl flex flex-row text-left gap-4 shadow-md w-full place-content-between`}
              key={index}
            >
              <div className="text-xs">
                <p className="text-darkBlue font-semibold text-sm">
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
              {/* <FiTrash2
              onClick={() => {
                
              }}
              size={"1rem"} className="text-red"/> */}
            </div>
          );
        })}
      </div>
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
