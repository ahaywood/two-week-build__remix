export interface AvatarProps {
  alt: string;
  className?: string;
  size?: string;
  src?: string;
}

const Avatar = ({ alt, className = "", size = "72px", src }: AvatarProps) => {
  const firstLetter = (str: string) => {
    if (!str) return "🤪";
    return str.charAt(0).toUpperCase();
  };

  return src ? (
    <img
      src={src}
      alt={alt}
      style={{ width: size, maxWidth: "100%" }}
      className={`rounded-full object-cover aspect-square ${className}`}
    />
  ) : (
    <div
      className={`rounded-full text-2xl bg-mineShaft aspect-square center text-white ${className}`}
      style={{ width: size, maxWidth: "100%" }}
    >
      {firstLetter(alt)}
    </div>
  );
};

export { Avatar };
