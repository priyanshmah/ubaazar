"use client";
import styles from "@/styles/Home.module.css";
import Image from "next/image";

import AuthContext from "@/context/authContext.js";
import { useContext, useState } from "react";
import { usePathname } from "next/navigation";
import { FiLogOut } from "react-icons/fi";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useRouter } from "nextjs-toploader/app";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Cross } from "lucide-react";
import { IoClose } from "react-icons/io5";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { TfiPackage } from "react-icons/tfi";
import { HiOutlineUserCircle } from "react-icons/hi";
import { CiUser } from "react-icons/ci";
import { GoPackage } from "react-icons/go";


export default function SideBar({ closeDrawer }) {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const currentPath = usePathname();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogOut = () => {
    Cookies.remove("token");
    setIsLoggedIn(false);
  };

  const handleClick = () => {
    router.push("/login");
    closeDrawer();
  };


  return (
    <div className="h-full flex flex-col place-content-between gap-4">
      <div>
      <div 
      onClick={closeDrawer}
      className="flex bg-black mb-2">
        <IoClose size={30} strokeWidth={0.5} className="text-white p-1"/>
      </div>
      <div className="text-darkGrayColor text-base flex flex-col gap-4">
        {isLoggedIn ? (
          <div className={`${styles.sideBarItem} mb-4`}>
            <p className="text-xl text-black">Welcome ❤️✨</p>
            <p className="text-sm text-black">
              Explore and enjoy your shopping
            </p>
          </div>
        ) : (
          <div className="bg-lightPink mx-2">
            <button
              onClick={handleClick}
              className="rounded-none font-medium text-lg w-full p-2 border border-black text-black"
            >
              Login / Signup
            </button>
          </div>
        )}
        <div className="pl-4 flex flex-col gap-2">
          <div
            onClick={() => {
              closeDrawer();
              router.push("/");
            }}
          >
            <p className="py-2 font-semibold border-b border-silver ">
              Home
            </p>
          </div>
          <div
            onClick={() => {
              closeDrawer();
              router.push("/collections/ethnic-wear");
            }}
          >
            <p className="py-2 font-semibold border-b border-silver ">
              Ethnic Wear
            </p>
          </div>
          <div
            onClick={() => {
              closeDrawer();
              router.push("/collections/party-wear");
            }}
          >
            <p className="py-2 font-semibold border-b border-silver ">
              Party Wear
            </p>
          </div>
          <div
            onClick={() => {
              closeDrawer();
              router.push("/collections/daily-wear");
            }}
          >
            <p className="py-2 font-semibold border-b border-silver ">
              Daily Wear
            </p>
          </div>
          <div
            onClick={() => {
              closeDrawer();
              router.push("/collections/wedding-wear");
            }}
          >
            <p className="py-2 font-semibold border-b border-silver ">
              Wedding Wear
            </p>
          </div>
        </div>
      </div>
      </div>

     
        <div className="flex flex-col gap-2 p-2 text-sm font-normal text-grayColor">
          <div
          className="flex flex-row gap-2 items-center"
            onClick={() => {
              closeDrawer();
              router.push("/user/favourites");
            }}
          >
            <IoIosHeartEmpty size={30} className="text-grayColor p-1 bg-lightBackground rounded-full"/>
            <p>
              Favourites
            </p>
          </div>
          <div
                    className="flex flex-row gap-2 items-center"
            onClick={() => {
              closeDrawer();
              router.push("/user/orders");
            }}
          >
            <GoPackage size={30} className="text-grayColor p-1 bg-lightBackground rounded-full"/>
            <p>
              Track Order
            </p>
          </div>
          <div
                    className="flex flex-row gap-2 items-center"
            onClick={() => {
              closeDrawer();
              router.push("/user/profile");
            }}
          >
            <CiUser size={30} strokeWidth={0.75} className="text-grayColor p-1 bg-lightBackground rounded-full"/>
            <p>
              My account
            </p>
          </div>
        </div>
      
    </div>
  );
}
