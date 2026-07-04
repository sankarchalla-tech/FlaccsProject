interface BadgeProps {
  variant?: "success" | "warning" | "danger" | "info" | "neutral";

  children: React.ReactNode;
}

export default function Badge({
  children,

  variant = "info",
}: BadgeProps) {
  const variants = {
    success: "bg-green-100 text-green-700",

    warning: "bg-amber-100 text-amber-700",

    danger: "bg-red-100 text-red-700",

    info: "bg-blue-100 text-blue-700",

    neutral: "bg-slate-100 text-slate-700",
  };

  return (
    <span
      className={`
        rounded-full
        px-3
        py-1
        text-xs
        font-semibold
        flex
        flex-row
        items-center
        gap-1
        whitespace-nowrap
        select-none
        ${variants[variant]}
      `}
    >
      {children}
    </span>
  );
}
