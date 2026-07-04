import { Toaster } from "sonner";

export default function ToastProvider() {
  return (
    <Toaster
      richColors
      position="top-right"
      expand={false}
      closeButton
      duration={3000}
    />
  );
}