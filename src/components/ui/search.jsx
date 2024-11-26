"use client";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { IoSearch } from "react-icons/io5";
import "react-datepicker/dist/react-datepicker.css";
import { FiFilter, FiX } from "react-icons/fi";

function Search({ date, setDate}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <div className="flex flex-row items-center w-full place-content-between gap-2 px-2 text-grayColor">
        <div className="flex flex-row items-center p-2 w-full justify-start gap-1 border border-silver rounded-xl bg-searchBarColor">
          <IoSearch size="1.2rem" className="text-silver" />
          <label
            className="w-full"
            onClick={() => {
              setOpen(true);
              setDate(new Date());
            }}
          >
            Search by Date
          </label>
        </div>
        <button className="bg-darkBlue text-white text-sm font-semibold p-2 rounded-sm font-mona">
          Search
        </button>
      </div>
      {date && (
        <div className="flex flex-row items-center rounded-3xl bg-brightOrange text-white text-sm font-semibold w-fit p-2">
          <DatePicker
            open={open}
            autoFocus={false}
            preventOpenOnFocus={false}
            onInputClick={() => setOpen(true)}
            className={`bg-brightOrange focus:outline-none font-mona w-24`}
            selected={date}
            onChange={(date) => {
              setDate(date);
              setOpen(false);
            }}
          />
          <FiX
            onClick={() => {
              setDate("");
              setOpen(false);
            }}
            size={"1rem"}
            className="bg-white text-brightOrange rounded-full"
          />
        </div>
      )}
    </div>
  );
}

export default Search;
