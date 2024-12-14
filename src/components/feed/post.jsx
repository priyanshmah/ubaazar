"use client";
import { useEffect, useRef, useState } from "react";
import styles from "@/styles/Home.module.css";

import { IoHeartOutline, IoHeart, IoPaperPlaneOutline } from "react-icons/io5";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import Loading from "../../app/loading";
import LayoutOne from "../layouts/one/layout_one";
import LayoutTwo from "../layouts/two/layout_two";
import LayoutThree from "../layouts/three/layout_three";
import LayoutFour1 from "../layouts/four/layout_four_a";
import LayoutFour2 from "../layouts/four/layout_four_b";
import { Passion_One } from "next/font/google";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

const passion = Passion_One({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700", "900"],
});

export default function ProductFeed({ feed }) {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  const router = useRouter();

  const handleBuyNow = ({ category, slug, id }) => {
    setLoading(true);
    router.push(`/${category}/${slug}/${id}`);
  };

  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  return (
    <div className="w-[85vw] md:w-2/3 lg:w-1/2">
      {loading && <Loading />}
      <div className="flex flex-col justify-center items-center gap-6 ">
        {feed.map((value, index) => {
          const slug = stringToSlug(value.productName);
          const fullStars = Math.floor(value.rating);
          const halfStar = value.rating - fullStars;

          return (
            <div className={`flex flex-col w-full`} key={index}>
              <div
                className={`flex flex-row ${passion.className} text-lg items-center`}
              >
                <p className="text-brightOrange">U</p>
                <p className="text-darkBlue">BAAZAR</p>
              </div>
              <div className="flex flex-col gap-1">
                <div
                  onClick={() =>
                    handleBuyNow({
                      category: value.category,
                      slug,
                      id: value._id,
                    })
                  }
                  className={`hover:cursor-pointer`}
                >
                  <ImageGrid images={value.images}  alt={value.productName}/>
                </div>

                <div className="flex flex-row px-2 place-content-between">
                  <p className="text-md font-semibold text-darkGrayColor w-4/5">
                    {value.productName}
                  </p>
                  <div className="flex flex-row text-xl font-semibold text-darkGrayColor justify-center items-center">
                    <p>₹</p>
                    <p>{value.price}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-row px-2 w-full items-center place-content-between">
                <div className="flex flex-row text-gold gap-1">
                  {Array.from({ length: fullStars }, (_, key) => (
                    <FaStar key={key} size={"1.2rem"} className="text-gold" />
                  ))}

                  {halfStar < 1 && (
                    <FaStarHalfAlt size={"1.2rem"} className="text-gold" />
                  )}
                  {halfStar == 1 && (
                    <FaStar size={"1.2rem"} className="text-gold" />
                  )}
                </div>
                <button
                  onClick={() =>
                    handleBuyNow({
                      category: value.category,
                      slug,
                      id: value._id,
                    })
                  }
                  className="px-8 py-2 font-semibold rounded-lg text-sm bg-red text-white shadow-md"
                >
                  Buy now
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

function ImageGrid({ images, alt }) {
  if (images.length === 1) return <LayoutOne images={images} alt={alt} />;
  else if (images.length === 3) return <LayoutThree images={images} alt={alt}/>;
  else return <LayoutTwo images={images} alt={alt}/>;
}

