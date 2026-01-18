import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { useRef } from "react";
import {
  NavbarLink,
  LogoutButton,
  UserCard,
  OrganizationCard,
  Button,
} from "../../index";
import {
  userImg,
  stockImg,
  purchaseImg,
  salesImg,
  revenueImg,
} from "../../../assets/Imagesender";
import { DASH_NAV } from "../../../config/dashnav.config";

const SideBarLayout = () => {
  const [activeId, setActiveId] = useState(false);
  const { permissions, user } = useSelector((state) => state.auth);
  const icons = [userImg, stockImg, purchaseImg, salesImg, revenueImg];
  let navItems = {};
  const buttonRef = useRef(null);

  Object.keys(DASH_NAV).forEach((key) => {
    DASH_NAV[key].map((permission) => {
      permissions.map((per) => {
        per = per.toLowerCase();
        if (per.includes(permission)) {
          Object.hasOwn(navItems, key)
            ? navItems[key].push(permission)
            : (navItems[key] = [permission]);
        }
      });
    });
  });

  const handleSubLinks = (key) => {
    setActiveId(activeId === key ? null : key);
  };

  return (
    <>
      <div className="w-full fixed md:hidden flex items-center justify-between bg-darkblue text-white px-4 py-3 ">
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
        className="hidden md:w-64 md:bg-darkblue md:flex md:flex-col md:h-full md:justify-start md:gap-8 md:items-center text-white rounded-r-3xl"
      >
        <OrganizationCard name={user.companyName ?? "Khanal Dhuwani Sewa"} />

        <nav className="gap-0 w-full ">
          {Object.entries(navItems).map(([key, value]) => {
            return (
              <NavbarLink name={key.toUpperCase()} key={key} path={`/web/${key}`} />
            )
          })}
        </nav>

        <div className="flex flex-col justify-center fixed bottom-5">
          <LogoutButton />
          <UserCard
            name={user.name ?? "Bikash khanal"}
            role={user.role ?? "super admin"}
          />
        </div>
      </aside>
    </>
  );
};

export default SideBarLayout;
