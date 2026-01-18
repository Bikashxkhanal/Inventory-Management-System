import { variants, sizes, iconSizes } from "./ButtonStyles";


export default function Button({
  as: Component = "button",
  variant = "primary",
  size = "md",
  iconStart,
  iconEnd,
  loading = false,
  disabled = false,
  noBg = false,       // remove background
  noBorder = false,   // remove border
  className = "",
  children,
  onClick,
  ...props
}) {
  const isButton = Component === "button";
  const isIconOnly = !children && (iconStart || iconEnd);

  const handleClick = (e) => {
      e.stopPropagation()
      e.nativeEvent.stopImmediatePropagation();
    if (disabled || loading) {
      e.preventDefault();
      e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
      return;
    }
  
    onClick?.(e);
  };

  return (
    <Component
      {...(isButton && { disabled: disabled || loading })}
      onClick={handleClick}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-md font-medium transition
        ${isIconOnly ? "p-1.5" : sizes[size]}
        ${noBg ? "bg-transparent" : variants[variant].split(" ").filter(c => !c.includes("bg-")).join(" ")}
        ${noBorder ? "" : variants[variant].split(" ").filter(c => !c.includes("border-")).join(" ")}
        ${disabled || loading ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
      )}

      {!loading && iconStart}
      {!loading && children}
      {!loading && iconEnd}
    </Component>
  );
}
