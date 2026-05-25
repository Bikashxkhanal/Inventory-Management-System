import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Menu, X } from 'lucide-react';
import { NavbarLink, LogoutButton, UserCard, OrganizationCard } from '../../index';
import { DASH_NAV, NAV_PATHS } from '../../../config/dashnav.config';
import { NAV_ICONS, NAV_LABELS } from '../../../config/navIcons';

const SideBarLayout = () => {
  const { authStatus, permissions, user, company } = useSelector((state) => state.auth);
  const [mobileOpen, setMobileOpen] = useState(false);

  const userPerms = Array.isArray(permissions) ? permissions : [];
  const normPerm = (value) =>
    String(value ?? '')
      .toLowerCase()
      .replace(/[\s-]+/g, '_');

  const navItems = {};
  Object.keys(DASH_NAV).forEach((key) => {
    const required = DASH_NAV[key] ?? [];
    const hasAccess = required.some((permission) =>
      userPerms.some((per) => normPerm(per) === normPerm(permission)),
    );
    if (hasAccess) navItems[key] = required;
  });

  if (authStatus === 'idle' || authStatus === 'loading') {
    return null;
  }

  const navLinks = (
    <>
      <OrganizationCard name={company?.companyName ?? 'Inventory'} />
      <nav className="flex w-full flex-col gap-0.5 px-2">
        {Object.keys(navItems).map((key) => {
          const Icon = NAV_ICONS[key];
          return (
            <NavbarLink
              key={key}
              icon={Icon}
              name={NAV_LABELS[key] ?? key}
              path={NAV_PATHS[key] ?? `/web/${key}`}
              onNavigate={() => setMobileOpen(false)}
            />
          );
        })}
      </nav>
      <div className="mt-auto flex w-full flex-col items-center gap-2 px-2 pb-4">
        <LogoutButton />
        <UserCard name={user?.name ?? 'User'} role={user?.role ?? 'staff'} />
      </div>
    </>
  );

  return (
    <>
      <div className="fixed top-0 z-40 flex w-full items-center justify-between bg-darkblue px-4 py-3 text-white md:hidden">
        <span className="text-lg font-semibold truncate pr-2">
          {company?.companyName ?? 'Menu'}
        </span>
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="cursor-pointer rounded-lg p-2 hover:bg-white/10"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
        </button>
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 md:hidden"
          onClick={() => setMobileOpen(false)}
          role="presentation"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 flex h-full w-64 max-w-[85vw] flex-col items-stretch gap-6 rounded-r-3xl bg-darkblue py-6 pt-16 text-white transition-transform duration-300 md:static md:z-auto md:max-w-none md:translate-x-0 md:pt-6 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } md:flex`}
      >
        {navLinks}
      </aside>
    </>
  );
};

export default SideBarLayout;
