"use client";
import { Solway } from 'next/font/google';
import { TailSpin } from 'react-loader-spinner'

const solway = Solway({
  subsets: ["latin"],
  weight: ["500"],
});

export default function Loading() {
  return (
    <div
      className={`absolute inset-0 flex flex-col opacity-70 gap-10 justify-center items-center font-normal px-2 text-5xl z-50 ${solway.className} bg-white`}
    >
      <div className="flex flex-row gap-1">
        <p className="text-brightOrange">U</p>
        <p className="text-darkBlue">Baazar</p>
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
