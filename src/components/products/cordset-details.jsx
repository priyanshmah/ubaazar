import React from 'react'

import styles from "@/styles/Product.module.css";
import "@/styles/globals.css";

import skirt from "@/public/icons/skirt.svg";
import neck from "@/public/icons/neck.svg";
import occasion from "@/public/icons/occasion.svg";
import topDesign from "@/public/icons/toppattern.svg";
import fabric from "@/public/icons/fabric.svg";
import tape from "@/public/icons/scale.svg";
import washcare from "@/public/icons/washing.svg";

import Image from "next/image";

function CordsetDetails({ productData }) {
    return (
      <div className="flex flex-col gap-6 font-semibold text-xs">
        <div className="rounded-xl shadow-md">
          <p className={styles.label}>Top Details</p>
          <div className="flex flex-col place-content-evenly p-4 border-2 border-brightOrange rounded-b-xl">
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
                {productData.topLength} inches
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
                <Image src={neck} height={30} width={30} />
                <p className="text-darkGrayColor font-semibold">Neck Shape</p>
              </div>
              <p className="text-grayColor text-end my-2">{productData.neck}</p>
            </div>
          </div>
        </div>
  
        <div className="rounded-xl shadow-md">
          <p className={styles.label}>Bottom Details</p>
          <div className="flex flex-col place-content-evenly p-4 border-2 border-brightOrange rounded-b-xl">
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
                <Image src={tape} height={30} width={30} />
                <p className="text-darkGrayColor font-semibold">Bottom Length</p>
              </div>
              <p className="text-grayColor my-2 text-end">
                {productData.bottomLength} inches
              </p>
            </div>
          </div>
        </div>
  
        <div className="rounded-xl shadow-md font-semibold">
          <p className={styles.label}>Basic Details</p>
          <div className="flex flex-col place-content-evenly p-4 border-2 border-brightOrange rounded-b-xl">
            <div className="flex flex-row place-content-between">
              <div className="flex flex-row gap-4 items-center justify-center">
                <Image src={neck} height={30} width={30} />
                <p className="text-darkGrayColor font-semibold">Neck Shape</p>
              </div>
              <p className="text-grayColor text-end my-2">{productData.neck}</p>
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

export default CordsetDetails