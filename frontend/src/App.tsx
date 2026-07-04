import AppLayout from "./components/layout/AppLayout";
import AppRoutes from "./routes/AppRoutes";
import ToastProvider from "./providers/ToastProvider";
import { useLoading } from "./components/context/LoadingContext";
import  LoadingOverlay  from "./components/ui/LoadingOverlay";

export default function App() {
  const { loading, title, message } = useLoading();
  return (
    <>
      <AppLayout>
        <AppRoutes />
        <ToastProvider />
      </AppLayout>

      <ToastProvider />

      <LoadingOverlay
        open={loading}
        title={title}
        message={message}
      />
    </>
  );
}
