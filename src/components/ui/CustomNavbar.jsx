import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";

const CustomNavbar = ({ customText }) => {
    const router = useRouter();
  
    return (
      <div className="flex flex-row bg-white text-darkGrayColor gap-4 items-center text-lg py-4 px-2 shadow">
        <FiArrowLeft onClick={() => router.back()} size={"1.5rem"} />
        {customText}
      </div>
    );
  };

  export default CustomNavbar;