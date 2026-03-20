import { useState } from "react";
import { NewButton } from "..";

const AddCustomer = ({ handlePageNavigation }) => {
  const [phone, setPhone] = useState("");

  return (
    <div className="bg-white min-h-screen md:bg-gray-100 flex justify-center items-start ">
      <form className="w-full md:w-[550px] bg-white mt-50 rounded-xl md:shadow-md flex flex-col gap-4 p-10 ">  

        <div className="w-full flex flex-col md:flex-row  gap-4 md:gap-2">
          <input
            type="text"
            placeholder="Enter Customer phone number"
            value={phone}
            onChange={(e) =>
            setPhone(e.target.value.replace(/\D/g, ""))
            }
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <NewButton
            children="Next"
            size="lg"
            className="px-4 cursor-pointer"
            onClick={handlePageNavigation}
          />
        </div>

      </form>
    </div>
  );
};

export default AddCustomer;