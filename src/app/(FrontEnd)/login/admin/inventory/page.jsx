"use client";

import Loading from "@/app/loading";
import axios from "axios";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FiEdit } from "react-icons/fi";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoCloseCircle } from "react-icons/io5";
import useSWR from "swr";

const fetcher = async (url, params) => {
  const response = await axios.post(url, params);
  return response.data?.products;
};

export default function InventoryPage() {
  const [selectedCategory, setSelectedCategory] = useState("sarees");
  const [isCategoryChanging, setIsCategoryChanging] = useState(false);
  const [editClicked, setEditClicked] = useState(false);
  const [productData, setProductData] = useState([]);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);

  const { data, error, isLoading } = useSWR(
    isCategoryChanging
      ? null
      : [
          "/api/auth/admin/products",
          { page, limit: 15, category: selectedCategory },
        ],
    ([url, params]) => fetcher(url, params),
    { revalidateOnFocus: false }
  );

  useEffect(() => {
    if (data) {
      setProductData((prev) => {
        const uniqueProducts = [
          ...prev,
          ...data.filter((product) => !prev.some((p) => p._id === product._id)),
        ];
        return uniqueProducts;
      });
    }
  }, [data]);

  useEffect(() => {
    setIsCategoryChanging(true);
    setProductData([]);
    setPage(1);
    setTimeout(() => setIsCategoryChanging(false), 0);
  }, [selectedCategory]);

  console.log("product data: ", productData);

  const setField = (id, fieldName, fieldValue) => {
    let updatedProductData = productData.map((value) => {
      if (value._id === id) value[fieldName] = fieldValue;
      return value;
    });
    if (updatedProductData) setProductData(updatedProductData);
  };

  const handleUpdateProductDetails = async (productId) => {
    let productDataToBeUpdated = productData.find((value) => {
      return value._id === productId;
    });

    if (!productDataToBeUpdated) {
      toast.error("Invalid product");
      return;
    }
    setLoading(true);

    try {
      const response = await axios.post(
        "/api/auth/admin/products/edit",
        JSON.stringify({
          productId,
          data: productDataToBeUpdated,
          category: productDataToBeUpdated?.category,
        })
      );

      if (response.data?.success) {
        toast.success("Product updated successfully");
      } else {
        toast.error(response.data?.message || "Product updation failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally{
      setEditClicked(false);
      setLoading(false);
    }
  };

  const deleteImage = async (productId, imageUrl) => {
    try {
      setLoading(true)
      const response = await axios.post(
        "/api/auth/admin/products/delete-image",
        JSON.stringify({
          productId,
          imageUrl,
        })
      );

      if (response.data.success) {
        toast.success("Image deleted successfully");
      } else {
        toast.error("Image not deleted");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false)
    }
  };

  if(loading || isLoading) return <Loading />

  const total = 32;

  return (
    <div className="flex flex-col w-full gap-4 justify-center items-center p-2 lg:w-1/2">
      <h1 className="font-semibold font-mona text-lg text-darkBlue">
        Inventory Management System
      </h1>

      <div className="flex flex-row gap-4 place-content-around items-center w-full text-base font-semibold text-brightOrange">
        <div
          onClick={() => setSelectedCategory("sarees")}
          className={
            selectedCategory === "sarees"
              ? selectedCategoryStyle
              : "py-1 w-1/2 text-center"
          }
        >
          Sarees
        </div>
        <div
          onClick={() => setSelectedCategory("suits")}
          className={
            selectedCategory === "suits"
              ? selectedCategoryStyle
              : "py-1 w-1/2 text-center"
          }
        >
          Suits and Kurtas
        </div>
      </div>
      <h2 className="font-semibold text-grayColor">
        Total {selectedCategory} : {total}
      </h2>
      {productData.length > 0 &&
        productData?.map((value, index) => {
          const {
            _id,
            productName,
            category,
            description,
            price,
            images,
            video,
            variants,
            __v,
            sizes,
            ...productDetails
          } = value;
          return (
            <div
              key={index}
              className="p-2 border border-grayColor rounded-xl w-full relative"
            >
              <div className="h-6 w-6 rounded-full flex flex-row justify-center items-center text-white bg-brightOrange font-semibold absolute -top-1 -left-1">
                {index + 1}
              </div>

              <div className="flex flex-row place-content-between items-center text-sm border-b border-dashed border-darkGrayColor my-2 py-2">
                <p className="text-darkGrayColor font-semibold ">
                  Edit details
                </p>
                {editClicked ? (
                  <button 
                  onClick={() => handleUpdateProductDetails(_id)}
                  className="bg-skyBlue text-white font-semibold rounded-md py-1 px-4">
                    Save Changes
                  </button>
                ) : (
                  <FiEdit onClick={() => setEditClicked(true)} size={"1rem"} />
                )}
              </div>

              <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-row place-content-between items-center text-sm">
                  {editClicked ? (
                    <input
                      value={productName}
                      type="text"
                      onChange={(e) => {
                        e.preventDefault();
                        setField(_id, "productName", e.target.value);
                      }}
                      className="pl-2 bg-searchBarColor rounded-md text-grayColor font-medium"
                    />
                  ) : (
                    <h2 className="w-4/5 font-semibold">{productName}</h2>
                  )}
                  {editClicked ? (
                    <input
                      value={price}
                      type="text"
                      onChange={(e) => {
                        e.preventDefault();
                        setField(_id, "price", e.target.value);
                      }}
                      className="pl-2 bg-searchBarColor rounded-md text-grayColor font-medium"
                    />
                  ) : (
                    <h2 className="w-1/5 text-center font-semibold">
                      ₹{price}
                    </h2>
                  )}
                </div>
                <div className="flex flex-row flex-wrap gap-2">
                  {images?.map((img, key) => {
                    return (
                      <div key={key} className="relative">
                        <Image
                          src={img}
                          className="h-24 w-24 object-cover border border-grayColor rounded-xl"
                          height={300}
                          width={400}
                          alt={productName}
                        />
                        <IoCloseCircle
                          size={"1.2rem"}
                          className="bg-white text-red rounded-full absolute -top-1 -right-1"
                          onClick={() => deleteImage(_id, img)}
                        />
                      </div>
                    );
                  })}
                  <div className="h-24 w-24 flex flex-row items-center justify-center border border-grayColor border-dashed rounded-xl">

                  <CldUploadWidget
                    uploadPreset={"t3ftzbug"}
                  >
                    {({ open }) => (
                      <IoIosAddCircleOutline
                        onClick={() => open()}
                        size={"2rem"}
                        className="text-grayColor"
                      />
                    )}
                  </CldUploadWidget>
                  </div>
                </div>
                <BasicDetails
                  editDetails={editClicked}
                  productData={productDetails}
                  setProductData={setField}
                  id={_id}
                />
                {sizes && (
                  <SelectSize
                    defaultSize={sizes}
                    editDetails={editClicked}
                    setField={setField}
                    id={_id}
                  />
                )}
              </div>
            </div>
          );
        })}
    <Toaster />
    </div>
  );
}

const selectedCategoryStyle =
  "text-white bg-brightOrange py-1 px-4 rounded-xl text-base w-1/2 text-center";

function SelectSize({ setField, defaultSize, editDetails, id }) {
  const [sizes, setSizes] = useState({
    XS: { selected: false, quantity: "" },
    S: { selected: false, quantity: "" },
    M: { selected: false, quantity: "" },
    L: { selected: false, quantity: "" },
    XL: { selected: false, quantity: "" },
    XXL: { selected: false, quantity: "" },
    "3XL": { selected: false, quantity: "" },
    "4XL": { selected: false, quantity: "" },
    "5XL": { selected: false, quantity: "" },
  });

  useEffect(() => {
    defaultSize?.map((value) => {
      if (value.quantity > 0) sizes[value.size].selected = true;
      sizes[value.size].quantity = value.quantity;
    });
  }, []);

  useEffect(() => {
    const selectedSizes = Object.keys(sizes)
      .filter((size) => sizes[size].selected)
      .map((size) => ({
        size: size,
        quantity: sizes[size].quantity,
      }));

    setField(id, "sizes", selectedSizes);
  }, [sizes]);

  // Handle checkbox toggle for selecting sizes
  const handleSizeChange = (size) => {
    setSizes((prevState) => ({
      ...prevState,
      [size]: {
        ...prevState[size],
        selected: !prevState[size].selected,
      },
    }));
  };

  const handleQuantityChange = (size, quantity) => {
    setSizes((prevState) => ({
      ...prevState,
      [size]: {
        ...prevState[size],
        quantity: quantity,
      },
    }));
  };

  return (
    <form className="text-xs">
      <h3 className="min-w-36">Inventory</h3>
      {Object.keys(sizes).map((size) => (
        <div className="flex flex-row place-content-between my-1" key={size}>
          <div className="flex flex-row gap-2">
            <input
              type="checkbox"
              checked={sizes[size]?.selected}
              onChange={(e) => handleSizeChange(size)}
            />
            <p>{size}</p>
          </div>
          {sizes[size]?.selected && (
            <div className="flex flex-row gap-1 text-xs">
              <p> Qty</p>
              <input
                type="number"
                value={sizes[size]?.quantity}
                onChange={(e) => handleQuantityChange(size, e.target.value)}
                placeholder="Qty"
                min="1"
                className="w-8 bg-searchBarColor rounded-lg pl-2"
              />
            </div>
          )}
        </div>
      ))}
    </form>
  );
}

const BasicDetails = ({ editDetails, productData, setProductData, id }) => {
  return (
    <div className="flex flex-col w-full gap-4 p-2">
      <h3 className="">Product Details</h3>
      <div className="text-xs font-semibold flex flex-col w-full gap-1">
        {Object.keys(productData).map((value, index) => {
          return (
            <div
              key={index}
              className="flex flex-row place-content-between items-center"
            >
              <p>{value}</p>
              {editDetails ? (
                <input
                  value={productData[value]}
                  type="text"
                  onChange={(e) => {
                    e.preventDefault();
                    setProductData(id, value.toString(), e.target.value);
                  }}
                  className="pl-2 bg-searchBarColor rounded-md text-grayColor font-medium"
                />
              ) : (
                <p className="text-grayColor font-medium">
                  {productData[value]}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
