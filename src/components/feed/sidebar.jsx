"use client";
import styles from "@/styles/Home.module.css";
import Link from "next/link";
import Image from "next/image";
import img from "@/public/images/1.jpg";

import AuthContext from "@/context/authContext.js";
import { useContext, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FiLogOut } from "react-icons/fi";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";

export default function SideBar({closeDrawer}) {

  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const currentPath = usePathname();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogOut = () => {

    Cookies.remove('token');
    setIsLoggedIn(false);
  }

  const handleClick = () => {
    router.push('/login');
    closeDrawer();
  }


  console.log("loggedin status: ", isLoggedIn);
  console.log("current path is: ", currentPath);
  

  return (
    <div className="h-full flex flex-col place-content-between">
      <div className="text-grayColor text-base flex flex-col gap-4">
        {isLoggedIn ? (
          <div className={`${styles.sideBarItem} mb-4`}>
            
            <p className="text-xl text-black">Welcome ❤️✨</p>
            <p className="text-sm text-black">Explore and enjoy your shopping</p>
          </div>
        ) : (
          <div className="my-4">
            <p className="text-darkBlue text-xl">Namaste Ji 🙏</p>
            <p className="text-sm  text-darkBlue">
              To interact and shop please
            </p>
              <button
              onClick={handleClick}
              className="rounded-xl font-semibold w-full py-2 shadow-lg my-4 border-2 border-darkBlue text-darkBlue">
                Login / Signup
              </button>
          </div>
        )}
        <div onClick={closeDrawer}>
          <Link href={"/"}>
            <p className={`px-4 ${currentPath === '/' && 'bg-darkBlue text-white rounded-xl py-2 font-semibold'}`}>
              Product Feed
            </p>
          </Link>
        </div>
        {/* <div onClick={closeDrawer}>
          <Link href={"/user/favourites"}>
            <p className={`px-4 ${currentPath === '/user/favourites' && 'bg-darkBlue text-white rounded-xl py-2 font-semibold'}`}>Favourites</p>
          </Link>
        </div>
        <div onClick={closeDrawer}>
          <Link href={"/user/orders"}>
            <p className={`px-4 ${currentPath === '/user/orders' && 'bg-darkBlue text-white rounded-xl py-2 font-semibold'}`}>Orders</p>
          </Link>
        </div>
        <div onClick={closeDrawer}>
          <Link href={"/user/profile"}>
            <p className={`px-4 ${currentPath === '/user/profile' && 'bg-darkBlue text-white rounded-xl py-2 font-semibold'}`}>Profile</p>
          </Link>
        </div>
        <div onClick={closeDrawer}>
          <Link href={"/user/notifications"}>
            <p className={`px-4 ${currentPath === '/user/notifications' && 'bg-darkBlue text-white rounded-xl py-2 font-semibold'}`}>Notifications</p>
          </Link>
        </div> */}
      </div>

      { isLoggedIn &&  <div className="flex flex-row gap-4 text-grayColor">
      <FiLogOut size={"1.5rem"}/>
        <button 
        onClick={handleLogOut}
        className="font-semibold text-grayColor">Log out</button>
      </div>}
    </div>
  );
}


