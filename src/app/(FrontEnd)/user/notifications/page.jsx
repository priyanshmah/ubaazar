import React from "react";
import notifications from "@/public/images/illustrations/no-notifiy.jpg";
import Image from "next/image";

export default function Notifications() {
  return (
    <div className="h-[70vh] flex flex-col justify-center items-center">
      <div className="h-[80vw] w-[100vw] relative">
        <Image src={notifications} fill className="object-cover" />
      </div>
      <p className="text-pink text-2xl font-semibold">No notifications</p>
    </div>
  );
}
