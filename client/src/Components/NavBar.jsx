
import {  NavLink } from "react-router-dom";

function NavBar() {
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
          <button className="hidden md:block cursor-pointer text-white px-4 py-2 rounded hover:text-orange-500">
      Login
    </button>
        </div>
      </nav>
    </>
  );
}

export default NavBar;
