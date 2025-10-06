import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

// Define the shape of your context
type UserTypeContextType = {
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
};

// Create context
const UserTypeContext = createContext<UserTypeContextType | undefined>(undefined);

// Provider
export function UserTypeProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  // ✅ Rehydrate isAdmin from localStorage on first load
  useEffect(() => {
    const stored = localStorage.getItem("isAdmin");
    if (stored !== null) {
      setIsAdmin(stored === "true"); // restore as boolean
    }
  }, []);

  return (
    <UserTypeContext.Provider value={{ isAdmin, setIsAdmin }}>
      {children}
    </UserTypeContext.Provider>
  );
}

// Hook to use context
// eslint-disable-next-line react-refresh/only-export-components
export function useUserTypeOption() {
  const context = useContext(UserTypeContext);
  if (!context) {
    throw new Error("useUserTypeOption must be used inside a UserTypeProvider");
  }
  return context;
}
