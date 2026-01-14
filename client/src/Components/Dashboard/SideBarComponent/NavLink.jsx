import { NavLink} from 'react-router-dom';


function NavbarLink({
    icon, 
    name, 
    path,
    ...props

}){
    return( 
     <div class="flex justify-center mt-4">
  <NavLink to={path}
     className="flex flex-start gap-6 w-[98%] hover:bg-blue-950 hover:rounded-sm bg-darkblue text-white px-8 py-2  hover:w-[98%] ">
     <img src={icon} width="16px" height="8px" className='color-white' alt="img" />
    <span className="">{name}</span>
     
  </NavLink>
</div>
    );
}

export default NavbarLink;