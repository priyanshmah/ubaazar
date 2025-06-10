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
    <div className="h-full flex flex-col bg-lightPink gap-4">
      <div 
      onClick={closeDrawer}
      className="flex bg-black ">
        <IoClose size={25} className="text-white"/>
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
          <div className="bg-white mx-2">
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
              router.push("/");
            }}
          >
            <p className="py-2 font-semibold border-b border-silver ">
              Ethnic Wear
            </p>
          </div>
          <div
            onClick={() => {
              closeDrawer();
              router.push("/");
            }}
          >
            <p className="py-2 font-semibold border-b border-silver ">
              Party Wear
            </p>
          </div>
          <div
            onClick={() => {
              closeDrawer();
              router.push("/");
            }}
          >
            <p className="py-2 font-semibold border-b border-silver ">
              Daily Wear
            </p>
          </div>
          <div
            onClick={() => {
              closeDrawer();
              router.push("/");
            }}
          >
            <p className="py-2 font-semibold border-b border-silver ">
              Wedding Wear
            </p>
          </div>
        </div>
      </div>

      {isLoggedIn && (
        <div className="flex flex-row gap-4 text-grayColor">
          <FiLogOut size={"1.5rem"} />
          <Dialog>
            <DialogTrigger>
              <button className="font-semibold text-grayColor">Log out</button>
            </DialogTrigger>
            <DialogContent className="p-0 w-4/5">
              <DialogHeader className="p-4 gap-2">
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription className="font-mona text-xs">
                  Once you logout you are not able to see your data still do you
                  want it...
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <div className="flex flex-row text-lg font-semibold w-full">
                  <DialogClose className="w-1/2 text-center text-skyBlue p-2 border-t border-lightGrayColor">
                    Cancel
                  </DialogClose>
                  <DialogClose
                    onClick={handleLogOut}
                    className="w-1/2 text-center text-red p-2 border-t border-lightGrayColor border-l"
                  >
                    Logout
                  </DialogClose>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}
