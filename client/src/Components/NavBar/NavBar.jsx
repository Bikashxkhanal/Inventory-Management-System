
import {  NavLink } from "react-router-dom";
import Button from '../Button';
import { useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();
  const navItems = [
    {
      name: "Home",
      slug: "/",
    },
    {
      name: "service",
      slug: "/service",
    },
    {
      name: "about",
      slug: "/about",
    },
    {
      name: "contact",
      slug: "/contact",
    },
  ];

  return (
    <>
      <nav className="w-full bg-darkblue shadow-md">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
          {/* Logo */}

          <div className="logo text-white text-2xl font-bold">IMS</div>
          {/* <img src="" alt="" /> */}

          {/* Other Link */}
          <ul className="hidden md:flex space-x-6">
            {navItems?.map((item, id) => (
              <li className="text-white px-10" key={id}>
                <NavLink to={item.slug} className={({isActive})=>
                    `hover:text-orange-500 ${isActive ? "text-orange-500": "text-white"}`
                 }>{item.name}</NavLink>
              </li>
            ))}
          </ul>
          
    <Button  props="md:px-5 md:py-3 md:block" borderColor="border-skyblue" btnName="Login"  onClick = {() => navigate('/login')} />
        </div>
      </nav>
    </>
  );
}

export default NavBar;
