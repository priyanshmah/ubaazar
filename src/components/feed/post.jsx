"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import Loading from "../../app/loading";
import { Passion_One } from "next/font/google";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import Lottie from "lottie-react";
import saleAnimation from "@/public/animations/sale.json";
import { HiOutlineHeart } from "react-icons/hi";

const passion = Passion_One({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700", "900"],
});

export default function ProductFeed() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const productArray = useSelector((state) => state.productArray);

  const router = useRouter();

  console.log("productArray is: ", productArray[0]);

  const handleBuyNow = ({ category, slug, id }) => {
    setLoading(true);
    
    router.push(`/${category}/${slug}/${id}`);
  };

  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  return (
    <div className="w-full">
      {loading && <Loading />}
      <div className="grid grid-cols-2 gap-1">
        {productArray?.map((value, index) => {
          const slug = stringToSlug(value.productName);
          const fullStars = Math.floor(value.rating);
          const halfStar = value.rating - fullStars;
          const discount = value.mrp ? value.mrp - value.price : 0;
          const discountPercentage = value.mrp
            ? Math.round((discount / value.mrp) * 100)
            : 50;

          return (
            <div className={`flex flex-col w-full gap-2`} key={index}>
              <div
                onClick={() =>
                  handleBuyNow({
                    category: value.category,
                    slug,
                    id: value._id,
                  })
                }
                className={`hover:cursor-pointer w-full aspect-[3/4] relative`}
              >
                <Image
                  src={value.images[0]}
                  alt={value.productName}
                  fill
                  className="object-cover rounded-none"
                />
              </div>

              <div className=" w-full flex flex-col px-1  text-darkGrayColor">
                <div>
                  <p className="text-md font-semibold line-clamp-2 leading-none">
                    {value.productName}
                  </p>
                  <div className="flex flex-row place-content-between">
                    <div className="flex flex-row gap-2">
                      <div className="flex flex-row text-xl bg-yellowColor font-semibold justify-center items-center">
                        <p>₹</p>
                        <p>{value.price}</p>
                      </div>
                      <div className="flex flex-row text-md text-silver line-through font-normal justify-center items-center">
                        <p>₹</p>
                        <p>{value.mrp || value.price * 1.5}</p>
                      </div>
                    </div>
                    <HiOutlineHeart
                      strokeWidth={1.25}
                      size={20}
                      className="text-black"
                    />
                  </div>
                  <div className="flex flex-row place-content-between mt-1">
                    <div className="bg-darkGreen justify-center py-0 px-2 items-center w-fit rounded text-white flex flex-row gap-1">
                      {value.rating}
                      <FaStar size={12} color="white" />
                    </div>
                    <div className="bg-pink text-white rounded-md text-xs font-semibold px-2 py-1">
                      Save {discountPercentage}%
                    </div>
                  </div>
                </div>
              </div>


              <div className="px-1 mb-2">
                <button className="bg-white text-black w-full rounded-full text-sm  font-medium p-2 border border-black">
                  Add to Bag
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function stringToSlug(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
