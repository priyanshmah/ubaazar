"use client";
import { useEffect, useRef, useState } from "react";
import styles from "@/styles/Home.module.css";

import { Roboto, Solway } from "@next/font/google";
import {
  IoHeartOutline,
  IoHeart,
  IoChatboxOutline,
  IoPaperPlaneOutline,
} from "react-icons/io5";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Loading from "../ui/loading";
import LayoutOne from "../layouts/one/layout_one";
import LayoutTwo from "../layouts/two/layout_two";
import LayoutThree from "../layouts/three/layout_three";
import LayoutFour1 from "../layouts/four/layout_four_a";
import LayoutFour2 from "../layouts/four/layout_four_b";

const solway = Solway({
  subsets: ["latin"],
  weight: ["500"],
});

const roboto = Roboto({
  subsets: ["cyrillic"],
  weight: ["400", "500", "700", "900"],
});

export default function ProductFeed({ feed }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [likeClicked, setLikeClicked] = useState(false);
  const [commentClicked, setCommentClicked] = useState(false);
  const [shareClicked, setShareClicked] = useState(false);
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
    <div className="w-full my-4 md:w-2/3 lg:w-1/2">
      {loading && <Loading />}
      <div className="flex flex-col justify-center items-center gap-6 ">
        {feed.map((value, index) => {
          const slug = stringToSlug(value.productName);

          return (
            <div className={`flex flex-col border-t border-darkGrayColor w-full`} key={index}>
              <div className={`flex flex-row gap-1 font-semibold px-2 text-lg ${solway.className}`}>
                <p className="text-brightOrange">U</p>
                <p className="text-darkBlue">Baazar</p>
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
                  <ImageGrid images={value.images} />
                </div>

                <div className="flex flex-row px-2 place-content-between w-[100vw]">
                  <p className="text-md font-semibold text-darkGrayColor w-4/5">
                    {value.productName}
                  </p>
                  <div className="flex flex-row text-xl font-semibold text-darkGrayColor justify-center items-center">
                    <p>₹</p>
                    <p>{value.price}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-row px-2 w-full place-content-between">
                <div className="flex flex-row text-darkGrayColor gap-2">
                  <div className="font-semibold">
                    {!likeClicked && (
                      <IoHeartOutline
                        className="font-semibold"
                        size="1.8rem"
                        strokeWidth={2}
                        onClick={() => setLikeClicked((prev) => !prev)}
                      />
                    )}
                    {likeClicked && (
                      <IoHeart
                        size="1.8rem"
                        className="text-red"
                        onClick={() => setLikeClicked((prev) => !prev)}
                      />
                    )}
                  </div>
                  <div className={styles.icon}>
                    <IoPaperPlaneOutline
                      size="1.8rem"
                      className={styles.icon}
                    />
                  </div>
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

function ImageGrid({ images }) {
  if (images.length === 1) return <LayoutOne images={images} />;
  else if (images.length === 2) return <LayoutTwo images={images} />;
  else if (images.length === 3) return <LayoutThree images={images} />;
  else if (images.length === 4) {
    let number = Math.random();

    if (number > 0.5) return <LayoutFour1 images={images} />;
    else return <LayoutFour2 images={images} />;
  }
}
