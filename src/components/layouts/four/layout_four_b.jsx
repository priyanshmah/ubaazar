import Image from "next/image";
import React from "react";

function LayoutFour2({ images }) {
  if (!images) return;
  else if (images.length < 4) return;

  return (
    <div
      className="w-full flex flex-col p-4 gap-2"
      style={{
        width: "100vw",
      }}
    >
      <div
        className="w-full relative rounded-xl bg-red"
        style={{ height: "70%" }}
      >
        <Image
          src={images[0]}
          height={100}
          width={400}
          style={{
            objectFit: "contain",
            height: "auto",
            width: "100%",
            borderRadius: "0.75rem",
          }}
        />
      </div>
      <div className="w-full flex flex-row gap-2" style={{ height: "30%" }}>
        <div className="h-full w-1/3 rounded-xl bg-red">
          <Image
            src={images[1]}
            height={100}
            width={100}
            style={{
              objectFit: "contain",
              height: "auto",
              width: "100%",
              borderRadius: "0.75rem",
            }}
          />
        </div>
        <div className="h-full w-1/3 rounded-xl bg-red">
          <Image
            src={images[2]}
            height={100}
            width={100}
            style={{
              objectFit: "contain",
              height: "auto",
              width: "100%",
              borderRadius: "0.75rem",
            }}
          />
        </div>
        <div className="h-full w-1/3 rounded-xl bg-red">
          <Image
            src={images[3]}
            height={100}
            width={100}
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

export default LayoutFour2;
