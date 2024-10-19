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
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { FiX } from "react-icons/fi";

export default function UserAuth() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const [timer, setTimer] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
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
    isLoggedIn && router.replace("/");
  }, []);

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

  return (
    <div className="flex flex-col justify-center items-center">
      {loading && <Loading />}
      <PrivacyPolicy open={dialogOpen} setOpen={setDialogOpen} />
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
              <button
                onClick={() => setDialogOpen(true)}
                className="text-orange"
              >
                Terms of use
              </button>
              <p>&</p>
              <button
                onClick={() => setDialogOpen(true)}
                className="text-orange"
              >
                Privacy policy
              </button>
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
            className="rounded-md w-full py-2 font-semibold bg-darkBlue text-white"
          >
            Continue
          </button>
        </div>
      )}
      <Toaster />
    </div>
  );
}

const PrivacyPolicy = ({ open, setOpen }) => {
  return (
    <Dialog open={open}>
      <DialogContent className="h-4/5">
        <div className="p-4 overflow-y-auto">
          <div
            onClick={() => setOpen(false)}
            className="flex flex-row-reverse hover:cursor-pointer"
          >
            <FiX
              className="bg-red text-white rounded-full p-1"
              size={"1.5rem"}
            />
          </div>
          <h1 className="text-darkBlue text-xl font-semibold">
            Terms and Conditions
          </h1>
          <p className="text-xs text-grayColor text-justify">
            Terms & ConditionsThis document is an electronic record in terms of
            Information Technology Act, 2000 and rules there under as applicable
            and the amended provisions pertaining to electronic records in
            various statutes as amended by the Information Technology Act, 2000.
            This electronic record is generated by a computer system and does
            not require any physical or digital signatures.This document is
            published in accordance with the provisions of Rule 3 (1) of the
            Information Technology Rules, 2011 that require publishing the rules
            and regulations, privacy policy and Terms of Use for access or usage
            of domain name [ubaazar.com], including the related mobile site and
            mobile application The Platform is owned by Ubaazar , a company
            incorporated under the Companies Act, 1956 with its registered
            office at Mathura, Uttar Pradesh .Your use of the Platform and
            services and tools are governed by the following terms and
            conditions as applicable to the Platform including the applicable
            policies which are incorporated herein by way of reference. If You
            transact on the Platform, You shall be subject to the policies that
            are applicable to the Platform for such transaction. By mere use of
            the Platform, You shall be contracting with the Platform Owner and
            these terms and conditions including the policies constitute Your
            binding obligations, with Platform Owner. These Terms of Use relate
            to your use of our website, goods or services Any terms and
            conditions proposed by You which are in addition to or which
            conflict with these Terms of Use are expressly rejected by the
            Platform Owner and shall be of no force or effect. These Terms of
            Use can be modified at any time without assigning any reason. It is
            your responsibility to periodically review these Terms of Use to
            stay informed of updates.For the purpose of these Terms of Use,
            wherever the context so requires "you", “your” or "user" shall mean
            any natural or legal person who has agreed to become a user/buyer on
            the Platform.ACCESSING, BROWSING OR OTHERWISE USING THE PLATFORM
            INDICATES YOUR AGREEMENT TO ALL THE TERMS AND CONDITIONS UNDER THESE
            TERMS OF USE, SO PLEASE READ THE TERMS OF USE CAREFULLY BEFORE
            PROCEEDING.The use of Platform and/or availing of our Services is
            subject to the following Terms of Use:To access and use the
            Services, you agree to provide true, accurate and complete
            information to us during and after registration, and you shall be
            responsible for all acts done through the use of your registered
            account on the Platform.Neither we nor any third parties provide any
            warranty or guarantee as to the accuracy, timeliness, performance,
            completeness or suitability of the information and materials offered
            on this website or through the Services, for any specific purpose.
            You acknowledge that such information and materials may contain
            inaccuracies or errors and we expressly exclude liability for any
            such inaccuracies or errors to the fullest extent permitted by
            law.Your use of our Services and the Platform is solely and entirely
            at your own risk and discretion for which we shall not be liable to
            you in any manner. You are required to independently assess and
            ensure that the Services meet your requirements.The contents of the
            Platform and the Services are proprietary to us and are licensed to
            us. You will not have any authority to claim any intellectual
            property rights, title, or interest in its contents. The contents
            includes and is not limited to the design, layout, look and
            graphics.You acknowledge that unauthorized use of the Platform
            and/or the Services may lead to action against you as per these
            Terms of Use and/or applicable laws.You agree to pay us the charges
            associated with availing the Services.You agree not to use the
            Platform and/ or Services for any purpose that is unlawful, illegal
            or forbidden by these Terms, or Indian or local laws that might
            apply to you.You agree and acknowledge that website and the Services
            may contain links to other third party websites. On accessing these
            links, you will be governed by the terms of use, privacy policy and
            such other policies of such third party websites. These links are
            provided for your convenience for provide further information.You
            understand that upon initiating a transaction for availing the
            Services you are entering into a legally binding and enforceable
            contract with the Platform Owner for the Services.You shall
            indemnify and hold harmless Platform Owner, its affiliates, group
            companies and their respective officers, directors, agents, and
            employees, from any claim or demand, or actions including reasonable
            attorneys fees, made by any third party or penalty imposed due to or
            arising out of Your breach of this Terms of Use, privacy Policy and
            other Policies, or Your violation of any law, rules or regulations
            or the rights (including infringement of intellectual property
            rights) of a third party.In no event will the Platform Owner be
            liable for any indirect, consequential, incidental, special or
            punitive damages, including without limitation damages for loss of
            profits or revenues, business interruption, loss of business
            opportunities, loss of data or loss of other economic interests,
            whether in contract, negligence, tort or otherwise, arising from the
            use of or inability to use the Services, however caused and whether
            arising in contract, tort, negligence, warranty or otherwise, exceed
            the amount paid by You for using the Services giving rise to the
            cause of action or Rupees One Hundred (Rs. 100) whichever is
            lessNotwithstanding anything contained in these Terms of Use, the
            parties shall not be liable for any failure to perform an obligation
            under these Terms if performance is prevented or delayed by a force
            majeure event.These Terms and any dispute or claim relating to it,
            or its enforceability, shall be governed by and construed in
            accordance with the laws of India.All disputes arising out of or in
            connection with these Terms shall be subject to the exclusive
            jurisdiction of the courts in Uttar Pradesh All concerns or
            communications relating to these Terms must be communicated to us
            using the contact information provided on this website.
          </p>
          <h1 className="text-darkBlue text-xl font-semibold">
            Return and Refund
          </h1>
          <p className="text-grayColor text-xs text-justify">
            This RETURN AND REFUND policy outlines how you can cancel or seek a
            refund for a product / service that you have purchased through the
            Platform. Under this policy: Return will only be considered if the
            request is made 4 WORKING days of placing the order. However,
            cancellation requests may not be entertained if the orders have been
            communicated to such sellers / merchant(s) listed on the Platform
            and they have initiated the process of shipping them, or the product
            is out for delivery. In such an event, you may choose to reject the
            product at the doorstep. Company does not accept cancellation
            requests for perishable items like flowers, eatables, etc. However,
            the refund / replacement can be made if the user establishes that
            the quality of the product delivered is not good.In case of receipt
            of damaged or defective items, please report to our customer service
            team. The request would be entertained once the seller/ merchant
            listed on the Platform, has checked and determined the same at its
            own end. This should be reported within 10 days of receipt of
            products. In case you feel that the product received is not as shown
            on the site or as per your expectations, you must bring it to the
            notice of our customer service within 10 days of receiving the
            product. The customer service team after looking into your complaint
            will make an appropriate decision.In case of complaints regarding
            the products that come with a warranty from the manufacturers,
            please refer the issue to them.In case of any refunds approved by 3
            working days , it will take 7 working days for the refund.
          </p>
          <h1 className="text-darkBlue text-xl font-semibold">
            Shipping Policy
          </h1>
          <p className="text-xs text-grayColor text-justify">
            The orders for the user are shipped through registered domestic
            courier companies and/or speed post only. Orders are shipped within
            3 to 4 days from the date of the order and/or payment or as per the
            delivery date agreed at the time of order confirmation and
            delivering of the shipment, subject to courier company / post office
            norms. Platform Owner shall not be liable for any delay in delivery
            by the courier company / postal authority. Delivery of all orders
            will be made to the address provided by the buyer at the time of
            purchase. Delivery of our services will be confirmed on your email
            ID as specified at the time of registration. If there are any
            shipping cost(s) levied by the seller or the Platform Owner (as the
            case be), the same is not refundable. For any issues in utilizing
            our services you may contact our helpdesk on the number given in
            contact us{" "}
          </p>
          <h1 className="text-darkBlue text-xl font-semibold">
            Privacy Policy
          </h1>{" "}
          <p className="text-xs text-grayColor text-justify">
            <h2 className="text-darkBlue text-sm mt-4 font-semibold">
              Introduction
            </h2>
            At our website, we are committed to protecting your privacy. This
            Privacy Policy explains how we collect, use, disclose, and safeguard
            your information when you visit our website. Please read this
            privacy policy carefully. If you do not agree with the terms of this
            privacy policy, please do not access the site.
            <h2 className="text-darkBlue text-sm mt-4 font-semibold">
              Information
            </h2>
            We Collect Personal Data While using our website, we may ask you to
            provide us with certain personally identifiable information that can
            be used to contact or identify you. Personally identifiable
            information may include, but is not limited to: Name Email address
            Phone number Date of birth Payment information (when purchasing
            services) Non-Personal Data We may also collect non-personally
            identifiable information about you whenever you interact with our
            website. Non-personally identifiable information may include your
            browser type, the type of device you are using, your IP address, the
            pages you visit on our site, and other similar information.
            <h2 className="text-darkBlue text-sm mt-4 font-semibold">
              How we use your information
            </h2>
            We use the information we collect in the following ways: To provide,
            operate, and maintain our website. To improve, personalize, and
            expand our website. To understand and analyze how you use our
            website. To develop new products, services, features, and
            functionality. To communicate with you, either directly or through
            one of our partners, including for customer service, to provide you
            with updates and other information relating to the website, and for
            marketing and promotional purposes. To process your transactions and
            manage your orders. To send you emails. To find and prevent fraud.
            <h2 className="text-darkBlue text-sm mt-4 font-semibold">
              Sharing your information
            </h2>
            We do not sell, trade, or otherwise transfer to outside parties your
            Personally Identifiable Information unless we provide users with
            advance notice. This does not include website hosting partners and
            other parties who assist us in operating our website, conducting our
            business, or serving our users, so long as those parties agree to
            keep this information confidential. We may also release information
            when its release is appropriate to comply with the law, enforce our
            site policies, or protect ours or others rights, property or safety.
            <h2 className="text-darkBlue text-sm mt-4 font-semibold">
              Security of your information
            </h2>
            We use administrative, technical, and physical security measures to
            help protect your personal information. While we have taken
            reasonable steps to secure the personal information you provide to
            us, please be aware that despite our efforts, no security measures
            are perfect or impenetrable, and no method of data transmission can
            be guaranteed against any interception or other type of misuse.
            <h2 className="text-darkBlue text-sm mt-4 font-semibold">
              Cookies and Tracking Technologies
            </h2>
            We use cookies and similar tracking technologies to track the
            activity on our website and hold certain information. Cookies are
            files with a small amount of data which may include an anonymous
            unique identifier. Cookies are sent to your browser from a website
            and stored on your device. You can instruct your browser to refuse
            all cookies or to indicate when a cookie is being sent. However, if
            you do not accept cookies, you may not be able to use some portions
            of our website.
            <h2 className="text-darkBlue text-sm mt-4 font-semibold">
              Third Party Services
            </h2>
            Our website may contain links to third-party websites, products, and
            services. We do not control these third-party websites and are not
            responsible for their privacy policies or practices. We encourage
            you to review the privacy policies of any third-party websites you
            visit.
            <h2 className="text-darkBlue text-sm mt-4 font-semibold">
              Childrens Privacy
            </h2>
            Our website does not address anyone under the age of 13. We do not
            knowingly collect personally identifiable information from children
            under 13. If we become aware that we have collected personal
            information from a child under age 13 without verification of
            parental consent, we take steps to remove that information from our
            servers.
            <h2 className="text-darkBlue text-sm mt-4 font-semibold">
              Changes to this Privacy Policy
            </h2>
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page.
            You are advised to review this Privacy Policy periodically for any
            changes. Changes to this Privacy Policy are effective when they are
            posted on this page.
          </p>
          <div
            onClick={() => setOpen(false)}
            className="bg-red rounded-md px-2 py-1 text-white w-fit mt-4"
          >
            Close
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
