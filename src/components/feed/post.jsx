"use client";
import { useEffect, useRef, useState } from "react";
import styles from "@/styles/Home.module.css";
import img from "@/public/images/1.jpg";

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

const solway = Solway({
  subsets: ["latin"],
  weight: ["500"],
});

const roboto = Roboto({
  subsets: ['cyrillic'],
  weight: ['400', '500', '700', '900']
})

export default function ProductFeed({ feed }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [likeClicked, setLikeClicked] = useState(false);
  const [commentClicked, setCommentClicked] = useState(false);
  const [shareClicked, setShareClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  const [height, setHeight] = useState(500);
  const [width, setWidth] = useState(500);

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
          const words = value.description?.split(" ");

          const handleToggle = () => {
            setIsExpanded(!isExpanded);
          };

          return (
            <div
              className={`flex flex-col gap-2 pb-4 border-y-1 `}
              key={index}
            >
              <div className="flex flex-col gap-1">
                <div
                  className={`flex flex-row text-xl px-2 w-full ${solway.className}`}
                >
                  <p className="text-orange">U</p>
                  <p className="text-darkBlue">Baazar</p>
                </div>
                <div 
                onClick={() => handleBuyNow({ category: value.category, 
                  slug, id: value._id
                })}
                className={`${styles.imgContainer} hover:cursor-pointer`}>
                  <Image
                    src={value.images?.[0]}
                    height={300}
                    width={450}
                    style={{
                      objectFit: "contain",
                    }}
                    key={index}
                    onLoadingComplete={(img) => {
                      setHeight(img.naturalHeight);
                      setWidth(img.naturalWidth);
                    }}
                  />
                </div>

                <div className="flex flex-row w-full place-content-between px-2">
                  <p className="text-md font-semibold text-darkGrayColor w-4/5">
                    {value.productName}
                  </p>
                  <div className="flex flex-row text-xl font-semibold text-darkGrayColor justify-center items-center">
                    <p>₹</p>
                    <p>{value.price}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-row w-full px-2 place-content-between">
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
              {/* {value.description && (
                <div className="">
                  <p className={`whitespace-pre-line ${roboto.className} px-2 text-sm text-darkGrayColor`}>
                    {isExpanded
                      ? value.description
                      : words?.slice(0, 10)?.join(" ") + "..."}
                    {"  "}
                    {words?.length > 10 && (
                      <button
                        onClick={handleToggle}
                        className="font-semibold text-grayColor"
                      >
                        {isExpanded ? "less" : "more"}
                      </button>
                    )}
                  </p>
                </div>
              )} */}
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
