import React from "react";
import Image from "next/image";

function LayoutThree({ images, alt }) {
  if (!images) return;
  if (images.length < 3) return;

  return (
    <div className="w-[85vw] lg:w-[40vw] flex flex-row items-center justify-center p-4 gap-2">
      <div className="w-2/3 h-full rounded-xl">
        <Image
          src={images[0]}
          height={300}
          width={400}
          alt={alt}
          style={{
            objectFit: "contain",
            height: "auto",
            width: "100%",
            borderRadius: "0.75rem",
          }}
        />
      </div>
      <div className="w-1/3 h-full flex flex-col gap-2">
        <div className="w-full h-1/2 rounded-xl bg-red">
          <Image
            src={images[1]}
            height={100}
            width={400}
            alt={alt}
            style={{
              objectFit: "contain",
              height: "auto",
              width: "100%",
              borderRadius: "0.75rem",
            }}
          />
        </div>
        <div className="w-full h-1/2 rounded-xl bg-red">
          <Image
            src={images[2]}
            height={100}
            width={400}
            alt={alt}
            style={{
              objectFit: "contain",
              height: "auto",
              width: "100%",
              borderRadius: "0.75rem",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default LayoutThree;
