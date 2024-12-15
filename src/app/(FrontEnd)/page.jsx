import styles from "@/styles/Home.module.css";
import "@/styles/globals.css";
import Link from "next/link";
import Image from "next/image";
import img from "@/public/images/1.jpg";
import Sidebar from "@/components/feed/sidebar";
import Stories from "@/components/feed/stories";
import Post from "@/components/feed/post";
import MorePosts from "@/components/feed/more-post";
import dbConnect from "@/lib/dbConnect";
import axios from "axios";
import Loading from "@/app/loading";
import { Suspense } from "react";
import Category from "@/components/feed/category";



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
  const posts = await axios.post(`https://www.ubaazar.com/api/feed`, JSON.stringify({
    category: 'sarees'
  }));
  const { feed } = posts.data;

  return (
    <Suspense fallback={<Loading />}>
    <div className="overflow-x-clip">
      <div
        className="hidden lg:flex lg:w-1/3 p-4 lg:sticky lg:top-0"
        style={{ height: "100vh" }}
      >
        <Sidebar />
      </div>
      <Category feed={feed} searchBar={true} storiesSection={true}/>
    </div>
    </Suspense>
  );
}


