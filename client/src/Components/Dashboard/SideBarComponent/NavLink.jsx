import { isAction } from '@reduxjs/toolkit';
import { NavLink} from 'react-router-dom';


function NavbarLink({
    icon = null,
    name, 
    path,
    css, 
    

}){
    return( 
     
  <NavLink to={path}
    className={({ isActive }) =>
  [
    "flex gap-6 w-[98%] px-8 py-2 rounded-sm",
    "hover:bg-blue-950",
    icon == null && "justify-center mt-0",
    isActive
      ? "bg-blue-950 font-semibold"
      : "bg-darkblue text-gray-400"
  ].filter(Boolean).join(" ")
}>
    <div class="flex justify-center">

            {
                // if there is no icon , then aligh the content to center
                icon &&
                 <img  src={icon }  alt="img" width="16px" height="8px" className='color-white' />
            }
    
    <span className={`${css }`}>{name}</span>
    </div>
     
  </NavLink>

    );
}

export default NavbarLink;