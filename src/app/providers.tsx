"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#374151',
            borderRadius: '10px',
            border: '1px solid #F5E6D3',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
          },
          success: {
            iconTheme: { primary: '#8B5E3C', secondary: '#fff' },
          },
        }}
      />
    </SessionProvider>
  );
}
