import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import {NavbarLink, LogoutButton, UserCard, OrganizationCard} from '../../index';

const SideBarLayout = () => {
    const {permissions, user} = useSelector(state => state.auth);

    return ( 
        <>
<div className="md:hidden flex items-center justify-between bg-darkblue text-white px-4 py-3">
  <span className="text-lg font-semibold">Dashboard</span>

  {/* <!-- Hamburger --> */}
  <button id="menuBtn" className="space-y-1">
    <span className="block w-6 h-0.5 bg-white"></span>
    <span className="block w-6 h-0.5 bg-white"></span>
    <span className="block w-6 h-0.5 bg-white"></span>
  </button>
</div>

{/* <!-- Sidebar --> */}
<aside
  id="sidebar"
  className="hidden md:w-64 md:bg-darkblue md:flex md:flex-col md:h-full md:justify-around md:items-center text-white rounded-r-3xl"
>
  <OrganizationCard name={user.companyName ?? "Khanal Dhuwani Sewa"}/>

  <nav className="gap-0">
    {permissions?.map(permission =>  <NavbarLink name={permission} path={permission}  />)

    }
  </nav>

  <div className="flex flex-col justify-center">
    <LogoutButton />
    <UserCard name={user.name ?? "Bikash khanal"} role={user.role?? "super admin"}/>
  </div>

</aside>
</>

   );


}


export default SideBarLayout;