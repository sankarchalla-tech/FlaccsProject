import { LoaderCircle } from "lucide-react";

interface SpinnerProps {
  size?: number;
}

export default function Spinner({
  size = 32,
}: SpinnerProps) {
  return (
    <LoaderCircle
      size={size}
      className="animate-spin text-blue-600"
    />
  );
}