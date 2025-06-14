import { AuthProvider } from "@/contexts/auth/AuthContext";


export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
        {/* Products */}
        {/* Users */}
      {children}
    </AuthProvider>
  );
}