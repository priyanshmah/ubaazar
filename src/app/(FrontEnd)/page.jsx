import styles from "@/styles/Home.module.css";
import "@/styles/globals.css";
import Link from "next/link";
import Image from "next/image";
import Sidebar from "@/components/feed/sidebar";
import Stories from "@/components/feed/stories";
import Post from "@/components/feed/post";
import MorePosts from "@/components/feed/more-post";
import dbConnect from "@/lib/dbConnect";
import axios from "axios";
import Loading from "@/app/loading";
import { Suspense } from "react";
import Category from "@/components/feed/category";
import Carousel from "@/components/feed/carousel";
import Explore from "@/components/feed/Explore";

import Banner from "@/public/images/banners/Welcome100.png";

export const metadata = {
  title:
    "Shop the premium and exclusive traditional Womens Sarees , Suits and Kurtis - Ubaazar",
  descripton:
    "Beautiful Collection of traditional Indian Sarees , Suits and women wear. Discover the ethnic and traditional wear of Indian women dresses",
  keywords:
    "ecommerce, online shopping, buy sarees, sarees for women, girls, design, online, draping, farewell, blouse, women party wear, blouse design",
  canonical: "https://www.ubaazar.com/",
};

export default async function Home() {
  const posts = await axios.post(
    `https://www.ubaazar.com/api/feed`,
    JSON.stringify({
      category: "sarees",
    })
  );
  const { feed } = posts.data;

  return (
    <Suspense fallback={<Loading />}>
      <div className="overflow-x-clip">
        <Carousel />
        <div className="w-full aspect-[3.09] relative my-4 py-4">
          <Image src={Banner} alt="Explore" fill className="object-cover" />
        </div>
        
        <Explore />
        <Category feed={feed} searchBar={true} storiesSection={true} />
      </div>
    </Suspense>
  );
}
