import { NavLink } from 'react-router-dom';

function NavbarLink({ icon: Icon = null, name, path, css = '', onNavigate }) {
  return (
    <NavLink
      to={path}
      onClick={() => onNavigate?.()}
      className={({ isActive }) =>
        [
          'mx-1 flex w-[96%] cursor-pointer items-center gap-3 rounded-lg px-4 py-2.5 transition-colors',
          'hover:bg-blue-950/80',
          isActive ? 'bg-blue-950 font-semibold text-white' : 'text-gray-400',
        ].join(' ')
      }
    >
      {Icon && (
        <Icon
          size={20}
          strokeWidth={2}
          className="shrink-0 opacity-90"
          aria-hidden
        />
      )}
      <span className={`text-sm capitalize ${css}`}>{name}</span>
    </NavLink>
  );
}

export default NavbarLink;
