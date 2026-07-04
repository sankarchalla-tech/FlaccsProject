import {
  createContext,
  useContext,
  useState,
} from "react";

interface LoadingContextType {
  loading: boolean;
  title: string;
  message: string;

  showLoading: (
    title?: string,
    message?: string
  ) => void;

  hideLoading: () => void;
}

const LoadingContext =
  createContext<LoadingContextType | null>(null);

export function LoadingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("Loading...");
  const [message, setMessage] = useState("Please wait");

  function showLoading(
    newTitle = "Loading...",
    newMessage = "Please wait"
  ) {
    setTitle(newTitle);
    setMessage(newMessage);
    setLoading(true);
  }

  function hideLoading() {
    setLoading(false);
  }

  return (
    <LoadingContext.Provider
      value={{
        loading,
        title,
        message,
        showLoading,
        hideLoading,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext)!;
}