"use client";
import { useContext, useState, useEffect } from "react";
import styles from "@/styles/Auth.module.css";
import "@/styles/globals.css";
import { auth } from "../../../../firebase.config.js";
import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import axios from "axios";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";


import AuthContext from "@/context/authContext.js";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation.js";
import Loading from "@/components/ui/loading.jsx";

export default function UserAuth() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const [timer, setTimer] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [newUser, setNewUser] = useState(false);
  const router = useRouter();
  

  useEffect(() => {
    if (timer > 0) {
      const intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(intervalId);
    } else {
      setIsButtonDisabled(false);
    }
  }, [timer]);

  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  console.log("Login status: ", isLoggedIn);
    

  useEffect(() => {    
    isLoggedIn && router.replace('/')
  }, [])  

  const handleOtpVerification = async () => {
    setLoading(true);

    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({
        mobileNumber,
        enteredOTP: otp,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const message = data.message;

      setNewUser(data.newUser);
      setLoading(false);
      setTimer(0);
      setIsLoggedIn(true);

      toast.success(message, { duration: 5000 });
      if (!newUser) {
        router.push('/');
      }
    } else {
      const errorData = await res.json();
      const errorMessage = errorData.error;

      setLoading(false);
      toast.error(errorMessage, { duration: 5000 });
    }
  };

  const handleSendOtp = async () => {
    setLoading(true);
    setIsButtonDisabled(true)

    let res = await fetch("/api/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({
        mobileNumber,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const message = data.message;

      setLoading(false);
      toast.success(message, { duration: 5000 });
      setProgress(1);
      setTimer(30)
    } else {
      const errorData = await res.json();
      const errorMessage = errorData.error;

      setLoading(false);
      toast.error(errorMessage, { duration: 5000 });
    }
  };

  const handleResendOtp = async () => {
    setIsButtonDisabled(true);
    setLoading(true);

    let res = await fetch("/api/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({
        mobileNumber,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const message = data.message;

      setLoading(false);
      toast.success(message, { duration: 5000 });
      setTimer(30);
    } else {
      const errorData = await res.json();
      const errorMessage = errorData.error;

      setLoading(false);
      toast.error(errorMessage, { duration: 5000 });
    }
  };

  const handleUsername = async () => {
    setLoading(true);

    let res = await fetch("/api/profile/update", {
      method: "POST",
      body:  JSON.stringify({
        username: name
      })
    })

    if (res.ok) {
      const data = await res.json();
      const message = data.message;

      setLoading(false);
      toast.success(message, { duration: 5000 });
      router.push('/');
    } else {
      const errorData = await res.json();
      const errorMessage = errorData.error;

      setLoading(false);
      toast.error(errorMessage, { duration: 5000 });
    }
  }

  return (
    <div className="flex flex-col justify-center items-center">
      {loading && (
        <Loading />
      )}
      {progress == 0 && (
        <div className={styles.form} style={{ minHeight: "50vh" }}>
          <div className="flex flex-row gap-4 justify-center items-center text-darkGrayColor">
            <h1 className="text-2xl">Login</h1>
            <div className="text-xl text-orange">or</div>
            <h1 className="text-2xl">Signup</h1>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center justify-start gap-4 border border-grayColor p-2 w-full">
              <p className="border-r border-grayColor px-2 text-grayColor">
                +91
              </p>
              <input
                placeholder="Mobile Number"
                inputMode="tel"
                maxLength={10}
                value={mobileNumber}
                onChange={(e) => {
                  e.preventDefault();
                  setMobileNumber(e.target.value);
                }}
                className="text-sm focus:outline-none"
              />
            </div>
            <div className="flex flex-row flex-wrap text-xs text-grayColor font-semibold gap-1">
              <p>By continuing , I agreed to </p>
              <p className="text-orange">Terms of use</p>
              <p>&</p>
              <p className="text-orange"> Privacy policy</p>
            </div>
          </div>

          <button
            className="bg-darkBlue text-white text-base rounded-md w-full py-2"
            onClick={handleSendOtp}
          >
            Continue
          </button>
        </div>
      )}

      {progress == 1 && (
        <div className={styles.form} style={{ minHeight: "60vh" }}>
          <p className="text-xl font-semibold text-darkBlue ">
            One Time Password
          </p>

          <p className="text-md">
            Enter the 4-digit code sent to +91{mobileNumber}
          </p>

          <InputOTP maxLength={4} onChange={(value) => setOtp(value)}>
            <InputOTPGroup>
              <InputOTPSlot
                className="h-12 w-12 border-grayColor text-3xl"
                index={0}
              />
              <InputOTPSlot
                className="h-12 w-12 border-grayColor text-3xl"
                index={1}
              />
              <InputOTPSlot
                className="h-12 w-12 border-grayColor text-3xl"
                index={2}
              />
              <InputOTPSlot
                className="h-12 w-12 border-grayColor text-3xl"
                index={3}
              />
            </InputOTPGroup>
          </InputOTP>

          <div className="text-grayColor text-sm flex flex-row gap-2">
            <p>Didn't get a code ? </p>
            <button
              // className={`${isButtonDisabled ? "text-grayColor" : "text-brightOrange"} font-semibold`}
              className="text-brightOrange font-semibold"
              onClick={handleResendOtp}
              disabled={isButtonDisabled}
            >
              {isButtonDisabled ? `00:${timer}` : "Resend Code"}
            </button>
          </div>

          <button
            className="rounded-md w-full py-2 font-semibold bg-darkBlue text-white"
            onClick={handleOtpVerification}
          >
            Submit
          </button>
        </div>
      )}

      {newUser && (
        <div className={styles.form} style={{ minHeight: "40vh" }}>
          <div>
            <p className="text-xl text-darkBlue font-semibold">
              Enter your name
            </p>
            <p className="text-grayColor text-sm">
              Please let us know what we call the new member of our family
            </p>
          </div>

          <input
            placeholder="Enter your name"
            inputMode="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-searchBarColor p-2 px-4 rounded-md w-full"
          />

          <button 
          onClick={handleUsername}
          className="rounded-md w-full py-2 font-semibold bg-darkBlue text-white">
            Continue
          </button>
        </div>
      )}
      <Toaster />
    </div>
  );
}
