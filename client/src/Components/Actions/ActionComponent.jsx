import { useState, useEffect } from "react";
import { NewButton , DotsHortlIcon, IconImage} from "../index";
import { useNavigate } from "react-router-dom";
import { Edit, Delete } from "../../assets/Imagesender";

const ActionComponent = ({
    id
}) => {
  const navigate = useNavigate();

    const [openMenuId, setOpenMenuId] = useState(null);
   

        const handleMenuToggle = (id) => {
        setOpenMenuId(openMenuId === id ? null : id);
        
      };

      const handleEdit = (id) =>{
        navigate(`update/${id}`)
      }

      const handleDelete = (id) => {
        alert("Are you sure you want to delete.");
        //call api to delete the user/stock/vendor with the id

      }
    
      // Close menu on outside click
      useEffect(() => {
        const handleClickOutside = () => setOpenMenuId(null);
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
      }, []);

 return <div className="relative" onClick={(e) => e.stopPropagation()}>
          <NewButton
           onClick={() => handleMenuToggle(id)}
            className='cursor-pointer'
             size='sm' noBorder noBg={true} iconEnd={<DotsHortlIcon />  } 
             />

             {
              openMenuId === id && (
          <div className="absolute right-0 top-full mt-2 w-42 py-1 px-1 bg-[#c7c9c7] shadow-4xl border border-white rounded-xl opacity-80  z-50">
            <NewButton
              className="w-full border-lg text-gray-500 hover:text-gray-800 cursor-pointer hover:bg-gray-400 "
              noBg
              noBorder
              onClick={() => handleEdit(id)}
              children="Edit"
              iconStart={<IconImage src={Edit} />}
            />       
            <NewButton
              className="w-full border-lg text-gray-500 cursor-pointer hover:text-red-500 hover:bg-red-300"
               noBg
              noBorder
              onClick={() => handleDelete(id)}
              children="Delete"
              iconStart={<IconImage src={Delete} />}
            />
            </div>

)}
             </div>

}

export default ActionComponent;