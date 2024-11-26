"use client";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FiEdit } from "react-icons/fi";

function User({ user }) {
  const [name, setName] = useState(user?.username || "not added");
  const [mobileNumber, setMobileNumber] = useState(
    user?.mobileNumber || "not added"
  );
  const [emailId, setEmailId] = useState(user?.email || "not added");
  const [editClicked, setEditClicked] = useState(false);

  const handleSaveDetails = async() => {
    try {
      setEditClicked(false);
      const response = await axios.post('/api/auth/user/edit', JSON.stringify({
        username: name,
        email: emailId ,
        mobileNumber
      }));

      if(response.data?.success){        
        toast.success("Profile updated successfully...")
      }
      else {
        toast.error("Profile not updated due to technical issue")
      }

    } catch (error) {
      toast.error("Something went wrong!!!")
    }
  }

  return (
    <div className="rounded-2xl shadow border border-brightOrange">
      <div className="font-semibold text-base p-2 bg-brightOrange text-white rounded-t-xl flex flex-row place-content-between items-center">
        <p>Profile Details</p>
        <FiEdit onClick={() => setEditClicked(true)} size={"1rem"} />
      </div>
      <div className="p-4 text-sm flex flex-col gap-2">
        <div className="flex flex-row place-content-between items-center w-full">
          <p>Full Name</p>
          {editClicked ? (
            <input
              type="text"
              min={3}
              max={25}
              value={name}
              onChange={(e) => {
                e.preventDefault();
                setName(e.target.value);
              }}
              placeholder="Full Name"
              className="bg-searchBarColor rounded-xl p-2 border-silver border"
            />
          ) : (
            <p className="text-grayColor">{name}</p>
          )}
        </div>
        <div className="flex flex-row place-content-between items-center w-full">
          <p>Mobile Number</p>
          {editClicked ? (
            <input
              type="tel"
              max={10}
              value={mobileNumber}
              onChange={(e) => {
                e.preventDefault();
                setMobileNumber(e.target.value);
              }}
              placeholder="Mobile Number"
              className="bg-searchBarColor rounded-xl p-2 border-silver border"
            />
          ) : (
            <p className="text-grayColor">{mobileNumber}</p>
          )}
        </div>
        <div className="flex flex-row place-content-between items-center w-full">
          <p>Email ID</p>
          {editClicked ? (
            <input
              type="email"
              value={emailId}
              maxLength={40}
              onChange={(e) => {
                e.preventDefault();
                setEmailId(e.target.value);
              }}
              placeholder="Email ID"
              className="bg-searchBarColor rounded-xl p-2 border-silver border"
            />
          ) : (
            <p className="text-grayColor">{emailId}</p>
          )}
        </div>
        {editClicked && (
          <div className="flex place-content-end pt-2">
            <button
              onClick={handleSaveDetails}
              className="bg-darkBlue text-white text-base font-semibold rounded-md text-center w-fit py-1 px-4"
            >
              Save Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default User;
