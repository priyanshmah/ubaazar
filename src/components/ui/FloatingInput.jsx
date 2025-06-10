import React from "react";
import { FiPhone } from "react-icons/fi";

function FloatingInput({ id, label, type = "text", ...rest }) {
  return (
    <div className="relative w-full">
      <input
        id={id}
        type={type}
        placeholder=" "
        {...rest}
        className="peer text-lg w-full font-normal text-darkGrayColor rounded-md border border-input bg-background p-2 px-3  placeholder-transparent focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <label
        htmlFor={id}
        className="pointer-events-none font-normal text-silver bg-white px-1 absolute left-2 -top-2.5 text-sm  transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal  peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-ring after:content-['*'] after:ml-0.5"
      >
        {label}
      </label>
    </div>
  );
}

export default FloatingInput;
