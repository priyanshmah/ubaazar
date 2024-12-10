import { IoSearch } from "react-icons/io5";
import { PiSlidersHorizontal } from "react-icons/pi";

export default function SearchBar({ query, setQuery}){
    const handleInputChange = (e) => {
      setQuery(e.target.value);
    };
  
    const submitHandler = (e) => {
      e.preventDefault();
    };
  
    return (
      <div className="p-2 px-4">
      <div className="flex flex-row w-full justify-center items-center bg-searchBarColor rounded-s-lg">
        <div className="flex flex-row w-full bg-searchBarColor rounded-s-lg">
          <IoSearch size={"2rem"} className="text-grayColor p-2"/>
        <input
          type="text"
          placeholder="Search for brands, products and more"
          value={query}
          onChange={handleInputChange}
          className="w-full text-sm bg-searchBarColor focus:outline-none"
          />
          </div>
        <PiSlidersHorizontal size="2rem" className="text-white bg-darkBlue rounded-lg p-1" />
      </div>
      </div>
    );
  };