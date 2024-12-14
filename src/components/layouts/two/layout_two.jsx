import React from "react";
import Image from "next/image";

function LayoutTwo({ images, alt }) {
  if (!images) return;
  else if (images.length < 1) return;

  return (
    <div className="overflow-x-auto w-full scrollbar-hide">
      <div
        className={`lg:w-[40vw] inline-flex pr-4 gap-2`}
      >
       {
        images.map((value, index) => {
          return (
            <div
              className="h-full rounded-xl"
              style={{ width: "60vw", height: "75vw", borderRadius: "0.75rem" }}
              key={index}
            >
              <Image
                src={value}
                height={300}
                width={400}
                alt={`${alt} ${index}`}
                className="h-full w-full rounded-xl object-cover"
              />
            </div>
          )
        })
       }     
      </div>
    </div>
  );
}

export default LayoutTwo;
