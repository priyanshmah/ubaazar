import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import styles from "@/styles/Product.module.css";
import "@/styles/globals.css";


import ImagesCrousel from "@/components/products/image-crousel";

import Image from "next/image";
import { getProductById } from "@/lib/api";
import { notFound } from "next/navigation";
import MorePosts from "@/components/feed/more-post";
import { Toaster } from "react-hot-toast";
import ProductDetails from "@/components/products/product-details";


export async function generateMetadata({ params }) {
  const { slug, productId, category } = params;
  const product = await getProductById(productId); 

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'This product does not exist or has been removed.',
    };
  }

  return {
    title: `${product.productName} - Buy ${product.category} at Ubaazar`,
    description: product.description || `Shop premium ${product.category} at unbeatable price`,
    openGraph: {
      title: `${product.name} - Buy ${product.category}`,
      description: product.description || `Shop premium ${product.category}.`,
      url: `https://ubaazar.com/${category}/${slug}/${productId}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} - Buy ${product.category} at Ubaazar`,
      description: product.description || `Shop premium ${product.category} at unbeatable prices.`,
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
    <div>
      <div className={`flex flex-col ${styles.mainContainer} gap-8 lg:flex-row`}>
        <ImagesCrousel variants={product?.variants}/>
        <ProductDetails productData={product} />
      </div> 
      <Toaster />
      {/* <MorePosts /> */}
    </div>
  );
}


