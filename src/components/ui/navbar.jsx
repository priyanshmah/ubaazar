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

import { useContext, useEffect, useState } from "react";
import Link from "next/link";

// importing icons
import { CiHeart, CiMenuBurger, CiSearch } from "react-icons/ci";

import { LuHeart, LuMenu, LuUser2 } from "react-icons/lu";
import { FiArrowLeft, FiGrid, FiMenu, FiShoppingBag } from "react-icons/fi";
import SideBar from "../feed/sidebar";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import ubaazarLogo from "@/public/icons/ubaazar.logo.svg";
import { Passion_One } from "next/font/google";

import { HiMenu, HiOutlineHeart, HiOutlineShoppingBag } from "react-icons/hi";
import { TbShoppingBag } from "react-icons/tb";
import AuthContext from "@/context/authContext";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useSelector } from "react-redux";

const passion = Passion_One({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export default function Navbar() {
  const pathName = usePathname();

  if (pathName === '/bag' || pathName === '/bag/pay') return <AnnouncementBar/>;
  else  return <HomeNavbar />;
}


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
        <div className="flex flex-row justify-center items-center ">
          <LuMenu
            onClick={openDrawer}
            size="1.5rem"
            className="md:hidden text-black"
            strokeWidth={1}
          />
        </div>
      </SheetTrigger>
      <SheetContent className="" side="left">
        <SideBar closeDrawer={closeDrawer} />
      </SheetContent>
    </Sheet>
  );
};

const AnnouncementBar = () => {
  return (
    <Carousel
        className="bg-lightPink text-darkGrayColor m-0 text-xs font-bold p-2 text-center"
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
      >
        <CarouselContent>
          <CarouselItem>FREE SHIPPING</CarouselItem>
          <CarouselItem>CASH ON DELIVERY</CarouselItem>
          <CarouselItem>Get ₹100 off on your first purchase</CarouselItem>
        </CarouselContent>
      </Carousel>
  )
}

const HomeNavbar = () => {
  const router = useRouter();
  const bag = useSelector(state => state.bag?.products);

  return (
    <div className="flex flex-col w-full">
      <AnnouncementBar />

      <div className="flex flex-row w-full py-2 px-4 place-content-between items-center">
        <div className="flex flex-row gap-2">
          <Drawer />
          <div>
            <CiSearch size={"1.5rem"} className="md:hidden text-black" />
          </div>
        </div>
        <div className="flex flex-col justify-start items-start">
          <button
            onClick={() => router.push("/")}
            className={`flex flex-row ${passion.className} text-3xl items-center md:text-4xl`}
          >
            <p className="text-brightOrange">U</p>
            <p className="text-darkBlue">BAAZAR</p>
          </button>
        </div>

        <div className="flex flex-row place-content-end items-center gap-2">
          {/* <SearchBar /> */}
          <HiOutlineHeart
            size={"1.5rem"}
            strokeWidth={1.25}
            className="text-darkBlue"
          />
          <button onClick={() => router.push("/bag")}>
            <div className="flex flex-col relative items-center justify-center">
              <TbShoppingBag
                strokeWidth={1.25}
                size="1.5rem"
                className="text-darkBlue"
              />
              {/* <p className="hidden md:block md:navbarItemText">Bag</p> */}
              {bag?.length > 0 && (
                <p className="text-white bg-black rounded-full text-xs h-4 w-4 flex flex-row justify-center items-center font-medium absolute -bottom-2 -right-2">
                  {bag?.length}
                </p>
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};


