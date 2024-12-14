"use client";
import { Passion_One } from 'next/font/google';
import { TailSpin } from 'react-loader-spinner'

const passion = Passion_One({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export default function Loading() {
  return (
    <div
      className={`fixed inset-0 bg-white flex flex-col gap-10 justify-center items-center font-normal px-2 text-5xl z-50 ${passion.className}`}
    >
      <div className="flex flex-row gap-1">
        <p className="text-brightOrange">U</p>
        <p className="text-darkBlue">BAAZAR</p>
      </div>
      <div className='rounded-full border border-darkGrayColor p-1'>

      <TailSpin
        visible={true}
        height="30"
        width="30"
        color="#ff6100"
        radius="5"
        wrapperStyle={{}}
        wrapperClass=""
        />
        </div>
    </div>
  );
}
