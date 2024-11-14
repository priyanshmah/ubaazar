import React from "react";
import Image from "next/image";

function LayoutTwo({ images }) {
  if (!images) return;
  else if (images.length < 1) return;

  return (
    <div className="overflow-x-auto w-full scrollbar-hide">
      <div
        className={`lg:w-[40vw] inline-flex min-w-[160vw] p-4 gap-2`}
      >
        
            <div
              className="h-full rounded-xl"
              style={{ width: "80vw" }}
            >
              <Image
                src={images[0]}
                height={300}
                width={400}
                style={{
                  objectFit: "contain",
                  height: "100%",
                  width: "100%",
                  borderRadius: "0.75rem",
                }}
              />
            </div>
            <div
              className="h-full rounded-xl"
              style={{ width: "80vw" }}
            >
              <Image
                src={images[1]}
                height={300}
                width={400}
                style={{
                  objectFit: "contain",
                  height: "100%",
                  width: "100%",
                  borderRadius: "0.75rem",
                }}
              />
            </div>
          
      </div>
    </div>
  );
}

export default LayoutTwo;
