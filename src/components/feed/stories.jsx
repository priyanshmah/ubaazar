import Image from "next/image";
import { stories } from "@/public/images/categories/stories";

import styles from "@/styles/Home.module.css";
import Link from "next/link";

export default function StoriesSection() {
  
  return (
    <div className="overflow-x-auto w-full p-4 scrollbar-hide">
      <div className="inline-flex gap-4">
        {stories.map((value, index) => {
          return (
            <div className='flex flex-col text-center gap-4' key={index}>
              <Link href={"/"} className={styles.storiesContainer}>
                <Image
                  src={value.img}
                  key={index}
                  alt={`${value.description} product category`}
                  fill
                  style={{ borderRadius: "1rem", objectFit: "cover" }}
                />
                </Link>
              <p className="text-xs lg:text-base  font-semibold text-darkGrayColor">
                {value.description}
              </p>
            </div>
          );
        })}
        </div>
      </div>
    
  );
}
