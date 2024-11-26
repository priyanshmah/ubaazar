"use client";
import Loading from "@/components/ui/loading";
import { Roboto } from "@next/font/google";
import axios from "axios";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FiCheck, FiX } from "react-icons/fi";

const roboto = Roboto({
  subsets: ["cyrillic"],
  weight: ["400"],
});

function Complaint() {
  const [complaint, setComplaint] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState({});
  const [complaintRaised, setComplaintRaised] = useState(false);

  const handleComplaint = async () => {
    if (!complaint || !contactInfo || !name) {
      toast.error("Please fill all field first");
      return;
    }

    else if (contactInfo.length !== 10 ) {
      toast.error("Invalid contact number");
      return;
    }

    setLoading(true);
    setComplaintRaised(true);

    try {
      const response = await axios.post("/api/raise-complaint", {
        complaint,
        contactInfo,
        name,
      });

      if (response.data.success)
        setResponse({
          success: true,
          complaintNumber: response.data.complaintNumber,
        });
      else setResponse({ success: false });
      setLoading(false);
    } catch (error) {
      toast.error("Something went wrong plz try again");
    } finally {
      setComplaint('');
      setContactInfo('');
      setName('');
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col p-4 my-4 gap-8">
      {!complaintRaised ? (
        <div className="flex flex-col gap-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-xl text-darkBlue font-semibold">
                  Enter your complaint
                </p>
                <p
                  className={`text-darkGrayColor text-xs font-medium font-mona`}
                >
                  Please bataiye hum aapki kaise help kar skte hai !!!
                </p>
              </div>
              <textarea
                type="text"
                rows={6}
                cols={50}
                maxLength={500}
                placeholder="Enter your complaint"
                value={complaint}
                className="bg-searchBarColor p-2 px-4 rounded-md resize-none"
                onChange={(e) => {
                  e.preventDefault();
                  setComplaint(e.target.value);
                }}
              />
            </div>
            <div className="flex flex-col">
              <p className="text-base text-darkBlue font-semibold">
                Contact number
              </p>

              <input
                placeholder="Contact number"
                inputMode="tel"
                value={contactInfo}
                maxLength={10}
                onChange={(e) => {
                  e.preventDefault();
                  setContactInfo(e.target.value);
                }}
                className="bg-searchBarColor p-2 px-4 rounded-md w-full"
              />
            </div>
            <div className="flex flex-col">
              <p className="text-base text-darkBlue font-semibold">Your name</p>

              <input
                placeholder="Enter your name"
                inputMode="text"
                value={name}
                maxLength={30}
                onChange={(e) => {
                  e.preventDefault();
                  setName(e.target.value);
                }}
                className="bg-searchBarColor p-2 px-4 rounded-md w-full"
              />
            </div>
          </form>
          <button
            onClick={handleComplaint}
            className="rounded-md w-full py-2 font-semibold bg-darkBlue text-white"
          >
            Continue
          </button>
        </div>
      ) : (
        <Response response={response} setComplaintRaised={setComplaintRaised} />
      )}

      <Toaster />
    </div>
  );
}

function Response({ response, setComplaintRaised }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 justify-center items-center rounded-xl  p-4">
        <div
        // className={`${
        //   response.success ? "bg-lightGreen" : "bg-rose-50"
        // } p-4 rounded-full`}
        >
          {response.success ? (
            <FiCheck
              className=" text-green border-2 border-green rounded-full p-2"
              size={"3rem"}
            />
          ) : (
            <FiX
              className="border-2 border-red text-red rounded-full p-2"
              size={"3rem"}
            />
          )}
        </div>
        {response.success ? (
          <div className="flex flex-col justify-between items-center text-center gap-2">
            <h1 className="text-xl text-green font-semibold">
              Complaint registered
            </h1>
            <p className="text-xl text-green font-mona">
              # {response.complaintNumber}
            </p>
            <div className="text-darkGrayColor text-xs ">
              We have successfully registered your complaint we will contact you
              within 24 hrs to 48 hrs on your given contact details
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center text-center gap-2">
            <h1 className="text-xl text-red font-semibold">
              Complaint cancelled
            </h1>
            <div className="text-darkGrayColor text-xs">
              Due to some technical reason we are not able to register your
              complaint please try after some time
            </div>
          </div>
        )}
      </div>

      <RaiseComplaintButton setComplaintRaised={setComplaintRaised} />
    </div>
  );
}

function RaiseComplaintButton({ setComplaintRaised }) {
  return (
    <button
      onClick={() => setComplaintRaised(false)}
      className="p-2 font-semibold text-darkBlue rounded-xl border border-dashed border-darkBlue text-center w-full text-base"
    >
      + Raise another complaint
    </button>
  );
}

export default Complaint;
