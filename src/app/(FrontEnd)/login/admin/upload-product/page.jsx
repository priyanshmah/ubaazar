"use client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import styles from "../../../../../../styles/admin/Upload-Product.module.css";
import "../../../../../../styles/globals.css";
import { useEffect, useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { FiInfo, FiTrash2 } from "react-icons/fi";
import { IoCloseCircle } from "react-icons/io5";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import {
  resetCategoryData,
  setCategoryData,
} from "@/redux/slice/product-type/productCategorySlice";
import { setDetails } from "@/redux/slice/productDetailSlice";
import axios from "axios";
import {
  addVariant,
  deleteVariant,
  resetVariants,
} from "@/redux/slice/product-type/productInventorySlice";
import { CldUploadWidget } from "next-cloudinary";
import toast, { Toaster } from "react-hot-toast";
import { RotatingLines } from "react-loader-spinner";

export default function UploadProductPage() {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [variants, setVariants] = useState({
    colour: "",
    images: [],
    inventory: null,
  });

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const productVariants = useSelector((state) => state.productVariants);
  const productCategoryData = useSelector((state) => state.productCategoryData);

  const uploadVariant = () => {
    dispatch(
      addVariant({
        newVariant: {
          colour: variants.colour,
          images: variants.images,
          inventory: variants.inventory,
        },
      })
    );
    setVariants({
      colour: "",
      images: [],
      inventory: "",
    });
  };

  const handleUpload = async () => {
    setLoading(true);
    try {
      const data = {
        productName,
        description,
        category,
        price,
        ...productCategoryData,
        ...productVariants,
      };

      if (
        !data.productName ||
        !data.description ||
        !data.category ||
        !data.price ||
        !productCategoryData ||
        !productVariants
      ) {
        toast.error("Please fill all fields first...", { duration: 5000 });
        return;
      }
      const response = await axios.post(
        "/api/upload-product",
        JSON.stringify(data)
      );

      if (response.status === 200) {
        toast.success("Product uploaded successfully", { duration: 5000 });
        setProductName("");
        setDescription("");
        setCategory("");
        setPrice("");
        resetVariants();
        resetCategoryData();
      } else {
        toast.error(`${response.statusText}`, { duration: 5000 });
      }
    } catch (error) {
      console.log(error);
      toast.error(`${error.response?.data?.error || error.message}`, {
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex flex-row w-full relative ">
        <p className="text-3xl font-semibold mt-4 px-4">Upload Product</p>
        <button
          className="button text-white bg-darkBlue"
          style={{
            position: "absolute",
            top: "20px",
            right: "2%",
          }}
          onClick={handleUpload}
        >
          {loading ? (
            <RotatingLines
              visible={true}
              height="30"
              width="30"
              color="grey"
              strokeWidth="5"
              animationDuration="0.75"
              ariaLabel="rotating-lines-loading"
            />
          ) : (
            <p>Upload</p>
          )}
        </button>
      </div>
      <div className="flex flex-row flex-wrap place-content-evenly">
        <Card className={styles.basicDetailsCard}>
          <CardContent>
            <form>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col">
                  <label htmlFor="name" className={styles.label}>
                    Name
                  </label>
                  <input
                    maxLength={50}
                    min={3}
                    type="text"
                    placeholder="Name of your product"
                    className={styles.input}
                    value={productName}
                    onChange={(e) => {
                      e.preventDefault();
                      setProductName(e.target.value);
                    }}
                  />
                </div>
                <div className="flex flex-col ">
                  <label htmlFor="description" className={styles.label}>
                    Description
                  </label>
                  <textarea
                    type="text"
                    rows={6}
                    cols={50}
                    maxLength={200}
                    placeholder="Description of your product"
                    value={description}
                    className={styles.input}
                    onChange={(e) => {
                      e.preventDefault();
                      setDescription(e.target.value);
                    }}
                  />
                </div>
                <div className="flex flex-col ">
                  <label htmlFor="price" className={styles.label}>
                    Price
                  </label>
                  <div className="flex flex-row gap-3 items-center">
                    <p className="text-lg">₹</p>
                    <input
                      max={10000}
                      step={"none"}
                      type="number"
                      value={price}
                      placeholder="Price"
                      className={styles.input}
                      onChange={(e) => {
                        e.preventDefault();
                        setPrice(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="flex flex-col ">
                  <label htmlFor="category" className={styles.label}>
                    Category
                  </label>
                  <Select
                    onValueChange={(value) => setCategory(value)}
                    value={category}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className={styles.popper} position="popper">
                      <SelectItem value="sarees" className={styles.popperItem}>
                        Sarees
                      </SelectItem>
                      <SelectItem value="suits" className={styles.popperItem}>
                        Suits & Kurtas
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
        {category.toLowerCase() === "sarees" && <SareesCard />}
        {category.toLowerCase() === "suits" && <SuitsCard />}
      </div>

      {/*  upload variant  */}
      <div className="flex flex-row w-full shadow-md p-6 mr-3 mt-3 rounded-2xl gap-5 h-fit">
        <div className="w-1/2">
          <div className="flex flex-row place-content-between items-center">
            <p className="text-2xl  font-semibold m-5">Upload Variants</p>
            <button
              htmlFor="upload"
              className="button text-lg bg-darkBlue text-white max-h-10"
              onClick={uploadVariant}
            >
              Add Variant
            </button>
          </div>
          <div className="flex flex-row">
            <div className="flex flex-col w-1/3">
              <label htmlFor="name" className={styles.label}>
                Colour
              </label>
              <input
                maxLength={50}
                min={3}
                type="text"
                placeholder="Colour"
                className={styles.input}
                value={variants.colour}
                onChange={(e) => {
                  e.preventDefault();
                  setVariants((prev) => ({
                    ...prev,
                    colour: e.target.value,
                  }));
                }}
                style={{
                  maxWidth: "100%",
                  padding: "8px",
                  paddingLeft: "16px",
                }}
              />
              {category === "suits" && <SelectSize setVariant={setVariants} />}
              {category === "sarees" && (
                <div>
                  <label className={styles.label}>Inventory</label>
                  <input
                    maxLength={50}
                    min={3}
                    type="number"
                    placeholder="Quantity"
                    className={styles.input}
                    value={variants.inventory}
                    onChange={(e) => {
                      e.preventDefault();
                      setVariants((prev) => ({
                        ...prev,
                        inventory: e.target.value,
                      }));
                    }}
                  />
                </div>
              )}
            </div>
            <div className="w-2/3 px-6 h-fit">
              <div className=" h-1/3 w-full border-2 border-dotted border-gray rounded-2xl flex flex-col justify-center items-center text-gray">
                <CldUploadWidget
                  uploadPreset={"t3ftzbug"}
                  onSuccess={(result) => {
                    setVariants((prev) => ({
                      ...prev,
                      images: [...prev.images, result.info.secure_url],
                    }));
                  }}
                >
                  {({ open }) => (
                    <IoIosAddCircleOutline
                      onClick={() => open()}
                      size={50}
                      className="cursor-pointer"
                    />
                  )}
                </CldUploadWidget>
                Add images upto 4 MB
              </div>
              <div className="flex flex-row flex-wrap gap-4 mt-4 ">
                {variants.images.map((value) => {
                  return (
                    <div className={styles.imageContainer}>
                      <Image
                        src={value}
                        fill
                        sizes="(max-width: 120px) ,(max-height: 120px)"
                        alt={`${productName} variant`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/2 gap-4">
          {productVariants.variants.map((value) => {
            const handleDeleteVariant = () => {
              dispatch(deleteVariant({ index: value.index }));
            };

            return (
              <div className="p-4 rounded-3xl shadow-lg">
                <div className="flex flex-row place-content-between text-gray">
                  <div className="flex flex-row gap-2 items-center">
                    <p className="text-xl font-semibold">Colour</p>
                    <p className="text-lg font-semibold bg-searchBarColor px-4 rounded-lg shadow-lg">
                      {value.colour}
                    </p>
                  </div>
                  <FiTrash2
                    size={30}
                    className="hover:text-darkGrayColor hover:cursor-pointer"
                    onClick={handleDeleteVariant}
                  />
                </div>
                <div className="flex flex-row place-content-between items-center">
                  <div className="flex flex-row flex-wrap gap-4 mt-4 w-4/5">
                    {value.images?.map((img) => {
                      return (
                        <div className={styles.imageContainer}>
                          <Image
                            src={img}
                            fill
                            sizes="(max-width: 120px) ,(max-height: 120px)"
                            alt={`${productName} variant`}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex flex-col w-20">
                    {category === "suits" &&
                      value.inventory?.map((value) => {
                        return (
                          <div className="flex flex-row place-content-between">
                            <p className="text-xl font-semibold">
                              {value.size}
                            </p>
                            <p className="text-xl">{value.quantity}</p>
                          </div>
                        );
                      })}
                    {category === "sarees" && (
                      <div className="flex flex-col">
                        <p className="text-xl font-semibold">Inventory</p>
                        <p className="text-lg">{value.inventory}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <VideoUpload />
      <Toaster />
    </div>
  );
}

function SareesCard() {
  const [border, setBorder] = useState("");
  const [pattern, setPattern] = useState("");
  const [washCare, setWashCare] = useState("");
  const [occasion, setOccasion] = useState("");
  const [blouseType, setBlouseType] = useState("");
  const [sareeFabric, setSareeFabric] = useState("");
  const [sareeLength, setSareeLength] = useState("");
  const [blouseLength, setBlouseLength] = useState("");
  const [blouseFabric, setBlouseFabric] = useState("");
  const [ornamentation, setOrnamentation] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    const productCategoryData = {
      border,
      pattern,
      washCare,
      occasion,
      blouseType,
      sareeFabric,
      sareeLength,
      blouseLength,
      blouseFabric,
      ornamentation,
    };
    dispatch(setCategoryData({ productCategoryData }));
  }, [
    border,
    pattern,
    washCare,
    occasion,
    blouseType,
    sareeFabric,
    sareeLength,
    blouseLength,
    blouseFabric,
    ornamentation,
  ]);

  return (
    <div className="flex flex-row flex-wrap place-content-evenly w-3/4">
      <Card className={styles.SareesCard}>
        <CardContent>
          <form className="flex flex-col gap-10">
            <div className="flex flex-col">
              <label htmlFor="name" className={styles.label}>
                Pattern
              </label>
              <input
                maxLength={50}
                min={3}
                type="text"
                placeholder="Lehariya or Solid"
                className={styles.input}
                onChange={(e) => {
                  e.preventDefault();
                  setPattern(e.target.value);
                }}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="name" className={styles.label}>
                Saree Fabric
              </label>
              <input
                maxLength={50}
                min={3}
                type="text"
                placeholder="Fabric"
                className={styles.input}
                onChange={(e) => {
                  e.preventDefault();
                  setSareeFabric(e.target.value);
                }}
              />
            </div>
            <div className="flex flex-col w-26">
              <label htmlFor="name" className={styles.label}>
                Saree Length
              </label>
              <Select onValueChange={(value) => setSareeLength(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className={styles.popper} position="popper">
                  <SelectItem value="5" className={styles.popperItem}>
                    5
                  </SelectItem>
                  <SelectItem value="5.1" className={styles.popperItem}>
                    5.1
                  </SelectItem>
                  <SelectItem value="5.2" className={styles.popperItem}>
                    5.2
                  </SelectItem>
                  <SelectItem value="5.3" className={styles.popperItem}>
                    5.3
                  </SelectItem>
                  <SelectItem value="5.4" className={styles.popperItem}>
                    5.4
                  </SelectItem>
                  <SelectItem value="5.5" className={styles.popperItem}>
                    5.5
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="name" className={styles.label}>
                Border
              </label>
              <Select onValueChange={(value) => setBorder(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className={styles.popper} position="popper">
                  <SelectItem value="No Border" className={styles.popperItem}>
                    No Border
                  </SelectItem>
                  <SelectItem value="Embroidered" className={styles.popperItem}>
                    Embroidered
                  </SelectItem>
                  <SelectItem value="Embellished" className={styles.popperItem}>
                    Embellished
                  </SelectItem>
                  <SelectItem value="Lace Border" className={styles.popperItem}>
                    Lace Border
                  </SelectItem>
                  <SelectItem value="Zari Border" className={styles.popperItem}>
                    Zari Border
                  </SelectItem>
                  <SelectItem value="Big Border" className={styles.popperItem}>
                    Big Border
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className={styles.SareesCard}>
        <CardContent>
          <form className="flex flex-col">
            <div className="mt-3 flex flex-col gap-14">
              <div className="flex flex-col">
                <label htmlFor="name" className={styles.label}>
                  Blouse Type
                </label>
                <Select onValueChange={(value) => setBlouseType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className={styles.popper} position="popper">
                    <SelectItem
                      value="Running Blouse"
                      className={styles.popperItem}
                    >
                      Running Blouse
                    </SelectItem>
                    <SelectItem
                      value="Seperate Blouse"
                      className={styles.popperItem}
                    >
                      Seperate Blouse
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col ">
                <label htmlFor="name" className={styles.label}>
                  Blouse Fabric
                </label>
                <input
                  maxLength={50}
                  min={3}
                  type="text"
                  placeholder="Blouse Fabric"
                  className={styles.input}
                  onChange={(e) => {
                    e.preventDefault();
                    setBlouseFabric(e.target.value);
                  }}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="name" className={styles.label}>
                  Blouse Length
                </label>
                <Select onValueChange={(value) => setBlouseLength(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className={styles.popper} position="popper">
                    <SelectItem value="0.8" className={styles.popperItem}>
                      0.8
                    </SelectItem>
                    <SelectItem value="0.9" className={styles.popperItem}>
                      0.9
                    </SelectItem>
                    <SelectItem value="1" className={styles.popperItem}>
                      1
                    </SelectItem>
                    <SelectItem value="1.1" className={styles.popperItem}>
                      1.1
                    </SelectItem>
                    <SelectItem value="1.2" className={styles.popperItem}>
                      1.2
                    </SelectItem>
                    <SelectItem value="1.3" className={styles.popperItem}>
                      1.3
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className={styles.SareesCard}>
        <CardContent>
          <form>
            <div className="mt-3 flex flex-col gap-14 place-content-start">
              <div className="flex flex-col">
                <label htmlFor="name" className={styles.label}>
                  Occasion
                </label>
                <Select onValueChange={(value) => setOccasion(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className={styles.popper} position="popper">
                    <SelectItem
                      value="Daily Wear"
                      className={styles.popperItem}
                    >
                      Daily Wear
                    </SelectItem>
                    <SelectItem
                      value="Party Wear"
                      className={styles.popperItem}
                    >
                      Party Wear
                    </SelectItem>
                    <SelectItem
                      value="Traditional"
                      className={styles.popperItem}
                    >
                      Traditional
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="name" className={styles.label}>
                  Ornamentation
                </label>
                <input
                  maxLength={50}
                  min={3}
                  type="text"
                  placeholder="Embroidered or Zari"
                  className={styles.input}
                  onChange={(e) => {
                    e.preventDefault();
                    setOrnamentation(e.target.value);
                  }}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="name" className={styles.label}>
                  Wash Care
                </label>
                <Select onValueChange={(value) => setWashCare(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className={styles.popper} position="popper">
                    <SelectItem value="Dry Clean" className={styles.popperItem}>
                      Dry Clean
                    </SelectItem>
                    <SelectItem value="Hand Wash" className={styles.popperItem}>
                      Hand Wash
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function SuitsCard() {
  const [topFabric, setTopFabric] = useState("");
  const [topShape, setTopShape] = useState("");
  const [topPattern, setTopPattern] = useState("");
  const [topLength, setTopLength] = useState("");
  const [neck, setNeck] = useState("");
  const [bottom, setBottom] = useState('');
  const [bottomFabric, setBottomFabric] = useState("");
  const [bottomType, setBottomType] = useState("");
  const [bottomPattern, setBottomPattern] = useState("");
  const [dupatta, setDupatta] = useState(false);
  const [dupattaLength, setDupattaLength] = useState("");
  const [dupattaFabric, setDupattaFabric] = useState("");
  const [ornamentation, setOrnamentation] = useState("");
  const [occasion, setOcassion] = useState("");
  const [washCare, setWashCare] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    const productCategoryData = {
      topFabric,
      topShape,
      topPattern,
      topLength,
      neck,
      bottom,
      bottomFabric,
      bottomType,
      bottomPattern,
      dupatta,
      dupattaLength,
      dupattaFabric,
      ornamentation,
      occasion,
      washCare,
    };
    dispatch(setCategoryData({ productCategoryData }));
  }, [
    topFabric,
    topShape,
    topPattern,
    topLength,
    neck,
    bottom,
    bottomFabric,
    bottomType,
    bottomPattern,
    dupatta,
    dupattaLength,
    dupattaFabric,
    ornamentation,
    occasion,
    washCare,
  ]);

  return (
    <div className="flex flex-row flex-wrap place-content-evenly w-3/4">
      <Card className={styles.SareesCard}>
        <CardContent>
          <form className="flex flex-col gap-10">
            <div className="flex flex-col">
              <label htmlFor="name">Top Fabric</label>
              <input
                maxLength={50}
                min={3}
                type="text"
                value={topFabric}
                placeholder="Cotton or Rayon"
                className={styles.input}
                onChange={(e) => {
                  e.preventDefault();
                  setTopFabric(e.target.value);
                }}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="name">Top Shape</label>
              <input
                maxLength={50}
                min={3}
                type="text"
                value={topShape}
                placeholder="Anarkali or Straight"
                className={styles.input}
                onChange={(e) => {
                  e.preventDefault();
                  setTopShape(e.target.value);
                }}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="name" className={styles.label}>
                Top Pattern
              </label>
              <input
                maxLength={50}
                min={3}
                type="text"
                value={topPattern}
                placeholder="Floral or Solid"
                className={styles.input}
                onChange={(e) => {
                  e.preventDefault();
                  setTopPattern(e.target.value);
                }}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="name" className={styles.label}>
                Top Length
              </label>
              <Select
                value={topLength}
                onValueChange={(value) => setTopLength(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className={styles.popper} position="popper">
                  <SelectItem
                    value="Thigh-Length"
                    className={styles.popperItem}
                  >
                    Thigh-Length
                  </SelectItem>
                  <SelectItem value="Knee-Length" className={styles.popperItem}>
                    knee-Length
                  </SelectItem>
                  <SelectItem value="Calf-Length" className={styles.popperItem}>
                    Calf-Length
                  </SelectItem>
                  <SelectItem value="Full-Length" className={styles.popperItem}>
                    Full-Length
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="name" className={styles.label}>
                Neck
              </label>
              <Select value={neck} onValueChange={(value) => setNeck(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className={styles.popper} position="popper">
                  <SelectItem value="V-Neck" className={styles.popperItem}>
                    V-Neck
                  </SelectItem>
                  <SelectItem value="Round-Neck" className={styles.popperItem}>
                    Round-Neck
                  </SelectItem>
                  <SelectItem value="Collar" className={styles.popperItem}>
                    Collar
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className={styles.SareesCard}>
        <CardContent>
          <form className="flex flex-col gap-10">
            <div className="flex flex-row place-content-between">
              <label>Bottom</label>
              <input
                maxLength={50}
                min={3}
                type="checkbox"
                placeholder="Cotton or Rayon"
                checked={bottom}
                onChange={(e) => {
                  setBottom(e.target.checked)
                }}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="name">Bottom Fabric</label>
              <input
                maxLength={50}
                min={3}
                type="text"
                placeholder="Cotton or Rayon"
                value={bottomFabric}
                className={styles.input}
                onChange={(e) => {
                  e.preventDefault();
                  setBottomFabric(e.target.value);
                }}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="name">Bottom Type</label>
              <input
                maxLength={50}
                min={3}
                type="text"
                value={bottomType}
                placeholder="Pant or Plazzo"
                className={styles.input}
                onChange={(e) => {
                  e.preventDefault();
                  setBottomType(e.target.value);
                }}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="name" className={styles.label}>
                Bottom Pattern
              </label>
              <input
                maxLength={50}
                min={3}
                type="text"
                value={bottomPattern}
                placeholder="Floral or Solid"
                className={styles.input}
                onChange={(e) => {
                  e.preventDefault();
                  setBottomPattern(e.target.value);
                }}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="name" className={styles.label}>
                Ornamentation
              </label>
              <input
                maxLength={50}
                min={3}
                type="text"
                value={ornamentation}
                placeholder="Lehariya or Floral"
                className={styles.input}
                onChange={(e) => {
                  e.preventDefault();
                  setOrnamentation(e.target.value);
                }}
              />
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className={styles.SareesCard}>
        <CardContent>
          <form className="flex flex-col gap-10">
          <div className="flex flex-row place-content-between">
              <label>Dupatta</label>
              <input
                maxLength={50}
                min={3}
                type="checkbox"
                value={dupatta}
                onChange={(e) => {                 
                 setDupatta(e.target.checked)
                }}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="name">Dupatta Fabric</label>
              <input
                maxLength={50}
                min={3}
                type="text"
                value={dupattaFabric}
                placeholder="Cotton or Rayon"
                className={styles.input}
                onChange={(e) => {
                  e.preventDefault();
                  setDupattaFabric(e.target.value);
                }}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="name" className={styles.label}>
                Dupatta Length
              </label>
              <Select 
              value={dupattaLength}
              onValueChange={(value) => setDupattaLength(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className={styles.popper} position="popper">
                  <SelectItem value="0.8" className={styles.popperItem}>
                    0.8
                  </SelectItem>
                  <SelectItem value="0.9" className={styles.popperItem}>
                    0.9
                  </SelectItem>
                  <SelectItem value="1" className={styles.popperItem}>
                    1
                  </SelectItem>
                  <SelectItem value="1.1" className={styles.popperItem}>
                    1.1
                  </SelectItem>
                  <SelectItem value="1.2" className={styles.popperItem}>
                    1.2
                  </SelectItem>
                  <SelectItem value="1.3" className={styles.popperItem}>
                    1.3
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="name" className={styles.label}>
                Ocassion
              </label>
              <Select 
              value={occasion}
              onValueChange={(value) => setOcassion(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className={styles.popper} position="popper">
                  <SelectItem value="Traditional" className={styles.popperItem}>
                    Traditional
                  </SelectItem>
                  <SelectItem value="Daily Wear" className={styles.popperItem}>
                    Daily Wear
                  </SelectItem>
                  <SelectItem value="Party Wear" className={styles.popperItem}>
                    Party Wear
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="name" className={styles.label}>
                Wash Care
              </label>
              <Select 
              value={washCare}
              onValueChange={(value) => setWashCare(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className={styles.popper} position="popper">
                  <SelectItem value="Hand Wash" className={styles.popperItem}>
                    Hand wash
                  </SelectItem>
                  <SelectItem value="Dry Clean" className={styles.popperItem}>
                    Dry clean
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function VideoUpload() {
  const [selectedVideos, setSelectedVideos] = useState([]);

  const handleVideoUpload = (event) => {
    const files = Array.from(event.target.files);
    const videoUrls = files.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setSelectedVideos((prevVideos) => [...prevVideos, ...videoUrls]);
  };

  const removeVideo = (videoUrl) => {
    const updatedFiles = selectedVideos.filter(
      (video) => video.url !== videoUrl
    );
    setSelectedVideos(updatedFiles);
  };

  return (
    <div className="flex flex-row w-full shadow-md p-6 mr-3 mt-3 rounded-2xl gap-5">
      <div className="w-1/3">
        <p className="text-2xl  font-semibold m-5">Video Upload</p>
        <div className={styles.uploadBox}>
          <input
            id="uploadVideo"
            type="file"
            accept="video/*"
            multiple
            onChange={handleVideoUpload}
            style={{
              display: "none",
            }}
          />
          <label htmlFor="uploadVideo" className="hover:cursor-pointer">
            <IoIosAddCircleOutline size={40} />
          </label>
          <p>Drag & drop or click to choose files</p>
          <p className="flex flex-row items-center gap-2 font-semibold mt-3">
            <FiInfo size={20} />
            Max file size: 10MB
          </p>
        </div>
      </div>
      <div className="flex flex-row flex-wrap gap-6">
        {selectedVideos.map((video, index) => (
          <div key={video.url} className="flex flex-col items-end">
            <IoCloseCircle
              size={25}
              className={styles.closeButton}
              onClick={() => removeVideo(video.url)}
            />
            <div className={styles.videoContainer}>
              <video
                controls
                style={{ height: "100%", width: "100%", objectFit: "cover" }}
              >
                <source src={video.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SelectSize({ setVariant }) {
  const availableSizes = [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "3XL",
    "4XL",
    "5XL",
  ];
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

  const productVariants = useSelector(
    (state) => state.productVariants?.variants
  );

  useEffect(() => {
    const selectedSizes = Object.keys(sizes)
      .filter((size) => sizes[size].selected)
      .map((size) => ({
        size: size,
        quantity: sizes[size].quantity,
      }));

    setVariant((prevState) => ({
      ...prevState,
      inventory: selectedSizes,
    }));
  }, [sizes]);

  useEffect(() => {
    setSizes({
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
  }, [productVariants]);

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
    <form>
      <h3 className="min-w-36">Inventory</h3>
      {availableSizes.map((size) => (
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
            <input
              type="number"
              value={sizes[size]?.quantity}
              onChange={(e) => handleQuantityChange(size, e.target.value)}
              placeholder="Qty"
              min="1"
              className="w-16 rounded-lg pl-2"
            />
          )}
        </div>
      ))}
    </form>
  );
}
