export function DotsHortlIcon({ 
  size = 16, 
  className = "" 
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={` ${className}`}
    >
      <circle cx="2" cy="12" r="2.5" />
      <circle cx="10" cy="12" r="2.5" />
      <circle cx="18" cy="12" r="2.5" />
    </svg>
  );
}
