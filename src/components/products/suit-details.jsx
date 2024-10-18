import styles from "@/styles/Product.module.css";
import "@/styles/globals.css";

import skirt from "@/public/icons/skirt.svg";
import dress from "@/public/icons/dress.svg";
import neck from "@/public/icons/neck.svg";
import dupatta from "@/public/icons/dupatta.svg";
import occasion from "@/public/icons/occasion.svg";
import topDesign from "@/public/icons/toppattern.svg";
import bottomDesign from "@/public/icons/bottom-pattern.svg";
import fabric from "@/public/icons/fabric.svg";
import tape from "@/public/icons/scale.svg";
import floral from "@/public/icons/drawing.svg";
import washcare from "@/public/icons/washing.svg";

import Image from "next/image";


export default function SuitDetails({ productData }) {     
  
    return (
      <div className="flex flex-col gap-6 font-semibold text-xs">
        <div className="rounded-xl shadow-md">
          <p className={styles.label}>Top Details</p>
          <div className="flex flex-col place-content-evenly p-4 border-2 border-orange rounded-b-xl">
            <div className="flex flex-row place-content-between">
              <div className="flex flex-row gap-4 items-center justify-center">
                <Image src={fabric} height={30} width={30} />
                <p className="text-darkGrayColor font-semibold">Top Fabric</p>
              </div>
              <p className="text-grayColor text-end my-2">
                {productData.topFabric}
              </p>
            </div>
            <div className="flex flex-row place-content-between">
              <div className="flex flex-row gap-4 items-center justify-center">
                <Image src={tape} height={30} width={30} />
                <p className="text-darkGrayColor font-semibold">Top Length</p>
              </div>
              <p className="text-grayColor text-end my-2">
                {productData.topLength}
              </p>
            </div>
            <div className="flex flex-row place-content-between">
              <div className="flex flex-row gap-4 items-center justify-center">
                <Image src={topDesign} height={30} width={30} />
                <p className="text-darkGrayColor font-semibold">Top Pattern</p>
              </div>
              <p className="text-grayColor text-end my-2">
                {productData.topPattern}
              </p>
            </div>
            <div className="flex flex-row place-content-between">
              <div className="flex flex-row gap-4 items-center justify-center">
                <Image src={dress} height={30} width={30} />
                <p className="text-darkGrayColor font-semibold">Top Shape</p>
              </div>
              <p className="text-grayColor text-end my-2">
                {productData.topShape}
              </p>
            </div>
            <div className="flex flex-row place-content-between">
              <div className="flex flex-row gap-4 items-center justify-center">
                <Image src={neck} height={30} width={30} />
                <p className="text-darkGrayColor font-semibold">Neck Shape</p>
              </div>
              <p className="text-grayColor text-end my-2">
                {productData.neck}
              </p>
            </div>
          </div>
        </div>
  
        {productData.bottom && (
          <div className="rounded-xl shadow-md">
            <p className={styles.label}>Bottom Details</p>
            <div className="flex flex-col place-content-evenly p-4 border-2 border-orange rounded-b-xl">
              <div className="flex flex-row place-content-between">
                <div className="flex flex-row gap-4 items-center justify-center">
                  <Image src={fabric} height={30} width={30} />
                  <p className="text-darkGrayColor font-semibold">Bottom Fabric</p>
                </div>
                <p className="text-grayColor text-end my-2">
                  {productData.bottomFabric}
                </p>
              </div>
              <div className="flex flex-row place-content-between">
                <div className="flex flex-row gap-4 items-center justify-center">
                  <Image src={skirt} height={30} width={30} />
                  <p className="text-darkGrayColor font-semibold">Bottom Type</p>
                </div>
                <p className="text-grayColor my-2 text-end">
                  {productData.bottomType}
                </p>
              </div>
              <div className="flex flex-row place-content-between">
                <div className="flex flex-row gap-4 items-center justify-center">
                  <Image src={bottomDesign} height={30} width={30} />
                  <p className="text-darkGrayColor font-semibold">Bottom Pattern</p>
                </div>
                <p className="text-grayColor my-2 text-end">
                  {productData.bottomPattern}
                </p>
              </div>
            </div>
          </div>
        )}
  
        {productData.dupatta && (
          <div className="rounded-xl shadow-md">
            <p className={styles.label}>Dupatta Details</p>
            <div className="flex flex-col place-content-evenly p-4 border-2 border-orange rounded-b-xl">
              <div className="flex flex-row gap-8 place-content-between">
                <div className="flex flex-row gap-4 justify-center items-center">
                  <Image src={dupatta} height={30} width={30} />
                  <p className="text-darkGrayColor font-semibold">Dupatta Fabric</p>
                </div>
                <p className="text-grayColor text-end my-2">
                  {productData.dupattaFabric}
                </p>
              </div>
              <div className="flex flex-row gap-8 place-content-between">
                <div className="flex flex-row gap-4 justify-center items-center">
                  <Image src={tape} height={30} width={30} />
                  <p className="text-darkGrayColor font-semibold">Dupatta Length</p>
                </div>
                <p className="text-grayColor text-end my-2">
                  {productData.dupattaLength}meters
                </p>
              </div>
            </div>
          </div>
        )}
  
        <div className="rounded-xl shadow-md font-semibold">
          <p className={styles.label}>Basic Details</p>
          <div className="flex flex-col place-content-evenly p-4 border-2 border-orange rounded-b-xl">
            <div className="flex flex-row place-content-between">
              <div className="flex flex-row gap-4 items-center justify-center">
                <Image src={floral} height={30} width={30} />
                <p className="text-darkGrayColor font-semibold">Ornamentation</p>
              </div>
              <p className="text-grayColor my-2 text-end">
                {productData.ornamentation}
              </p>
            </div>
            <div className="flex flex-row place-content-between">
              <div className="flex flex-row gap-4 items-center justify-center">
                <Image src={occasion} height={30} width={30} />
                <p className="text-darkGrayColor font-semibold">Occasion</p>
              </div>
              <p className="text-grayColor text-end my-2">
                {productData.occasion}
              </p>
            </div>
            <div className="flex flex-row place-content-between">
              <div className="flex flex-row gap-4 items-center justify-center">
                <Image src={washcare} height={30} width={30} />
                <p className="text-darkGrayColor font-semibold">Wash Care</p>
              </div>
              <p className="text-grayColor text-end my-2">
                {productData.washCare}
              </p>
            </div>
          </div>
        </div>

      </div>
    );
  }