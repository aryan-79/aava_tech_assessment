import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Loader = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <span className="animate-spin">
        <AiOutlineLoading3Quarters className="size-10 text-indigo-500" />
      </span>
    </div>
  );
};

export default Loader;
