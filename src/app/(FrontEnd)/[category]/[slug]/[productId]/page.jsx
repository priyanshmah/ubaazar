import { getProductById } from "@/lib/api";
import { notFound } from "next/navigation";
import { Toaster } from "react-hot-toast";
import Product from "@/components/products/product";
import Category from "@/components/feed/category";
import Rating from "@/components/products/rating";

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
    <div>
      <div
        className={`flex flex-col bg-white gap-4  overflow-x-hidden lg:flex-row`}
      >
        <Product productData={product} />
        <Rating rating={product?.rating} />
      </div>
      <div>
        <p className="font-sans text-xl font-medium p-4">
          More products you might love 💖
        </p>
        <Category SearchBar={false} storiesSection={false} />
      </div>
      <Toaster />
    </div>
  );
}
