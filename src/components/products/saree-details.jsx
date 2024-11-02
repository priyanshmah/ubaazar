import styles from "@/styles/Product.module.css";
import "@/styles/globals.css";

import fabric from "@/public/icons/fabric.svg";
import tape from "@/public/icons/scale.svg";
import floral from "@/public/icons/drawing.svg";
import washcare from "@/public/icons/washing.svg";
import blouse from "@/public/icons/blouse.svg";
import pattern from "@/public/icons/pattern.svg";
import border from "@/public/icons/border.svg";

import Image from "next/image";

export default function SareeDetails({ productData }) {
    return (
      <div className="flex flex-col gap-6 font-semibold text-xs">
  
        <div className="rounded-2xl shadow-md">
          <p className={styles.label}>Saree Details</p>
          <div className="flex flex-col place-content-evenly p-4 border-2 border-brightOrange rounded-b-xl">
            <div className="flex flex-row place-content-between">
              <div className="flex flex-row gap-4 items-center justify-center">
                <Image src={tape} height={30} width={30} />
                <p className="text-darkGrayColor">Saree Length</p>
              </div>
              <p className="text-grayColor my-2">
                {productData?.sareeLength}
              </p>
            </div>
            <div className="flex flex-row place-content-between">
              <div className="flex flex-row gap-4 items-center justify-center">
                <Image src={fabric} height={30} width={30} />
                <p className="text-darkGrayColor">Saree Fabric</p>
              </div>
              <p className="text-grayColor my-2 ">
                {productData?.sareeFabric}
              </p>
            </div>
            <div className="flex flex-row place-content-between">
              <div className="flex flex-row gap-4 items-center justify-center">
                <Image src={border} height={30} width={30} />
                <p className="text-darkGrayColor">Border</p>
              </div>
              <p className="text-grayColor my-2">
                {productData?.border}
              </p>
            </div>
          </div>
        </div>
  
        <div className="rounded-2xl shadow-md">
          <p className={styles.label}>Blouse Details</p>
          <div className="flex flex-col place-content-evenly p-4 border-2 border-brightOrange rounded-b-xl">
            <div className="flex flex-row place-content-between">
              <div className="flex flex-row gap-4 items-center justify-center">
                <Image src={blouse} height={30} width={30} />
                <p className="text-darkGrayColor ">Blouse Type</p>
              </div>
              <p className="text-grayColor my-2">
                {productData?.blouseType}
              </p>
            </div>
            <div className="flex flex-row place-content-between">
              <div className="flex flex-row gap-4 items-center justify-center">
                <Image src={fabric} height={30} width={30} />
                <p className="text-darkGrayColor">Blouse Fabric</p>
              </div>
              <p className="text-grayColor my-2 ">
                {productData?.blouseFabric}
              </p>
            </div>
            <div className="flex flex-row place-content-between ">
              <div className="flex flex-row gap-4 justify-center items-center">
                <Image src={tape} height={30} width={30} />
                <p className="text-darkGrayColor">Blouse Length</p>
              </div>
              <p className="text-grayColor my-2">
                {productData?.blouseLength} meters
              </p>
            </div>
          </div>
        </div>
  
        <div className="rounded-2xl shadow-md">
          <p className={styles.label}>Basic Details</p>
          <div className="flex flex-col place-content-evenly p-4 border-2 border-brightOrange rounded-b-xl">
            <div className="flex flex-row gap-8 place-content-between">
              <div className="flex flex-row gap-4 justify-center items-center">
                <Image src={floral} height={30} width={30} />
                <p className="text-darkGrayColor">Ornamentation</p>
              </div>
              <p className="text-grayColor my-2">
                {productData?.ornamentation}
              </p>
            </div>
            <div className="flex flex-row place-content-between">
              <div className="flex flex-row gap-4 justify-center items-center">
                <Image
                  src={pattern}
                  height={30}
                  width={30}
                />
                <p className="text-darkGrayColor">Pattern</p>
              </div>
              <p className="text-grayColor my-2">
                {productData?.pattern}
              </p>
            </div>
            <div className="flex flex-row place-content-between gap-8">
              <div className="flex flex-row gap-4 justify-center items-center">
                <Image src={washcare} height={30} width={30} />
                <p className="text-darkGrayColor">Wash Care</p>
              </div>
              <p className="text-grayColor my-2">
                {productData?.washCare}
              </p>
            </div>
          </div>
        </div>
        
      </div>
    );
  }