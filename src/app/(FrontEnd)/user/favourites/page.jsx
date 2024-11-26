"use client";
import React, { useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Favourites() {
  const [favourites, setFavourites] = useState([]);
  const router = useRouter();

  useEffect(() => {
    let storedFav = localStorage.getItem("favourites");
    if (storedFav) {
      setFavourites(JSON.parse(storedFav));
    }
  }, []);

  const handleDelete = (idToBeRemoved) => {
    let updatedFav = favourites.filter((value) => value.id !== idToBeRemoved);

    if (updatedFav) {
      localStorage.setItem("favourites", JSON.stringify(updatedFav));
      setFavourites(updatedFav);
    }
  };

  const handleBuyNow = ({ category, slug, id }) => {
    router.push(`/${category}/${slug}/${id}`);
  };

  return (
    <div className="p-2 flex flex-col gap-4 mb-10">
      
      {favourites.map((value, index) => {
        const slug = stringToSlug(value.productName);
        return (
          <div
            key={index}
            className="flex flex-col items-center justify-center"
          >
            <div className="flex flex-col justify-center gap-4 px-0 shadow pb-4 rounded-xl items-center">
              <div className="relative rounded-xl">
                <div className="flex flex-row gap-1 w-fit items-center absolute -top-2 -right-2 text-white bg-red rounded-full border-2 border-white">
                  <IoIosClose
                    size={"1.5rem"}
                    onClick={() => handleDelete(value.id)}
                  />
                </div>
                <Image
                  onClick={() =>
                    handleBuyNow({
                      category: "product",
                      slug,
                      id: value.id,
                    })
                  }
                  src={value.image}
                  height={400}
                  width={300}
                  className="object-cover rounded-t-2xl aspect-square"
                />
              </div>
              <div className="flex flex-row w-full place-content-between p-4 gap-4">
                <div className="w-2/3">
                  <p className="text-sm text-darkGrayColor font-semibold">
                    {value.productName}
                  </p>
                  <p className="flex flex-row gap-1 text-darkGrayColor font-normal text-lg">
                    <p>₹</p>
                    <p>{value.price}</p>
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleBuyNow({
                      category: "product",
                      slug,
                      id: value.id,
                    })
                  }
                  className="w-1/3 py-2 h-fit flex flex-col justify-center items-center bg-red rounded-xl text-white shadow-md font-semibold"
                >
                  Buy now
                </button>
              </div>
            </div>
          </div>
        );
      })}
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
