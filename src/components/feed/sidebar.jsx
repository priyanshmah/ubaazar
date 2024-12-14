"use client";
import styles from "@/styles/Home.module.css";
import Image from "next/image";

import AuthContext from "@/context/authContext.js";
import { useContext, useState } from "react";
import { usePathname } from "next/navigation";
import { FiLogOut } from "react-icons/fi";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useRouter } from 'nextjs-toploader/app'

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

  console.log("loggedin status: ", isLoggedIn);
  console.log("current path is: ", currentPath);

  return (
    <div className="h-full flex flex-col place-content-between">
      <div className="text-darkGrayColor text-base flex flex-col gap-4">
        {isLoggedIn ? (
          <div className={`${styles.sideBarItem} mb-4`}>
            <p className="text-xl text-black">Welcome ❤️✨</p>
            <p className="text-sm text-black">
              Explore and enjoy your shopping
            </p>
          </div>
        ) : (
          <div className="my-4">
            <p className="text-darkBlue text-xl">Namaste Ji 🙏</p>
            <p className="text-sm  text-darkBlue">
              To interact and shop please
            </p>
            <button
              onClick={handleClick}
              className="rounded-xl font-semibold w-full py-2 shadow-lg my-4 border-2 border-darkBlue text-darkBlue"
            >
              Login / Signup
            </button>
          </div>
        )}
        <div
          onClick={() => {
            closeDrawer();
            router.push("/");
          }}
        >
          <p
            className={`px-4 font-semibold ${
              currentPath === "/" &&
              "bg-darkBlue text-white rounded-xl py-2"
            }`}
          >
            Product Feed
          </p>
        </div>

        <div
          onClick={() => {
            closeDrawer();
            router.push("/user/favourites");
          }}
        >
          <p
            className={`px-4 font-semibold ${
              currentPath === "/user/favourites" &&
              "bg-darkBlue text-white rounded-xl py-2"
            }`}
          >
            Favourites
          </p>
        </div>
        <div
          onClick={() => {
            closeDrawer();
            router.push("/user/orders");
          }}
        >
          <p
            className={`px-4 font-semibold ${
              currentPath === "/user/orders" &&
              "bg-darkBlue text-white rounded-xl py-2"
            }`}
          >
            Orders
          </p>
        </div>
       { isLoggedIn && <> <div
          onClick={() => {
            closeDrawer();
            router.push("/user/profile");
          }}
        >
          <p
            className={`px-4 font-semibold ${
              currentPath === "/user/profile" &&
              "bg-darkBlue text-white rounded-xl py-2 "
            }`}
          >
            Profile
          </p>
        </div>
        <div
          onClick={() => {
            closeDrawer();
            router.push("/user/notifications");
          }}
        >
          <p
            className={`px-4 font-semibold ${
              currentPath === "/user/notifications" &&
              "bg-darkBlue text-white rounded-xl py-2"
            }`}
          >
            Notifications
          </p>
        </div> </>}
        <div
          onClick={() => {
            closeDrawer();
            router.push("/user/complaint");
          }}
        >
          <p
            className={`px-4 font-semibold ${
              currentPath === "/user/complaint" &&
              "bg-darkBlue text-white rounded-xl py-2"
            }`}
          >
            Raise Complaint
          </p>
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
                  Once you logout you are not able to see your data still do
                  you want it...
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
