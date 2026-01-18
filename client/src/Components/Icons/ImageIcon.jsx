export default function IconImage({
  src,
  alt = "",
  size = 16,
  className = "",
  ariaHidden = true,
  ...props
}) {
  return (
    <img
      src={src}
      width={size}
      height={size}
      alt={alt}
      aria-hidden={ariaHidden}
      className={`inline-block shrink-0 object-contain ${className}`}
      {...props}
    />
  );
}
