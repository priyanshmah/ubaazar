import React from "react";
import Image from "next/image";

function LayoutFour1({ images }) {
  if(!images) return;
  else if(images.length < 4) return ;

  return (
    <div
      className="w-full flex flex-col p-4 gap-2"
      style={{
        width: "100vw",
      }}
    >
      <div className="w-full h-1/2 flex flex-row justify-center items-center gap-2">
        <div className="h-full rounded-xl" style={{ width: "55%" }}>
        <Image 
        src={images[0]}
        height={100}
        width={400}
        style={{
            objectFit: 'contain',
            height: 'auto',
            width: '100%',
            borderRadius: '0.75rem'
        }}
        />
        </div>
        <div className="h-full rounded-xl bg-red" style={{ width: "45%" }}>
        <Image 
        src={images[1]}
        height={100}
        width={400}
        style={{
            objectFit: 'contain',
            height: 'auto',
            width: '100%',
            borderRadius: '0.75rem'
        }}
        />
        </div>
      </div>
      <div className="w-full h-1/2 flex flex-row items-center justify-center gap-2">
        <div className="h-full rounded-xl bg-red" style={{ width: "45%" }}>
        <Image 
        src={images[2]}
        height={100}
        width={400}
        style={{
            objectFit: 'contain',
            height: 'auto',
            width: '100%',
            borderRadius: '0.75rem'
        }}
        />
        </div>
        <div className="h-full rounded-xl bg-red" style={{ width: "55%" }}>
        <Image 
        src={images[3]}
        height={100}
        width={400}
        style={{
            objectFit: 'contain',
            height: 'auto',
            width: '100%',
            borderRadius: '0.75rem'
        }}
        />
        </div>
      </div>
    </div>
  );
}

export default LayoutFour1;
