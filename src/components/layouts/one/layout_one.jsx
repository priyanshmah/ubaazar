import React from "react";
import Image from "next/image";

function LayoutOne({ images }) {
  if (!images) return;
  if (images.length < 1) return;

  return (
    <div className="w-[100vw] lg:w-[40vw] flex flex-col items-center mb-4 justify-center p-4 gap-2 relative">
      <Image
        src={images[0]}
        height={300}
        width={400}
        style={{
          objectFit: "contain",
          height: "auto",
          width: "100%",
          borderRadius: "0.75rem",
        }}
      />
      {/* <div className="h-24 w-24 absolute bottom-6 right-6">
        <Image
          src={images[0]}
          fill
          className="border border-white object-cover rounded-full"
        />
      </div> */}
    </div>
  );
}

export default LayoutOne;
