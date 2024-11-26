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
import { FaRegCompass } from "react-icons/fa6";
import { FaTags } from "react-icons/fa6";
import { LuClapperboard } from "react-icons/lu";
import { MdOutlineFilterVintage } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { LuUser2 } from "react-icons/lu";
import { IoHeartCircle } from "react-icons/io5";
import { FiArrowLeft, FiMenu, FiShoppingBag } from "react-icons/fi";
import { PiCompassDuotone } from "react-icons/pi";
import { BsFlower1 } from "react-icons/bs";
import { CiShoppingTag } from "react-icons/ci";
import SideBar from "../feed/sidebar";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const pathName = usePathname();
  return (
    <div className="shadow-sm flex flex-row place-content-between w-full py-2 px-3">
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

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <input
        type="text"
        placeholder="Search for brands, products and more"
        value={query}
        onChange={handleInputChange}
        className="hidden md:py-2 min-h-10 pl-6 md:block searchBar text-sm w-full"
      />
      <IoSearch size="2rem" className="searchIcon" />
    </>
  );
};

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
        <FiMenu
          onClick={openDrawer}
          size="2rem"
          className="md:hidden"
          strokeWidth={1}
        />
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
    const storedBag = localStorage.getItem("bag") || [];
    if (storedBag) {
      let parsedBag = JSON.parse(storedBag);
      setBagQty(parsedBag.length);
    }
  }, []);

  return (
    <div className="flex flex-row w-full place-content-between items-center">
      <div className="flex flex-row gap-2 justify-center items-center">
        <Drawer />
        <button
          onClick={() => router.push("/")}
          className="flex flex-row font-serif text-2xl items-center md:text-4xl"
        >
          <p className="text-orange">U</p>
          <p className="text-darkBlue">Baazar</p>
        </button>
      </div>

      {/* <div className="hidden w-1/3 text-xs font-semibold text-center md:flex md:flex-row md:justify-center md:text-xs  md:gap-6 ">
        <div
          className={`flex flex-col justify-center items-center gap-2 ${
            clickedState === 1 ? "text-brightOrange" : ""
          }`}
          onClick={() => setClickedState(1)}
        >
          <PiCompassDuotone size={30} strokeWidth={2} />
          <p className={` ${clickedState === 1 ? "text-brightOrange" : ""}`}>
            Explore
          </p>
        </div>

        <div
          className={`flex flex-col justify-center items-center gap-2 ${
            clickedState === 4 ? "text-brightOrange" : ""
          }`}
          onClick={() => setClickedState(4)}
        >
          <LuClapperboard size={30} strokeWidth={1.5} />
          <p className={` ${clickedState === 4 ? "text-brightOrange" : ""}`}>
            Watch & Buy
          </p>
        </div>

        <div
          className={`flex flex-col justify-center items-center gap-2 ${
            clickedState === 3 ? "text-brightOrange" : ""
          }`}
          onClick={() => setClickedState(3)}
        >
          <BsFlower1 size={30} />
          <p className={` ${clickedState === 3 ? "text-brightOrange" : ""}`}>
            New Arrival
          </p>
        </div>

        <div
          className={`flex flex-col justify-center items-center gap-2 ${
            clickedState === 2 ? "text-brightOrange" : ""
          }`}
          onClick={() => setClickedState(2)}
        >
          <CiShoppingTag size={30} strokeWidth={0.5} />
          <p className={`${clickedState === 2 ? "text-brightOrange" : ""}`}>
            Best Seller
          </p>
        </div>
      </div> */}

      {/* <div className="flex flex-row mx-5 gap-4 "> */}
      {/* <div className="outline-none border-none">
          <Profile />
          </div>
          
          
          <div className="colourChangeOnHover">
          <IoHeartCircle className="text-pink" size={30} />
          <p className="navbarItemText">Favourites</p>
          </div> */}
      <div className="flex flex-row place-content-end items-center w-2/5 lg:w-2/3 gap-4">
        <SearchBar />
        <button onClick={() => router.push("/bag")}>
          <div className="flex flex-col relative">
            <FiShoppingBag size="1.5rem" />
            <p className="hidden md:block md:navbarItemText">Bag</p>
            {bagQty > 0 && (
              <p className="text-white font-sans bg-brightOrange rounded-full text-xs h-4 w-4 flex flex-row justify-center items-center font-semibold absolute -top-2 -right-2">
                {bagQty}
              </p>
            )}
          </div>
        </button>
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
