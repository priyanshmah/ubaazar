import { getProductById } from "@/lib/api";
import { notFound } from "next/navigation";
import { Toaster } from "react-hot-toast";
import Product from "@/components/products/product";
import Category from "@/components/feed/category";
import Rating from "@/components/products/rating";
import { HiOutlineHeart } from "react-icons/hi";
import { TbShoppingBag } from "react-icons/tb";
import BottomBar from "@/components/products/bottom-bar";

export async function generateMetadata({ params }) {
  const { slug, productId, category } = params;
  const product = await getProductById(productId);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "This product does not exist or has been removed.",
    };
  }

  return {
    title: `${product.productName} - Buy ${product.category} at Ubaazar`,
    description:
      product.description ||
      `Shop premium ${product.category} at unbeatable price`,
    openGraph: {
      title: `${product.name} - Buy ${product.category}`,
      description: product.description || `Shop premium ${product.category}.`,
      url: `https://ubaazar.com/${category}/${slug}/${productId}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} - Buy ${product.category} at Ubaazar`,
      description:
        product.description ||
        `Shop premium ${product.category} at unbeatable prices.`,
    },
  };
}

export default async function ProductPage({ params }) {
  const productId = params.productId;
  const product = await getProductById(productId);

  if (!product) {
    notFound();
  }


  return (
    <div className="scrollbar-hide">
      <div
        className={`flex flex-col bg-white gap-4  overflow-x-hidden lg:flex-row`}
      >
        <Product productData={product} />
        <Rating rating={product?.rating} />
      </div>
      <Toaster />
      <BottomBar />
    </div>
  );
}


