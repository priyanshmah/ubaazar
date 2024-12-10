"use client";
import { useContext, useState, useEffect } from "react";
import "@/styles/globals.css";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import AuthContext from "@/context/authContext.js";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation.js";
import Loading from "@/app/loading.jsx";
import { FiAlertCircle } from "react-icons/fi";
import { phoneNumberSchema } from "@/schemas/phoneNumberSchema.js";
import { Roboto } from "next/font/google";
import axios from "axios";
import Cookies from "js-cookie";

const roboto = Roboto({
  subsets: ["cyrillic"],
  weight: ["300", "400", "500", "700"],
});

export default function UserAuth() {
  const [mobileNumber, setMobileNumber] = useState("236");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [progress, setProgress] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [timer, setTimer] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [newUser, setNewUser] = useState(false);
  const router = useRouter();
  console.log("errors", errors);

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
    isLoggedIn && router.replace("/");
  }, []);

  const handleOtpVerification = async () => {
    setLoading(true);

    const response = await axios.post("/api/auth/verify-otp", JSON.stringify({
      mobileNumber,
      enteredOTP: otp,
    }));

    if (response.data?.success) {
      
      Cookies.set("access-token", response.data?.accessToken);
      Cookies.set("refresh-token", response.data?.refreshToken);

      setNewUser(response.data.newUser);
      setLoading(false);
      setTimer(0);
      setIsLoggedIn(true);

      toast.success("Logged in successfully", { duration: 5000 });
      if (!newUser) {
        router.push("/");
      }
    } else {
      const errorData = await res.json();
      const errorMessage = errorData.error;

      setLoading(false);
      toast.error(errorMessage, { duration: 5000 });
    }
  };

  const handleSendOtp = async () => {
    if (!mobileNumber) {
      toast.error("Mobile number is required");
      return;
    }
    try {
      await phoneNumberSchema.validate({ mobileNumber });
      setErrors({ ...errors, mobileNumber: "" });

      setLoading(true);
      setIsButtonDisabled(true);

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
        setTimer(30);
      } else {
        const errorData = await res.json();
        const errorMessage = errorData.error;

        setLoading(false);
        toast.error(errorMessage, { duration: 5000 });
      }
    } catch (error) {
      setErrors({ ...errors, mobileNumber: error.errors?.[0] });
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
    
    if (!name) {
      toast.error("Please enter your name");
      return ;
    }
    
    setLoading(true);
    let res = await fetch("/api/profile/update", {
      method: "POST",
      body: JSON.stringify({
        username: name,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const message = data.message;

      setLoading(false);
      toast.success(message, { duration: 5000 });
      router.push("/");
    } else {
      const errorData = await res.json();
      const errorMessage = errorData.error;

      setLoading(false);
      toast.error(errorMessage, { duration: 5000 });
    }
  };

  const handleMobileNumberChange = async (text) => {
    setMobileNumber(text);

    if (errors.mobileNumber) {
      try {
        await phoneNumberSchema.validate({ mobileNumber: text });
        setErrors({ ...errors, mobileNumber: "" });
      } catch (error) {
        setErrors({ ...errors, mobileNumber: error.errors?.[0] });
      }
    }
  };

  return (
    <div
      className="flex flex-col justify-center items-center"
      style={{ minHeight: "60vh" }}
    >
      {loading && <Loading />}
      {progress == 0 && (
        <div className="flex flex-col p-4 my-8 gap-8">
          <div className="flex flex-row gap-4 justify-start items-center text-darkGrayColor">
            <h1 className="text-2xl">Login</h1>
            <div className="text-xl text-orange">or</div>
            <h1 className="text-2xl">Signup</h1>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-1">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendOtp();
                }}
                className="flex flex-row items-center justify-start gap-4 border border-grayColor p-2 w-full"
              >
                <p className="border-r border-grayColor px-2 text-grayColor">
                  +91
                </p>
                <input
                  placeholder="Mobile Number"
                  inputMode="numeric"
                  maxLength={10}
                  value={mobileNumber}
                  onChange={(e) => {
                    e.preventDefault();
                    handleMobileNumberChange(e.target.value);
                  }}
                  className="text-sm focus:outline-none"
                />
              </form>
              {errors.mobileNumber && (
                <div
                  className={`flex flex-row items-center justify-start gap-2 text-red font-medium ${roboto.className}`}
                  style={{ fontSize: "0.6rem" }}
                >
                  <FiAlertCircle className="text-red" size={"0.85rem"} />
                  {errors.mobileNumber}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <div
                style={{ fontSize: "0.6rem" }}
                className={`flex flex-row flex-wrap text-grayColor font-medium gap-1 ${roboto.className}`}
              >
                <p>By continuing , I agreed to </p>
                <button
                  onClick={() => router.push("/terms-of-use")}
                  className="text-orange"
                >
                  Terms of use
                </button>
                <p>&</p>
                <button
                  onClick={() => router.push("terms-of-use")}
                  className="text-orange"
                >
                  Privacy policy
                </button>
              </div>
              <button
                className="bg-darkBlue text-white text-base font-semibold rounded-md w-full py-2"
                onClick={handleSendOtp}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {progress == 1 && (
        <div className="flex flex-col p-4 gap-8">
          <p className="text-xl font-semibold text-darkBlue ">
            One Time Password
          </p>
          <div className="flex flex-col gap-4">
            <p className={`text-sm `}>
              Enter the 4-digit code sent to +91{mobileNumber}
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleOtpVerification();
              }}
            >
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
            </form>
            <div
              className={`text-grayColor ${roboto.className} text-xs flex flex-row gap-2`}
            >
              <p>Didn&apos;t get a code ?</p>
              <button
                // className={`${isButtonDisabled ? "text-grayColor" : "text-brightOrange"} font-semibold`}
                className="text-brightOrange font-semibold"
                onClick={handleResendOtp}
                disabled={isButtonDisabled}
              >
                {isButtonDisabled ? `00:${timer}` : "Resend Code"}
              </button>
            </div>
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
        <div className='flex flex-col p-4 my-8 gap-8'>
          <div className="flex flex-col gap-1">
            <p className="text-xl text-darkBlue font-semibold">
              Enter your name
            </p>
            <p className={`text-grayColor text-xs ${roboto.className}`}>
              Please let us know what we call the new member of our family
            </p>
          </div>
        <div className="flex flex-col gap-6">
          <form onSubmit={(e) => {
            e.preventDefault();
            handleUsername();
          }}>

          <input
            placeholder="Enter your name"
            inputMode="text"
            value={name}
            maxLength={30}
            onChange={(e) => setName(e.target.value)}
            className="bg-searchBarColor p-2 px-4 rounded-md w-full"
            />

            </form>
          <button
            onClick={handleUsername}
            className="rounded-md w-full py-2 font-semibold bg-darkBlue text-white"
          >
            Continue
          </button>
          </div>
        </div>
      )}
      <Toaster />
    </div>
  );
}

