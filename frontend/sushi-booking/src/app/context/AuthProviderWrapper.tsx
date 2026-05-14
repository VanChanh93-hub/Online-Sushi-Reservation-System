  // components/AuthProviderWrapper.tsx
  "use client";
  import { AuthProvider } from "./authContext";

  export default function AuthProviderWrapper({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return <AuthProvider>{children}</AuthProvider>;
  }
