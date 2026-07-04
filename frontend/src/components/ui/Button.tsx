import type { LucideIcon } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "icon";
  icon?: LucideIcon;
  children?: React.ReactNode;
}

const sizes = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2.5",
  icon: "h-9 w-9 p-0",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  className = "",
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",

    secondary: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100",

    danger: "bg-red-600 hover:bg-red-700 text-white",
  };

  return (
    <button
      {...props}
      className={`
    inline-flex
    items-center
    justify-center
    gap-2
    rounded-xl
    ${sizes[size]}
    font-medium
    transition
    disabled:opacity-50
    disabled:cursor-not-allowed
    ${variants[variant]}
    ${className}
  `}
    >
      {Icon && (
    <Icon
        size={size === "icon" ? 16 : 18}
    />
)}

      {children && <span>{children}</span>}
    </button>
  );
}
