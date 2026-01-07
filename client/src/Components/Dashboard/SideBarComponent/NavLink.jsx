import { NavLink} from 'react-router-dom';


function NavbarLink({
    icon = "abc" , 
    name, 
    path, 
    ...props

}){
    return( 
     <div class="flex justify-center mt-4">
  <NavLink to={path}
     className="flex flex-start gap-6 w-full hover:bg-blue-950 hover:rounded-sm bg-darkblue text-white px-8 py-2  ">
     <span className="">{icon}</span>
    <span className="">{name}</span>
     
  </NavLink>
</div>
    );
}

export default NavbarLink;