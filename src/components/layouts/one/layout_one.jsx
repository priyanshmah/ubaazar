import React from "react";
import Image from "next/image";

function LayoutOne({ images }) {
  if (!images) return;
  if (images.length < 1) return;

  return (
    <div className="w-[85vw] lg:w-[40vw] flex flex-col items-center justify-center pr-4 gap-2 relative">
      <Image
        src={images[0]}
        height={300}
        width={400}
        style={{
          objectFit: "cover",
          height: "auto",
          width: "100%",
          borderRadius: "0.75rem",
        }}
      />
    </div>
  );
}

export default LayoutOne;
