"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { useEffect, useState } from "react";
import Link from "next/link";

// importing icons
import { LuUser2 } from "react-icons/lu";
import { FiArrowLeft, FiGrid, FiMenu, FiShoppingBag } from "react-icons/fi";
import SideBar from "../feed/sidebar";
import { usePathname, useRouter } from "next/navigation";
import ubaazarLogo from '@/public/icons/ubaazar.logo.svg'
import { Passion_One } from "next/font/google";

import { HiMenu } from "react-icons/hi";
import { TbShoppingBag } from "react-icons/tb";


const passion = Passion_One({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '700', '900']
})

export default function Navbar() {
  const pathName = usePathname();
  return (
    <div className="flex flex-row place-content-between w-full py-2 px-3">
      {pathName === "/bag" ? (
        <CustomNavbar customText={"Shopping Bag"} />
      ) : pathName === "/bag/pay" ? (
        <CustomNavbar customText={"Payment"} />
      ) : pathName === "/user/favourites" ? (
        <CustomNavbar customText={"Favourites"} />
      ) : pathName === "/user/orders" ? (
        <CustomNavbar customText={"Orders"} />
      ) : (
        <HomeNavbar />
      )}
    </div>
  );
}


const Profile = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="colourChangeOnHover dropdown-trigger">
          <LuUser2 size={30} />
          <p className="navbarItemText">Profile</p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="rounded-lg shadow-md p-4">
        <DropdownMenuLabel className="text-darkBlue text-2xl font-sans ">
          Welcome❤️✨
        </DropdownMenuLabel>
        <p className="text-lg font-medium text-darkBlue font-sans px-2">
          To interact and shop please{" "}
        </p>
        <Link href={"/auth"}>
          <button className="button shadow-md my-4 bg-darkBlue font-sans text-white">
            Login / Signup
          </button>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Team</DropdownMenuItem>
        <DropdownMenuItem>Subscription</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Drawer = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const openDrawer = () => {
    setIsDrawerOpen(true);
  };

  return (
    <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <SheetTrigger>
        <div className="flex flex-row justify-center items-center rounded-xl shadow">

        <HiMenu
          onClick={openDrawer}
          size="2.5rem"
          className="md:hidden text-darkBlue p-2"
          />
          </div>
      </SheetTrigger>
      <SheetContent side="left">
        <SideBar closeDrawer={closeDrawer} />
      </SheetContent>
    </Sheet>
  );
};

const HomeNavbar = () => {
  const [bagQty, setBagQty] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const storedBag = localStorage.getItem("bag");
    // if (storedBag) {
    //   let parsedBag = JSON.parse(storedBag) || [];
    //   setBagQty(parsedBag.length);
    // }
  }, []);

  return (
    <div className="flex flex-col w-full gap-4">
    <div className="flex flex-row w-full place-content-between items-center">
        <Drawer />
      <div className="flex flex-col justify-start items-start">
        <button
          onClick={() => router.push("/")}
          className={`flex flex-row ${passion.className} text-3xl items-center md:text-4xl`}
        >
          <p className="text-brightOrange">U</p>
          <p className="text-darkBlue">BAAZAR</p>
        </button>
      </div>

      
      <div className="flex flex-row place-content-end items-center gap-4">
        {/* <SearchBar /> */}
        <button onClick={() => router.push("/bag")}>
          <div className="flex flex-col relative items-center justify-center rounded-xl shadow">
            <TbShoppingBag size="2.5rem" className="text-darkBlue p-2" />
            {/* <p className="hidden md:block md:navbarItemText">Bag</p> */}
            {bagQty > 0 && (
              <p className="text-white font-sans bg-brightOrange rounded-full text-xs h-4 w-4 flex flex-row justify-center items-center font-semibold absolute -top-2 -right-2">
                {bagQty}
              </p>
            )}
          </div>
        </button>
      </div>
    </div>
    </div>
  );
};

const CustomNavbar = ({ customText }) => {
  const router = useRouter();

  return (
    <div className="flex flex-row text-darkGrayColor gap-4 items-center text-lg">
      <FiArrowLeft onClick={() => router.back()} size={"1.5rem"} />
      {customText}
    </div>
  );
};
